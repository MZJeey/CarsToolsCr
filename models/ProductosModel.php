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
            $promocion = new PromocionModel();
            $promos = $promocion->all();
            $resena = new ResenaModel();
            $resenas = $resena->all();
            $etiqueta = new EtiquetaModel();
            $etiquetas = $etiqueta->all();
            // Consulta SQL
            $vSQL = "SELECT p.*, c.nombre as categoria_nombre
                 FROM Producto p
                 JOIN Categoria c ON p.categoria_id = c.id";
            // Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);
            // Incluir imágenes (todas)
            if (!empty($vResultado) && is_array($vResultado)) {
                for ($i = 0; $i < count($vResultado); $i++) {
                    $vResultado[$i] = $this->get($vResultado[$i]->id);

                    $vResultado[$i]->promociones = $promos;
                    $vResultado[$i]->resen = $resenas;
                    $vResultado[$i]->etiqu = $etiquetas;
                }
            }
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

    public function create($data)
    {
        try {
            // Insertar producto
            $sql = "
        INSERT INTO Producto (
            nombre, descripcion, precio, categoria_id, stock,
            ano_compatible, marca_compatible,
            modelo_compatible, motor_compatible, certificaciones, estado
        ) VALUES (
            '$data->nombre', '$data->descripcion', $data->precio, $data->categoria_id, $data->stock, 
            '$data->ano_compatible', '$data->marca_compatible', '$data->modelo_compatible',
            '$data->motor_compatible', '$data->certificaciones', '$data->estado'
        )
        ";



            //obtener el último ID insertado
            // Ejecutar la consulta
            $producto_id = $this->enlace->executeSQL_DML_last($sql);





            if (!$producto_id || $producto_id <= 0) {
                error_log("No se pudo insertar el producto");
                return false;
            }


            //insertar imágenes
            // $imagenModel = new ImageModel();
            // if (isset($data->imagenes) && is_array($data->imagenes)) {
            //     foreach ($data->imagenes as $imagen) {
            //         $imagenModel->uploadFile(['files' => $imagen, 'producto_id' => $producto_id]);
            //     }
            // }

            // Insertar etiquetas
            foreach ($data->etiquetas as $etiqueta_id) {
                $sqlTag = "INSERT INTO productoetiqueta (producto_id, etiqueta_id) VALUES ($producto_id, $etiqueta_id)";
                $resTag = $this->enlace->executeSQL_DML($sqlTag);
                if (!$resTag) {
                    error_log("Error insertando etiqueta $etiqueta_id para producto $producto_id");
                }
            }

            return $this->get($producto_id);
        } catch (Exception $e) {
            error_log("Error en modelo Producto::create - " . $e->getMessage());
            return false;
        }
    }


    public function get($id)
    {
        try {
            $imagenP = new ImageModel();
            $promocion = new PromocionModel();
            $resena = new ResenaModel();
            $etiqueta = new EtiquetaModel();
            $sql = "SELECT p.*, c.nombre as categoria_nombre
                FROM Producto p
                JOIN Categoria c ON p.categoria_id = c.id
                WHERE p.id = $id";

            $producto = $this->enlace->executeSQL($sql);

            if (!empty($producto)) {
                $producto = $producto[0];
                // Obtener imágenes asociadas al producto
                $producto->imagen = $imagenP->getImagen($producto->id);
                $producto->promocion = $promocion->get($producto->id);
                $producto->resena = $resena->getByProducto($producto->id);
                $producto->etiquetas = $etiqueta->get($producto->id);
            }

            return $producto;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function update($id, $data)
    {
        try {
            $id = (int)$id; // ← Aquí fuerzas que sea un número

            $nombre = $data['nombre'] ?? '';
            $descripcion = $data['descripcion'] ?? '';
            $precio = $data['precio'] ?? 0;
            $categoria_id = $data['categoria_id'] ?? 0;
            $stock = $data['stock'] ?? 0;
            $promedio_valoraciones = $data['promedio_valoraciones'] ?? 0;
            $ano_compatible = $data['ano_compatible'] ?? '';
            $marca_compatible = $data['marca_compatible'] ?? '';
            $modelo_compatible = $data['modelo_compatible'] ?? '';
            $motor_compatible = $data['motor_compatible'] ?? '';
            $certificaciones = $data['certificaciones'] ?? '';
            $estado = isset($data['estado']) ? (int)$data['estado'] : 1;

            $sql = "UPDATE Producto 
            SET nombre = '{$nombre}',
                descripcion = '{$descripcion}',
                precio = {$precio},
                categoria_id = {$categoria_id},
                stock = {$stock},
                promedio_valoraciones = {$promedio_valoraciones},
                ano_compatible = '{$ano_compatible}',
                marca_compatible = '{$marca_compatible}',
                modelo_compatible = '{$modelo_compatible}',
                motor_compatible = '{$motor_compatible}',
                certificaciones = '{$certificaciones}',
                estado = {$estado}
            WHERE id = {$id}";

            return $this->enlace->executeSQL_DML($sql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function delete($id)
    {
        try {
            $sql = "UPDATE Producto SET estado = true WHERE id = $id";
            return $this->enlace->executeSQL_DML($sql);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
