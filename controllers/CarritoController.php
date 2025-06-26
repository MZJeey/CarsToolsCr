<?php
class carrito {
    public function index() {
        try {
            $response = new Response();
            $request = new Request();
            $data = $request->getJSON();

            $usuario_id = $data->usuario_id ?? 0;
            $session_token = $data->session_token ?? '';

            $model = new CarritoModel();
            $result = $model->obtenerCarrito($usuario_id, $session_token);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function agregar() {
        try {
            $response = new Response();
            $request = new Request();
            $data = $request->getJSON()->data;

            $model = new CarritoModel();
            $result = $model->agregarProducto(
                $data->usuario_id,
                $data->session_token,
                $data->producto_id,
                $data->cantidad
            );

            $response->toJSON(['status' => $result ? 'ok' : 'error']);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function actualizar() {
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

    public function eliminar() {
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

    public function vaciar() {
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
