<?php


class categorias
{
    private $categoriaModel;

    public function __construct()
    {
        $this->categoriaModel = new CategoriaModel();
    }

    // Endpoint para obtener todas las categorías
    public function index()
    {
        try {
            $response = new Response();
            $model = new CategoriaModel();
            $result = $model->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
