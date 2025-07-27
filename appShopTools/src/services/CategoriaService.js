import axios from "axios";
const BASE_URL = "http://localhost:81/carstoolscr/categorias";

class CategoriaService {
  // Obtener lista de categorías
  getCategorias() {
    return axios.get(BASE_URL);
  }
}

export default new CategoriaService();
