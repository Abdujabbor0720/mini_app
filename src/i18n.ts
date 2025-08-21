import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
const uz = require('./locales/uz.json');
const ru = require('./locales/ru.json');
const en = require('./locales/en.json');
const tr = require('./locales/tr.json');

i18n
    .use(initReactI18next)
    .init({
        resources: {
            uz: { translation: uz },
            ru: { translation: ru },
            en: { translation: en },
            tr: { translation: tr },
        },
        lng: 'uz',
        fallbackLng: 'uz',
        interpolation: { escapeValue: false },
    });

export default i18n;
