import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL + "promocion";

class PromocionService {
  // Obtener lista de promociones
  getPromociones() {
    return axios.get(BASE_URL);
  }

  // Crear promoción
  createPromocion(data) {
    return axios.post(BASE_URL, data);
  }

  // Actualizar promoción
updatePromocion(id, data) {
  return axios.put(`${BASE_URL}/update/${id}`, data);
}


  // Eliminar promoción
  deletePromocion(id) {
    return axios.delete(`${BASE_URL}/${id}`);
  }
}

export default new PromocionService();
