"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLocale } from "@/components/layout/LocaleProvider";
import { ThemeToggle } from "@/components/layout/ThemeProvider";
import { RollingText } from "@/components/ui/RollingText";
import { scrollToTarget } from "@/lib/smooth-scroll";
import { LANDING_COPY } from "@/lib/landing-copy";

const WORDMARK = "BrainDrop";
const SECTION_IDS = ["story", "workspace", "hybrid", "clipper", "privacy", "index"];

export function LandingHeader({
  homeHref = "/",
  introReady = true,
}: {
  homeHref?: string;
  introReady?: boolean;
}) {
  const { locale, toggleLocale } = useLocale();
  const c = LANDING_COPY[locale];
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [surface, setSurface] = useState<"ink" | "paper" | "void">("ink");
  const [activeTarget, setActiveTarget] = useState<string>("#story");
  const [menuOpen, setMenuOpen] = useState(false);
  const [introPlayed, setIntroPlayed] = useState(false);
  const lastYRef = useRef(0);

  useEffect(() => {
    if (!introReady) return;
    setIntroPlayed(true);
    const t = window.setTimeout(() => setIntroPlayed(false), 1400);
    return () => window.clearTimeout(t);
  }, [introReady]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const mq = window.matchMedia("(min-width: 1025px)");
    const onMq = () => {
      if (mq.matches) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const dy = y - lastYRef.current;
      setScrolled(y > 32);

      if (y <= 72) {
        setHidden(false);
      } else if (dy > 8 && !menuOpen) {
        setHidden(true);
      } else if (dy < -8) {
        setHidden(false);
      }
      lastYRef.current = y;

      const probeY = 44;
      const midY = window.innerHeight * 0.45;
      const mainStage = document.getElementById("landing-main-stage");
      let activeSurface: "ink" | "paper" | "void" = "ink";
      let curTarget = "#story";

      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= midY) {
          curTarget = `#${id}`;
        }
      }

      if (mainStage && mainStage.getBoundingClientRect().bottom <= probeY) {
        activeSurface = "void";
      } else {
        const sections = document.querySelectorAll<HTMLElement>("#landing-main-stage [data-surface]");
        sections.forEach((sec) => {
          const rect = sec.getBoundingClientRect();
          if (rect.top <= probeY && rect.bottom > probeY) {
            activeSurface =
              sec.dataset.surface === "void"
                ? "void"
                : sec.dataset.surface === "paper"
                  ? "paper"
                  : "ink";
          }
        });
      }

      setSurface((prev) => (prev === activeSurface ? prev : activeSurface));
      setActiveTarget((prev) => (prev === curTarget ? prev : curTarget));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [menuOpen]);

  const handleJump = (target: string) => {
    setMenuOpen(false);
    scrollToTarget(target);
  };

  return (
    <header
      className={`lp-header lp-header-${surface} ${scrolled || menuOpen ? "is-scrolled" : ""} ${
        hidden ? "is-hidden" : ""
      } ${introPlayed ? "is-intro" : ""}`}
    >
      <Link href={homeHref} className="lp-logo" aria-label="BrainDrop">
        <span className="lp-brand-text" aria-hidden="true">
          {WORDMARK.split("").map((ch, idx) => (
            <span
              key={idx}
              className="lp-brand-char"
              style={{ ["--char-index" as string]: idx }}
            >
              {ch}
            </span>
          ))}
          <span className="lp-brand-period">.</span>
        </span>
      </Link>

      <nav className="lp-header-nav" aria-label="Section navigation">
        {c.nav.links.map((item) => {
          const isActive = activeTarget === item.target;
          return (
            <button
              key={item.target}
              type="button"
              aria-current={isActive ? "location" : undefined}
              onClick={() => handleJump(item.target)}
              className={`lp-nav-link ${isActive ? "is-active" : ""}`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="lp-header-actions">
        <button
          type="button"
          className="lp-mobile-sections-btn"
          aria-expanded={menuOpen}
          aria-controls="lp-mobile-sections-sheet"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span>{menuOpen ? c.nav.closeBtn : c.nav.sectionsBtn}</span>
        </button>

        <button
          type="button"
          className="lp-lang-btn"
          onClick={toggleLocale}
          aria-label={c.nav.language}
        >
          {locale === "en" ? "EN" : "ID"}
        </button>

        <div className="lp-theme-wrap">
          <ThemeToggle />
        </div>

        <Link href="/notes" className="group lp-demo-link" data-magnetic>
          <RollingText text={c.nav.cta} />
          <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>

      {menuOpen && (
        <nav
          id="lp-mobile-sections-sheet"
          className="lp-mobile-sheet"
          aria-label="Mobile section navigation"
        >
          {c.nav.links.map((item, idx) => {
            const isActive = activeTarget === item.target;
            return (
              <button
                key={item.target}
                type="button"
                onClick={() => handleJump(item.target)}
                className={`lp-mobile-sheet-row ${isActive ? "is-active" : ""}`}
              >
                <span className="lp-mobile-sheet-num">0{idx + 1}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
}
