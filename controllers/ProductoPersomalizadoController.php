<?php
class ProductoPersonalizado
{
    public function detalle($pedido_id)
    {
        try {
            $productoPersonalizadoM = new ProductoPersonalizadoModel(); // Modelo
            $response = new Response();   // Clase para responder en JSON

            $detallePedido = $pedidoM->obtenerDetallePedido($pedido_id);

            $response->toJSON($detallePedido);
        } catch (Exception $e) {
            handleException($e); // Función para capturar errores
        }
    }
}
