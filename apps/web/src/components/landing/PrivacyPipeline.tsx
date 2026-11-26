"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { sanitize } from "@braindrop/core";
import type { LandingCopy } from "@/lib/landing-copy";
import { scrollToY } from "@/lib/smooth-scroll";
import { SplitLines } from "./SplitLines";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

const LAYERS = [
  { id: "device", pts: "130,130 400,70 640,130 370,190", cy: 130 },
  { id: "gate", pts: "130,290 400,230 640,290 370,350", cy: 290 },
  { id: "cloud", pts: "130,450 400,390 640,450 370,510", cy: 450 },
];
const MAIN = "M385 130 C 560 150, 560 250, 385 290 C 210 330, 210 410, 385 450";
const LOOP = "M345 130 C 345 100, 425 100, 425 130 C 425 160, 345 160, 345 130";
const BACK = "M385 450 C 610 430, 660 230, 440 140";

/** Deterministic dots inside a flat rhombus centred at (385, cy). */
function layerDots(seed: number, count: number, cy: number) {
  let s = seed;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const out: { x: number; y: number }[] = [];
  let guard = 0;
  while (out.length < count && guard++ < 400) {
    const ox = rnd() * 2 - 1;
    const oy = rnd() * 2 - 1;
    if (Math.abs(ox) + Math.abs(oy) > 0.86) continue;
    out.push({ x: 385 + ox * 250, y: cy + oy * 56 });
  }
  return out;
}

const DOTS = [layerDots(7, 26, 130), layerDots(19, 8, 290), layerDots(31, 14, 450)];

/** Parse numeric prefix & suffix for animated stat count-up (e.g. "38ms" -> 38 + "ms"). */
function parseFact(val: string) {
  const m = val.match(/^(\d+)(.*)$/);
  if (!m) return { target: 0, suffix: val, numeric: false };
  return { target: Number(m[1]), suffix: m[2], numeric: true };
}

