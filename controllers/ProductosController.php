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
    public function create()
    {
        try {
            $response = new Response();
            $request = new Request();
            //Obtener json enviado
            $inputJSON = $request->getJSON(); // $inputJSON['data'] y $inputJSON['imagenes']
            $producto = new ProductoModel();
            $result = $producto->create($inputJSON['data'], $inputJSON['imagenes']);
            $response->toJSON($result);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
