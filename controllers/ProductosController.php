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
    public function getDetalles($id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $producto = new ProductoModel();
            //Acción del modelo a ejecutar
            $result = $producto->Detalles($id);
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
