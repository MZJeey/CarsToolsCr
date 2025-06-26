<?php

class PedidoModel {
    private $db;

    public function __construct() {
        $this->db = new MySqlConnect();
    }

    public function crearPedido($usuario_id, $direccion_envio, $productos) {
        try {
            // Insertar el pedido
            $sqlPedido = "INSERT INTO pedido (usuario_id, fecha_pedido, direccion_envio, estado) 
                          VALUES ($usuario_id, NOW(), '$direccion_envio', 'en_proceso')";
            $pedidoId = $this->db->executeSQL_DML_last($sqlPedido);

            if (!$pedidoId) return false;

            // Insertar productos en pedido_detalle
foreach ($productos as $producto) {
    // Obtener el precio actual del producto
    $precioQuery = "SELECT precio FROM producto WHERE id = {$producto->producto_id}";
    $precioResult = $this->db->executeSQL($precioQuery);
    $precio_unitario = $precioResult[0]->precio ?? 0;

    $sqlDetalle = "INSERT INTO detallepedido (pedido_id, producto_id, cantidad, precio_unitario) 
                   VALUES ({$pedidoId}, {$producto->producto_id}, {$producto->cantidad}, {$precio_unitario})";

    $this->db->executeSQL_DML($sqlDetalle);
}


            return true;
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }

    public function obtenerPedidosPorUsuario($usuario_id) {
        $sql = "SELECT * FROM pedido WHERE usuario_id = $usuario_id";
        return $this->db->executeSQL($sql);
    }

    public function obtenerDetalles($pedido_id) {
        $sql = "SELECT * FROM detallepedido WHERE pedido_id = $pedido_id";
        return $this->db->executeSQL($sql);
    }

    public function cambiarEstado($pedido_id, $nuevoEstado) {
        $estadoActual = $this->db->executeSQL("SELECT estado FROM pedido WHERE id = $pedido_id");
        if (empty($estadoActual)) return false;

        $estadoActual = $estadoActual[0]->estado;
        $secuencia = ['en_proceso', 'pagado', 'entregado'];
        $posActual = array_search($estadoActual, $secuencia);
        $posNuevo = array_search($nuevoEstado, $secuencia);

        if ($posNuevo === $posActual + 1) {
            $sql = "UPDATE pedido SET estado = '$nuevoEstado' WHERE id = $pedido_id";
            return $this->db->executeSQL_DML($sql);
        }

        return false;
    }
}
