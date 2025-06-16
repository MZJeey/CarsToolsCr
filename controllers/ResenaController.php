<?php
class resena
{
    public function index()
    {
        try {
            $resenaM = new ResenaModel();
            $response = new Response();
            $result = $resenaM->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }



    public function getByProducto($id)
    {
        try {
            $resenaM = new ResenaModel();
            $response = new Response();
            $result = $resenaM->getByProducto($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

        public function create()
    {
        try {
            $request = new Request();
            $response = new Response();

            $input = (array)$request->getJSON();
            $resenaM = new ResenaModel();
            $resultado = $resenaM->create($input);

            $response->toJSON($resultado);
        } catch (Exception $e) {
            handleException($e);
        }
    }

public function update()
{
    try {
        $request = new Request();
        $response = new Response();
        $input = (array)$request->getJSON();

        // Tomar el ID desde el cuerpo
        $id = isset($input['id']) ? (int)$input['id'] : 0;
        $estado = isset($input['estado']) ? (int)$input['estado'] : 1;

        if ($id <= 0) {
            return $response->toJSON([
                'status' => 'error',
                'message' => 'ID inválido'
            ]);
        }

        $resenaM = new ResenaModel();
        $result = $resenaM->update($id, $estado);

        $response->toJSON(['status' => $result ? 'ok' : 'error']);
    } catch (Exception $e) {
        handleException($e);
    }
}


    public function estadisticas($producto_id)
    {
        try {
            $resenaM = new ResenaModel();
            $response = new Response();
            $result = $resenaM->estadisticasValoracion($producto_id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

}