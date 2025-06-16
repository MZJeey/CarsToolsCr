import axios from "axios";

const BASE_URL = "http://localhost:81/carstoolscr/producto";

class ProductoService {
  // Obtener lista de habitaciones
  getProductos() {
    return axios.get(BASE_URL);
  }

  // Obtener detalles de una habitación por ID
}

export default new ProductoService();
