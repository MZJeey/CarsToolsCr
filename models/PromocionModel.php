<?php
class PromocionModel
{
    private $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all()
    {
        try {
            $sql = "SELECT 
    pr.IdPromocion, pr.Nombre, pr.Descripcion, pr.Descuento, pr.FechaInicio, pr.FechaFin,
    pre.IdProducto,
    pc.IdCategoria
FROM Promociones pr
LEFT JOIN PromocionRepuestos pre ON pr.IdPromocion = pre.IdPromocion
LEFT JOIN PromocionCategoria pc ON pr.IdPromocion = pc.IdPromocion;
";
            return $this->enlace->executeSQL($sql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $sql = "SELECT 
    p.IdPromocion, 
    pr.Nombre, 
    
    pr.Descuento, 
    pr.FechaInicio, 
    pr.FechaFin, 
    'producto' AS Tipo
FROM 
    PromocionRepuestos p
JOIN 
    Promociones pr ON p.IdPromocion = pr.IdPromocion
WHERE 
    p.IdProducto = $id

UNION

SELECT 
    pc.IdPromocion, 
    pr.Nombre, 
    pr.Descuento, 
    pr.FechaInicio, 
    pr.FechaFin, 
    'categoria' AS Tipo
FROM 
    PromocionCategoria pc
JOIN 
    Promociones pr ON pc.IdPromocion = pr.IdPromocion
JOIN 
    Producto prod ON prod.categoria_id = pc.  IdCategoria
WHERE 
    prod.Id = $id
ORDER BY 
    Tipo DESC, Descuento DESC;
     ";
            $result = $this->enlace->executeSQL($sql);
            return !empty($result) ? $result[0] : null;
        } catch (Exception $e) {
            handleException($e);
        }
    }

public function create($data)
{
    try {
        // Paso 1: Insertar en promociones
        $nombre = addslashes($data['Nombre']);
        $descripcion = isset($data['Descripcion']) ? addslashes($data['Descripcion']) : '';
        $descuento = (float)$data['Descuento'];
        $fechaInicio = $data['FechaInicio'];
        $fechaFin = $data['FechaFin'];

        $sqlPromo = "INSERT INTO promociones (Nombre, Descripcion, Descuento, FechaInicio, FechaFin)
                     VALUES ('$nombre', '$descripcion', $descuento, '$fechaInicio', '$fechaFin')";
        $idPromocion = $this->enlace->executeSQL_DML_last($sqlPromo);

        // Paso 2: Insertar en tabla de relación según el tipo
        if (isset($data['Tipo'])) {
            if ($data['Tipo'] === 'producto' && !empty($data['IdProducto'])) {
                $idProducto = (int)$data['IdProducto'];
                $sqlRelacion = "INSERT INTO promocionrepuestos (IdPromocion, IdProducto)
                                VALUES ($idPromocion, $idProducto)";
                $this->enlace->executeSQL_DML($sqlRelacion);
            } elseif ($data['Tipo'] === 'categoria' && !empty($data['IdCategoria'])) {
                $idCategoria = (int)$data['IdCategoria'];
                $sqlRelacion = "INSERT INTO promocioncategoria (IdPromocion, IdCategoria)
                                VALUES ($idPromocion, $idCategoria)";
                $this->enlace->executeSQL_DML($sqlRelacion);
            }
        }

        return $idPromocion;
    } catch (Exception $e) {
        handleException($e);
    }
}


public function update($id, $data)
{
    try {
        $nombre = addslashes($data['Nombre']);
        $descripcion = isset($data['Descripcion']) ? addslashes($data['Descripcion']) : '';
        $descuento = (float)$data['Descuento'];
        $fechaInicio = $data['FechaInicio'];
        $fechaFin = $data['FechaFin'];

        $sql = "UPDATE promociones SET
                    Nombre = '$nombre',
                    Descripcion = '$descripcion',
                    Descuento = $descuento,
                    FechaInicio = '$fechaInicio',
                    FechaFin = '$fechaFin'
                WHERE IdPromocion = $id";

        $this->enlace->executeSQL_DML($sql);

        //  Actualiza la tabla de relación (producto o categoría)
        $this->enlace->executeSQL_DML("DELETE FROM promocionrepuestos WHERE IdPromocion = $id");
        $this->enlace->executeSQL_DML("DELETE FROM promocioncategoria WHERE IdPromocion = $id");

        if (isset($data['Tipo'])) {
            if ($data['Tipo'] === 'producto' && !empty($data['IdProducto'])) {
                $idProducto = (int)$data['IdProducto'];
                $sqlRelacion = "INSERT INTO promocionrepuestos (IdPromocion, IdProducto)
                                VALUES ($id, $idProducto)";
                $this->enlace->executeSQL_DML($sqlRelacion);
            } elseif ($data['Tipo'] === 'categoria' && !empty($data['IdCategoria'])) {
                $idCategoria = (int)$data['IdCategoria'];
                $sqlRelacion = "INSERT INTO promocioncategoria (IdPromocion, IdCategoria)
                                VALUES ($id, $idCategoria)";
                $this->enlace->executeSQL_DML($sqlRelacion);
            }
        }

        return true;
    } catch (Exception $e) {
        handleException($e);
    }
}


    public function delete($id)
    {
        try {
            $sql = "DELETE FROM promocion WHERE id = $id";
            return $this->enlace->executeSQL_DML($sql);
        } catch (Exception $e) {
            handleException($e);
        }
    }


    public function getActivas()
    {
        try {
            $sql = "SELECT * FROM promocion 
                WHERE NOW() BETWEEN fecha_inicio AND fecha_fin";
            return $this->enlace->executeSQL($sql);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
