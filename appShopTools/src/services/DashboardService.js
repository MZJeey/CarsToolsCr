
import axios from "axios";


const BASE_URL =
  (import.meta.env.VITE_BASE_URL || "").replace(/\/+$/, "") + "/dashboard";

class DashboardService {
 
  resenasRecientes() {
    return axios.get(`${BASE_URL}/recientes`);
  }

 
  ventasDiarias({ from, to } = {}) {
    return axios.get(`${BASE_URL}/ventasDiarias`, { params: { from, to } });
  }

  
  ventasMensuales({ from, to } = {}) {
    return axios.get(`${BASE_URL}/ventasMensuales`, { params: { from, to } });
  }


  pedidosPorEstado({ from, to } = {}) {
    return axios.get(`${BASE_URL}/pedidosPorEstado`, { params: { from, to } });
  }


  topProductos(limit = 3, params = {}) {
    const qp = { ...params };
    if (Number(limit) !== 3) qp.limit = Number(limit);
    return axios.get(`${BASE_URL}/topProductos`, { params: qp });
  }
}

export default new DashboardService();
