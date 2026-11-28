"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollWordReveal } from "@/components/ui/ScrollWordReveal";
import type { ChaptersCopy } from "@/lib/landing-chapters";
import { SplitLines } from "./SplitLines";

gsap.registerPlugin(ScrollTrigger);

const FALLBACK_IMG = "/images/dummy.png";
const MISSING_HYBRID_IMGS = new Set<string>();

/** Unpinned free-scroll editorial interlude: 16:9 clip-path reveal + Interactive Speed Benchmark & Hybrid Ledger. */
export function HybridLedgerChapter({ copy }: { copy: ChaptersCopy["hybrid"] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [, setFallbackVer] = useState(0);

  const resolvedImgSrc = MISSING_HYBRID_IMGS.has(copy.imageSrc) ? FALLBACK_IMG : copy.imageSrc;

  useLayoutEffect(() => {
    const el = sectionRef.current;
    const frame = frameRef.current;
    const img = imgRef.current;
    if (!el || !frame || !img) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      gsap.set(frame, { clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(img, { scale: 1, xPercent: 0, yPercent: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".lp-hy-title .lp-word",
        { yPercent: 112 },
        {
          yPercent: 0,
          duration: 1.05,
          ease: "expo.out",
          stagger: 0.06,
          scrollTrigger: { trigger: el, start: "top 78%" },
        }
      );

      gsap.fromTo(
        frame,
        { clipPath: "inset(10% 22% 4% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: frame,
            start: "top 86%",
            end: "top 24%",
            scrub: 0.65,
          },
        }
      );

      gsap.fromTo(
        img,
        { scale: 1.09, xPercent: -2, yPercent: 1 },
        {
          scale: 1,
          xPercent: 0,
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: frame,
            start: "top 92%",
            end: "bottom 18%",
            scrub: 0.65,
          },
        }
      );

      gsap.fromTo(
        ".lp-hy-row",
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          ease: "power3.out",
          stagger: 0.05,
          scrollTrigger: {
            trigger: ".lp-hy-ledger",
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  const activeRoute = copy.routes[selectedIdx] ?? copy.routes[0];
  const maxMs = 820;
  const activePct = Math.max(2.2, Math.min(100, (activeRoute.ms / maxMs) * 100));
  const cloudBasePct = (680 / maxMs) * 100;
  const speedup = Math.max(15, Math.round(680 / Math.max(1, activeRoute.ms)));
  const titleLines = copy.title.includes(". ")
    ? copy.title.split(". ").map((part, idx, arr) => (idx < arr.length - 1 ? `${part}.` : part))
    : [copy.title];

  return (
    <section
      id="hybrid"
      ref={sectionRef}
      data-surface="ink"
      className="lp-hy lp-ink"
      aria-label={copy.title}
    >
      <div className="lp-hy-wrap">
        {/* Asymmetric 2-Column Diagonal Editorial Spread: Staggered Display Head + Counter-Balanced Thesis */}
        <div className="lp-hy-intro-spread">
          <header className="lp-hy-head">
            <h2 className="lp-h2 lp-hy-title" aria-label={copy.title}>
              <SplitLines lines={titleLines} italicWords={[copy.italicWord]} />
            </h2>
          </header>

          <div className="lp-hy-thesis-wrap">
            <ScrollWordReveal as="p" className="lp-hy-thesis">
              {copy.thesis}
            </ScrollWordReveal>
          </div>
        </div>

        {/* Editorial 16:9 showcase slot with scroll-scrubbed 90° left-anchored inset reveal */}
        <figure className="lp-hy-figure">
          <div ref={frameRef} className="lp-hy-frame">
            <img
              ref={imgRef}
              src={resolvedImgSrc}
              alt={copy.imageAlt}
              className="lp-hy-img"
              decoding="async"
              onError={() => {
                if (!MISSING_HYBRID_IMGS.has(copy.imageSrc)) {
                  MISSING_HYBRID_IMGS.add(copy.imageSrc);
                  setFallbackVer((v) => v + 1);
                }
              }}
            />
          </div>
          <figcaption className="lp-hy-caption">{copy.imageCaption}</figcaption>
        </figure>

        {/* Interactive Speed & Egress Visualizer + Task Routing Ledger */}
        <div className="lp-hy-ledger">
          <div className="lp-hy-ledger-top">
            <div>
              <h3>{copy.ledgerTitle}</h3>
              <p className="lp-hy-bench-hint">{copy.benchmarkHint}</p>
            </div>
            <span className="lp-hy-bench-summary" aria-live="polite">
              {activeRoute.tier === "local"
                ? `${speedup}× ${copy.localSpeedNote}`
                : copy.cloudSafetyNote}
            </span>
          </div>

          <div className="lp-hy-bench" aria-hidden="true">
            <div className="lp-hy-bench-row">
              <span className="lp-hy-bench-label">
                {activeRoute.task} · <strong>{activeRoute.latency}</strong>
              </span>
              <span className="lp-hy-bench-track">
                <i
                  className={activeRoute.tier === "local" ? "is-local" : "is-cloud"}
                  style={{ ["--s" as string]: (activePct / 100).toFixed(4) }}
                />
              </span>
            </div>
            <div className="lp-hy-bench-row is-ref">
              <span className="lp-hy-bench-label">{copy.cloudRefLabel}</span>
              <span className="lp-hy-bench-track">
                <i
                  className="is-baseline"
                  style={{ ["--s" as string]: (cloudBasePct / 100).toFixed(4) }}
                />
              </span>
            </div>
          </div>

          <div className="lp-hy-table" role="table" aria-label={copy.ledgerTitle}>
            <div className="lp-hy-thead" role="row">
              {copy.ledgerHeaders.map((h) => (
                <span key={h} role="columnheader">
                  {h}
                </span>
              ))}
            </div>

            {copy.routes.map((r, idx) => (
              <div
                key={r.task}
                role="row"
                tabIndex={0}
                onMouseEnter={() => setSelectedIdx(idx)}
                onFocus={() => setSelectedIdx(idx)}
                onClick={() => setSelectedIdx(idx)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedIdx(idx);
                  }
                }}
                className={`lp-hy-row ${selectedIdx === idx ? "is-selected" : ""}`}
              >
                <span className="lp-hy-task" role="cell">
                  {r.task}
                </span>
                <span className={`lp-hy-model is-${r.tier}`} role="cell">
                  <i aria-hidden="true" />
                  {r.model}
                </span>
                <span className="lp-hy-mono" role="cell">
                  {r.latency}
                </span>
                <span className={`lp-hy-egress is-${r.tier}`} role="cell">
                  {r.egress}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Asymmetric Editorial Monograph Comparison + Numbered Offline Callouts */}
        <div className="lp-hy-split">
          <div className="lp-hy-compare">
            <div className="lp-hy-block-head">
              <h3>{copy.compareTitle}</h3>
            </div>

            <div className="lp-hy-ctable" role="table" aria-label={copy.compareTitle}>
              <div className="lp-hy-cthead" role="row">
                {copy.compareHeaders.map((h) => (
                  <span key={h} role="columnheader">
                    {h}
                  </span>
                ))}
              </div>

              {copy.compare.map((row) => (
                <div key={row.dimension} className="lp-hy-crow" role="row">
                  <span className="lp-hy-dim" role="cell">
                    {row.dimension}
                  </span>
                  <span className="lp-hy-ours" role="cell">
                    {row.braindrop}
                  </span>
                  <span className="lp-hy-theirs" role="cell">
                    {row.cloudOnly}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lp-hy-notes">
            <article className="lp-hy-note">
              <span className="lp-num">01</span>
              <h4>{copy.offlineTitle}</h4>
              <p>{copy.offlineBody}</p>
            </article>
            <article className="lp-hy-note">
              <span className="lp-num">02</span>
              <h4>{copy.browserTitle}</h4>
              <p>{copy.browserBody}</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
