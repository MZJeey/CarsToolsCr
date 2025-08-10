<?php
class CarritoModel
{
    // Esto es un model de ejemplo para manejar caritos de compras
    private $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function obtenerCarrito()
    {
        $sql = "select * from carrito;'";
        return $this->enlace->executeSQL($sql);
    }

    public function agregarProducto($data)
    {
        try {
            $sql = "INSERT INTO carrito (usuario_id, producto_id, cantidad, guardado_en)
                VALUES ('$data->usuario_id', '$data->producto_id', '$data->cantidad', NOW())";

            $carrito_id = $this->enlace->executeSQL_DML_last($sql);

            return $this->get($carrito_id);
        } catch (Exception $e) {
            // Manejo de errores: puedes registrar el error y relanzarlo
            error_log("Error en agregarProducto: " . $e->getMessage());
            throw $e; // Relanza la excepción para que el controlador también pueda manejarla
        }
    }


    public function actualizarCantidad($data)
    {
        $sql = "UPDATE carrito SET cantidad = {$data->cantidad}, guardado_en = NOW()
                WHERE usuario_id = {$data->usuario_id} AND producto_id = {$data->producto_id}";
        return $this->enlace->executeSQL_DML($sql);
    }

    public function eliminarProducto($data)
    {
        $sql = "DELETE FROM carrito WHERE usuario_id = {$data->usuario_id} AND producto_id = {$data->producto_id}";
        return $this->enlace->executeSQL_DML($sql);
    }

    public function vaciarCarrito($data)
    {
        $sql = "DELETE FROM carrito WHERE usuario_id = {$data->usuario_id}";
        return $this->enlace->executeSQL_DML($sql);
    }
    public function get($id)
    {
        try {
            $sql = "SELECT * FROM carrito WHERE id = $id";
            $result = $this->enlace->executeSQL($sql);
            if (empty($result)) {
                throw new Exception("Carrito no encontrado");
            }
            return $result[0];
        } catch (Exception $e) {
            error_log("Error en modelo CarritoModel::get - " . $e->getMessage());
            return false;
        }
    }
}
