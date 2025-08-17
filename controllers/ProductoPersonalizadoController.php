<?php

class producto_personalizado
{
    public function getByPedido()
    {
        try {
            $request = new Request();
            $response = new Response();
            $data = $request->getJSON();

            $model = new ProductoPersonalizadoModel();
            $detalles = $model->obtenerPorPedido($data->pedido_id);

            $response->toJSON($detalles);
        } catch (Exception $e) {
            handleException($e);
        }
    }
// Se crean los métodos para manejar los productos personalizados
    // public function create()
    // {
    //     try {
    //         $request = new Request();
    //         $response = new Response();
    //         $data = $request->getJSON()->data;

    //         $model = new ProductoPersonalizadoModel();
    //         $ok = $model->crear($data->pedido_id, $data->productos_personalizados);

    //         $response->toJSON(['status' => $ok ? 'ok' : 'error']);
    //     } catch (Exception $e) {
    //         handleException($e);
    //     }
    // }
    public function create()
{
    try {
        $request  = new Request();
        $response = new Response();

        // 1) Lee JSON (con o sin wrapper "data")
        $json = $request->getJSON();
        if ($json === null) {
            // Fallback por si el Request no detecta el JSON
            $raw  = file_get_contents('php://input');
            $json = json_decode($raw);
        }

        if ($json === null) {
            return $response->toJSON(['status' => 'error', 'message' => 'JSON inválido']);
        }

        $in = isset($json->data) ? $json->data : $json;

        $pedido_id = (int)($in->pedido_id ?? 0);
        $items     = $in->productos_personalizados ?? [];

        // Normaliza items a array asociativo
        if (is_object($items)) {
            $items = json_decode(json_encode($items), true);
        }
        if (!is_array($items)) {
            $items = [];
        }

        if ($pedido_id <= 0 || empty($items)) {
            return $response->toJSON(['status' => 'error', 'message' => 'Datos incompletos']);
        }

        // 2) Invoca el modelo
        $model = new ProductoPersonalizadoModel();
        $ok    = $model->crear($pedido_id, $items);

        return $response->toJSON(['status' => $ok ? 'ok' : 'error']);
    } catch (Throwable $e) {
        handleException($e);
    }
}


public function getAll()
{
    try {
        $model = new ProductoPersonalizadoModel();
        $lista = $model->obtenerTodos();

        $response = new Response();
        $response->toJSON($lista);
    } catch (Exception $e) {
        handleException($e);
    }
}



// ========== NUEVO ==========
// GET /producto_personalizado/productos_base
public function productos_base()
{
    try {
        $model = new ProductoPersonalizadoModel();
        $lista = $model->listarProductosBase();

        $response = new Response();
        $response->toJSON($lista);
    } catch (Exception $e) {
        handleException($e);
    }
}

// ========== NUEVO ==========
// POST /producto_personalizado/producto_base_detalle
// body JSON: { "producto_id": 123 }
public function producto_base_detalle()
{
    try {
        $request = new Request();
        $data = $request->getJSON();
        if (!isset($data->producto_id)) {
            throw new Exception("producto_id es requerido");
        }

        $model = new ProductoPersonalizadoModel();
        $detalle = $model->detalleProductoBase($data->producto_id);

        $response = new Response();
        $response->toJSON($detalle);
    } catch (Exception $e) {
        handleException($e);
    }
}





}
