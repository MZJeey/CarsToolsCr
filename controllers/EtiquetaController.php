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

            // Convertir JSON a array
            $input = (array) $request->getJSON();

            // Extraer 'data' si existe
            $data = isset($input['data']) ? (array) $input['data'] : $input;

            $model = new EtiquetaModel();
            $result = $model->create($data);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }



<<<<<<< HEAD
public function update()
{
    try {
        $response = new Response();
        $request = new Request();
        $data = (array) $request->getJSON(); // convertir objeto en array

        // Extraer el ID desde la URL
        $url = $_SERVER['REQUEST_URI'];
        $partes = explode('/', $url);
        $id = end($partes); // último valor de la URL

        $model = new EtiquetaModel();
        $result = $model->update($id, $data);
        $response->toJSON($result);
    } catch (Exception $e) {
        handleException($e);
=======
    public function update($id)
    {
        try {
            $response = new Response();

            // Convertir el JSON recibido a array
            $data = json_decode(file_get_contents("php://input"), true);

            // Si viene envuelto en "data", extraerlo
            if (isset($data['data'])) {
                $data = $data['data'];
            }

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
>>>>>>> developer
    }
}


public function delete()
{
    try {
        $response = new Response();
        $request = new Request();

        // Obtener el ID desde la URL
        $url = $_SERVER['REQUEST_URI'];
        $partes = explode('/', $url);
        $id = end($partes); // Toma el último segmento de la URL

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
