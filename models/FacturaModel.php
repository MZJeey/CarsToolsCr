<?php
class FacturaModel
{
    private $db;

    public function __construct()
    {
        $this->db = new MySqlConnect();
    }

    public function all()
    {
        $sql = "SELECT f.* FROM factura f ORDER BY f.id DESC";
        return $this->db->executeSQL($sql);
    }

    public function get($id)
    {
        $id = (int)$id;
        $sql = "SELECT f.* FROM factura f WHERE f.id = {$id}";
        $rows = $this->db->executeSQL($sql);
        return $rows ? $rows[0] : null;
    }

    public function getByPedido($pedido_id)
    {
        $pedido_id = (int)$pedido_id;
        $sql = "SELECT f.* FROM factura f WHERE f.pedido_id = {$pedido_id} LIMIT 1";
        $rows = $this->db->executeSQL($sql);
        return $rows ? $rows[0] : null;
    }

    /**
     * Crea una factura:
     *  - Si $pedido_id != null: calcula total desde pedido/pedido_detalle.
     *  - Si $pedido_id == null: usa $items del carrito para calcular total.
     */
    public function create($pedido_id, $metodo_pago, $items = null)
    {
        $metodo_pago = substr(trim($metodo_pago), 0, 50);

        // -------- A) Con pedido_id --------
        if ($pedido_id) {
            $pedido_id = (int)$pedido_id;

            $sqlTotal = "
                SELECT 
                  COALESCE(p.total,
                           SUM(COALESCE(pd.subtotal, pd.cantidad * pd.precio_unitario))
                  ) AS total
                FROM pedido p
                LEFT JOIN pedido_detalle pd ON pd.pedido_id = p.id
                WHERE p.id = {$pedido_id}
                GROUP BY p.id
            ";
            $rows = $this->db->executeSQL($sqlTotal);
            if (!$rows) {
                throw new Exception("No existe el pedido #{$pedido_id}");
            }
            $total = (float)$rows[0]['total'];

            $xml = $this->generarXMLFactura($pedido_id, $total, $metodo_pago);
            $pval = $pedido_id; // se inserta el id del pedido
        }
        // -------- B) Sin pedido_id → carrito --------
        else {
            if (!is_array($items) || count($items) === 0) {
                throw new Exception("Debe enviar items del carrito cuando no hay pedido_id.");
            }

            // normaliza y calcula total
            $lineasXML = '';
            $total = 0.0;
            $i = 1;
            foreach ($items as $it) {
                $pid   = (int)($it['producto_id'] ?? $it['id'] ?? 0);
                $name  = addslashes($it['nombre'] ?? $it['nombre_producto'] ?? "Producto {$pid}");
                $cant  = (float)($it['cantidad'] ?? $it['qty'] ?? 0);
                $pu    = (float)($it['precio_unitario'] ?? $it['precio'] ?? 0);
                $sub   = $cant * $pu;
                $total += $sub;

                $cantFmt = number_format($cant, 2, '.', '');
                $puFmt   = number_format($pu,   2, '.', '');
                $subFmt  = number_format($sub,  2, '.', '');

                $lineasXML .= "
    <LineaDetalle>
      <Numero>{$i}</Numero>
      <ProductoId>{$pid}</ProductoId>
      <Descripcion>{$name}</Descripcion>
      <Cantidad>{$cantFmt}</Cantidad>
      <PrecioUnitario>{$puFmt}</PrecioUnitario>
      <Subtotal>{$subFmt}</Subtotal>
    </LineaDetalle>";
                $i++;
            }

            $totalFmt = number_format((float)$total, 2, '.', '');
            $fechaISO = date('c');

            $xml = <<<XML
<?xml version="1.0" encoding="UTF-8"?>
<Factura>
  <Encabezado>
    <PedidoId/>
    <Fecha>{$fechaISO}</Fecha>
    <MetodoPago>{$metodo_pago}</MetodoPago>
    <Moneda>CRC</Moneda>
    <Total>{$totalFmt}</Total>
  </Encabezado>
  <Detalle>{$lineasXML}
  </Detalle>
</Factura>
XML;
            $pval = "NULL"; // ← se inserta NULL en pedido_id
        }

        // Inserta
        $xmlEsc   = addslashes($xml);
        $metEsc   = addslashes($metodo_pago);
        $totalFmt = number_format((float)$total, 2, '.', '');

        $sqlIns = "
            INSERT INTO factura (pedido_id, fecha, total, xml_factura, metodo_pago)
            VALUES ({$pval}, NOW(), {$totalFmt}, '{$xmlEsc}', '{$metEsc}')
        ";
        $this->db->executeSQL($sqlIns);

        $rowId = $this->db->executeSQL("SELECT LAST_INSERT_ID() AS id");
        $id    = (int)$rowId[0]['id'];

        // Si hubo pedido, puedes marcarlo como pagado
        if ($pedido_id) {
            @ $this->db->executeSQL("UPDATE pedido SET estado = 'pagado' WHERE id = {$pedido_id}");
        }

        return $this->get($id);
    }

    public function delete($id)
    {
        $id = (int)$id;
        $sql = "DELETE FROM factura WHERE id = {$id}";
        $this->db->executeSQL($sql);
        return true;
    }

    private function generarXMLFactura($pedido_id, $total, $metodo_pago)
    {
        $totalFmt = number_format((float)$total, 2, '.', '');
        $fechaISO = date('c');

        return <<<XML
<?xml version="1.0" encoding="UTF-8"?>
<Factura>
  <Encabezado>
    <PedidoId>{$pedido_id}</PedidoId>
    <Fecha>{$fechaISO}</Fecha>
    <MetodoPago>{$metodo_pago}</MetodoPago>
    <Moneda>CRC</Moneda>
    <Total>{$totalFmt}</Total>
  </Encabezado>
</Factura>
XML;
    }
}
