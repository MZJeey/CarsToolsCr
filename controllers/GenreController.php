<?php
class genre
{
    public function index()
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $genero = new GenreModel();
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
            $genero = new GenreModel();
            $result = $genero->get($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function getGenreMovie($id)
    {
        try {
            $response = new Response();
            $genero = new GenreModel();
            $result = $genero->getGenreMovie($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function getMoviesbyGenre($param)
    {
        try {
            $response = new Response();
            $genero = new GenreModel();
            $result = $genero->getMoviesbyGenre($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
