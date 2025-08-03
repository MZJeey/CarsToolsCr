<?php

class productoetiqueta
{
    public function index()
    {
        try {
            $response = new Response();
            $model = new ProductoEtiquetaModel();
            $result = $model->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function getByProducto($producto_id)
    {
        try {
            $response = new Response();
            $model = new ProductoEtiquetaModel();
            $result = $model->getEtiquetasByProducto($producto_id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function asignar()
    {
        try {
            $request = new Request();
            $response = new Response();
            $input = (array) $request->getJSON();

            $producto_id = $input['producto_id'] ?? 0;
            $etiquetas = $input['etiquetas'] ?? [];

            $model = new ProductoEtiquetaModel();
            $result = $model->asignarEtiquetas($producto_id, $etiquetas);
            $response->toJSON(['status' => $result ? 'ok' : 'error']);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function eliminar()
    {
        try {
            $request = new Request();
            $response = new Response();
            $input = (array) $request->getJSON();

            $producto_id = $input['producto_id'] ?? 0;
            $etiqueta_id = $input['etiqueta_id'] ?? 0;

            $model = new ProductoEtiquetaModel();
            $result = $model->eliminarEtiqueta($producto_id, $etiqueta_id);
            $response->toJSON(['status' => $result ? 'ok' : 'error']);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function eliminarTodas()
    {
        try {
            $request = new Request();
            $response = new Response();
            $input = (array)$request->getJSON();

            $producto_id = $input['producto_id'] ?? 0;

            if ($producto_id <= 0) {
                return $response->toJSON([
                    'status' => 'error',
                    'message' => 'ID de producto inválido'
                ]);
            }

            $model = new ProductoEtiquetaModel();
            $result = $model->eliminarTodas($producto_id);
            $response->toJSON(['status' => $result ? 'ok' : 'error']);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
