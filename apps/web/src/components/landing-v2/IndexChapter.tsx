"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import type { ChaptersCopy } from "@/lib/landing-v2-chapters";
import { MorphField } from "./MorphField";
import { cardsShape, dropShape, dustShape, graphShape, gridShape, linesShape } from "./shapes";

gsap.registerPlugin(ScrollTrigger);

const IDLE = 5;

/** Five giant titles on the left; the particle field on the right morphs to the hovered module. */
export function IndexChapter({ copy }: { copy: ChaptersCopy["index"] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);

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

  // Scroll velocity gently skews the titles, then they settle.
  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const names = Array.from(el.querySelectorAll<HTMLElement>(".v2-index-name"));
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
      return () => {
        st.kill();
        gsap.set(names, { skewY: 0 });
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="v2-index" ref={sectionRef} data-v2-surface="ink" className="v2-index v2-ink">
      <MorphField
        className="v2-particles"
        buildShapes={buildShapes}
        shapeIndex={active ?? IDLE}
        count={7000}
        mobileCount={1600}
        dark
      />

      <header className="v2-index-head">
        <h2 className="v2-index-title">{copy.title}</h2>
        <span className="v2-index-hint">{copy.hint}</span>
      </header>

      <ul className={`v2-index-list ${active !== null ? "has-active" : ""}`}>
        {copy.items.map((it, i) => (
          <li
            key={it.href}
            className={active === i ? "is-active" : ""}
            onPointerEnter={() => setActive(i)}
            onPointerLeave={() => setActive(null)}
          >
            <Link
              href={it.href}
              className="v2-index-row"
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
            >
              <span className="v2-num">0{i + 1}</span>
              <span className="v2-index-name">
                {it.name}
                <ArrowUpRight className="v2-index-arrow" size={26} aria-hidden="true" />
              </span>
              <span className="v2-index-line">{it.line}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
