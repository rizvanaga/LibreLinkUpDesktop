import i18next from "i18next"
import { initReactI18next } from "react-i18next"
import en from "./en.json"
import si from "./si.json"
import no from "./no.json"
import de from "./de.json"
import ba from "./ba.json"

i18next.use(initReactI18next).init({
  // lng: 'en', // if you're using a language detector, do not define the lng option
  fallbackLng: "en",
  debug: true,
  resources: {
    en: {
      translation: en,
    },
    si: {
      translation: si,
    },
    no: {
      translation: no,
    },
    de: {
      translation: de,
    },
    ba: {
      translation: ba,
    },
  },
})
