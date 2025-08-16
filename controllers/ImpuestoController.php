<?php
class impuesto
{
    public function index()
    {
        // Esto es un controller de ejemplo para manejar el carrito de compras
        try {
            $response = new Response();
            $request = new Request();
            $data = $request->getJSON();

            $model = new ImpuestoModel();
            $result = $model->all();

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function get($id)
    {
        try {
            $response = new Response();
            $model = new ImpuestoModel();
            $result = $model->find($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
