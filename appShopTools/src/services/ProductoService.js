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
  // updateProducto(id, productoData) {
  //   return axios({
  //     method: "post", // ← usar POST en lugar de PUT si no manejás PUT en el backend
  //     url: `http://localhost:81/carstoolscr/controllers/productoController.php?action=update&id=${id}`,
  //     data: productoData,
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  // }
updateProducto(id, productoData) {
  return axios.post(`${BASE_URL}/update/${id}`, productoData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

  deleteProducto(id) {
    return axios.delete(BASE_URL + "/" + id);
    // Asegúrate de que esta ruta coincida con el método `delete($id)` en el controlador PHP
  }
}

export default new ProductoService();
