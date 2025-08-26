<?php

class PedidoModel
{
    private $db;

    public function __construct()
    {
        $this->db = new MySqlConnect();
    }

    public function all($usuario_id)
    {
        try {
            $sql = "SELECT 
            Pedido.id,
            Usuario.nombre_usuario,
            Pedido.fecha_pedido,
            Pedido.direccion_envio,
            Pedido.estado
        FROM Pedido
        JOIN Usuario ON Pedido.usuario_id = Usuario.id
        WHERE Usuario.id = $usuario_id
        ";

            $pedidos = $this->db->executeSQL($sql);

            if (is_array($pedidos)) {
                foreach ($pedidos as $pedido) {
                    $pedido->detalles = $this->obtenerDetalles($pedido->id) ?? [];
                }
                return $pedidos;
            }

            return [];
        } catch (Exception $e) {
            error_log("Error en PedidoModel::all(): " . $e->getMessage());
            return [];
        }
    }

    // public function all($usuario_id)
    // {
    //     try {
    //         // Primero obtener el rol del usuario (asumiendo que tienes acceso a esta información)
    //         $rol = new RolModel();

    //         $rol_usuario = $rol->getRolUser($usuario_id);

    //         $sql = "SELECT 
    //         Pedido.id,
    //         Usuario.nombre_usuario,
    //         Pedido.fecha_pedido,
    //         Pedido.direccion_envio,
    //         Pedido.estado
    //     FROM Pedido
    //     JOIN Usuario ON Pedido.usuario_id = Usuario.id";

    //         // Si no es administrador, filtrar por usuario
    //         if ($rol_usuario != 1) {
    //             $sql .= " WHERE Usuario.id = $usuario_id";
    //         }

    //         $pedidos = $this->db->executeSQL($sql);

    //         if (is_array($pedidos)) {
    //             foreach ($pedidos as $pedido) {
    //                 $pedido->detalles = $this->obtenerDetalles($pedido->id) ?? [];
    //             }
    //             return $pedidos;
    //         }

    //         return [];
    //     } catch (Exception $e) {
    //         error_log("Error en PedidoModel::all(): " . $e->getMessage());
    //         return [];
    //     }
    // }


    public function crearPedido($data)
    {
        try {
            // Insertar el pedido
            $sqlPedido = "INSERT INTO pedido (usuario_id, fecha_pedido, direccion_envio, estado) 
                          VALUES ($data->usuario_id, NOW(), '$data->direccion_envio', 'en_proceso')";
            $pedidoId = $this->db->executeSQL_DML_last($sqlPedido);

            if (!$pedidoId) return false;

            // Insertar productos en pedido
            foreach ($data->productos as $producto) {
                // Obtener el precio actual del producto
                $precioQuery = "SELECT precio FROM producto WHERE id = {$producto->producto_id}";
                $precioResult = $this->db->executeSQL($precioQuery);
                $precio_unitario = $precioResult[0]->precio ?? 0;

                $sqlDetalle = "INSERT INTO detallepedido (pedido_id, producto_id, cantidad, precio_unitario) 
                   VALUES ({$pedidoId}, {$producto->producto_id}, {$producto->cantidad}, {$precio_unitario})";

                $this->db->executeSQL_DML($sqlDetalle);
            }


            return [
                "id" => $pedidoId,
                "detalles" => $this->obtenerDetalles($pedidoId)
            ];
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }
    // Obtiene todos los pedidos de un usuario
    // por su ID de usuario
    public function obtenerPedidosPorUsuario($usuario_id)
    {
        $sql = "SELECT * FROM pedido WHERE usuario_id = $usuario_id";
        return $this->db->executeSQL($sql);
    }
    // Se va a utilizar para pasarlo a factura
    public function obtenerDetalles($pedido_id)
    {
        $ProductoPersonalizado = new ProductoPersonalizadoModel();

        $sql = "SELECT 
    dp.pedido_id,
    p.nombre AS nombre_producto,
    p.IdImpuesto AS id_impuesto,
    i.Porcentaje AS porcentaje,
    dp.cantidad,
    dp.precio_unitario
FROM DetallePedido dp
JOIN Producto p ON dp.producto_id = p.id
JOIN Impuesto i ON p.IdImpuesto = i.IdImpuesto
WHERE dp.pedido_id = $pedido_id";

        $detalle = $this->db->executeSQL($sql);


        if (!empty($detalle)) {
            $detalle = $detalle[0];
            $detalle->productos = $ProductoPersonalizado->obtenerPorPedido($pedido_id);
        }
        return $detalle;
    }
    // Cambia el estado de un pedido si es válido
    public function cambiarEstado($pedido_id, $nuevoEstado)
    {
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
    public function obtenerTodosLosPedidosConDetalles()
    {
        $sql = "SELECT 
                p.id AS pedido_id, 
                p.fecha_pedido, 
                p.direccion_envio, 
                p.estado, 
                dp.producto_id, 
                pr.nombre AS nombre_producto,
                dp.cantidad, 
                dp.precio_unitario
            FROM pedido p
            JOIN detallepedido dp ON p.id = dp.pedido_id
            JOIN producto pr ON dp.producto_id = pr.id
            ORDER BY p.fecha_pedido DESC";
        return $this->db->executeSQL($sql);
    }
}
