<?php

class image
{
    //POST Crear
    public function create()
    {
        try {
            $imageModel = new ImageModel();

            $input = [
                'file' => $_FILES['file'],
                'producto_id' => $_POST['producto_id']
            ];

            $result = $imageModel->uploadFile($input);

            $response = new Response();
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
    public function delete($id)
    {
        try {
            $imageModel = new ImageModel();
            $result = $imageModel->deleteImagen($id);

            $response = new Response();
            $response->toJSON([
                'success' => true,
                'message' => 'Imagen eliminada correctamente',
                'data' => $result
            ]);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
