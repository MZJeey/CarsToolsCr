import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'actor';

class ActorService {
    
  getActors() {
    const user = localStorage.getItem('user')
    const token =user? user.replace(/^"|"$/g,''):''
    console.log("Token", token)
    return axios.get(BASE_URL,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    });
  }

  getActorById(ActorId) {
    return axios.get(BASE_URL + '/' + ActorId);
  }
}

export default new ActorService();
