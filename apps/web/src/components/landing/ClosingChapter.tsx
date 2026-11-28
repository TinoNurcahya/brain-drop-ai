"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUp } from "lucide-react";
import { RollingText } from "@/components/ui/RollingText";
import type { ChaptersCopy } from "@/lib/landing-chapters";
import { scrollToY } from "@/lib/smooth-scroll";
import { ParticleField } from "./ParticleField";
import { textShape } from "./shapes";

gsap.registerPlugin(ScrollTrigger);

/** Closing: balanced 3-zone sticky curtain reveal with closing thesis, magnetic CTA, hairline colophon, and luminous particle wordmark. */
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
    const w = Math.min(halfW * (isMobile ? 1.82 : 1.56), 24.5);
    const text = await textShape(n, "BrainDrop", w, {
      cx: 0,
      cy: isMobile ? 0.48 : 0.78,
      scale: 1,
    });
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
      window.matchMedia("(min-width: 1025px) and (min-height: 680px)").matches;
    const mainStage = document.getElementById("landing-main-stage");

    const ctx = gsap.context(() => {
      if (useStickyCurtain && mainStage) {
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
      id="closing"
      ref={sectionRef}
      data-surface="void"
      className="lp-closing lp-void"
    >
      {/* Zone 1: Editorial Closing Thesis + Primary Magnetic CTA + Extension Action */}
      <div className="lp-closing-top">
        <p className="lp-closing-thesis">{copy.thesis}</p>

        <div className="lp-closing-actions">
          <Link href={copy.ctaHref} className="group lp-closing-cta" data-magnetic>
            <RollingText text={copy.cta} />
            <ArrowRight strokeWidth={1.75} className="lp-closing-cta-arrow" aria-hidden="true" />
          </Link>

          <a href={copy.extensionHref} download className="group lp-quiet-link">
            <RollingText text={copy.extensionCta} />
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>

      {/* Zone 2: Hairline Colophon & Quick Module Links */}
      <div className="lp-closing-foot">
        <div className="lp-closing-links-row">
          <ul className="lp-closing-links">
            {copy.links.map((lnk) => (
              <li key={lnk.label}>
                <Link href={lnk.href} className="group">
                  <RollingText text={lnk.label} />
                </Link>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="group lp-back-top"
            onClick={() => scrollToY(0)}
          >
            <RollingText text={copy.backToTop} />
            <ArrowUp size={13} aria-hidden="true" />
          </button>
        </div>

        <div className="lp-closing-meta">
          <div className="lp-closing-meta-left">
            <span>{copy.legal}</span>
            <span className="lp-closing-dot" aria-hidden="true">·</span>
            <span>{copy.author}</span>
          </div>
        </div>
      </div>

      {/* Zone 3: Luminous 11,000-Particle BrainDrop Wordmark */}
      <div className="lp-closing-mark">
        {webgl && (
          <ParticleField
            className="lp-particles"
            buildTargets={buildTargets}
            count={11000}
            mobileCount={2100}
            stageRef={stageRef}
            dark={true}
            onUnsupported={() => setWebgl(false)}
          />
        )}
      </div>
    </footer>
  );
}
