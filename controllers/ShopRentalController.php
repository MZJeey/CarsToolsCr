<?php
//class Genre
class shop{
    //Listar en el API
    public function index(){
        $response = new Response();
        //Obtener el listado del Modelo
        $shopRental=new ShopRentalModel();
        $result=$shopRental->all();
         //Dar respuesta
         $response->toJSON($result);
    }
    public function get($param){
        $response = new Response();
        $shopRental=new ShopRentalModel();
        $result=$shopRental->get($param);
        //Dar respuesta
        $response->toJSON($result);
    }
   
}