import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'rental';

class RentalService {
  getRentals() {
    return axios.get(BASE_URL);
  }

  getRentalById(RentalId) {
    return axios.get(BASE_URL + '/' + RentalId);
  }
  createRental(Rental) {
    return axios.post(BASE_URL, JSON.stringify(Rental));
  }
  rentalMonthbyShop() {
    return axios.get(BASE_URL+"/rentalMonthbyShop/");
  }
  rentalbyMovie() {
    return axios.get(BASE_URL+"/rentalbyMovie/");
  }
}

export default new RentalService();
