import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Locale, ui, UiKey } from "../i18n";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: UiKey) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("zh-TW");

  useEffect(() => {
    const savedLocale = localStorage.getItem("app-locale") as Locale;
    if (savedLocale && (savedLocale === "zh-TW" || savedLocale === "en")) {
      setLocaleState(savedLocale);
    } else {
      const browserLang = navigator.language.startsWith("en") ? "en" : "zh-TW";
      setLocaleState(browserLang);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("app-locale", newLocale);
    document.documentElement.lang = newLocale;
  };

  const t = (key: UiKey): string => {
    return ui[locale][key] || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
