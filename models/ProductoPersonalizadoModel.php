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

    // public function crear($pedido_id, $productosPersonalizados)
    // {
    //     foreach ($productosPersonalizados as $pp) {
    //         $nombre = $pp->nombre_personalizado;
    //         $producto_id = $pp->producto_id;
    //         $costo_base = $pp->costo_base;
    //         $cantidad = $pp->cantidad;

    //         // Calcular costo adicional sumando cada criterio
    //         $costo_adicional = 0;
    //         foreach ($pp->opciones_personalizacion as $opcion) {
    //             $costo_adicional += $opcion->costo ?? 0;
    //         }

    //         $precio_unitario = $costo_base + $costo_adicional;
    //         $subtotal = $precio_unitario * $cantidad;

    //         $opciones = json_encode($pp->opciones_personalizacion, JSON_UNESCAPED_UNICODE);

    //         $sql = "INSERT INTO producto_personalizado (
    //                 pedido_id, producto_id, nombre_personalizado, 
    //                 costo_base, opciones_personalizacion, 
    //                 costo_adicional, cantidad, precio_unitario, subtotal
    //             ) VALUES (
    //                 $pedido_id, $producto_id, '$nombre',
    //                 $costo_base, '$opciones',
    //                 $costo_adicional, $cantidad, $precio_unitario, $subtotal
    //             )";

    //         $this->db->executeSQL_DML($sql);
    //     }

    //     return true;
    // }



public function crear($pedido_id, $productosPersonalizados) 
{
    // helper para DECIMAL(10,2)
    $fmt = fn($n) => number_format((float)$n, 2, '.', '');

    foreach ($productosPersonalizados as $pp) {
        // Normaliza a array asociativo
        if (is_object($pp)) $pp = json_decode(json_encode($pp), true);

        $nombre      = substr(trim($pp['nombre_personalizado'] ?? ''), 0, 100);
        $producto_id = (int)($pp['producto_id'] ?? 0);
        $costo_base  = (float)($pp['costo_base'] ?? 0);
        $cantidad    = max(1, (int)($pp['cantidad'] ?? 1));

        // Opciones puede venir como array o como string JSON (o alias *_json)
        $opciones = $pp['opciones_personalizacion'] ?? ($pp['opciones_personalizacion_json'] ?? []);
        if (is_string($opciones)) {
            $tmp = json_decode($opciones, true);
            if ($tmp !== null) $opciones = $tmp;
        }

        // Suma costos adicionales
        $costo_adicional = 0.0;
        if (is_array($opciones)) {
            foreach ($opciones as $op) $costo_adicional += (float)($op['costo'] ?? 0);
        }

        // Totales sin IVA
        $precio_unitario   = $costo_base + $costo_adicional;
        $subtotal_sin_iva  = $precio_unitario * $cantidad;

        // IVA (si no viene, 13%)
        $iva_pct   = isset($pp['iva_porcentaje']) && is_numeric($pp['iva_porcentaje'])
                     ? (float)$pp['iva_porcentaje'] : 0.13;
        $iva_monto = $subtotal_sin_iva * $iva_pct;

        // ✅ Guardar subtotal CON IVA
        $subtotal = $subtotal_sin_iva + $iva_monto;

        // JSON y escapes
        $opciones_json = json_encode($opciones, JSON_UNESCAPED_UNICODE);
        $nombre_esc   = addslashes($nombre);
        $opciones_esc = addslashes($opciones_json);

        // INSERT (números sin comillas)
        $sql = "INSERT INTO producto_personalizado
                (pedido_id, producto_id, nombre_personalizado,
                 costo_base, opciones_personalizacion, costo_adicional,
                 cantidad, precio_unitario, subtotal)
                VALUES (
                 ".(int)$pedido_id.",
                 ".$producto_id.",
                 '".$nombre_esc."',
                 ".$fmt($costo_base).",
                 '".$opciones_esc."',
                 ".$fmt($costo_adicional).",
                 ".$cantidad.",
                 ".$fmt($precio_unitario).",
                 ".$fmt($subtotal)."
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



// ========== NUEVO ==========
public function listarProductosBase()
{
    $sql = "
    SELECT
        p.id,
        p.nombre,
        p.precio AS precio_base,
        IFNULL(i.Porcentaje, 0) AS impuesto_porcentaje,
        (
          SELECT ip.imagen
          FROM imagenproducto ip
          WHERE ip.producto_id = p.id
          ORDER BY ip.id ASC
          LIMIT 1
        ) AS imagen
    FROM producto p
    LEFT JOIN impuesto i ON i.IdImpuesto = p.IdImpuesto
    WHERE p.estado = 1
    ORDER BY p.nombre ASC";
    return $this->db->executeSQL($sql);
}

// ========== NUEVO ==========
public function detalleProductoBase($producto_id)
{
    $producto_id = (int)$producto_id; // seguridad básica

    $sqlProd = "
    SELECT
        p.id,
        p.nombre,
        p.descripcion,
        p.precio AS precio_base,
        IFNULL(i.Porcentaje, 0) AS impuesto_porcentaje
    FROM producto p
    LEFT JOIN impuesto i ON i.IdImpuesto = p.IdImpuesto
    WHERE p.id = $producto_id
    LIMIT 1";

    $prod = $this->db->executeSQL($sqlProd);
    if (!$prod || count($prod) === 0) return null;

    $sqlImgs = "
    SELECT imagen
    FROM imagenproducto
    WHERE producto_id = $producto_id
    ORDER BY id ASC";

    $imgs = $this->db->executeSQL($sqlImgs);
    $prod[0]['imagenes'] = array_map(fn($r) => $r['imagen'], $imgs ?? []);

    return $prod[0];
}





}
