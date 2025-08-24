import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL + "pedido";

class PedidoService {
  /**
   * Crea un nuevo pedido
   * @param {Object} pedidoData - Datos del pedido {usuario_id, direccion_envio, productos}
   * @returns {Promise} Promesa con la respuesta del servidor
   */
  crearPedido(pedidoData) {
    return axios.post(BASE_URL + "/crear", {
      data: pedidoData,
    });
  }

  /**
   * Obtiene pedidos por usuario
   * @param {number|string} usuarioId - ID del usuario
   * @returns {Promise} Promesa con la lista de pedidos
   */
  listarPedidosPorUsuario(usuarioId) {
    return axios.post(BASE_URL + "/listar", {
      usuario_id: usuarioId,
    });
  }

  /**
   * Obtiene detalles de un pedido específico
   * @param {number|string} pedidoId - ID del pedido
   * @returns {Promise} Promesa con los detalles del pedido
   */
  obtenerDetallesPedido(pedidoId) {
    return axios.post(BASE_URL + "/detalles", {
      pedido_id: pedidoId,
    });
  }

  /**
   * Cambia el estado de un pedido
   * @param {number|string} pedidoId - ID del pedido
   * @param {string} nuevoEstado - Nuevo estado del pedido
   * @returns {Promise} Promesa con el resultado de la operación
   */
  cambiarEstadoPedido(pedidoId, nuevoEstado) {
    return axios.post(BASE_URL + "/cambiarEstado", {
      pedido_id: pedidoId,
      nuevo_estado: nuevoEstado,
    });
  }

  /**
   * Lista todos los pedidos (sin filtro por usuario)
   * @returns {Promise} Promesa con todos los pedidos
   */
  listarTodosLosPedidos(usuario_id) {
    return axios.post(BASE_URL + "/listarTodos", {
      usuario_id,
    });
  }



/**
 * Elimina un pedido completo (pedido + personalizados + detalles)
 * @param {number|string} pedidoId - ID del pedido
 * @returns {Promise}
 */
eliminarPedido(pedidoId) {
  return axios.post(BASE_URL + "/eliminar", {
    pedido_id: pedidoId,
  });
}




}



export default new PedidoService();
