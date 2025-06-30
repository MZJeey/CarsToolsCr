import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  es: {
    translation: {
      bienvenido: "Bienvenido",
      login: "Iniciar sesión",
      logout: "Cerrar sesión",
      search: "Buscar",
      // Agrega aquí más claves y traducciones en español
    },
  },
  en: {
    translation: {
      bienvenido: "Welcome",
      login: "Login",
      logout: "Logout",
      search: "Search",
      // Add more keys and English translations here
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "es", // idioma por defecto
  fallbackLng: "es",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
