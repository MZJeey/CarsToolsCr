import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'shop';

class ShopRentalService {
  getShopRentals() {
    return axios.get(BASE_URL);
  }

  getShopRentalById(ShopRentalId) {
    return axios.get(BASE_URL + '/' + ShopRentalId);
  }
}

export default new ShopRentalService();
