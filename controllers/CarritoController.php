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

    public function create()
    {
        try {
            $request = new Request();
            $inputJSON = $request->getJSON();

            // DEBUG: Imprimir el input recibido
            file_put_contents("debug_input.log", print_r($inputJSON, true));

            if (!$inputJSON) {
                throw new Exception("No se recibió JSON válido");
            }

            $carrito = new CarritoModel();
            $result = $carrito->agregarProducto($inputJSON);
        } catch (Exception $e) {
            handleException($e);
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
