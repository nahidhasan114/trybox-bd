"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { getDictionary, type Dictionary, type Locale } from "./dictionaries";
import { LOCALE_COOKIE } from "./constants";

type LocaleContextValue = {
  locale: Locale;
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = (next: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000`;
    setLocaleState(next);
  };

  const value = useMemo(
    () => ({ locale, dict: getDictionary(locale), setLocale }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
