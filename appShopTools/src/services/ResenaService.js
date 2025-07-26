import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL + "resena";
class ResenaService {
  // Obtener lista de resenas
  getResenas() {
    return axios.get(BASE_URL);
  }
  getResenasPorProducto(id) {
    return axios.get(BASE_URL + "/" + id);
  
  }
// para crear la reseña 
    create(resena) {
    return axios.post(BASE_URL, resena);
  }
}

export default new ResenaService();
