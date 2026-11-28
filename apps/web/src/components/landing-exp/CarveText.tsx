"use client";

import { useEffect, useRef, useState } from "react";

const DIRS = ["l", "r", "u", "d"] as const;

interface CarveTextProps {
  text: string;
  className?: string;
  /** Explicit boolean controls playback directly; omit to auto-trigger once via IntersectionObserver. */
  active?: boolean;
  delayMs?: number;
  stepMs?: number;
  durationMs?: number;
  slidePx?: number;
  as?: "span" | "div";
}

/**
 * 4-direction alternating clip-path + vertical glide glyph reveal.
 * Uses screen-reader-only canonical text + aria-hidden animated glyphs so
 * accessibility trees and Lighthouse ARIA audits stay 100% valid.
 */
export function CarveText({
  text,
  className = "",
  active,
  delayMs = 60,
  stepMs = 28,
  durationMs = 820,
  slidePx = -76,
  as = "span",
}: CarveTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [observed, setObserved] = useState(false);

  const isControlled = typeof active === "boolean";
  const isInView = isControlled ? active : observed;

  useEffect(() => {
    if (isControlled) return;
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setObserved(true);
      return;
    }

    // Immediate reveal if already inside viewport on mount
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.96 && rect.bottom > 0) {
      setObserved(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setObserved(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -4% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [isControlled]);

  const words = text.split(" ");
  let glyphIndex = 0;

  const style = {
    ["--nc-delay" as string]: `${delayMs}ms`,
    ["--nc-step" as string]: `${stepMs}ms`,
    ["--nc-dur" as string]: `${durationMs}ms`,
    ["--nc-slide" as string]: `${slidePx}px`,
  };

  const content = words.map((word, wIdx) => (
    <span key={`${word}-${wIdx}`} className="nc-word">
      {Array.from(word).map((ch, cIdx) => {
        const i = glyphIndex++;
        const dir = DIRS[i % DIRS.length];
        return (
          <span
            key={`${cIdx}-${i}`}
            className="nc-ch"
            data-dir={dir}
            style={{ ["--i" as string]: i }}
          >
            <span className="nc-ch-inner">{ch}</span>
          </span>
        );
      })}
      {wIdx < words.length - 1 ? <span className="nc-space">{"\u00A0"}</span> : null}
    </span>
  ));

  const sharedClass = `nc-chars ${isInView ? "is-inview" : ""} ${className}`;
  const inViewAttr = isInView ? "true" : "false";

  if (as === "div") {
    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={sharedClass}
        data-inview={inViewAttr}
        style={style}
      >
        <span className="sr-only">{text}</span>
        <span aria-hidden="true" className="nc-chars-inner">
          {content}
        </span>
      </div>
    );
  }

  return (
    <span
      ref={ref as React.RefObject<HTMLSpanElement>}
      className={sharedClass}
      data-inview={inViewAttr}
      style={style}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="nc-chars-inner">
        {content}
      </span>
    </span>
  );
}
