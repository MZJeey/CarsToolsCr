<?php
class CarritoModel {
    // Esto es un model de ejemplo para manejar caritos de compras
    private $enlace;

    public function __construct() {
        $this->enlace = new MySqlConnect();
    }

    public function obtenerCarrito($usuario_id, $session_token) {
        $sql = "SELECT * FROM carrito WHERE usuario_id = $usuario_id OR session_token = '$session_token'";
        return $this->enlace->executeSQL($sql);
    }

    public function agregarProducto($usuario_id, $session_token, $producto_id, $cantidad) {
        $sql = "INSERT INTO carrito (usuario_id, session_token, producto_id, cantidad, guardado_en)
                VALUES ($usuario_id, '$session_token', $producto_id, $cantidad, NOW())
                ON DUPLICATE KEY UPDATE cantidad = cantidad + $cantidad, guardado_en = NOW()";
        return $this->enlace->executeSQL_DML($sql);
    }

    public function actualizarCantidad($usuario_id, $producto_id, $cantidad) {
        $sql = "UPDATE carrito SET cantidad = $cantidad, guardado_en = NOW()
                WHERE usuario_id = $usuario_id AND producto_id = $producto_id";
        return $this->enlace->executeSQL_DML($sql);
    }

    public function eliminarProducto($usuario_id, $producto_id) {
        $sql = "DELETE FROM carrito WHERE usuario_id = $usuario_id AND producto_id = $producto_id";
        return $this->enlace->executeSQL_DML($sql);
    }

    public function vaciarCarrito($usuario_id) {
        $sql = "DELETE FROM carrito WHERE usuario_id = $usuario_id";
        return $this->enlace->executeSQL_DML($sql);
    }
}
