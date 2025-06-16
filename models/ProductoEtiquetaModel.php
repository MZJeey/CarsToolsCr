<?php 
class ProductoEtiquetaModel
{
       private $enlace;

    public function __construct()
    {
          $this->enlace = new MySqlConnect();
    }

   // Obtener todas las etiquetas asociadas a un producto
    public function getEtiquetasByProducto($producto_id) {
        try {
            $sql = "SELECT e.* FROM etiqueta e
                    JOIN productoetiqueta pe ON e.id = pe.etiqueta_id
                    WHERE pe.producto_id = $producto_id";
            return $this->enlace->executeSQL($sql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Asignar una o varias etiquetas a un producto
    public function asignarEtiquetas($producto_id, $etiquetas) {
        try {
            foreach ($etiquetas as $etiqueta_id) {
                $sql = "INSERT INTO productoetiqueta (producto_id, etiqueta_id)
                        VALUES ($producto_id, $etiqueta_id)";
                $this->enlace->executeSQL_DML($sql);
            }
            return true;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Eliminar una etiqueta específica de un producto
    public function eliminarEtiqueta($producto_id, $etiqueta_id) {
        try {
            $sql = "DELETE FROM productoetiqueta
                    WHERE producto_id = $producto_id AND etiqueta_id = $etiqueta_id";
            return $this->enlace->executeSQL_DML($sql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Eliminar todas las etiquetas de un producto
    public function eliminarTodas($producto_id) {
        try {
            $sql = "DELETE FROM productoetiqueta WHERE producto_id = $producto_id";
            return $this->enlace->executeSQL_DML($sql);
        } catch (Exception $e) {
            handleException($e);
        }
    }


}