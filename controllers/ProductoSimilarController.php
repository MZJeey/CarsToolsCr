<?php


class ProductoSimilares
{


    public function create()
    {
        try {
            $request = new Request();
            $inputJSON = $request->getJSON();


            if (!$inputJSON) {
                throw new Exception("No se recibió JSON válido");
            }


            $producto = new ProductosSimilaresModel();
            $result = $producto->agregarProductoSimilares($inputJSON);

            (new Response())->toJSON($result);
        } catch (Exception $e) {
            (new Response())->toJSON([
                'error' => true,
                'message' => $e->getMessage()
            ]);
        }
    }
}
