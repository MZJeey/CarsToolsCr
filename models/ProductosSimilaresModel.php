<?php
class ProductosSimilaresModel
{
    // Esto es un model de ejemplo para manejar caritos de compras
    private $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }


    public function agregarProductoSimilares($data)
    {
        $query = "INSERT INTO ProductosSimilares (producto_id, producto_similar_id, tipo_relacion) 
              VALUES ($data->producto_id, $data->producto_similar_id, '$data->tipo_relacion')
              ON DUPLICATE KEY UPDATE tipo_relacion = VALUES(tipo_relacion)";

        $stmt = $this->enlace->executeSQL_DML($query);

        return $stmt;
    }


    public function obtenerProductosSimilares($producto_id)
    {
        try {
            $sql = "SELECT 
                    ps.producto_similar_id AS id,
                    p.nombre,
                    p.descripcion,
                    p.precio,
                    p.stock,
                    (SELECT imagen FROM ImagenProducto WHERE producto_id = p.id LIMIT 1) AS imagen,
                    ps.tipo_relacion,
                    ROUND((p.precio / orig.precio) * 100, 2) AS porcentaje_ahorro
                FROM ProductosSimilares ps
                INNER JOIN Producto p ON ps.producto_similar_id = p.id
                INNER JOIN Producto orig ON ps.producto_id = orig.id
                WHERE ps.producto_id = $producto_id
                  AND p.precio < orig.precio
                  AND p.stock > 0
                  AND p.estado = TRUE
                ORDER BY (orig.precio - p.precio) DESC
                LIMIT 3
";

            // Parámetro correctamente preparado
            $params = [':producto_id' => $producto_id];
            $result = $this->enlace->executeSQL($sql, $params);

            return $result;
        } catch (Exception $e) {
            error_log("Error al obtener productos similares: " . $e->getMessage());
            return [];
        }
    }
}
