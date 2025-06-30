import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Traducciones
const resources = {
  en: {
    translation: {
      welcome: "Welcome",
      description: "This is an internationalized app.",
    },
  },
  es: {
    translation: {
      welcome: "Bienvenido",
      description: "Esta es una aplicación internacionalizada.",
    },
  },
};

i18n
  .use(LanguageDetector) // detecta el idioma del navegador
  .use(initReactI18next) // conecta con react
  .init({
    resources,
    fallbackLng: "es", // idioma por defecto
    interpolation: {
      escapeValue: false, // React ya se encarga de la seguridad
    },
  });

export default i18n;
