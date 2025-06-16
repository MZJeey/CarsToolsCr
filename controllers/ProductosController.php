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

            $raw = file_get_contents("php://input");
            error_log("JSON recibido: $raw");

            $input = json_decode($raw, true);

            if (!$input || !isset($input['data'], $input['imagenes'])) {
                return $response->toJSON([
                    'status' => 400,
                    'result' => 'JSON malformado o faltan campos requeridos: "data" e "imagenes".'
                ]);
            }

            $producto = new ProductoModel();
            $exito = $producto->create($input['data'], $input['imagenes']);

            return $response->toJSON([
                'status' => $exito ? 200 : 500,
                'result' => $exito ? 'Producto creado exitosamente' : 'Error al crear el producto'
            ]);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function createProducto()
    {
        try {
            $response = new Response();
            $inputJSON = json_decode(file_get_contents("php://input"), true);

            if (!isset($inputJSON['data']) || !is_array($inputJSON['data'])) {
                http_response_code(400);
                return $response->toJSON([
                    'status' => 400,
                    'result' => 'Datos incompletos o inválidos: se requiere "data".'
                ]);
            }

            $producto = new ProductoModel();
            $result = $producto->createProducto($inputJSON['data']);

            http_response_code($result ? 200 : 500);
            return $response->toJSON([
                'status' => $result ? 200 : 500,
                'result' => $result ? 'Producto creado exitosamente' : 'Error al crear el producto'
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return $response->toJSON([
                'status' => 500,
                'result' => 'Error interno del servidor: ' . $e->getMessage()
            ]);
        }
    }


    public function update($id)
    {
        try {
            $response = new Response();
            $request = new Request();
            // Obtener JSON como objeto
            $inputJSON = $request->getJSON();

            if (!isset($inputJSON->data)) {
                return $response->toJSON([
                    'status' => 400,
                    'result' => 'Datos incompletos: se requiere "data".'
                ]);
            }

            $producto = new ProductoModel();
            // Convertir el objeto data a array antes de enviarlo al modelo
            $result = $producto->update($id, (array)$inputJSON->data);

            $response->toJSON([
                'status' => $result ? 200 : 500,
                'result' => $result ? 'Producto actualizado exitosamente' : 'Error al actualizar el producto'
            ]);
        } catch (Exception $e) {
            handleException($e);
        }
    }


    public function delete($id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $producto = new ProductoModel();
            //Acción del modelo a ejecutar
            $result = $producto->delete($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
