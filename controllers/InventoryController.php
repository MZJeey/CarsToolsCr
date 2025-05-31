<?php
//class Inventory
class inventory{

    //Listar en el API
    public function index(){
        $response = new Response();
        //Obtener el listado del Modelo
        $inventory=new InventoryModel();
        $result=$inventory->all();
         //Dar respuesta
         $response->toJSON($result);
    }
    public function get($idMovie,$idShopRental){
        $response = new Response();
        $inventory=new InventoryModel();
        $result=$inventory->get($idMovie,$idShopRental);
        //Dar respuesta
        $response->toJSON($result);
        
    }
    public function getInventoryMovie($id){
        $response = new Response();
        $inventory=new InventoryModel();
        $result=$inventory->getInventoryMovie($id);
        //Dar respuesta
        $response->toJSON($result);
    }
    public function getInvetoryShop($idRentalShop){
        $response = new Response();
        $inventory=new InventoryModel();
        $result=$inventory->getInvetoryShop($idRentalShop);
        //Dar respuesta
        $response->toJSON($result);
    }
}