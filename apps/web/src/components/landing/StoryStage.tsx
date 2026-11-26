"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { RollingText } from "@/components/ui/RollingText";
import type { LandingCopy } from "@/lib/landing-copy";
import { scrollToY } from "@/lib/smooth-scroll";
import { ParticleField } from "./ParticleField";
import { SplitLines } from "./SplitLines";
import { cardsShape, dropShape, graphShape } from "./shapes";

gsap.registerPlugin(ScrollTrigger);

const MAX_STAGE = 3;

export function StoryStage({
  copy,
  introReady = true,
  dark = true,
}: {
  copy: LandingCopy;
  introReady?: boolean;
  dark?: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef(0);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const entrancePlayedRef = useRef(false);
  const [act, setAct] = useState(-1);
  const [webgl, setWebgl] = useState(true);
  const [reduced, setReduced] = useState(false);

  const buildTargets = useCallback((n: number, isMobile: boolean, halfW: number) => {
    const scale = isMobile ? 0.55 : Math.min(0.95, (halfW * 0.44) / 3.4);
    const l = isMobile ? { cx: 0, cy: 1.25, scale } : { cx: halfW * 0.42, cy: 0, scale };
    return [dropShape(n, l), graphShape(n, l), cardsShape(n, { ...l, scale: l.scale * 0.85 })];
  }, []);

  // Synchronize hero entrance with the IntroLoader 'o' aperture reveal.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      entrancePlayedRef.current = true;
      gsap.set(el.querySelectorAll(".lp-hero-copy .lp-word"), { yPercent: 0, rotate: 0 });
      gsap.set(el.querySelectorAll(".lp-hero-fade"), { autoAlpha: 1, y: 0 });
      return;
    }

    if (!introReady) {
      gsap.set(el.querySelectorAll(".lp-hero-copy .lp-word"), { yPercent: 112, rotate: 4 });
      gsap.set(el.querySelectorAll(".lp-hero-fade"), { autoAlpha: 0, y: 18 });
      return;
    }

    if (entrancePlayedRef.current) return;
    entrancePlayedRef.current = true;

    const ctx = gsap.context(() => {
      gsap.to(".lp-hero-copy .lp-word", {
        yPercent: 0,
        rotate: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.07,
        delay: 0.08,
      });
      gsap.to(".lp-hero-fade", {
        autoAlpha: 1,
        y: 0,
        duration: 0.85,
        ease: "power3.out",
        delay: 0.35,
        stagger: 0.08,
      });
    }, el);

    return () => ctx.revert();
  }, [introReady]);

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    setReduced(reduce);

    if (reduce) {
      stageRef.current = 2;
      return;
    }

    const ctx = gsap.context(() => {
      triggerRef.current = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: isMobile ? "+=1150" : "+=1650",
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const s = Math.min(MAX_STAGE, self.progress * (MAX_STAGE + 0.4));
          stageRef.current = s;
          const next = s < 0.5 ? -1 : Math.min(2, Math.round(s) - 1);
          setAct((prev) => (prev === next ? prev : next));
        },
      });
    }, el);

    return () => {
      triggerRef.current = null;
      ctx.revert();
    };
  }, []);

  const jumpTo = (railIndex: number) => {
    const st = triggerRef.current;
    if (!st) return;
    if (railIndex === 0) {
      scrollToY(st.start);
      return;
    }
    const progress = railIndex / (MAX_STAGE + 0.4);
    scrollToY(st.start + progress * (st.end - st.start) + 2);
  };

  const heroHidden = act >= 0 && !reduced;

  return (
    <section
      id="story"
      ref={sectionRef}
      data-surface="ink"
      className={`lp-stage lp-ink ${reduced ? "is-static" : ""}`}
    >
      {webgl ? (
        <ParticleField
          className="lp-particles"
          buildTargets={buildTargets}
          count={9000}
          mobileCount={1800}
          stageRef={stageRef}
          dark={dark}
          onUnsupported={() => setWebgl(false)}
        />
      ) : (
        <div className="lp-particles lp-fallback-constellation" aria-hidden="true" />
      )}

      <div className={`lp-hero-copy ${heroHidden ? "is-hidden" : ""}`}>
        <h1 className="lp-h1" aria-label={copy.hero.lines.join(" ")}>
          <SplitLines lines={copy.hero.lines} />
        </h1>

        <p className="lp-sub lp-hero-fade">{copy.hero.sub}</p>

        <div className="lp-hero-actions lp-hero-fade">
          <Link href="/notes" className="group lp-enter-link" data-magnetic>
            <RollingText text={copy.hero.cta} />
            <span className="lp-enter-arrow" aria-hidden="true">→</span>
          </Link>
          <Link href="/capture" className="group lp-quiet-link">
            <RollingText text={copy.hero.secondaryCta} />
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="lp-acts">
        {copy.story.acts.map((a, i) => (
          <article
            key={a.title}
            className={`lp-act ${act === i ? "is-active" : ""}`}
            aria-hidden={!reduced && act !== i}
          >
            <span className="lp-num">0{i + 1}</span>
            <h2>{a.title}</h2>
            <p>{a.body}</p>
          </article>
        ))}
      </div>

      {!reduced && (
        <nav className="lp-rail" aria-label="Story progress">
          {copy.story.rail.map((label, i) => (
            <button
              key={label}
              type="button"
              className={act + 1 === i ? "is-active" : ""}
              onClick={() => jumpTo(i)}
            >
              <span>0{i}</span>
              <span className="lp-rail-label">{label}</span>
            </button>
          ))}
        </nav>
      )}

      <span className={`lp-scroll-hint ${heroHidden ? "is-hidden" : ""}`}>
        {copy.hero.hint} ↓
      </span>
    </section>
  );
}
