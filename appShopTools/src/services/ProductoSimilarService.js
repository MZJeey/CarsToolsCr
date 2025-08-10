import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL + "ProductoSimilares";

class ProductoSimilarService {
  // Crear producto similar
  createProductoSimilar(data) {
    return axios.post(BASE_URL, JSON.stringify(data));
  }
}

export default new ProductoSimilarService();
// return axios({
//     method: "post",
//     url: BASE_URL,
//     data: JSON.stringify(data), // Convierte a JSON
//     headers: {
//       "Content-Type": "application/json", // Especifica que envías JSON
//       Accept: "application/json", // Esperas recibir JSON
//     },
//   });
//
