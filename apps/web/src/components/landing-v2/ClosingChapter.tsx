"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUp } from "lucide-react";
import { RollingText } from "@/components/ui/RollingText";
import type { ChaptersCopy } from "@/lib/landing-v2-chapters";
import { scrollToY } from "@/lib/smooth-scroll";
import { ParticleField } from "./ParticleField";
import { textShape } from "./shapes";

gsap.registerPlugin(ScrollTrigger);

/** Closing: sticky curtain reveal on deep ink with magnetic CTA, colophon, and luminous particle wordmark. */
export function ClosingChapter({
  copy,
  dark = true,
}: {
  copy: ChaptersCopy["closing"];
  dark?: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef(0);
  const [webgl, setWebgl] = useState(true);

  const buildTargets = useCallback(async (n: number, isMobile: boolean, halfW: number) => {
    const w = Math.min(halfW * (isMobile ? 2.02 : 2.08), 42);
    const text = await textShape(n, "BrainDrop", w, { cx: 0, cy: isMobile ? -0.1 : -0.25, scale: 1 });
    return [text];
  }, []);

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      stageRef.current = 1;
      return;
    }

    const useStickyCurtain =
      window.matchMedia("(min-width: 1024px) and (min-height: 680px)").matches;
    const mainStage = document.getElementById("v2-main-stage");

    const ctx = gsap.context(() => {
      if (useStickyCurtain && mainStage) {
        // As mainStage lifts upward from bottom to top, particles gather into BrainDrop.
        ScrollTrigger.create({
          trigger: mainStage,
          start: "bottom bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            stageRef.current = Math.min(1.08, self.progress * 1.12);
          },
        });
      } else {
        ScrollTrigger.create({
          trigger: el,
          start: "top 82%",
          end: "top 8%",
          scrub: true,
          onUpdate: (self) => {
            stageRef.current = Math.min(1.08, self.progress * 1.1);
          },
        });
      }
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <footer
      id="v2-closing"
      ref={sectionRef}
      data-v2-surface="ink"
      className="v2-closing v2-ink"
    >
      <div className="v2-closing-top">
        <Link href={copy.ctaHref} className="group v2-closing-cta" data-magnetic>
          <RollingText text={copy.cta} />
        </Link>
      </div>

      <div className="v2-closing-foot">
        <ul className="v2-closing-links">
          {copy.links.map((lnk) => (
            <li key={lnk.label}>
              {lnk.download ? (
                <a href={lnk.href} download className="group">
                  <RollingText text={lnk.label} />
                </a>
              ) : (
                <Link href={lnk.href} className="group">
                  <RollingText text={lnk.label} />
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="v2-closing-meta">
          <div className="v2-closing-meta-left">
            <span>{copy.legal}</span>
            <span className="v2-closing-dot" aria-hidden="true">·</span>
            <span>{copy.author}</span>
          </div>
          <button
            type="button"
            className="group v2-back-top"
            onClick={() => scrollToY(0)}
          >
            <RollingText text={copy.backToTop} />
            <ArrowUp size={13} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="v2-closing-mark">
        {webgl && (
          <ParticleField
            className="v2-particles"
            buildTargets={buildTargets}
            count={11000}
            mobileCount={2100}
            stageRef={stageRef}
            dark={dark}
            onUnsupported={() => setWebgl(false)}
          />
        )}
      </div>
    </footer>
  );
}
