"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Toaster } from "sonner";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";
type Origin = { x: number; y: number };
type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: Theme;
  toggleTheme: (originOrEvent?: React.MouseEvent<HTMLButtonElement> | Origin) => void;
};
const ThemeContext = createContext<ThemeContextValue | null>(null);

// Runs before the first paint; defaults to Light Theme (Archival Monograph) when no manual preference is stored.
export const themeInitScript = `(function(){var t;try{t=localStorage.getItem('braindrop-theme')}catch(e){}if(t!=='light'&&t!=='dark')t='light';var r=document.documentElement;r.dataset.theme=t;r.classList.toggle('dark',t==='dark');r.style.colorScheme=t;var m=document.querySelector('meta[name="theme-color"]');if(m)m.content=t==='dark'?'#112736':'#FBF9F5'})()`;

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle("dark", theme === "dark");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
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
      const next: Theme = stored === "light" || stored === "dark" ? stored : "light";
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

  const toggleTheme = useCallback((originOrEvent?: React.MouseEvent<HTMLButtonElement> | Origin) => {
    if (transitioning.current) return;
    const root = document.documentElement;
    const next: Theme = root.dataset.theme === "dark" ? "light" : "dark";
    manual.current = true;
    try { localStorage.setItem("braindrop-theme", next); } catch { /* Session-only preference still works. */ }

    let committed = false;
    const commit = () => {
      if (committed) return;
      committed = true;
      applyTheme(next);
      flushSync(() => setTheme(next));
    };

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (
      motionQuery.matches ||
      document.hidden ||
      typeof document.startViewTransition !== "function" ||
      typeof root.animate !== "function" ||
      typeof KeyframeEffect === "undefined" ||
      !("pseudoElement" in KeyframeEffect.prototype) ||
      !CSS.supports("selector(::view-transition-new(root))")
    ) {
      commit();
      return;
    }

    let x = window.innerWidth - 36;
    let y = 32;

    if (originOrEvent) {
      if ("currentTarget" in originOrEvent && originOrEvent.currentTarget instanceof HTMLElement) {
        const rect = originOrEvent.currentTarget.getBoundingClientRect();
        const isClick = typeof originOrEvent.clientX === "number" && originOrEvent.detail !== 0;
        x = isClick ? originOrEvent.clientX : rect.left + rect.width / 2;
        y = isClick ? originOrEvent.clientY : rect.top + rect.height / 2;
      } else if ("x" in originOrEvent && "y" in originOrEvent) {
        x = originOrEvent.x;
        y = originOrEvent.y;
      }
    }

    x = Math.max(0, Math.min(window.innerWidth, x));
    y = Math.max(0, Math.min(window.innerHeight, y));
    const radius = Math.ceil(Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))) + 1;

    let transition: ViewTransition | undefined;
    let animation: Animation | undefined;
    let cancelled = false;
    let cleaned = false;

    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      animation?.cancel();
      window.removeEventListener("resize", cancel);
      window.visualViewport?.removeEventListener("resize", cancel);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      motionQuery.removeEventListener("change", onMotionChange);
      root.removeAttribute("data-theme-transition");
      transitioning.current = false;
      // Post-transition updates without interrupting the 60fps frame loop
      root.style.colorScheme = next;
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next === "dark" ? "#112736" : "#FBF9F5");
    };

    const cancel = () => {
      if (cleaned) return;
      cancelled = true;
      commit();
      transition?.skipTransition();
      animation?.cancel();
      cleanup();
    };

    const onVisibilityChange = () => {
      if (document.hidden) cancel();
    };
    const onMotionChange = () => {
      if (motionQuery.matches) cancel();
    };

    transitioning.current = true;
    root.setAttribute("data-theme-transition", "iris");
    window.addEventListener("resize", cancel);
    window.visualViewport?.addEventListener("resize", cancel);
    document.addEventListener("visibilitychange", onVisibilityChange);
    motionQuery.addEventListener("change", onMotionChange);

    try {
      transition = document.startViewTransition(() => {
        if (!cancelled) commit();
      });
      void transition.finished.then(cleanup, cancel);
      void transition.ready
        .then(() => {
          if (cancelled || cleaned) return;
          animation = root.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${radius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 500,
              easing: "cubic-bezier(.4,0,.2,1)",
              pseudoElement: "::view-transition-new(root)",
            }
          );
          void animation.finished.catch(cancel);
        })
        .catch(cancel);
    } catch {
      cancel();
    }
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
    toggleTheme(event);
  }}>
    <Sun className="theme-sun" size={19} aria-hidden="true" />
    <Moon className="theme-moon" size={19} aria-hidden="true" />
  </button>;
}
