<?php
class ProductosSimilaresModel
{
    // Esto es un model de ejemplo para manejar caritos de compras
    private $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }


    public function agregarProductoSimilares($data)
    {
        $query = "INSERT INTO Productossimilares (producto_id, producto_similar_id, tipo_relacion) 
              VALUES ($data->producto_id, $data->producto_similar_id, '$data->tipo_relacion')
              ON DUPLICATE KEY UPDATE tipo_relacion = VALUES(tipo_relacion)";

        $stmt = $this->enlace->executeSQL_DML($query);

        return $stmt;
    }




}
