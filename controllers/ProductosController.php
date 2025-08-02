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
    public function getById($id)
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
            $request = new Request();
            $inputJSON = $request->getJSON();

            // DEBUG: Imprimir el input recibido
            file_put_contents("debug_input.log", print_r($inputJSON, true));

            if (!$inputJSON) {
                throw new Exception("No se recibió JSON válido");
            }

            $producto = new ProductoModel();
            $result = $producto->create($inputJSON);

            (new Response())->toJSON($result);
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

public function update()
{
    try {
        $urlParts = explode('/', $_SERVER["REQUEST_URI"]);
        $id = end($urlParts); // 🟢 Captura el último segmento de la URL como ID

        if (!is_numeric($id)) {
            throw new Exception("ID de producto no recibido o inválido");
        }

        // Manejo de multipart/form-data o JSON
        $data = $_POST;

        // Si se envía como JSON crudo
        if (empty($data)) {
            $input = file_get_contents("php://input");
            $data = json_decode($input, true);
        }

        // Manejo de imágenes desde FormData (si las hay)
        if (!empty($_FILES['imagenes'])) {
            $data['imagenes'] = array_map(function ($f) {
                return $f['name'];
            }, $_FILES['imagenes']);
        }

        // Si viene como string JSON
        if (isset($data['imagenes_a_eliminar']) && is_string($data['imagenes_a_eliminar'])) {
            $data['imagenes_a_eliminar'] = json_decode($data['imagenes_a_eliminar'], true);
        }

        require_once __DIR__ . '/../models/ProductoModel.php';
        $modelo = new ProductoModel();
        $resultado = $modelo->update($id, $data);

        echo json_encode(['status' => 'success', 'producto' => $resultado]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
}


}
