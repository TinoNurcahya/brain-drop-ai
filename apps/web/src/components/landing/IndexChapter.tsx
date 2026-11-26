"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import type { ChaptersCopy } from "@/lib/landing-chapters";
import { MorphField } from "./MorphField";
import { cardsShape, dropShape, dustShape, graphShape, gridShape, linesShape } from "./shapes";

gsap.registerPlugin(ScrollTrigger);

const IDLE = 5;

/** Five giant editorial titles on the left; MorphField + 16:9 clip-path Hover Image Preview on the right. */
export function IndexChapter({ copy, dark }: { copy: ChaptersCopy["index"]; dark: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [lastActive, setLastActive] = useState<number>(0);

  const handleActivate = (idx: number) => {
    setActive(idx);
    setLastActive(idx);
  };

  const buildShapes = useCallback((n: number, isMobile: boolean, halfW: number) => {
    const scale = isMobile ? 0.48 : Math.min(0.9, (halfW * 0.36) / 3.4);
    const l = isMobile ? { cx: 0, cy: -2.2, scale } : { cx: halfW * 0.58, cy: 0, scale };
    return [
      dropShape(n, l),
      linesShape(n, l),
      graphShape(n, l),
      cardsShape(n, { ...l, scale: l.scale * 0.85 }),
      gridShape(n, l),
      dustShape(n, { ...l, scale: l.scale * 0.96 }),
    ];
  }, []);

  // Scroll velocity gently skews titles + vertical pointer inertia glides the 16:9 preview plate.
  useLayoutEffect(() => {
    const el = sectionRef.current;
    const preview = previewRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1025px) and (prefers-reduced-motion: no-preference)", () => {
      const names = Array.from(el.querySelectorAll<HTMLElement>(".lp-index-name"));
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = Math.max(-5, Math.min(5, self.getVelocity() / -380));
          gsap.to(names, {
            skewY: v,
            duration: 0.2,
            overwrite: true,
            onComplete: () => {
              gsap.to(names, { skewY: 0, duration: 0.9, ease: "power3.out" });
            },
          });
        },
      });

      let onMove: ((e: PointerEvent) => void) | null = null;
      if (preview) {
        const yTo = gsap.quickTo(preview, "y", { duration: 0.55, ease: "power3.out" });
        onMove = (e: PointerEvent) => {
          const rect = el.getBoundingClientRect();
          if (!rect.height) return;
          const relY = (e.clientY - rect.top) / rect.height - 0.5;
          yTo(Math.max(-90, Math.min(90, relY * 160)));
        };
        el.addEventListener("pointermove", onMove, { passive: true });
      }

      return () => {
        st.kill();
        gsap.set(names, { skewY: 0 });
        if (onMove) el.removeEventListener("pointermove", onMove);
        if (preview) gsap.set(preview, { y: 0 });
      };
    });

    return () => mm.revert();
  }, []);

  const previewItem = copy.items[active ?? lastActive] ?? copy.items[0];

  return (
    <section id="index" ref={sectionRef} data-surface="paper" className="lp-index lp-paper">
      <MorphField
        className="lp-particles"
        buildShapes={buildShapes}
        shapeIndex={active ?? IDLE}
        count={7000}
        mobileCount={1600}
        dark={dark}
      />

      <header className="lp-index-head">
        <h2 className="lp-index-title">{copy.title}</h2>
        <span className="lp-index-hint">{copy.hint}</span>
      </header>

      {/* Tablet / Mobile 16:9 Workspace Preview Slot */}
      <figure className="lp-index-mobile-figure">
        <div className="lp-index-mobile-frame">
          <img
            src={previewItem.imageSrc}
            alt={previewItem.imageAlt}
            loading="lazy"
            decoding="async"
          />
        </div>
        <figcaption className="lp-hy-caption">{copy.mobileCaption}</figcaption>
      </figure>

      <ul className={`lp-index-list ${active !== null ? "has-active" : ""}`}>
        {copy.items.map((it, i) => (
          <li
            key={it.href}
            className={active === i ? "is-active" : ""}
            onPointerEnter={() => handleActivate(i)}
            onPointerLeave={() => setActive(null)}
          >
            <Link
              href={it.href}
              className="lp-index-row"
              onFocus={() => handleActivate(i)}
              onBlur={() => setActive(null)}
            >
              <span className="lp-num">0{i + 1}</span>
              <span className="lp-index-name">
                {it.name}
                <ArrowUpRight className="lp-index-arrow" size={26} aria-hidden="true" />
              </span>
              <span className="lp-index-line">{it.line}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Desktop Awwwards 16:9 Hover Image Preview with Clip-Path Reveal */}
      <div
        ref={previewRef}
        className={`lp-index-preview ${active !== null ? "is-visible" : ""}`}
        aria-hidden="true"
      >
        <div className="lp-index-preview-frame">
          <img
            src={previewItem.imageSrc}
            alt={previewItem.imageAlt}
            className="lp-index-preview-img"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="lp-index-preview-meta">
          <span>{previewItem.name}</span>
          <span className="lp-index-preview-route">{previewItem.routeLabel}</span>
        </div>
      </div>
    </section>
  );
}
