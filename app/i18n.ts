import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importar traducciones
import en from './locales/en.json';
import es from './locales/es.json';
import de from './locales/de.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      de: { translation: de },
    },
    lng: 'es', // Idioma predeterminado
    fallbackLng: 'es', // En caso de error, usar español
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
