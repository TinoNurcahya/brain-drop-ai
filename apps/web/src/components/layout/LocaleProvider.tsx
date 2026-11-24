"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { LANDING_COPY, type LandingCopy, type Locale } from "@/lib/landing-i18n";

const STORAGE_KEY = "braindrop-locale";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  toggleLocale: () => void;
  copy: LandingCopy;
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
        copy: LANDING_COPY[locale],
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
      copy: LANDING_COPY.en,
    };
  }
  return ctx;
}

export function LocaleToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className="aw-locale-switch"
      role="group"
      aria-label="Language selector"
    >
      {(["en", "id"] as const).map((code, idx) => {
        const active = locale === code;
        return (
          <span key={code} className="inline-flex items-center">
            {idx > 0 && (
              <span className="aw-locale-sep" aria-hidden="true">
                /
              </span>
            )}
            <button
              type="button"
              onClick={() => setLocale(code)}
              aria-pressed={active}
              className={`aw-locale-btn ${active ? "is-active" : ""}`}
            >
              {code.toUpperCase()}
            </button>
          </span>
        );
      })}
    </div>
  );
}
