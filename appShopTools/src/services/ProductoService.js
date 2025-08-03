import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL + "producto";

class ProductoService {
  // Obtener lista de habitaciones
  getProductos() {
    return axios.get(BASE_URL);
  }
  getProductobyId(id) {
    return axios.get(BASE_URL + "/" + id);
    // Asegúrate de que esta ruta coincida con el método `getById($id)` en el controlador PHP
  }
  createProducto(productoFormData) {
    return axios.post(BASE_URL, JSON.stringify(productoFormData));
  }

  // services/ProductoService.js
  updateProducto(Producto) {
    console.log("Producto", Producto);
    console.log("Base", BASE_URL);
    return axios({
      method: "put",
      url: BASE_URL + "/update",
      data: JSON.stringify(Producto),
    });
  }

  deleteProducto(id) {
    return axios.delete(BASE_URL + "/" + id);
    // Asegúrate de que esta ruta coincida con el método `delete($id)` en el controlador PHP
  }
}

export default new ProductoService();
