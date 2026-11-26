"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLocale } from "@/components/layout/LocaleProvider";
import { ThemeToggle } from "@/components/layout/ThemeProvider";
import { RollingText } from "@/components/ui/RollingText";
import { scrollToTarget } from "@/lib/smooth-scroll";
import { V2_COPY } from "@/lib/landing-v2-copy";

const WORDMARK = "BrainDrop";

export function V2Header({
  homeHref = "/v2",
  introReady = true,
}: {
  homeHref?: string;
  introReady?: boolean;
}) {
  const { locale, toggleLocale } = useLocale();
  const c = V2_COPY[locale];
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [surface, setSurface] = useState<"ink" | "paper">("ink");
  const [introPlayed, setIntroPlayed] = useState(false);
  const lastYRef = useRef(0);

  useEffect(() => {
    if (!introReady) return;
    setIntroPlayed(true);
    const t = window.setTimeout(() => setIntroPlayed(false), 1400);
    return () => window.clearTimeout(t);
  }, [introReady]);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const dy = y - lastYRef.current;
      setScrolled(y > 32);

      if (y <= 72) {
        setHidden(false);
      } else if (dy > 8) {
        setHidden(true);
      } else if (dy < -8) {
        setHidden(false);
      }
      lastYRef.current = y;

      // Detect active chapter surface behind header (respecting sticky closing curtain).
      const probeY = 44;
      const mainStage = document.getElementById("v2-main-stage");
      let activeSurface: "ink" | "paper" = "ink";
      if (mainStage && mainStage.getBoundingClientRect().bottom <= probeY) {
        activeSurface = "ink";
      } else {
        const sections = document.querySelectorAll<HTMLElement>("#v2-main-stage [data-v2-surface]");
        sections.forEach((sec) => {
          const rect = sec.getBoundingClientRect();
          if (rect.top <= probeY && rect.bottom > probeY) {
            activeSurface = sec.dataset.v2Surface === "paper" ? "paper" : "ink";
          }
        });
      }
      setSurface((prev) => (prev === activeSurface ? prev : activeSurface));
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
  }, []);

  return (
    <header
      className={`v2-header v2-header-${surface} ${scrolled ? "is-scrolled" : ""} ${
        hidden ? "is-hidden" : ""
      } ${introPlayed ? "is-intro" : ""}`}
    >
      <Link href={homeHref} className="v2-logo" aria-label="BrainDrop">
        <span className="v2-brand-text" aria-hidden="true">
          {WORDMARK.split("").map((ch, idx) => (
            <span
              key={idx}
              className="v2-brand-char"
              style={{ ["--char-index" as string]: idx }}
            >
              {ch}
            </span>
          ))}
          <span className="v2-brand-period">.</span>
        </span>
      </Link>

      <nav className="v2-header-nav" aria-label="Section navigation">
        {c.nav.links.map((item) => (
          <button
            key={item.target}
            type="button"
            onClick={() => scrollToTarget(item.target)}
            className="v2-nav-link"
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="v2-header-actions">
        <button
          type="button"
          className="v2-lang-btn"
          onClick={toggleLocale}
          aria-label={c.nav.language}
        >
          {locale === "en" ? "EN" : "ID"}
        </button>

        <div className="v2-theme-wrap">
          <ThemeToggle />
        </div>

        <Link href="/notes" className="group v2-demo-link" data-magnetic>
          <RollingText text={c.nav.cta} />
          <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
}
