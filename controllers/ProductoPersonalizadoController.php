<?php

class producto_personalizado
{
    public function getByPedido()
    {
        try {
            $request = new Request();
            $response = new Response();
            $data = $request->getJSON();

            $model = new ProductoPersonalizadoModel();
            $detalles = $model->obtenerPorPedido($data->pedido_id);

            $response->toJSON($detalles);
        } catch (Exception $e) {
            handleException($e);
        }
    }
// Se crean los métodos para manejar los productos personalizados
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            $data = $request->getJSON()->data;

            $model = new ProductoPersonalizadoModel();
            $ok = $model->crear($data->pedido_id, $data->productos_personalizados);

            $response->toJSON(['status' => $ok ? 'ok' : 'error']);
        } catch (Exception $e) {
            handleException($e);
        }
    }

public function getAll()
{
    try {
        $model = new ProductoPersonalizadoModel();
        $lista = $model->obtenerTodos();

        $response = new Response();
        $response->toJSON($lista);
    } catch (Exception $e) {
        handleException($e);
    }
}



}
