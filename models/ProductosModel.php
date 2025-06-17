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
            // Extraer datos del producto
            $nombre = $data['nombre'];
            $descripcion = $data['descripcion'];
            $precio = floatval($data['precio']);
            $categoria_id = intval($data['categoria_id']);
            $stock = isset($data['stock']) ? intval($data['stock']) : 0;
            $ano_compatible = $data['ano_compatible'];
            $marca_compatible = $data['marca_compatible'];
            $modelo_compatible = $data['modelo_compatible'];
            $motor_compatible = $data['motor_compatible'];
            $certificaciones = $data['certificaciones'];
            $estado = $data['estado'];
            $imagenes = isset($data['imagenes']) ? $data['imagenes'] : [];

            // Verificar si ya existe producto con ese nombre
            $sqlCheck = "SELECT COUNT(*) AS total FROM Producto WHERE nombre = '$nombre'";
            $result = $this->enlace->executeSQL($sqlCheck);

            if (!$result || $result[0]->total > 0) {
                return false; // Producto ya existe
            }

            // Insertar producto
            $sql = "
            INSERT INTO Producto (
                nombre, descripcion, precio, categoria_id, stock,
                promedio_valoraciones, ano_compatible, marca_compatible,
                modelo_compatible, motor_compatible, certificaciones, estado
            ) VALUES (
                '$nombre', '$descripcion', $precio, $categoria_id, $stock,
                0.00, '$ano_compatible', '$marca_compatible',
                '$modelo_compatible', '$motor_compatible', '$certificaciones', '$estado'
            )
        ";

            $producto_id = $this->enlace->executeSQL_DML_last($sql);

            if (!$producto_id || $producto_id <= 0) {
                error_log("No se pudo insertar el producto");
                return false;
            }

            // Insertar imágenes si existen en data['imagenes']
            foreach ($imagenes as $imagen) {
                $sqlImg = "INSERT INTO ImagenProducto (producto_id, imagen) VALUES ($producto_id, '$imagen')";
                $resImg = $this->enlace->executeSQL_DML($sqlImg);
                if (!$resImg) {
                    error_log("Error insertando imagen para producto $producto_id");
                }
            }

            return true;
        } catch (Exception $e) {
            error_log("Error en modelo Producto::create - " . $e->getMessage());
            return false;
        }
    }






    public function createProducto($data)
    {
        try {
            $sql = "INSERT INTO Producto 
            (nombre, descripcion, precio, categoria_id, stock, promedio_valoraciones, ano_compatible, marca_compatible, modelo_compatible, motor_compatible, certificaciones,estado)
            VALUES (
                '{$data['nombre']}',
                '{$data['descripcion']}',
                {$data['precio']},
                {$data['categoria_id']},
                " . ($data['stock'] ?? 0) . ",
                0.00,
                '{$data['ano_compatible']}',
                '{$data['marca_compatible']}',
                '{$data['modelo_compatible']}',
                '{$data['motor_compatible']}',
                '{$data['certificaciones']}',
                  '{$data['estado']}'

            )";

            return $this->enlace->executeSQL_DML_last($sql);
        } catch (Exception $e) {
            error_log("Error al crear producto (sin imágenes): " . $e->getMessage());
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

    public function Detalles($id)
    {
        try {
            $sql = "SELECT 
    p.id AS producto_id,
    p.nombre AS producto_nombre,
    p.descripcion,
    p.precio,
    c.nombre AS categoria,
    GROUP_CONCAT(DISTINCT e.nombre SEPARATOR ', ') AS etiquetas,
    GROUP_CONCAT(DISTINCT ip.imagen SEPARATOR ', ') AS imagenes,
    r.id AS resena_id,
    u.nombre_usuario,
    r.fecha,
    r.comentario,
    r.valoracion
FROM Producto p
LEFT JOIN Categoria c ON p.categoria_id = c.id
LEFT JOIN ProductoEtiqueta pe ON pe.producto_id = p.id
LEFT JOIN Etiqueta e ON e.id = pe.etiqueta_id
LEFT JOIN ImagenProducto ip ON ip.producto_id = p.id
LEFT JOIN Resena r ON r.producto_id = p.id
LEFT JOIN Usuario u ON u.id = r.usuario_id
WHERE p.id = $id
GROUP BY 
    p.id, r.id
ORDER BY 
    r.fecha DESC
";

            // Ejecutar con parámetro
            $productos = $this->enlace->executeSQL($sql, [$id]);

            return $productos;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
