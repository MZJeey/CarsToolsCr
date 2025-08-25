<?php


class ProductoSimilarController
{


    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            $inputJSON = $request->getJSON();

            if (!$inputJSON) {
                throw new Exception("No se recibió JSON válido");
            }

            $producto = new ProductosSimilaresModel();
            $result = $producto->agregarProductoSimilares($inputJSON);

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
            $producto = new ProductosSimilaresModel();
            //Acción del modelo a ejecutar
            $result = $producto->obtenerProductosSimilares($id);
            //Dar respuesta
            return $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
