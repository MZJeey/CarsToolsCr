<?php


class ProductoSimilarController
{


    public function index()
    {
        try {
            $request = new Request();
            $inputJSON = $request->getJSON();

            if (!$inputJSON) {
                throw new Exception("No se recibió JSON válido");
            }

            $productoId = $inputJSON['producto_id'] ?? null;
            $similarId = $inputJSON['producto_similar_id'] ?? null;
            $tipo = $inputJSON['tipo_relacion'] ?? 'similar';

            if (!$productoId || !$similarId) {
                throw new Exception("Faltan datos requeridos");
            }

            $producto = new ProductosSimilaresModel();
            $result = $producto->agregarProductoSimilares($productoId, $similarId, $tipo);

            (new Response())->toJSON($result);
        } catch (Exception $e) {
            (new Response())->toJSON([
                'error' => true,
                'message' => $e->getMessage()
            ]);
        }
    }
}
