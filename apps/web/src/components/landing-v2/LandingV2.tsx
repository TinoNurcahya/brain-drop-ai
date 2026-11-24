"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/components/layout/LocaleProvider";
import { useTheme } from "@/components/layout/ThemeProvider";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { V2_COPY } from "@/lib/landing-v2-copy";
import { V2_CHAPTERS } from "@/lib/landing-v2-chapters";
import { V2IntroLoader } from "./V2IntroLoader";
import { V2Header } from "./V2Header";
import { ChapterHud } from "./ChapterHud";
import { StoryStage } from "./StoryStage";
import { ProductReveal } from "./ProductReveal";
import { PrivacyPipeline } from "./PrivacyPipeline";
import { ClipperChapter } from "./ClipperChapter";
import { IndexChapter } from "./IndexChapter";
import { ClosingChapter } from "./ClosingChapter";
import "@/styles/landing-v2.css";

gsap.registerPlugin(ScrollTrigger);

export function LandingV2({ homeHref = "/v2" }: { homeHref?: string }) {
  useSmoothScroll();
  const { locale } = useLocale();
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const c = V2_COPY[locale];
  const ch = V2_CHAPTERS[locale];
  const root = useRef<HTMLDivElement>(null);
  const [introReady, setIntroReady] = useState(false);

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
    <div ref={root} className="v2 -mt-20 sm:-mt-24">
      <div className="v2-grain" aria-hidden="true" />
      <V2IntroLoader caption={ch.introCaption} onRevealStart={handleRevealStart} />
      <V2Header homeHref={homeHref} introReady={introReady} />
      <ChapterHud names={ch.hud} />

      <div id="v2-main-stage" className="v2-main-stage">
        <StoryStage copy={c} introReady={introReady} />
        <ProductReveal copy={c.product} />
        <PrivacyPipeline copy={c.why} />
        <ClipperChapter copy={ch.clipper} />
        <IndexChapter copy={ch.index} />
      </div>

      <ClosingChapter copy={ch.closing} dark={dark} />
    </div>
  );
}
