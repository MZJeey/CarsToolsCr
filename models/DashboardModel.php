<?php
class DashboardModel
{
    /** @var MySqlConnect */
    private $db;

    public function __construct()
    {
        $this->db = new MySqlConnect();
    }

    /** 3 reseñas más recientes */
public function ultimasTres(): array
{
    $sql = "
        SELECT r.id,
               u.nombre_usuario AS usuario,
               p.nombre         AS producto,
               r.comentario,
               r.fecha
        FROM resena r
        JOIN usuario  u ON u.id = r.usuario_id
        JOIN producto p ON p.id = r.producto_id
        ORDER BY r.fecha DESC
        LIMIT 3
    ";

    $rows = $this->db->executeSQL($sql); // array de stdClass

    foreach ($rows as $r) {
        if (!empty($r->fecha)) {
            $r->fecha = date('c', strtotime($r->fecha));
        }
    }

    return $rows; // array de stdClass con fecha normalizada
}

    /** Ventas por día SOLO desde pedido/detallepedido con estados pagado|entregado */
    public function ventasDiarias(?string $from = null, ?string $to = null): array
    {
        $cond = '';
        if ($from && $to) {
            $cond = " AND DATE(p.fecha_pedido) BETWEEN '{$from}' AND '{$to}' ";
        }

        $sql = "
            SELECT DATE(p.fecha_pedido) AS date,
                   COUNT(DISTINCT p.id) AS total_pedidos,
                   COALESCE(SUM(dp.cantidad), 0) AS total_productos,
                   COALESCE(SUM(dp.cantidad * dp.precio_unitario), 0) AS total_ingresos
            FROM pedido p
            INNER JOIN detallepedido dp ON p.id = dp.pedido_id
            WHERE p.estado IN ('pagado','entregado')
            {$cond}
            GROUP BY DATE(p.fecha_pedido)
            ORDER BY date DESC
        ";
        return $this->db->executeSQL($sql);
    }

    /** Ventas por mes SOLO desde pedido/detallepedido con estados pagado|entregado */
    public function ventasMensuales(?string $from = null, ?string $to = null): array
    {
        $cond = '';
        if ($from && $to) {
            $cond = " AND p.fecha_pedido BETWEEN '{$from}' AND '{$to}' ";
        }

        $sql = "
            SELECT DATE_FORMAT(p.fecha_pedido, '%Y-%m') AS month,
                   COUNT(DISTINCT p.id) AS total_pedidos,
                   COALESCE(SUM(dp.cantidad), 0) AS total_productos,
                   COALESCE(SUM(dp.cantidad * dp.precio_unitario), 0) AS total_ingresos
            FROM pedido p
            INNER JOIN detallepedido dp ON p.id = dp.pedido_id
            WHERE p.estado IN ('pagado','entregado')
            {$cond}
            GROUP BY DATE_FORMAT(p.fecha_pedido, '%Y-%m')
            ORDER BY month DESC
        ";
        return $this->db->executeSQL($sql);
    }

    /** Cantidad de pedidos por estado (devuelve siempre los 3 estados) */
    public function pedidosPorEstado(?string $from = null, ?string $to = null): array
    {
        $where = '';
        if ($from && $to) {
            $where = "WHERE DATE(p.fecha_pedido) BETWEEN '{$from}' AND '{$to}'";
        }

        $sql = "
            SELECT s.estado, COALESCE(c.cantidad, 0) AS cantidad
            FROM (
                SELECT 'en_proceso' AS estado
                UNION ALL SELECT 'pagado'
                UNION ALL SELECT 'entregado'
            ) s
            LEFT JOIN (
                SELECT p.estado, COUNT(*) AS cantidad
                FROM pedido p
                {$where}
                GROUP BY p.estado
            ) c ON c.estado = s.estado
            ORDER BY FIELD(s.estado, 'en_proceso','pagado','entregado')
        ";
        return $this->db->executeSQL($sql);
    }

    /** Top N productos más vendidos (por cantidad) en pedidos pagados/entregados */
    public function topProductosMasVendidos(int $limit = 3, ?string $from = null, ?string $to = null): array
    {
        $limit = max(1, min(10, (int)$limit));

        $whereFechas = '';
        if ($from && $to) {
            $whereFechas = " AND DATE(pe.fecha_pedido) BETWEEN '{$from}' AND '{$to}' ";
        }

        $sql = "
            SELECT dp.producto_id,
                   pr.nombre,
                   SUM(dp.cantidad) AS ventas
            FROM detallepedido dp
            JOIN pedido   pe ON pe.id = dp.pedido_id
            JOIN producto pr ON pr.id = dp.producto_id
            WHERE pe.estado IN ('pagado','entregado')
            {$whereFechas}
            GROUP BY dp.producto_id, pr.nombre
            ORDER BY ventas DESC
            LIMIT {$limit}
        ";
        return $this->db->executeSQL($sql);
    }
}
