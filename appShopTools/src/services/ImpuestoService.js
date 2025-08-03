import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL + "impuesto";

class ImpuestoService {
  getImpuesto() {
    return axios.get(BASE_URL);
  }
}

export default new ImpuestoService();
