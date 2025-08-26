<?php
class carrito
{
    public function index()
    {
        // Esto es un controller de ejemplo para manejar el carrito de compras
        try {
            $response = new Response();
            $request = new Request();
            $data = $request->getJSON();

            $usuario_id = $data->usuario_id ?? 0;
            $session_token = $data->session_token ?? '';

            $model = new CarritoModel();
            $result = $model->obtenerCarrito();

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // public function create()
    // {
    //     try {
    //         $request = new Request();
    //         $response = new Response();
    //         $inputJSON = $request->getJSON();

    //         // DEBUG: Imprimir el input recibido
    //         file_put_contents("debug_input.log", print_r($inputJSON, true));

    //         if (!$inputJSON) {
    //             throw new Exception("No se recibió JSON válido");
    //         }

    //         $carrito = new CarritoModel($inputJSON);
    //         $result = $carrito->guardarCarrito($inputJSON);

    //         $response->toJSON($result);
    //     } catch (Exception $e) {
    //         handleException($e);
    //     }
    // }

    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();

            // Obtener JSON del request
            $inputJSON = $request->getJSON();

            // DEBUG: Guardar lo recibido en un log
            file_put_contents("debug_input.log", print_r($inputJSON, true));

            if (!$inputJSON) {
                throw new Exception("No se recibió JSON válido");
            }

            // Si lo recibido es un array, convertirlo a objeto
            if (is_array($inputJSON)) {
                $inputJSON = json_decode(json_encode($inputJSON));
            }

            // Validar campos requeridos
            if (
                !isset($inputJSON->usuario_id) ||
                !isset($inputJSON->producto_id) ||
                !isset($inputJSON->cantidad)
            ) {
                throw new Exception("Faltan campos requeridos: usuario_id, producto_id o cantidad");
            }

            // Crear modelo y guardar carrito
            $carrito = new CarritoModel();
            $result = $carrito->guardarCarrito($inputJSON);

            // Respuesta en JSON
            $response->toJSON([
                "success" => true,
                "data" => $result
            ]);
        } catch (Exception $e) {
            // Loguear el error
            error_log("Error en CarritoController::create -> " . $e->getMessage());
            $response = new Response();
          
            $response->toJSON([
                "success" => false,
                "error" => $e->getMessage()
            ]);
        }
    }













    public function actualizar()
    {
        try {
            $response = new Response();
            $request = new Request();
            $data = $request->getJSON()->data;

            $model = new CarritoModel();
            $result = $model->actualizarCantidad($data->usuario_id, $data->producto_id, $data->cantidad);

            $response->toJSON(['status' => $result ? 'ok' : 'error']);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function eliminar()
    {
        try {
            $response = new Response();
            $request = new Request();
            $data = $request->getJSON()->data;

            $model = new CarritoModel();
            $result = $model->eliminarProducto($data->usuario_id, $data->producto_id);

            $response->toJSON(['status' => $result ? 'ok' : 'error']);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function vaciar()
    {
        try {
            $response = new Response();
            $request = new Request();
            $data = $request->getJSON()->data;

            $model = new CarritoModel();
            $result = $model->vaciarCarrito($data->usuario_id);

            $response->toJSON(['status' => $result ? 'ok' : 'error']);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
