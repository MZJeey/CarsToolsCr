<?php
class Producto
{
    private $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    // Obtener todos los productos con sus imágenes (solo nombres de imagenes o IDs)
    public function getAll()
    {
        $sql = "SELECT p.*, c.nombre as categoria_nombre
                FROM Producto p
                JOIN Categoria c ON p.categoria_id = c.id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Obtener imágenes para cada producto
        foreach ($productos as &$producto) {
            $producto['imagenes'] = $this->getImagenesByProductoId($producto['id']);
        }

        return $productos;
    }

    // Obtener imágenes asociadas a un producto
    public function getImagenesByProductoId($producto_id)
    {
        $stmt = $this->pdo->prepare("SELECT id FROM ImagenProducto WHERE producto_id = :pid");
        $stmt->execute(['pid' => $producto_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Crear producto junto con imágenes
    public function create($data, $imagenes)
    {
        try {
            $this->pdo->beginTransaction();

            $sql = "INSERT INTO Producto 
                    (nombre, descripcion, precio, categoria_id, stock, promedio_valoraciones, año_compatible, marca_compatible, modelo_compatible, motor_compatible, certificaciones)
                    VALUES
                    (:nombre, :descripcion, :precio, :categoria_id, :stock, :promedio_valoraciones, :año_compatible, :marca_compatible, :modelo_compatible, :motor_compatible, :certificaciones)";

            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                'nombre' => $data['nombre'],
                'descripcion' => $data['descripcion'],
                'precio' => $data['precio'],
                'categoria_id' => $data['categoria_id'],
                'stock' => $data['stock'] ?? 0,
                'promedio_valoraciones' => 0.00,
                'año_compatible' => $data['año_compatible'] ?? null,
                'marca_compatible' => $data['marca_compatible'] ?? null,
                'modelo_compatible' => $data['modelo_compatible'] ?? null,
                'motor_compatible' => $data['motor_compatible'] ?? null,
                'certificaciones' => $data['certificaciones'] ?? null
            ]);

            $producto_id = $this->pdo->lastInsertId();

            // Guardar imágenes
            if (!empty($imagenes)) {
                $stmtImg = $this->pdo->prepare("INSERT INTO ImagenProducto (producto_id, imagen) VALUES (:producto_id, :imagen)");
                foreach ($imagenes as $imagen) {
                    // Asumiendo $imagen es un archivo binario (blob) o base64 decodificado
                    $stmtImg->bindParam(':producto_id', $producto_id, PDO::PARAM_INT);
                    $stmtImg->bindParam(':imagen', $imagen, PDO::PARAM_LOB);
                    $stmtImg->execute();
                }
            }

            $this->pdo->commit();
            return true;
        } catch (Exception $e) {
            $this->pdo->rollBack();
            error_log("Error al crear producto: " . $e->getMessage());
            return false;
        }
    }

    // Otros métodos como update, delete, getById se pueden implementar similarmente
}
