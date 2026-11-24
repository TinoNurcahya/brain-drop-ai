"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { V2Copy } from "@/lib/landing-v2-copy";
import { scrollToY } from "@/lib/smooth-scroll";
import { WorkspaceScenes } from "./WorkspaceScenes";
import { SplitLines } from "./SplitLines";

gsap.registerPlugin(ScrollTrigger);

const INTRO = 0.08;

export function ProductReveal({ copy }: { copy: V2Copy["product"]; dark?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);
  const n = copy.tabs.length;

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    setReduced(reduce);
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".v2-pr-title .v2-word",
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 1.05,
          ease: "expo.out",
          stagger: 0.06,
          scrollTrigger: { trigger: el, start: "top 75%" },
        }
      );

      if (isMobile) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=1750",
          pin: true,
          scrub: true,
          onUpdate: (self) => {
            const p = (self.progress - INTRO) / (1 - INTRO);
            const clamped = Math.max(0, Math.min(0.9999, p));
            const f = clamped * n;
            const idx = p <= 0 ? 0 : Math.floor(f);
            const frac = p <= 0 ? 0 : f - idx;

            setActive((prev) => (prev === idx ? prev : idx));

            if (plateRef.current) {
              const y = (0.5 - clamped) * 14;
              plateRef.current.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
            }

            itemRefs.current.forEach((item, i) => {
              const fill = p <= 0 ? 0 : i < idx ? 1 : i === idx ? frac : 0;
              item?.style.setProperty("--p", fill.toFixed(3));
            });
          },
        },
      });
      triggerRef.current = tl.scrollTrigger ?? null;
      tl.to({}, { duration: 1 });
    }, el);

    return () => {
      triggerRef.current = null;
      ctx.revert();
    };
  }, [n]);

  const select = (i: number) => {
    const st = triggerRef.current;
    if (!st) {
      setActive(i);
      return;
    }
    const p = INTRO + ((i + 0.1) / n) * (1 - INTRO);
    scrollToY(st.start + p * (st.end - st.start));
  };

  return (
    <section
      id="v2-workspace"
      ref={sectionRef}
      data-v2-surface="paper"
      className={`v2-pr v2-paper ${reduced ? "is-static" : ""}`}
      aria-label={copy.title}
    >
      <div className="v2-pr-copy">
        <h2 className="v2-h2 v2-pr-title" aria-label={copy.title}>
          <SplitLines lines={[copy.title]} />
        </h2>
        <p className="v2-pr-sub">{copy.sub}</p>

        <div className="v2-pr-list" role="tablist">
          {copy.tabs.map((t, i) => (
            <button
              key={t.id}
              ref={(node) => {
                itemRefs.current[i] = node;
              }}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={`v2-pr-item ${i === active ? "is-active" : i < active ? "is-done" : ""}`}
              onClick={() => select(i)}
            >
              <span className="v2-pr-bar" aria-hidden="true" />
              <span className="v2-pr-item-head">
                <span className="v2-num">0{i + 1}</span>
                <span className="v2-pr-item-name">{t.name}</span>
              </span>
              <span className="v2-pr-item-body">
                <span>{t.caption}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="v2-pr-visual">
        <div ref={plateRef} className="v2-pr-stage-wrap">
          <WorkspaceScenes activeIndex={active} copy={copy} />
        </div>
      </div>
    </section>
  );
}
