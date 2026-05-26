import { I18n } from "i18n-js";
import en from "../locales/en.json";
import pt from "../locales/pt.json";

const translations = {
  en: en,
  pt: pt,
};

export const i18n = new I18n(translations);

// Default to Portuguese (Brazil) as it seems to be the primary target
i18n.defaultLocale = "pt";
i18n.locale = "pt";
i18n.enableFallback = true;
