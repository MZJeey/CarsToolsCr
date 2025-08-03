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

    // public function update($id, $data)
    // {
    //     try {
    //         // 🔁 Forzar conversión a array por si viene como stdClass
    //         $data = (array)$data;

    //         // ✅ Validación mínima
    //         if (empty($data['nombre'])) {
    //             throw new Exception('El nombre es requerido');
    //         }

    //         // 🔒 Escapar strings y convertir tipos
    //         $nombre = addslashes($data['nombre']);
    //         $descripcion = isset($data['descripcion']) ? addslashes($data['descripcion']) : '';
    //         $precio = isset($data['precio']) ? floatval($data['precio']) : 0;
    //         $categoria_id = isset($data['categoria_id']) ? intval($data['categoria_id']) : 0;
    //         $stock = isset($data['stock']) ? intval($data['stock']) : 0;
    //         $estado = isset($data['estado']) ? (intval($data['estado']) ? 1 : 0) : 0;
    //         $idImpuesto = isset($data['IdImpuesto']) ? intval($data['IdImpuesto']) : "NULL";
    //         $ano_compatible = isset($data['ano_compatible']) ? addslashes($data['ano_compatible']) : '';
    //         $marca_compatible = isset($data['marca_compatible']) ? addslashes($data['marca_compatible']) : '';
    //         $modelo_compatible = isset($data['modelo_compatible']) ? addslashes($data['modelo_compatible']) : '';
    //         $motor_compatible = isset($data['motor_compatible']) ? addslashes($data['motor_compatible']) : '';
    //         $certificaciones = isset($data['certificaciones']) ? addslashes($data['certificaciones']) : '';

    //         // ✅ Actualizar producto
    //         $sql = "
    //         UPDATE producto SET
    //             nombre = '$nombre',
    //             descripcion = '$descripcion',
    //             precio = $precio,
    //             categoria_id = $categoria_id,
    //             stock = $stock,
    //             estado = $estado,
    //             ano_compatible = '$ano_compatible',
    //             marca_compatible = '$marca_compatible',
    //             modelo_compatible = '$modelo_compatible',
    //             motor_compatible = '$motor_compatible',
    //             certificaciones = '$certificaciones',
    //             IdImpuesto = $idImpuesto
    //         WHERE id = $id
    //     ";

    //         $result = $this->enlace->executeSQL_DML($sql);

    //         // ✅ Eliminar etiquetas anteriores
    //         $sqlDeleteTags = "DELETE FROM productoetiqueta WHERE producto_id = $id";
    //         $this->enlace->executeSQL_DML($sqlDeleteTags);

    //         // ✅ Insertar nuevas etiquetas
    //         if (!empty($data['etiquetas']) && is_array($data['etiquetas'])) {
    //             foreach ($data['etiquetas'] as $etiqueta_id) {
    //                 $sqlInsertTag = "INSERT INTO productoetiqueta (producto_id, etiqueta_id) VALUES ($id, $etiqueta_id)";
    //                 $this->enlace->executeSQL_DML($sqlInsertTag);
    //             }
    //         }


    //         // ✅ Eliminar imágenes específicas si vienen en el JSON
    //         if (!empty($data['imagenes_eliminar']) && is_array($data['imagenes_eliminar'])) {
    //             foreach ($data['imagenes_eliminar'] as $imagen) {
    //                 $imagen = addslashes($imagen);
    //                 $sqlDeleteImage = "DELETE FROM imagenproducto WHERE producto_id = $id AND imagen = '$imagen'";
    //                 $this->enlace->executeSQL_DML($sqlDeleteImage);
    //             }
    //         }


    //         // ✅ Insertar nuevas imágenes
    //         if (!empty($data['imagenes']) && is_array($data['imagenes'])) {
    //             foreach ($data['imagenes'] as $imagen) {
    //                 $imagen = addslashes($imagen);
    //                 $sqlInsertImage = "INSERT INTO imagenproducto (producto_id, imagen) VALUES ($id, '$imagen')";
    //                 $this->enlace->executeSQL_DML($sqlInsertImage);
    //             }
    //         }

    //         // ✅ Retornar producto actualizado
    //         return $this->get($id);
    //     } catch (Exception $e) {
    //         error_log("Error en ProductoModel::update - " . $e->getMessage());
    //         http_response_code(400);
    //         return ['error' => $e->getMessage()];
    //     }
    // }
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
                $this->enlace->executeSQL_DML($sql);
            }

            // Eliminar una imagen específica (si se envió)
            if (isset($objeto->imagen_a_eliminar) && !empty($objeto->imagen_a_eliminar)) {
                $imagenEliminar = $objeto->imagen_a_eliminar;
                $sqlImg = "DELETE FROM imagenproducto 
                       WHERE producto_id = $objeto->id AND imagen = '$imagenEliminar'";
                $this->enlace->executeSQL_DML($sqlImg);
            }

            // Insertar nuevas imágenes
            $result = $this->get($objeto->id);
        } catch (Exception $e) {
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
