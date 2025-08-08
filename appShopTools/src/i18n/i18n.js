import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

i18n
  .use(HttpApi) // Usa el plugin para cargar archivos JSON desde el servidor
  .use(LanguageDetector) // Usa el plugin para detectar el idioma del usuario
  .use(initReactI18next) // Conecta i18n con React
  .init({
    fallbackLng: "es", // Idioma por defecto si la detección falla
    debug: true, // Habilita logs útiles para depuración
    interpolation: {
      escapeValue: false, // React ya se encarga de esto, no lo necesitamos
    },
    backend: {
      loadPath: "../src/translations/{{lng}}/{{ns}}.json", // Ruta donde se encuentran los archivos de traducción
    },
    ns: [
      "crearProducto",
      "crearPedido",
      "crearResena",
      "detallesResena",
      "etiquetas",
      "header",
      "lista",
      "listaDetalles",
      "listaProductos",
      "listaResenas",
      "pedido",
      "personalizarProducto",
      "promociones",
      
      "resena",
      "todosProductosPersonalizados",
    ], // "namespaces" o nombres de los archivos JSON
    /* defaultNS: 'common', // Namespace por defecto (si no se especifica)*/
    react: {
      useSuspense: false, // Deshabilita Suspense para una carga más simple
    },
  });

export default i18n;
