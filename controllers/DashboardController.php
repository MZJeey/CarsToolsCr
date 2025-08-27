<?php
require_once __DIR__ . '/../models/DashboardModel.php';

class dashboard
{
    /** GET /dashboard/recientes */
    public function recientes()
    {
        try {
            $response = new Response();
            $model    = new DashboardModel();
            $data     = $model->ultimasTres();
            $response->toJSON($data);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /** GET /dashboard/ventasDiarias?from=YYYY-MM-DD&to=YYYY-MM-DD */
    public function ventasDiarias()
    {
        try {
            $response = new Response();
            $model    = new DashboardModel();

            $from = isset($_GET['from']) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $_GET['from']) ? $_GET['from'] : null;
            $to   = isset($_GET['to'])   && preg_match('/^\d{4}-\d{2}-\d{2}$/', $_GET['to'])   ? $_GET['to']   : null;

            $rows = $model->ventasDiarias($from, $to);
            $response->toJSON($rows);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /** GET /dashboard/ventasMensuales?from=YYYY-MM-DD&to=YYYY-MM-DD */
    public function ventasMensuales()
    {
        try {
            $response = new Response();
            $model    = new DashboardModel();

            $from = isset($_GET['from']) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $_GET['from']) ? $_GET['from'] : null;
            $to   = isset($_GET['to'])   && preg_match('/^\d{4}-\d{2}-\d{2}$/', $_GET['to'])   ? $_GET['to']   : null;

            $rows = $model->ventasMensuales($from, $to);
            $response->toJSON($rows);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /** GET /dashboard/pedidosPorEstado?from=YYYY-MM-DD&to=YYYY-MM-DD */
    public function pedidosPorEstado()
    {
        try {
            $response = new Response();
            $model    = new DashboardModel();

            $from = isset($_GET['from']) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $_GET['from']) ? $_GET['from'] : null;
            $to   = isset($_GET['to'])   && preg_match('/^\d{4}-\d{2}-\d{2}$/', $_GET['to'])   ? $_GET['to']   : null;

            $rows = $model->pedidosPorEstado($from, $to);
            $response->toJSON($rows);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /** GET /dashboard/topProductos?limit=3&from=YYYY-MM-DD&to=YYYY-MM-DD */
    public function topProductos()
    {
        try {
            $response = new Response();
            $model    = new DashboardModel();

            $limit = isset($_GET['limit']) ? max(1, min(10, (int)$_GET['limit'])) : 3;
            $from  = isset($_GET['from']) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $_GET['from']) ? $_GET['from'] : null;
            $to    = isset($_GET['to'])   && preg_match('/^\d{4}-\d{2}-\d{2}$/', $_GET['to'])   ? $_GET['to']   : null;

            $rows = $model->topProductosMasVendidos($limit, $from, $to);
            $response->toJSON($rows);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
