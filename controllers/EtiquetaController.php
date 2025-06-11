<?php
class etiqueta
{
    public function index()
    {
        try {
            $response = new Response();
            $model = new EtiquetaModel();
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
            $model = new EtiquetaModel();
            $result = $model->get($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create()
    {
        try {
            $response = new Response();
            $request = new Request();
            $data = $request->getJSON();
            $model = new EtiquetaModel();
            $result = $model->create($data);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function update($id)
    {
        try {
            $response = new Response();
            $request = new Request();
            $data = $request->getJSON();
            $model = new EtiquetaModel();
            $result = $model->update($id, $data);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function delete($id)
    {
        try {
            $response = new Response();
            $model = new EtiquetaModel();
            $result = $model->delete($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

public function getByProducto($producto_id)
{
    try {
        $response = new Response();
        $model = new EtiquetaModel();
        $result = $model->getByProducto($producto_id);
        $response->toJSON($result);
    } catch (Exception $e) {
        handleException($e);
    }
}

}
