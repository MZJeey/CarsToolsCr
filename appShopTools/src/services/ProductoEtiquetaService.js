import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL + "productoetiqueta";
class ProductoEtiquetaService {
  CreateEtiqueta(data) {
    return axios.post(BASE_URL, data);
  }
}

export default new ProductoEtiquetaService();
