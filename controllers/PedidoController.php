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
}
