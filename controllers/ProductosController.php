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
            $request = new Request();

            // Obtener JSON enviado y convertir a array
            $inputJSON = json_decode(file_get_contents("php://input"), true); // convierte a array

            if (!isset($inputJSON['data']) || !isset($inputJSON['imagenes'])) {
                $response->toJSON([
                    'status' => 400,
                    'result' => 'Datos incompletos: se requiere "data" e "imagenes".'
                ]);
                return;
            }

            $producto = new ProductoModel();
            $result = $producto->create($inputJSON['data'], $inputJSON['imagenes']);

            $response->toJSON([
                'status' => 200,
                'result' => $result ? 'Producto creado exitosamente' : 'Error al crear el producto'
            ]);
        } catch (Exception $e) {
            handleException($e); // asegúrate de tener esta función definida
        }
    }
    public function createProducto()
    {
        try {
            $response = new Response();
            $inputJSON = json_decode(file_get_contents("php://input"), true);

            if (!isset($inputJSON['data'])) {
                return $response->toJSON([
                    'status' => 400,
                    'result' => 'Datos incompletos: se requiere "data".'
                ]);
            }

            $producto = new ProductoModel();
            $result = $producto->createProducto($inputJSON['data']); // método sin imágenes

            return $response->toJSON([
                'status' => $result ? 200 : 500,
                'result' => $result ? 'Producto creado exitosamente' : 'Error al crear el producto'
            ]);
        } catch (Exception $e) {
            handleException($e);
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
