<?php

class promocion
{
       public function index()
    {
        try {
            $response = new Response();
            $model = new PromocionModel();
            $result = $model->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $response = new Response();
            $model = new PromocionModel();
            $result = $model->get($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create()
    {
        try {
            $response = new Response();
            $inputJSON = json_decode(file_get_contents("php://input"), true);

            if (!isset($inputJSON['data'])) {
                return $response->toJSON(["status" => 400, "result" => "Datos incompletos"]);
            }

            $model = new PromocionModel();
            $result = $model->create($inputJSON['data']);

            return $response->toJSON(["status" => $result ? 200 : 500, "result" => $result]);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function update($id)
    {
        try {
            $response = new Response();
            $request = new Request();
            $input = $request->getJSON();

            if (!isset($input->data)) {
                return $response->toJSON(["status" => 400, "result" => "Datos incompletos"]);
            }

            $model = new PromocionModel();
            $result = $model->update($id, (array)$input->data);

            return $response->toJSON(["status" => $result ? 200 : 500, "result" => $result]);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function delete($id)
    {
        try {
            $response = new Response();
            $model = new PromocionModel();
            $result = $model->delete($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

public function activas()
{
    try {
        $response = new Response();
        $model = new PromocionModel();
        $result = $model->getActivas();
        $response->toJSON($result);
    } catch (Exception $e) {
        handleException($e);
    }
}



}