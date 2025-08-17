<?php
class factura
{
    /** GET /factura  */
    public function index()
    {
        try {
            $response = new Response();
            $model    = new FacturaModel();
            $data     = $model->all();
            $response->toJSON($data);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /** GET /factura/get?id=123 */
    public function get()
    {
        try {
            $response = new Response();
            $model    = new FacturaModel();

            $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
            if ($id <= 0) {
                http_response_code(400);
                return $response->toJSON(['error' => 'ID inválido']);
            }

            $row = $model->get($id);
            if (!$row) {
                http_response_code(404);
                return $response->toJSON(['error' => 'Factura no encontrada']);
            }

            $response->toJSON($row);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /** GET /factura/by-pedido?pedido_id=77 */
    public function getByPedido()
    {
        try {
            $response  = new Response();
            $model     = new FacturaModel();
            $pedido_id = isset($_GET['pedido_id']) ? (int)$_GET['pedido_id'] : 0;

            if ($pedido_id <= 0) {
                http_response_code(400);
                return $response->toJSON(['error' => 'pedido_id inválido']);
            }

            $row = $model->getByPedido($pedido_id);
            if (!$row) {
                http_response_code(404);
                return $response->toJSON(['error' => 'No existe factura para ese pedido']);
            }

            $response->toJSON($row);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * POST /factura/create
     * Body JSON (dos formas):
     *  A) Con pedido:
     *     { "pedido_id": 77, "metodo_pago": "tarjeta_credito" }
     *  B) Solo carrito (pedido_id NULL):
     *     { "metodo_pago": "tarjeta_credito",
     *       "items": [
     *         { "producto_id":1, "nombre":"Soporte", "cantidad":1, "precio_unitario":28250 }
     *       ]
     *     }
     */
    public function create()
    {
        try {
            $response = new Response();
            $model    = new FacturaModel();

            $raw  = file_get_contents('php://input');
            $data = json_decode($raw, true);

            $pedido_id   = (int)($data['pedido_id']   ?? 0);
            $metodo_pago = trim($data['metodo_pago']  ?? '');
            $items       = $data['items']            ?? null; // ← carrito opcional

            if ($metodo_pago === '') {
                http_response_code(400);
                return $response->toJSON(['error' => 'Debe enviar metodo_pago']);
            }

            // Si no hay pedido_id, debe venir un carrito con items
            if ($pedido_id <= 0 && (!is_array($items) || count($items) === 0)) {
                http_response_code(400);
                return $response->toJSON(['error' => 'Envíe items del carrito o un pedido_id válido']);
            }

            $creada = $model->create($pedido_id > 0 ? $pedido_id : null, $metodo_pago, $items);
            http_response_code(201);
            $response->toJSON($creada);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /** DELETE /factura/delete?id=123 */
    public function delete()
    {
        try {
            $response = new Response();
            $model    = new FacturaModel();

            $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
            if ($id <= 0) {
                http_response_code(400);
                return $response->toJSON(['error' => 'ID inválido']);
            }

            $ok = $model->delete($id);
            $response->toJSON(['deleted' => $ok]);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
