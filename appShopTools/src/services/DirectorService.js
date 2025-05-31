import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'director';

class DirectorService {
  getDirectores() {
    return axios.get(BASE_URL);
  }

  getDirectorById(DirectorId) {
    return axios.get(BASE_URL + '/' + DirectorId);
  }
  getMoviesbyDirector(DirectorId) {
    return axios.get(BASE_URL + '/getMoviesbyDirector/' + DirectorId);
  }
}

export default new DirectorService();
