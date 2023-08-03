import i18next from 'i18next';
import languageDetector from 'i18next-browser-languagedetector';
import {initReactI18next} from 'react-i18next';

// eslint-disable-next-line import/no-named-as-default-member
i18next
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    debug: process.env.REACT_APP_LOGGING === 'DEBUG',
    defaultNS: 'web',
    fallbackLng: ['ru'],
    interpolation: {
      escapeValue: false,
    },
    load: 'currentOnly',
    ns: ['web', 'common'],
    saveMissing: true,
    supportedLngs: ['en', 'ru'],
  });
