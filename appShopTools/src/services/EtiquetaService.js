import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL + "etiqueta";
class EtiquetaService {
  // Obtener lista de resenas
  getetiquetas() {
    return axios.get(BASE_URL);
  }
  getEtiquetasPorProducto(id) {
    return axios.get(BASE_URL + "/" + id);
    // Asegúrate de que esta ruta coincida con el método `getDetalles($id)` en el controlador PHP
  }
  CreateEtiqueta(data) {
    return axios.post(BASE_URL, data);
  }
}

export default new EtiquetaService();
