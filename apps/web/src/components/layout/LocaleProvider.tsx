"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Locale } from "@/lib/landing-i18n";

const STORAGE_KEY = "braindrop-locale";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  toggleLocale: () => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "id" || saved === "en") {
        setLocaleState(saved);
        document.documentElement.lang = saved;
      }
    } catch {
      /* Storage access may be restricted by browser settings. */
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && (event.newValue === "en" || event.newValue === "id")) {
        setLocaleState(event.newValue);
        document.documentElement.lang = event.newValue;
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    document.documentElement.lang = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* Session-only preference still works. */
    }
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "en" ? "id" : "en");
  }, [locale, setLocale]);

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
        toggleLocale,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return {
      locale: "en" as Locale,
      setLocale: () => {},
      toggleLocale: () => {},
    };
  }
  return ctx;
}
