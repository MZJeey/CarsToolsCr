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
    public function getByCategoria($categoriaId)
    {
        try {
            $imagenM = new ImageModel();

            $vSQL = "SELECT 
                    p.id,
                    p.nombre,
                    (p.precio + (p.precio * i.porcentaje / 100)) AS precio,
                    c.nombre AS categoria_nombre
                 FROM Producto p
                 JOIN Categoria c ON p.categoria_id = c.id
                 JOIN Impuesto i ON p.IdImpuesto = i.IdImpuesto
                 WHERE p.categoria_id = " . intval($categoriaId);

            $vResultado = $this->db->ExecuteSQL($vSQL);

            if (!empty($vResultado) && is_array($vResultado)) {
                for ($i = 0; $i < count($vResultado); $i++) {
                    $detalle = $this->get($vResultado[$i]->id);

                    // Adjuntar detalle
                    if (!is_object($detalle)) {
                        $vResultado[$i]->detalle = $detalle;
                    } else {
                        $vResultado[$i]->detalle = $detalle;
                    }

                    // Adjuntar imagen del producto
                    $vResultado[$i]->imagen = $imagenM->getImagen($vResultado[$i]->id);
                }
            }

            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }



    public function get($id)
    {
        try {
            $vSQL = "SELECT nombre 
                 FROM Categoria 
                 WHERE id = $id";

            $vResultado = $this->db->ExecuteSQL($vSQL);

            if (!empty($vResultado) && is_array($vResultado)) {
                return $vResultado[0]->nombre; // Devuelve solo el nombre
            }

            return $vResultado; // Si no se encontró
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
