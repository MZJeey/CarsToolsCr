<?php

class ProductoPersonalizadoModel
{
    private $db;

    public function __construct()
    {
        $this->db = new MySqlConnect();
    }

    public function obtenerPorPedido($pedido_id)
    {
        $sql = "SELECT 
    pp.id_personalizado,
    pp.pedido_id,
    pp.producto_id,
    p.nombre AS nombre_producto_base,
    p.IdImpuesto AS id_impuesto,
    i.Porcentaje AS porcentaje,
    pp.nombre_personalizado,
    pp.costo_base,
    pp.opciones_personalizacion,
    pp.costo_adicional,
    pp.cantidad,
    pp.precio_unitario,
    pp.subtotal
FROM producto_personalizado pp
JOIN producto p ON pp.producto_id = p.id
JOIN impuesto i ON p.IdImpuesto = i.IdImpuesto
WHERE pp.pedido_id = $pedido_id;
";

        return $this->db->executeSQL($sql);
    }

    public function crear($pedido_id, $productosPersonalizados)
    {
        foreach ($productosPersonalizados as $pp) {
            $nombre = $pp->nombre_personalizado;
            $producto_id = $pp->producto_id;
            $costo_base = $pp->costo_base;
            $cantidad = $pp->cantidad;

            // Calcular costo adicional sumando cada criterio
            $costo_adicional = 0;
            foreach ($pp->opciones_personalizacion as $opcion) {
                $costo_adicional += $opcion->costo ?? 0;
            }

            $precio_unitario = $costo_base + $costo_adicional;
            $subtotal = $precio_unitario * $cantidad;

            $opciones = json_encode($pp->opciones_personalizacion, JSON_UNESCAPED_UNICODE);

            $sql = "INSERT INTO producto_personalizado (
                    pedido_id, producto_id, nombre_personalizado, 
                    costo_base, opciones_personalizacion, 
                    costo_adicional, cantidad, precio_unitario, subtotal
                ) VALUES (
                    $pedido_id, $producto_id, '$nombre',
                    $costo_base, '$opciones',
                    $costo_adicional, $cantidad, $precio_unitario, $subtotal
                )";

            $this->db->executeSQL_DML($sql);
        }

        return true;
    }

    public function obtenerTodos()
    {
        $sql = "SELECT 
                pp.id_personalizado,
                pp.pedido_id,
                pp.producto_id,
                p.nombre AS nombre_producto_base,
                pp.nombre_personalizado,
                pp.costo_base,
                pp.opciones_personalizacion,
                pp.costo_adicional,
                pp.cantidad,
                pp.precio_unitario,
                pp.subtotal
            FROM producto_personalizado pp
            JOIN producto p ON pp.producto_id = p.id";

        return $this->db->executeSQL($sql);
    }
}
