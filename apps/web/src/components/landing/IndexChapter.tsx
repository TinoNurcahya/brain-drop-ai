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
const FALLBACK_IMG = "/images/dummy.png";
const MISSING_PREVIEW_IMGS = new Set<string>();

interface PreviewSwapState {
  cur: number;
  prev: number;
  dir: 1 | -1;
  seq: number;
}

/** Two-column editorial gallery index: giant numbered titles on the left, gallery-scale 16:10 showcase plate on the right. */
export function IndexChapter({ copy, dark }: { copy: ChaptersCopy["index"]; dark: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);

  const [active, setActive] = useState<number | null>(null);
  const [swap, setSwap] = useState<PreviewSwapState>({ cur: 0, prev: 0, dir: 1, seq: 0 });
  const [, setFallbackVer] = useState(0);

  const resolveImg = (src: string) => (MISSING_PREVIEW_IMGS.has(src) ? FALLBACK_IMG : src);

  const handleImgError = (src: string) => {
    if (!MISSING_PREVIEW_IMGS.has(src)) {
      MISSING_PREVIEW_IMGS.add(src);
      setFallbackVer((v) => v + 1);
    }
  };

  const activateIdx = (idx: number) => {
    setActive(idx);
    setSwap((s) =>
      s.cur === idx
        ? s
        : {
            cur: idx,
            prev: s.cur,
            dir: idx >= s.cur ? 1 : -1,
            seq: s.seq + 1,
          }
    );
  };

  const buildShapes = useCallback((n: number, isMobile: boolean, halfW: number) => {
    const scale = isMobile ? 0.44 : Math.min(0.76, (halfW * 0.3) / 3.4);
    const l = isMobile ? { cx: 0, cy: -2.1, scale } : { cx: halfW * 0.68, cy: 0, scale };
    return [
      dropShape(n, l),
      linesShape(n, l),
      graphShape(n, l),
      cardsShape(n, { ...l, scale: l.scale * 0.85 }),
      gridShape(n, l),
      dustShape(n, { ...l, scale: l.scale * 0.96 }),
    ];
  }, []);

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const frame = el.querySelector<HTMLElement>(".lp-index-gallery-frame");
      const names = Array.from(el.querySelectorAll<HTMLElement>(".lp-index-name"));

      const frameTween = frame
        ? gsap.fromTo(
            frame,
            { clipPath: "inset(8% 18% 4% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              ease: "none",
              scrollTrigger: {
                trigger: frame,
                start: "top 86%",
                end: "top 34%",
                scrub: 0.6,
              },
            }
          )
        : null;

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = Math.max(-3.5, Math.min(3.5, self.getVelocity() / -460));
          gsap.to(names, {
            skewY: v,
            duration: 0.2,
            overwrite: true,
            onComplete: () => {
              gsap.to(names, { skewY: 0, duration: 0.85, ease: "power3.out" });
            },
          });
        },
      });

      return () => {
        frameTween?.kill();
        st.kill();
        gsap.set(names, { skewY: 0 });
      };
    });

    return () => mm.revert();
  }, []);

  const curItem = copy.items[swap.cur] ?? copy.items[0];
  const prevItem = copy.items[swap.prev] ?? curItem;
  const curSrc = resolveImg(curItem.imageSrc);
  const prevSrc = resolveImg(prevItem.imageSrc);

  return (
    <section id="index" ref={sectionRef} data-surface="paper" className="lp-index lp-paper">
      <MorphField
        className="lp-particles lp-index-atmosphere"
        buildShapes={buildShapes}
        shapeIndex={active ?? IDLE}
        count={5200}
        mobileCount={1400}
        dark={dark}
      />

      <header className="lp-index-head">
        <h2 className="lp-index-title">{copy.title}</h2>
        <span className="lp-index-hint">{copy.hint}</span>
      </header>

      <div className="lp-index-layout">
        <ul className={`lp-index-list ${active !== null ? "has-active" : ""}`}>
          {copy.items.map((it, i) => {
            const isSelected = (active ?? swap.cur) === i;
            return (
              <li
                key={it.href}
                className={isSelected ? "is-active" : ""}
                onPointerEnter={() => activateIdx(i)}
                onPointerLeave={() => setActive(null)}
              >
                <Link
                  href={it.href}
                  className="lp-index-row"
                  onFocus={() => activateIdx(i)}
                  onBlur={() => setActive(null)}
                >
                  <span className="lp-num">0{i + 1}</span>
                  <span className="lp-index-body">
                    <span className="lp-index-name">
                      {it.name}
                      <ArrowUpRight className="lp-index-arrow" size={24} aria-hidden="true" />
                    </span>
                    <span className="lp-index-line">{it.line}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Monumental Always-Visible Editorial Gallery Showcase Plate */}
        <figure className="lp-index-gallery">
          <Link href={curItem.href} className="lp-index-gallery-frame" aria-label={curItem.name}>
            <i className="lp-reg-tick is-tl" aria-hidden="true" />
            <i className="lp-reg-tick is-tr" aria-hidden="true" />
            <i className="lp-reg-tick is-bl" aria-hidden="true" />
            <i className="lp-reg-tick is-br" aria-hidden="true" />
            <img
              src={prevSrc}
              alt=""
              className="lp-index-preview-base"
              decoding="async"
              onError={() => handleImgError(prevItem.imageSrc)}
            />
            <img
              key={swap.seq}
              src={curSrc}
              alt={curItem.imageAlt}
              className={`lp-index-preview-img ${
                swap.seq > 0 ? (swap.dir >= 0 ? "wipe-down" : "wipe-up") : ""
              }`}
              decoding="async"
              onError={() => handleImgError(curItem.imageSrc)}
            />
            <span className="lp-index-preview-num">
              0{swap.cur + 1} / 0{copy.items.length}
            </span>
          </Link>

          <figcaption className="lp-index-gallery-meta">
            <div className="lp-index-gallery-caption">
              <strong>{curItem.name}</strong>
              <span>{curItem.line}</span>
            </div>
            <Link href={curItem.href} className="lp-index-gallery-route">
              <span>{curItem.routeLabel}</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
