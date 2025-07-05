import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL + "producto_personalizado";

/**
 * Servicio para manejar productos personalizados
 */
class ProductoPersonalizadoService {
  /**
   * Crea uno o varios productos personalizados en un pedido
   * @param {number} pedidoId - ID del pedido
   * @param {Array} productosPersonalizados - Lista de productos personalizados
   * @returns {Promise} Promesa con el estado de la operación
   */
  crearProductosPersonalizados(pedidoId, productosPersonalizados) {
    return axios.post(`${BASE_URL}/create`, {
      data: {
        pedido_id: pedidoId,
        productos_personalizados: productosPersonalizados
      }
    });
  }

  /**
   * Obtiene los productos personalizados asociados a un pedido
   * @param {number} pedidoId - ID del pedido
   * @returns {Promise} Promesa con la lista de productos personalizados
   */
  obtenerPorPedido(pedidoId) {
    return axios.post(`${BASE_URL}/getByPedido`, {
      pedido_id: pedidoId
    });
  }

/**
 * Obtiene todos los productos personalizados sin filtrar por pedido
 * @returns {Promise}
 */
obtenerTodos() {
  return axios.post(`${BASE_URL}/getAll`);
}



}

export default new ProductoPersonalizadoService();
