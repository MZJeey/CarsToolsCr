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
        $sql = "SELECT * FROM resena";
        return $this->enlace->executeSQL($sql);
    }

//obtener reseña por visibles de un producto especifico 

   public function getByProducto($producto_id)
   {
$sql = "SELECT r.*, u.nombre_usuario as usuario_nombre

                FROM resena r
                JOIN usuario u ON r.usuario_id = u.id
                WHERE r.producto_id = $producto_id AND r.moderado = 0";
        return $this->enlace->executeSQL($sql);
   }

   // Crear una nueva reseña solo si existe una previa del usuario para ese producto 

   public function create($data)
   {
    $usuario_id = (int)$data['usuario_id'];
    $producto_id= (int)$data['producto_id'];

    // Verificar si ya existe una reseña del usuario para el producto

    $verificar = "SELECT COUNT(*) as total FROM resena WHERE usuario_id = $usuario_id AND producto_id = $producto_id";
    $existe = $this ->enlace->executeSQL($verificar);

    if($existe[0]->total >0){
        return ['status'=> 'error', 'message'=> 'Ya has registrado una reseña para este producto.'];
    }
    // Insertar la nueva reseña
    $comentario = addslashes($data['comentario']);

    $valoracion = (int)$data['valoracion'];

// Por defecto, la reseña no está moderada
    $moderado= 0; 

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