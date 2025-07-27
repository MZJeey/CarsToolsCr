import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL + "productoetiqueta";
class ProductoEtiquetaService {
  CreateEtiqueta(data) {
    return axios.post(BASE_URL, data);
  }
  getetiquetas() {
    return axios.get(BASE_URL);
  }
  getEtiquetasPorProducto(id) {
    return axios.get(BASE_URL + "/" + id);
    // Asegúrate de que esta ruta coincida con el método `getDetalles($id)` en el controlador PHP
  }
}

export default new ProductoEtiquetaService();
