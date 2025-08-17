import axios from "axios";

// Ajusta esta URL a tu backend
const BASE_URL = import.meta.env.VITE_BASE_URL + "factura";

class FacturaService {
  // GET /factura
  list() {
    return axios.get(BASE_URL);
  }

  // GET /factura/get?id=123
  get(id) {
    return axios.get(`${BASE_URL}/get`, { params: { id } });
  }

  // GET /factura/by-pedido?pedido_id=77
  getByPedido(pedido_id) {
    return axios.get(`${BASE_URL}/by-pedido`, { params: { pedido_id } });
  }

  // POST /factura/create  Body: { pedido_id, metodo_pago }
  create({ pedido_id, metodo_pago }) {
    return axios.post(`${BASE_URL}/create`, { pedido_id, metodo_pago });
  }

  // DELETE /factura/delete?id=123
  delete(id) {
    return axios.delete(`${BASE_URL}/delete`, { params: { id } });
  }
}

export default new FacturaService();
