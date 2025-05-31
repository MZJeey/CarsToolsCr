<?php
class actor
{
    public function index()
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $genero = new ActorModel();
            $result = $genero->all();
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
            $genero = new ActorModel();
            $result = $genero->get($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function getActorMovie($id)
    {
        try {
            $response = new Response();
            $genero = new ActorModel();
            $result = $genero->getActorMovie($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
