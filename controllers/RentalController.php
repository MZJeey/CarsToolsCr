<?php
//class Rental
class rental
{
    //Listar en el API
    public function index()
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $rental = new RentalModel();
            $result = $rental->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function get($param)
    {

        try {
            $response = new Response();
            //Instancia del modelo
            $rental = new RentalModel();
            //Acción del modelo a ejecutar
            $result = $rental->get($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //POST Crear
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $rental = new RentalModel($inputJSON);
            //Acción del modelo a ejecutar
            $result = $rental->create($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function rentalMonthbyShop()
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $rental = new RentalModel();
            $result = $rental->rentalMonthbyShop();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function rentalbyMovie()
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $rental = new RentalModel();
            $result = $rental->rentalbyMovie();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
