<?php

class CategoriaModel
{
    private $db;

    public function __construct()
    {
        $this->db = new MySqlConnect();
    }

    // Obtiene todas las categorías
    public function all()
    {
        $sql = "SELECT * FROM categoria";
        return $this->db->executeSQL($sql);
    }
}
