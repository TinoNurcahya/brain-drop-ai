"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Toaster } from "sonner";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";
type Origin = { x: number; y: number };
type ThemeContextValue = { theme: Theme; resolvedTheme: Theme; toggleTheme: (origin?: Origin) => void };
const ThemeContext = createContext<ThemeContextValue | null>(null);

// Runs before the first paint; storage access may be disabled by the browser.
export const themeInitScript = `(function(){var t;try{t=localStorage.getItem('braindrop-theme')}catch(e){}if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';var r=document.documentElement;r.dataset.theme=t;r.classList.toggle('dark',t==='dark');r.style.colorScheme=t;var m=document.querySelector('meta[name="theme-color"]');if(m)m.content=t==='dark'?'#0b1116':'#f6f8f9'})()`;

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0b1116" : "#f6f8f9");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const manual = useRef(false);
  const transitioning = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const storedTheme = () => {
      try { return localStorage.getItem("braindrop-theme"); } catch { return null; }
    };
    const sync = () => {
      const stored = storedTheme();
      manual.current = stored === "light" || stored === "dark";
      const next = stored === "light" || stored === "dark" ? stored : media.matches ? "dark" : "light";
      applyTheme(next);
      setTheme(next);
    };
    sync();
    const onSystem = () => {
      if (!manual.current) { const next = media.matches ? "dark" : "light"; applyTheme(next); setTheme(next); }
    };
    const onStorage = (event: StorageEvent) => { if (event.key === "braindrop-theme" || event.key === null) sync(); };
    media.addEventListener("change", onSystem);
    window.addEventListener("storage", onStorage);
    return () => { media.removeEventListener("change", onSystem); window.removeEventListener("storage", onStorage); };
  }, []);

  const toggleTheme = useCallback((origin?: Origin) => {
    if (transitioning.current) return;
    const next: Theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    manual.current = true;
    try { localStorage.setItem("braindrop-theme", next); } catch { /* Session-only preference still works. */ }
    const update = () => { applyTheme(next); flushSync(() => setTheme(next)); };
    if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { update(); return; }
    const x = origin?.x ?? innerWidth / 2;
    const y = origin?.y ?? 32;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    transitioning.current = true;
    try {
      const transition = document.startViewTransition(update);
      void transition.ready.then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 450, easing: "cubic-bezier(.22,1,.36,1)", pseudoElement: "::view-transition-new(root)" },
        );
      }).catch(() => { /* Theme already applied when animation is unavailable. */ });
      void transition.finished.catch(() => {}).finally(() => { transitioning.current = false; });
    } catch { transitioning.current = false; update(); }
  }, []);

  return <ThemeContext.Provider value={{ theme, resolvedTheme: theme, toggleTheme }}>
    {children}
    <Toaster richColors position="top-right" theme={theme} offset={{ top: 96, right: 24 }} mobileOffset={{ top: 88, right: 16, left: 16 }} />
  </ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const label = `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`;
  return <button type="button" className="theme-toggle" aria-label={label} title={label} onClick={(event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    toggleTheme({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  }}>
    <Sun className="theme-sun" size={19} aria-hidden="true" />
    <Moon className="theme-moon" size={19} aria-hidden="true" />
  </button>;
}
