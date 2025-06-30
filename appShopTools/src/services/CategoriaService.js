import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL + "categorias";

class CategoriaService {
  // Obtener lista de promociones
  getCategorias() {
    return axios.get(BASE_URL);
  }

  // Crear promoción
  createPromocion(data) {
    return axios.post(BASE_URL, data);
  }

  // Actualizar promoción
  updatePromocion(id, data) {
    return axios.put(`${BASE_URL}/${id}`, data);
  }

  // Eliminar promoción
  deletePromocion(id) {
    return axios.delete(`${BASE_URL}/${id}`);
  }
}

export default new CategoriaService();
