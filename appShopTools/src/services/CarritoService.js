import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL + "carrito";

// class CarritoService {
//   crearCarrito(data) {
//     return axios.post(BASE_URL, data);
//   }
// }

// export default new CarritoService();

class CarritoService {
  async crearCarrito(data) {
    try {
      // Solo enviar los campos que el backend espera
      const payload = {
        usuario_id: data.usuario_id,
        producto_id: data.producto_id,
        cantidad: data.cantidad,
      };

      const response = await axios.post(BASE_URL, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      console.error(
        "Error en crearCarrito:",
        error.response?.data || error.message
      );
      throw error; // Para que el frontend lo maneje con try/catch
    }
  }
}

export default new CarritoService();
