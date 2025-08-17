import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL + "carrito";

class CarritoService {
  crearCarrito(data) {
    return axios.post(BASE_URL, data);
  }
}

export default new CarritoService();
