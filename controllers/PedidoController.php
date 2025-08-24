<?php
class pedido
{
    public function crear()
    {
        try {
            $request = new Request();
            $response = new Response();
            $data = $request->getJSON()->data;

            $model = new PedidoModel();
            $resultado = $model->crearPedido($data);

            // Enviar el resultado completo al frontend
            $response->toJSON($resultado);
        } catch (Exception $e) {
            handleException($e);
        }
    }


    public function listar()
    {
        try {
            $request = new Request();
            $response = new Response();
            $data = $request->getJSON();

            $model = new PedidoModel();
            $pedidos = $model->obtenerPedidosPorUsuario($data->usuario_id);

            $response->toJSON($pedidos);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function detalles()
    {
        try {
            $request = new Request();
            $response = new Response();
            $data = $request->getJSON();

            $model = new PedidoModel();
            $detalles = $model->obtenerDetalles($data->pedido_id);

            $response->toJSON($detalles);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function cambiarEstado()
    {
        try {
            $request = new Request();
            $response = new Response();
            $data = $request->getJSON();

            $model = new PedidoModel();
            $ok = $model->cambiarEstado($data->pedido_id, $data->nuevo_estado);

            $response->toJSON(['status' => $ok ? 'ok' : 'error']);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function listarTodos()
    {
        try {
            $request = new Request();
            $response = new Response();
            $model = new PedidoModel();
            $data = $request->getJSON();
            $pedidos = $model->all($data->usuario_id);
            $response->toJSON($pedidos);
        } catch (Exception $e) {
            handleException($e);
        }
    }


    // Eliminar los pedidos de con su productoPersoanlizado completo

public function eliminar()
{
    try {
        $request = new Request();
        $response = new Response();
        $data = $request->getJSON();

        if (!isset($data->pedido_id)) {
            return $response->toJSON(['ok' => false, 'msg' => 'pedido_id requerido'], 400);
        }

        $model = new PedidoModel();
        $ok = $model->eliminarPedidoCompleto((int)$data->pedido_id);

        if ($ok) {
            return $response->toJSON(['ok' => true, 'msg' => 'Pedido eliminado']);
        } else {
            return $response->toJSON(['ok' => false, 'msg' => 'No se pudo eliminar (quizá no existe)'], 404);
        }
    } catch (Exception $e) {
        handleException($e);
    }
}


}
