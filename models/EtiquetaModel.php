<?php
class EtiquetaModel
{
    private $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    // listar todas las etiquetas


    public function all()
    {
        try {
            //Consulta SQL
            $vSQL = "SELECT * FROM Etiqueta";
            $vResultado = $this->enlace->ExecuteSQL($vSQL);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //obetener una etiqueta por ID

    public function get($id)
    {
        try {

            $sql = "SELECT * FROM etiqueta WHERE id = :id";
            $resultado = $this->enlace->executeSQL($sql);
            return $resultado[0] ?? null;
        } catch (Exception $e) {
            handleException($e);
        }
    }
    // Crear una nueva etiqueta
    public function create($data)
    {
        try {
            $sql = "INSERT INTO Etiqueta (nombre) VALUES ('{$data['nombre']}')";
            return $this->enlace->executeSQL_DML($sql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Actualizar una etiqueta 

    public function update($id, $data)
    {
        try {
            $sql = "UPDATE etiqueta SET nombre = '{$data['nombre']}' WHERE id = $id";
            return $this->enlace->executeSQL_DML($sql);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    // Eliminar etiqueta 
    public function delete($id)
    {
        try {
            $sql = "DELETE FROM etiqueta WHERE id = $id";
            return $this->enlace->executeSQL_DML($sql);
        } catch (Exception $e) {
            handleException($e);
        }
    }


    // Obtener todas las etiquetas de un producto específico
    public function getByProducto($producto_id)
    {
        try {
            $sql = "SELECT e.*
                FROM etiqueta e
                JOIN productoetiqueta pe ON e.id = pe.etiqueta_id
                WHERE pe.producto_id = $producto_id";
            return $this->enlace->executeSQL($sql);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
