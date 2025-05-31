import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'inventory';

class InventoryService {
  getInventory() {
    return axios.get(BASE_URL);
  }
  getInventoryById(MovieId, ShopRentalId) {
    return axios.get(BASE_URL + '/' + MovieId + '/' + ShopRentalId);
  }
  getInventoryMovie(MovieId) {
    return axios.get(BASE_URL + '/getInventoryMovie/' + MovieId);
  }
  getInvetoryShop(ShopRentalId) {
    return axios.get(BASE_URL + '/getInvetoryShop/' + ShopRentalId);
  }
}

export default new InventoryService();
