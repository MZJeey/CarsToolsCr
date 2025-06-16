import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL + "producto";
class ProductoService {
  // Obtener lista de habitaciones
  getProductos() {
    return axios.get(BASE_URL);
  }
}

export default new ProductoService();
