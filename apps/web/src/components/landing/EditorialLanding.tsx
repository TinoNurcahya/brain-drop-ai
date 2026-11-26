"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/components/layout/LocaleProvider";
import { useTheme } from "@/components/layout/ThemeProvider";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { LANDING_COPY } from "@/lib/landing-copy";
import { LANDING_CHAPTERS } from "@/lib/landing-chapters";
import { IntroLoader, hasIntroPlayedInMemory } from "./IntroLoader";
import { LandingHeader } from "./LandingHeader";
import { ChapterHud } from "./ChapterHud";
import { StoryStage } from "./StoryStage";
import { ProductReveal } from "./ProductReveal";
import { HybridLedgerChapter } from "./HybridLedgerChapter";
import { ClipperChapter } from "./ClipperChapter";
import { PrivacyPipeline } from "./PrivacyPipeline";
import { IndexChapter } from "./IndexChapter";
import { ClosingChapter } from "./ClosingChapter";
import "@/styles/landing.css";

gsap.registerPlugin(ScrollTrigger);

export function EditorialLanding({ homeHref = "/" }: { homeHref?: string }) {
  useSmoothScroll();
  const { locale } = useLocale();
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const c = LANDING_COPY[locale];
  const ch = LANDING_CHAPTERS[locale];
  const root = useRef<HTMLDivElement>(null);
  const [introReady, setIntroReady] = useState(() => hasIntroPlayedInMemory());

  const handleRevealStart = useCallback(() => {
    setIntroReady(true);
  }, []);

  // Magnetic links + final ScrollTrigger refresh once every chapter registered.
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: (() => void)[] = [];

    if (fine && !reduce) {
      el.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((btn) => {
        const xTo = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3.out" });
        const yTo = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = btn.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * 0.28);
          yTo((e.clientY - (r.top + r.height / 2)) * 0.28);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        btn.addEventListener("pointermove", move);
        btn.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          btn.removeEventListener("pointermove", move);
          btn.removeEventListener("pointerleave", leave);
          gsap.set(btn, { x: 0, y: 0 });
        });
      });
    }

    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    return () => cleanups.forEach((fn) => fn());
  }, [locale]);

  return (
    <div ref={root} className="lp -mt-20 sm:-mt-24">
      <div className="lp-grain" aria-hidden="true" />
      <IntroLoader caption={ch.introCaption} onRevealStart={handleRevealStart} />
      <LandingHeader homeHref={homeHref} introReady={introReady} />
      <ChapterHud names={ch.hud} />

      <div id="landing-main-stage" className="landing-main-stage">
        <StoryStage copy={c} introReady={introReady} dark={dark} />
        <ProductReveal copy={c.product} dark={dark} />
        <HybridLedgerChapter copy={ch.hybrid} />
        <ClipperChapter copy={ch.clipper} />
        <PrivacyPipeline copy={c.why} />
        <IndexChapter copy={ch.index} dark={dark} />
      </div>

      <ClosingChapter copy={ch.closing} dark={dark} />
    </div>
  );
}
