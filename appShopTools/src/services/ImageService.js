import axios from "axios";

// Asegúrate de que la URL termine con /
const BASE_URL = import.meta.env.VITE_BASE_URL + "image";

class ImageService {
  createImage(formData) {
    console.log("Imagen-->", formData);
    return axios.post(BASE_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  deleteImage(id) {
    return axios({
      method: "delete",
      url: `http://localhost:81/carstoolscr/image/delete/${id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      withCredentials: true, // Importante para cookies/sesiones
    });
  }
}

export default new ImageService();
