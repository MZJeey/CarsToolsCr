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
            $etiqueta = new ProductoEtiquetaModel();
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
            modelo_compatible, motor_compatible, certificaciones, estado,IdImpuesto
        ) VALUES (
            '$data->nombre', '$data->descripcion', $data->precio, $data->categoria_id, $data->stock, 
            '$data->ano_compatible', '$data->marca_compatible', '$data->modelo_compatible',
            '$data->motor_compatible', '$data->certificaciones', '$data->estado', $data->IdImpuesto
        )
        ";

            //obtener el último ID insertado
            // Ejecutar la consulta
            $producto_id = $this->enlace->executeSQL_DML_last($sql);


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
            $resenaModel = new ResenaModel();
            $etiqueta = new ProductoEtiquetaModel();
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
                $producto->resena = $resenaModel->getByProducto($producto->id);
                $producto->etiquetas = $etiqueta->getEtiquetasByProducto($producto->id);
            }

            return $producto;
        } catch (Exception $e) {
            handleException($e);
        }
    }


    public function update($objeto)
    {
        try {
            // Actualizar el producto
            $sql = "UPDATE producto SET 
            nombre = '$objeto->nombre',
            descripcion = '$objeto->descripcion',
            precio = '$objeto->precio',
            categoria_id = '$objeto->categoria_id',
            stock = '$objeto->stock',
            estado = '$objeto->estado',
            ano_compatible = '$objeto->ano_compatible',
            marca_compatible = '$objeto->marca_compatible',
            modelo_compatible = '$objeto->modelo_compatible',
            motor_compatible = '$objeto->motor_compatible',
            certificaciones = '$objeto->certificaciones',
            IdImpuesto = '$objeto->IdImpuesto'
            WHERE id = '$objeto->id'";

            $result = $this->enlace->executeSQL_DML($sql);

            // Eliminar etiquetas del producto
            $sqlDeleteTags = "DELETE FROM productoetiqueta WHERE producto_id = $objeto->id";
            $this->enlace->executeSQL_DML($sqlDeleteTags);

            // Insertar nuevas etiquetas
            foreach ($objeto->etiqueta as $item) {
                $sql = "INSERT INTO productoetiqueta(producto_id, etiqueta_id)
                    VALUES($objeto->id, $item)";
                $resulth = $this->enlace->executeSQL_DML($sql);
            }

            // Eliminar una imagen específica (si se envió)

            if (isset($objeto->imagenes_a_eliminar) && is_array($objeto->imagenes_a_eliminar)) {
                foreach ($objeto->imagenes_a_eliminar as $imagenEliminar) {
                    $sqlImg = "DELETE FROM imagenproducto 
                       WHERE producto_id = $objeto->id AND imagen = '$imagenEliminar'";
                    // $result = $this->enlace->executeSQL_DML($sql);
                    $resultG = $this->enlace->executeSQL_DML($sqlImg);
                }
            }

            // $modeloImagen = new ImageModel();
            // // // Insertar nuevas imágenes (si se envió)
            // if (isset($objeto->imagenesNuevas) && is_array($objeto->imagenesNuevas)) {
            //     foreach ($objeto->imagenesNuevas as $imagenNuevas) {
            //         $insertarImagen = $modeloImagen->uploadFile($imagenNuevas, $objeto->id);
            //         $this->enlace->executeSQL_DML($insertarImagen);
            //     }
            // }

            // if (($objeto->imagenesNuevas ?? null) && is_array($objeto->imagenesNuevas)) {

            //     foreach ($objeto->imagenesNuevas as $imagenNueva) {
            //         $sql = "INSERT INTO ImagenProducto (producto_id,imagen) VALUES ($objeto->id, '$imagenNueva')";
            //         $vResultado = $this->enlace->executeSQL_DML($sql);
            //         if ($vResultado > 0) {
            //             return 'Imagen creada';
            //         }
            //     }
            // }

            return $this->get($objeto->id);
        } catch (Exception $e) {
            echo "<script>alert('¡Hola desde PHP!');</script>";
            error_log("Error al actualizar producto: " . $e->getMessage());
            return false;
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
