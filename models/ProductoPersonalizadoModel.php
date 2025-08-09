<?php
class ProductoPersonalizadoModel
{
    private $db;

    public function __construct(PDO $conexion)
    {
        $this->db = $conexion;
    }

    /**
     * Obtiene el detalle completo de la factura incluyendo productos personalizados,
     * con sus criterios y costos, además el resumen total y forma de pago.
     */
    public function obtenerDetalleFactura($factura_id)
    {
        // Obtener datos básicos de la factura
        $queryFactura = "SELECT id, usuario_id, forma_pago FROM factura WHERE id = ?";
        $stmt = $this->db->prepare($queryFactura);
        $stmt->execute([$factura_id]);
        $factura = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$factura) {
            throw new Exception("Factura no encontrada.");
        }

        // Obtener productos incluidos en la factura
        $queryProductos = "SELECT 
                              df.id AS detalle_id,
                              p.nombre AS nombre_producto,
                              df.precio_unitario,
                              df.descripcion,
                              df.cantidad,
                              df.subtotal,
                              df.monto_iva,
                              df.total
                           FROM detalle_factura df
                           INNER JOIN producto p ON p.id = df.producto_id
                           WHERE df.factura_id = ?";
        $stmt = $this->db->prepare($queryProductos);
        $stmt->execute([$factura_id]);
        $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $subtotal = 0;

        foreach ($productos as &$producto) {
            // Parsear criterios y opciones desde descripción JSON
            $producto['criterios'] = $this->parsearCriteriosDesdeDescripcion($producto['descripcion']);
            
            // Calcular costo total producto: precio base + suma de costos de opciones
            $costoOpciones = 0;
            foreach ($producto['criterios'] as $criterio) {
                $costoOpciones += floatval($criterio['costo_opcion']);
            }
            $producto['total_producto_personalizado'] = floatval($producto['precio_unitario']) + $costoOpciones;

            // Actualizar subtotal acumulado (cantidad * total producto personalizado)
            $subtotal += $producto['cantidad'] * $producto['total_producto_personalizado'];
        }
        unset($producto);

        // Calcular impuesto y total
        $impuesto = round($subtotal * 0.13, 2); // Ajusta si tienes otro porcentaje
        $total = $subtotal + $impuesto;

        return [
            'factura_id' => $factura_id,
            'productos' => $productos,
            'resumen' => [
                'subtotal' => $subtotal,
                'impuestos' => $impuesto,
                'total' => $total,
                'forma_pago' => $factura['forma_pago'],
            ],
        ];
    }

    /**
     * Parsea el JSON guardado en el campo descripcion para obtener
     * criterios, opciones seleccionadas y costos asociados.
     * 
     * Se espera que descripcion sea un JSON con estructura:
     * [
     *   {
     *      "criterio": "Color",
     *      "opcion_seleccionada": "Rojo",
     *      "costo_opcion": 5.00
     *   },
     *   ...
     * ]
     */
    private function parsearCriteriosDesdeDescripcion($descripcion)
    {
        if (!$descripcion) return [];

        $datos = json_decode($descripcion, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            // Si no es JSON válido, devolver vacío o lanzar error según prefieras
            return [];
        }

        return $datos;
    }
}