/** Private by default: exploded three-layer pipeline with traveling light beam + node blooms + live PII redaction. */
export function PrivacyPipeline({ copy }: { copy: LandingCopy["why"] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const mainRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const loopRef = useRef<SVGPathElement>(null);
  const backRef = useRef<SVGPathElement>(null);
  const packetRef = useRef<SVGCircleElement>(null);
  const haloRef = useRef<SVGCircleElement>(null);
  const factRefs = useRef<(HTMLElement | null)[]>([]);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [beat, setBeat] = useState(0);
  const [layer, setLayer] = useState(0);
  const [sampleIdx, setSampleIdx] = useState(0);
  const [isStatic, setStatic] = useState(false);

  const sample = copy.sandbox.samples[sampleIdx] ?? copy.sandbox.samples[0];
  const result = useMemo(() => sanitize(sample.rawText), [sample.rawText]);
  const parts = useMemo(
    () => result.sanitized.split(/(\[REDACTED_[A-Z_]+\])/g).filter(Boolean),
    [result.sanitized]
  );

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const update = (p: number) => {
      const b = p < 0.34 ? 0 : p < 0.67 ? 1 : 2;
      const q = Math.max(0, Math.min(1, (p - 0.67) / 0.33));
      const al = q > 0.88 ? 2 : p > 0.74 ? 1 : 0;
      setBeat((prev) => (prev === b ? prev : b));
      setLayer((prev) => (prev === al ? prev : al));

      const main = mainRef.current;
      const glow = glowRef.current;
      const loop = loopRef.current;
      const back = backRef.current;
      const packet = packetRef.current;
      const halo = haloRef.current;
      if (!main || !glow || !loop || !back || !packet || !halo) return;

      const flight = Math.min(1, q / 0.85);
      const returning = Math.max(0, (q - 0.85) / 0.15);
      const trailStart = Math.max(0, flight - 0.24) * 100;
      gsap.set(main, { drawSVG: `0% ${flight * 100}%` });
      gsap.set(glow, {
        drawSVG: `${trailStart}% ${flight * 100}%`,
        opacity: flight > 0.02 && returning < 0.05 ? 0.95 : 0,
      });
      gsap.set(back, { drawSVG: `0% ${returning * 100}%` });
      gsap.set(loop, { opacity: b === 1 ? 1 : 0 });

      let pt: DOMPoint;
      if (b === 0) pt = main.getPointAtLength(0);
      else if (b === 1)
        pt = loop.getPointAtLength((((p - 0.34) / 0.33) * 2 % 1) * loop.getTotalLength());
      else if (q <= 0.85) pt = main.getPointAtLength(flight * main.getTotalLength());
      else pt = back.getPointAtLength(returning * back.getTotalLength());
      packet.setAttribute("cx", pt.x.toFixed(1));
      packet.setAttribute("cy", pt.y.toFixed(1));
      halo.setAttribute("cx", pt.x.toFixed(1));
      halo.setAttribute("cy", pt.y.toFixed(1));
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 1023px)").matches;
    if (reduce || narrow) {
      setStatic(true);
      update(1);
      return;
    }

    update(0);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".lp-pipe-title .lp-word",
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 1.05,
          ease: "expo.out",
          stagger: 0.06,
          scrollTrigger: { trigger: el, start: "top 75%" },
        }
      );

      // Animate numerical facts cleanly once on enter (LifeMemory data-count craft).
      copy.facts.forEach((f, idx) => {
        const parsed = parseFact(f.value);
        const targetEl = factRefs.current[idx];
        if (!targetEl || !parsed.numeric || parsed.target === 0) return;
        const counter = { v: 0 };
        gsap.to(counter, {
          v: parsed.target,
          duration: 1.1,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 70%", once: true },
          onUpdate: () => {
            targetEl.textContent = `${Math.round(counter.v)}${parsed.suffix}`;
          },
        });
      });

      triggerRef.current = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "+=1250",
        pin: true,
        scrub: true,
        onUpdate: (self) => update(self.progress),
      });
    }, el);
    return () => {
      triggerRef.current = null;
      ctx.revert();
    };
  }, [copy.facts]);

  const jump = (frac: number) => {
    const st = triggerRef.current;
    if (st) {
      scrollToY(st.start + frac * (st.end - st.start));
      return;
    }
    const b = frac < 0.34 ? 0 : frac < 0.67 ? 1 : 2;
    setBeat(b);
    setLayer(b === 2 ? 2 : 0);
  };

  const labels = [copy.labels.device, copy.labels.gate, copy.labels.cloud];
  const masked = layer >= 1;

  return (
    <section
      id="privacy"
      ref={sectionRef}
      data-surface="ink"
      className={`lp-pipe lp-ink ${isStatic ? "is-static" : ""}`}
      aria-label={copy.lines.join(" ")}
    >
      <div className="lp-pipe-copy">
        <h2 className="lp-pipe-title" aria-label={copy.lines.join(" ")}>
          <SplitLines lines={copy.lines} />
        </h2>

        <div className="lp-pipe-beats" aria-live="polite">
          {copy.beats.map((b, i) => (
            <div key={b.title} className={`lp-pipe-beat ${beat === i || isStatic ? "is-active" : ""}`}>
              <span className="lp-num">0{i + 1}</span>
              <h3>{b.title}</h3>
              <p>{b.body}</p>
            </div>
          ))}
        </div>

        <div className="lp-pipe-jump">
          <button
            type="button"
            className={`lp-tlink lp-tlink-lg ${beat === 1 ? "is-active" : ""}`}
            onClick={() => jump(0.52)}
          >
            {copy.sandbox.localBtn}
          </button>
          <button
            type="button"
            className={`lp-tlink lp-tlink-lg ${beat === 2 ? "is-active" : ""}`}
            onClick={() => jump(0.98)}
          >
            {copy.sandbox.cloudBtn}
          </button>
        </div>

        <dl className="lp-pipe-facts">
          {copy.facts.map((f, idx) => (
            <div key={f.label}>
              <dt
                ref={(node) => {
                  factRefs.current[idx] = node;
                }}
              >
                {f.value}
              </dt>
              <dd>{f.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="lp-pipe-visual">
        <svg className="lp-pipe-svg" viewBox="0 0 720 560" role="img" aria-label={labels.join(" → ")}>
          <defs>
            <filter id="lp-pipe-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {LAYERS.map((L, i) => (
            <g key={L.id} className={`lp-pipe-layer ${layer === i ? "is-active" : ""}`}>
              <polygon points={L.pts} />
              {DOTS[i].map((d, k) => (
                <circle key={k} cx={d.x} cy={d.y} r={1.6} />
              ))}
              {layer === i && (
                <>
                  <circle cx={385} cy={L.cy} r={10} className="lp-pipe-bloom" />
                  <circle cx={385} cy={L.cy} r={22} className="lp-pipe-bloom is-outer" />
                </>
              )}
              <text x={130} y={L.cy + 30}>
                {labels[i]}
              </text>
            </g>
          ))}

          <path d={MAIN} className="lp-pipe-base" />
          <path ref={mainRef} d={MAIN} className="lp-pipe-main" />
          <path ref={glowRef} d={MAIN} className="lp-pipe-beam" filter="url(#lp-pipe-glow)" />
          <path ref={backRef} d={BACK} className="lp-pipe-back" />
          <path ref={loopRef} d={LOOP} className="lp-pipe-loop" filter="url(#lp-pipe-glow)" />

          <text x={440} y={112} className={`lp-pipe-nano ${beat === 1 || isStatic ? "is-on" : ""}`}>
            {copy.labels.nano}
          </text>
          <circle ref={haloRef} r={16} className="lp-pipe-halo" filter="url(#lp-pipe-glow)" />
          <circle ref={packetRef} r={5} className="lp-pipe-packet" />
        </svg>

        <div className="lp-pipe-proof">
          <div className="lp-pipe-samples" role="tablist" aria-label={copy.sandbox.sampleLabel}>
            {copy.sandbox.samples.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={sampleIdx === idx}
                onClick={() => setSampleIdx(idx)}
                className={`lp-tlink ${sampleIdx === idx ? "is-active" : ""}`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="lp-pipe-proof-row">
            <span className="lp-pipe-proof-label">{copy.sandbox.rawLabel}</span>
            <p className={`lp-pipe-text ${masked ? "is-dim" : ""}`}>{sample.rawText}</p>
          </div>
          <div className={`lp-pipe-proof-row ${masked ? "is-on" : ""}`}>
            <span className="lp-pipe-proof-label">
              {copy.sandbox.sanitizedLabel} · {result.redactions.length} {copy.sandbox.scrubbedNote}
            </span>
            <p className="lp-pipe-text">
              {parts.map((part, i) =>
                part.startsWith("[REDACTED_") ? (
                  <mark key={i} className="lp-pii-redacted">
                    {part}
                  </mark>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
