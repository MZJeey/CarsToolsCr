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
        $response = new Response();

        $input = isset($_POST['data']) ? json_decode($_POST['data'], true) : null;
        $archivos = $_FILES['imagenes'] ?? null;

        if (!$input || !$archivos || empty($archivos['name'])) {
            return $response->toJSON([
                'status' => 400,
                'result' => 'Faltan datos: asegúrate de enviar "data" y al menos una imagen.'
            ]);
        }

        $carpeta = "public/uploads/"; // No se crea porque ya existe

        $imagenesGuardadas = [];

        foreach ($archivos['tmp_name'] as $index => $tmpPath) {
            $nombreOriginal = basename($archivos['name'][$index]);
            $rutaDestino = $carpeta . $nombreOriginal;

            // Mueve la imagen con su nombre original
            if (move_uploaded_file($tmpPath, $rutaDestino)) {
                $imagenesGuardadas[] = $nombreOriginal; // Solo guardamos el nombre, no la ruta
            }
        }

        $producto = new ProductoModel();
        $exito = $producto->create($input, $imagenesGuardadas);

        return $response->toJSON([
            'status' => $exito ? 200 : 500,
            'result' => $exito ? 'Producto creado exitosamente' : 'Error al crear el producto'
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
