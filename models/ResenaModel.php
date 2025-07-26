<?php
class ResenaModel
{
    private $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    //obtener todas las reseñas por el admin o gestion por el

    public function all()
    {
        $sql = "SELECT r.id, r.comentario, r.valoracion, r.fecha, r.moderado,
       u.id as usuario_id, u.nombre_usuario as usuario_nombre,
       p.id as producto_id, p.nombre as producto_nombre,
       ip.imagen
FROM resena r
JOIN usuario u ON r.usuario_id = u.id
JOIN producto p ON r.producto_id = p.id
LEFT JOIN (
    SELECT producto_id, imagen
    FROM ImagenProducto
    WHERE id IN (
        SELECT MIN(id)
        FROM ImagenProducto
        GROUP BY producto_id
    )
) ip ON ip.producto_id = p.id
ORDER BY r.fecha DESC;

";
        return $this->enlace->executeSQL($sql);
    }

    //obtener reseña por visibles de un producto especifico 

    public function getByProducto($producto_id)
    {
        $sql = "SELECT 
    r.id, r.comentario, r.valoracion, r.fecha, r.moderado,
    u.id AS usuario_id, u.nombre_usuario AS usuario_nombre,
    p.id AS producto_id, p.nombre AS producto_nombre,
    ip.imagen
FROM resena r
JOIN usuario u ON r.usuario_id = u.id
JOIN producto p ON r.producto_id = p.id
LEFT JOIN (
    SELECT producto_id, imagen
    FROM ImagenProducto
    WHERE id IN (
        SELECT MIN(id)
        FROM ImagenProducto
        GROUP BY producto_id
    )
) ip ON ip.producto_id = p.id
WHERE r.producto_id = $producto_id
ORDER BY r.fecha DESC;
";
        return $this->enlace->executeSQL($sql);
    }

    // Este es el metodo para crear las reseñas, permite que un usuario cree mas de una 

public function create($data)
{
    $usuario_id = (int)$data['usuario_id'];
    $producto_id = (int)$data['producto_id'];
    $comentario = addslashes($data['comentario']);
    $valoracion = (int)$data['valoracion'];
    $moderado = 0;

    $sql = "INSERT INTO resena (usuario_id, producto_id, comentario, valoracion, fecha, moderado)
            VALUES ($usuario_id, $producto_id, '$comentario', $valoracion, NOW(), $moderado)";

    return $this->enlace->executeSQL_DML($sql);
}

    // moderar o eliminar una reseña( actualizar el campo moderado)

    public function update($id, $estado)
    {
        $sql = "UPDATE resena SET moderado = $estado WHERE id = $id";
        return $this->enlace->executeSQL_DML($sql);
    }

    // Estadisticas de valoraciones por estrellas 

    public function estadisticasValoracion($producto_id)
    {
        $sql = "SELECT valoracion, COUNT(*) as cantidad
                FROM resena
                WHERE producto_id = $producto_id
                GROUP BY valoracion";
        return $this->enlace->executeSQL($sql);
    }
}
