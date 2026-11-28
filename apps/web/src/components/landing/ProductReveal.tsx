"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { LandingCopy } from "@/lib/landing-copy";
import { scrollToY } from "@/lib/smooth-scroll";
import { WorkspaceScenes } from "./WorkspaceScenes";
import { SplitLines } from "./SplitLines";

gsap.registerPlugin(ScrollTrigger);

const INTRO = 0.1;

export function ProductReveal({ copy }: { copy: LandingCopy["product"]; dark?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const prevIdxRef = useRef(0);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [seq, setSeq] = useState(0);
  const [reduced, setReduced] = useState(false);
  const n = copy.tabs.length;

  const updateActive = (nextIdx: number) => {
    if (prevIdxRef.current === nextIdx) return;
    const nextDir: 1 | -1 = nextIdx >= prevIdxRef.current ? 1 : -1;
    prevIdxRef.current = nextIdx;
    setDirection(nextDir);
    setActive(nextIdx);
    setSeq((s) => s + 1);
  };

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    setReduced(reduce);
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".lp-pr-title .lp-word",
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 1.05,
          ease: "expo.out",
          stagger: 0.06,
          scrollTrigger: { trigger: el, start: "top 78%", toggleActions: "play none none none" },
        }
      );

      if (isMobile) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=1250",
          pin: true,
          scrub: true,
          onUpdate: (self) => {
            // Smooth 90° left-anchored inset expand during the initial 10% INTRO window, clearing to "none" once open
            if (plateRef.current) {
              if (self.progress < INTRO) {
                const t = self.progress / INTRO;
                const tb = (4 * (1 - t)).toFixed(2);
                const r = (14 * (1 - t)).toFixed(2);
                plateRef.current.style.clipPath = `inset(${tb}% ${r}% ${tb}% 0%)`;
              } else if (plateRef.current.style.clipPath) {
                plateRef.current.style.clipPath = "";
              }
            }

            const p = (self.progress - INTRO) / (1 - INTRO);
            const clamped = Math.max(0, Math.min(0.9999, p));
            const f = clamped * n;
            const idx = p <= 0 ? 0 : Math.floor(f);
            const frac = p <= 0 ? 0 : f - idx;

            updateActive(idx);

            if (plateRef.current) {
              const y = (0.5 - clamped) * 12;
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
      updateActive(i);
      return;
    }
    const p = INTRO + ((i + 0.1) / n) * (1 - INTRO);
    scrollToY(st.start + p * (st.end - st.start));
  };

  return (
    <section
      id="workspace"
      ref={sectionRef}
      data-surface="paper"
      className={`lp-pr lp-paper ${reduced ? "is-static" : ""}`}
      aria-label={copy.title}
    >
      <div className="lp-pr-copy">
        <h2 className="lp-h2 lp-pr-title" aria-label={copy.title}>
          <SplitLines lines={[copy.title]} italicWords={[copy.italicWord]} />
        </h2>
        <p className="lp-pr-sub">{copy.sub}</p>

        <div className="lp-pr-list" role="tablist">
          {copy.tabs.map((t, i) => (
            <button
              key={t.id}
              ref={(node) => {
                itemRefs.current[i] = node;
              }}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={`lp-pr-item ${i === active ? "is-active" : i < active ? "is-done" : ""}`}
              onClick={() => select(i)}
            >
              <span className="lp-pr-bar" aria-hidden="true" />
              <span className="lp-pr-item-head">
                <span className="lp-num">0{i + 1}</span>
                <span className="lp-pr-item-name">{t.name}</span>
              </span>
              <span className="lp-pr-item-body">
                <span>{t.caption}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="lp-pr-visual">
        <div ref={plateRef} className="lp-pr-stage-wrap">
          <WorkspaceScenes activeIndex={active} direction={direction} seq={seq} copy={copy} />
        </div>
      </div>
    </section>
  );
}
