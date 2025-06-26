import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL + "resena";
class ResenaService {
  // Obtener lista de resenas
  getResenas() {
    return axios.get(BASE_URL);
  }
  getResenasPorProducto(id) {
    return axios.get(BASE_URL + "/" + id);
    // Asegúrate de que esta ruta coincida con el método `getDetalles($id)` en el controlador PHP
  }
}

export default new ResenaService();
