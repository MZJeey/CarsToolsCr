<?php
class producto
{
    public function index()
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $productoM = new ProductoModel;
            //Método del modelo
            $result = $productoM->All();
            //Dar respuesta

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function get($id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $producto = new ProductoModel();
            //Acción del modelo a ejecutar
            $result = $producto->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function getById($id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $producto = new ProductoModel();
            //Acción del modelo a ejecutar
            $result = $producto->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function create()
    {
        try {
            $request = new Request();
            $inputJSON = $request->getJSON();

            // DEBUG: Imprimir el input recibido
            file_put_contents("debug_input.log", print_r($inputJSON, true));

            if (!$inputJSON) {
                throw new Exception("No se recibió JSON válido");
            }

            $producto = new ProductoModel();
            $result = $producto->create($inputJSON);

            (new Response())->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }


    public function delete($id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $producto = new ProductoModel();
            //Acción del modelo a ejecutar
            $result = $producto->delete($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function update($id)
    {
        try {
            $request = new Request();
            $inputData = $request->getJSON(true);

            if (!$inputData) {
                throw new Exception("No se recibieron datos válidos");
            }

            $productoModel = new ProductoModel();
            $result = $productoModel->update($id, $inputData);

            (new Response())->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
