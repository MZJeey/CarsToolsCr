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
    pr.IdPromocion, pr.Nombre, pr.Descuento, pr.FechaInicio, pr.FechaFin,
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
            $sql = "INSERT INTO promocion (tipo, objetivo_id, descuento, fecha_inicio, fecha_fin) VALUES (
                '{$data['tipo']}',
                {$data['objetivo_id']},
                {$data['descuento']},
                '{$data['fecha_inicio']}',
                '{$data['fecha_fin']}'
            )";
            return $this->enlace->executeSQL_DML_last($sql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function update($id, $data)
    {
        try {
            $sql = "UPDATE promocion SET
                tipo = '{$data['tipo']}',
                objetivo_id = {$data['objetivo_id']},
                descuento = {$data['descuento']},
                fecha_inicio = '{$data['fecha_inicio']}',
                fecha_fin = '{$data['fecha_fin']}'
                WHERE id = $id";
            return $this->enlace->executeSQL_DML($sql);
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
