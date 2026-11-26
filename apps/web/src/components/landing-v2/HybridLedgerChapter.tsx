"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollWordReveal } from "@/components/ui/ScrollWordReveal";
import type { ChaptersCopy } from "@/lib/landing-v2-chapters";
import { SplitLines } from "./SplitLines";

gsap.registerPlugin(ScrollTrigger);

/** Unpinned free-scroll editorial interlude: Gemini still-life clip-path reveal + Hybrid Routing & Offline Ledger. */
export function HybridLedgerChapter({ copy }: { copy: ChaptersCopy["hybrid"] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const el = sectionRef.current;
    const frame = frameRef.current;
    const img = imgRef.current;
    if (!el || !frame || !img) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      gsap.set(frame, { clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(img, { scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".v2-hy-title .v2-word",
        { yPercent: 112 },
        {
          yPercent: 0,
          duration: 1.05,
          ease: "expo.out",
          stagger: 0.06,
          scrollTrigger: { trigger: el, start: "top 78%" },
        }
      );

      // Editorial clip-path aperture + subtle optical parallax zoom on scroll.
      gsap.fromTo(
        frame,
        { clipPath: "inset(9% 5% 9% 5%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: frame,
            start: "top 88%",
            end: "top 24%",
            scrub: 0.7,
          },
        }
      );

      gsap.fromTo(
        img,
        { scale: 1.09 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: frame,
            start: "top 95%",
            end: "bottom 15%",
            scrub: 0.7,
          },
        }
      );

      // Quiet staggered hairline ledger row reveals.
      gsap.fromTo(
        ".v2-hy-row",
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          ease: "power3.out",
          stagger: 0.05,
          scrollTrigger: {
            trigger: ".v2-hy-ledger",
            start: "top 82%",
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="v2-hybrid"
      ref={sectionRef}
      data-v2-surface="ink"
      className="v2-hy v2-ink"
      aria-label={copy.title}
    >
      <div className="v2-hy-wrap">
        <header className="v2-hy-head">
          <h2 className="v2-h2 v2-hy-title" aria-label={copy.title}>
            <SplitLines lines={[copy.title]} />
          </h2>
        </header>

        {/* Editorial 16:9 showcase slot with scroll-scrubbed clip-path reveal */}
        <figure className="v2-hy-figure">
          <div ref={frameRef} className="v2-hy-frame">
            <img
              ref={imgRef}
              src={copy.imageSrc}
              alt={copy.imageAlt}
              className="v2-hy-img"
              loading="lazy"
              decoding="async"
            />
          </div>
          <figcaption className="v2-hy-caption">{copy.imageCaption}</figcaption>
        </figure>

        {/* Editorial scroll-word thesis */}
        <div className="v2-hy-thesis-wrap">
          <ScrollWordReveal as="p" className="v2-hy-thesis">
            {copy.thesis}
          </ScrollWordReveal>
        </div>

        {/* Hairline Task Routing Ledger (box-free monograph table) */}
        <div className="v2-hy-ledger">
          <div className="v2-hy-block-head">
            <h3>{copy.ledgerTitle}</h3>
          </div>

          <div className="v2-hy-table" role="table" aria-label={copy.ledgerTitle}>
            <div className="v2-hy-thead" role="row">
              {copy.ledgerHeaders.map((h) => (
                <span key={h} role="columnheader">
                  {h}
                </span>
              ))}
            </div>

            {copy.routes.map((r) => (
              <div key={r.task} className="v2-hy-row" role="row">
                <span className="v2-hy-task" role="cell">
                  {r.task}
                </span>
                <span className={`v2-hy-model is-${r.tier}`} role="cell">
                  <i aria-hidden="true" />
                  {r.model}
                </span>
                <span className="v2-hy-mono" role="cell">
                  {r.latency}
                </span>
                <span className={`v2-hy-egress is-${r.tier}`} role="cell">
                  {r.egress}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hairline Comparison Ledger + Offline / Any-Browser Proof */}
        <div className="v2-hy-split">
          <div className="v2-hy-compare">
            <div className="v2-hy-block-head">
              <h3>{copy.compareTitle}</h3>
            </div>

            <div className="v2-hy-ctable" role="table" aria-label={copy.compareTitle}>
              <div className="v2-hy-cthead" role="row">
                {copy.compareHeaders.map((h) => (
                  <span key={h} role="columnheader">
                    {h}
                  </span>
                ))}
              </div>

              {copy.compare.map((row) => (
                <div key={row.dimension} className="v2-hy-crow" role="row">
                  <span className="v2-hy-dim" role="cell">
                    {row.dimension}
                  </span>
                  <span className="v2-hy-ours" role="cell">
                    {row.braindrop}
                  </span>
                  <span className="v2-hy-theirs" role="cell">
                    {row.cloudOnly}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="v2-hy-notes">
            <article className="v2-hy-note">
              <h4>{copy.offlineTitle}</h4>
              <p>{copy.offlineBody}</p>
            </article>
            <article className="v2-hy-note">
              <h4>{copy.browserTitle}</h4>
              <p>{copy.browserBody}</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
