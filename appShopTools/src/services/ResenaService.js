import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL + "resena";
class ResenaService {
  // Obtener lista de resenas
  getResenas() {
    return axios.get(BASE_URL);
  }
}

export default new ResenaService();
