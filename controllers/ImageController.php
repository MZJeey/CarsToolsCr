<?php

class image
{
    //POST Crear
    public function create()
    {
        try {
            /* $file=null;
            if (isset($_FILES['file'])){
                $file = $_FILES['file'];
            } */
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputFILE = $request->getBody();
            //Instancia del modelo
            $movie = new ImageModel();
            //Acción del modelo a ejecutar
            $result = $movie->uploadFile($inputFILE);

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
            $image = new ImageModel();
            //Acción del modelo a ejecutar
            $result = $image->getImagen($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
