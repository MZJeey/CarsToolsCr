<?php
class ProductoModel
{
    //Conectarse a la BD
    private $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    /**
     * Listar productos
     * @param 
     * @return $vResultado - Lista de objetos
     */



    public function all()
    {
        try {
            $imagenM = new ImageModel();
            //Consulta SQL
            $vSQL = "SELECT p.*, c.nombre as categoria_nombre
            FROM Producto p
            JOIN Categoria c ON p.categoria_id = c.id";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);
            //Incluir imagenes
            if (!empty($vResultado) && is_array($vResultado)) {
                for ($i = 0; $i < count($vResultado); $i++) {
                    $vResultado[$i] = $this->get($vResultado[$i]->id);

                    //$vResultado[$i]->imagen=$imagenM->getImageMovie(($vResultado[$i]->id));
                }
            }

            //Retornar la respuesta

            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }




    // Obtener imágenes asociadas a un producto
    public function getImagenesByProductoId($producto_id)
    {
        $vResultado = $this->enlace->executeSQL("SELECT id FROM ImagenProducto WHERE producto_id = $producto_id;");
        if (!empty($vResultado)) {
            $vResultado = $vResultado[0];
        }
    }

    // Crear producto junto con imágenes
    public function create($data, $imagenes)
    {
        try {
            // Crear producto
            $sql = "INSERT INTO Producto 
                (nombre, descripcion, precio, categoria_id, stock, promedio_valoraciones, año_compatible, marca_compatible, modelo_compatible, motor_compatible, certificaciones)
                VALUES (
                    '{$data['nombre']}',
                    '{$data['descripcion']}',
                    {$data['precio']},
                    {$data['categoria_id']},
                    " . ($data['stock'] ?? 0) . ",
                    0.00,
                    '{$data['año_compatible']}',
                    '{$data['marca_compatible']}',
                    '{$data['modelo_compatible']}',
                    '{$data['motor_compatible']}',
                    '{$data['certificaciones']}'
                )";

            $producto_id = $this->enlace->executeSQL_DML_last($sql);

            // Guardar imágenes
            if (!empty($imagenes) && $producto_id > 0) {
                foreach ($imagenes as $imagen) {
                    $imgData = addslashes(file_get_contents($imagen)); // si viene como path de archivo
                    $imgSql = "INSERT INTO ImagenProducto (producto_id, imagen) VALUES ($producto_id, '$imgData')";
                    $this->enlace->executeSQL_DML($imgSql);
                }
            }

            return true;
        } catch (Exception $e) {
            error_log("Error al crear producto: " . $e->getMessage());
            return false;
        }
    }

    public function get($id)
    {
        try {
            $imagenP = new ImageModel();
            $sql = "SELECT p.*, c.nombre as categoria_nombre
                FROM Producto p
                JOIN Categoria c ON p.categoria_id = c.id
                WHERE p.id = $id";

            $producto = $this->enlace->executeSQL($sql);

            if (!empty($producto)) {
                $producto = $producto[0];
                // Obtener imágenes asociadas al producto
                $producto->imagen = $imagenP->getImagen($producto->id);
            }

            return $producto;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
