import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL + "impuesto";

class ImpuestoService {
  getImpuesto() {
    return axios.get(BASE_URL);
  }

  getImpuestoById(id) {
    return axios.get(`${BASE_URL}/${id}`);
  }
}

export default new ImpuestoService();
