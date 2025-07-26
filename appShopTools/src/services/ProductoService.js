import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL + "producto";
class ProductoService {
  // Obtener lista de habitaciones
  getProductos() {
    return axios.get(BASE_URL);
  }
  getDetalleProducto(id) {
    return axios.get(BASE_URL + "/" + id);
    // Asegúrate de que esta ruta coincida con el método `getDetalles($id)` en el controlador PHP
  }
createProducto(productoFormData) {
  return axios.post(BASE_URL + "/create", productoFormData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}


  updateProducto(id, producto) {
    return axios.put(BASE_URL + "/" + id, producto);
    // Asegúrate de que esta ruta coincida con el método `update($id)` en el controlador PHP
  }
  deleteProducto(id) {
    return axios.delete(BASE_URL + "/" + id);
    // Asegúrate de que esta ruta coincida con el método `delete($id)` en el controlador PHP
  }
}

export default new ProductoService();
