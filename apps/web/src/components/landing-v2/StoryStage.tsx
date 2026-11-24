"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { RollingText } from "@/components/ui/RollingText";
import type { V2Copy } from "@/lib/landing-v2-copy";
import { scrollToY } from "@/lib/smooth-scroll";
import { ParticleField } from "./ParticleField";
import { SplitLines } from "./SplitLines";
import { cardsShape, dropShape, graphShape } from "./shapes";

gsap.registerPlugin(ScrollTrigger);

const MAX_STAGE = 3;

export function StoryStage({
  copy,
  introReady = true,
}: {
  copy: V2Copy;
  introReady?: boolean;
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
      gsap.set(el.querySelectorAll(".v2-hero-copy .v2-word"), { yPercent: 0, rotate: 0 });
      gsap.set(el.querySelectorAll(".v2-hero-fade"), { autoAlpha: 1, y: 0 });
      return;
    }

    if (!introReady) {
      gsap.set(el.querySelectorAll(".v2-hero-copy .v2-word"), { yPercent: 112, rotate: 4 });
      gsap.set(el.querySelectorAll(".v2-hero-fade"), { autoAlpha: 0, y: 18 });
      return;
    }

    if (entrancePlayedRef.current) return;
    entrancePlayedRef.current = true;

    const ctx = gsap.context(() => {
      gsap.to(".v2-hero-copy .v2-word", {
        yPercent: 0,
        rotate: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.07,
        delay: 0.08,
      });
      gsap.to(".v2-hero-fade", {
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
        end: isMobile ? "+=1750" : "+=2500",
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
      id="v2-story"
      ref={sectionRef}
      data-v2-surface="ink"
      className={`v2-stage v2-ink ${reduced ? "is-static" : ""}`}
    >
      {webgl ? (
        <ParticleField
          className="v2-particles"
          buildTargets={buildTargets}
          count={9000}
          mobileCount={1800}
          stageRef={stageRef}
          dark
          onUnsupported={() => setWebgl(false)}
        />
      ) : (
        <div className="v2-particles v2-fallback-constellation" aria-hidden="true" />
      )}

      <div className={`v2-hero-copy ${heroHidden ? "is-hidden" : ""}`}>
        <h1 className="v2-h1" aria-label={copy.hero.lines.join(" ")}>
          <SplitLines lines={copy.hero.lines} />
        </h1>

        <p className="v2-sub v2-hero-fade">{copy.hero.sub}</p>

        <div className="v2-hero-actions v2-hero-fade">
          <Link href="/notes" className="group v2-enter-link" data-magnetic>
            <RollingText text={copy.hero.cta} />
            <span className="v2-enter-arrow" aria-hidden="true">→</span>
          </Link>
          <Link href="/capture" className="group v2-quiet-link">
            <RollingText text={copy.hero.secondaryCta} />
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="v2-acts">
        {copy.story.acts.map((a, i) => (
          <article
            key={a.title}
            className={`v2-act ${act === i ? "is-active" : ""}`}
            aria-hidden={!reduced && act !== i}
          >
            <span className="v2-num">0{i + 1}</span>
            <h2>{a.title}</h2>
            <p>{a.body}</p>
          </article>
        ))}
      </div>

      {!reduced && (
        <nav className="v2-rail" aria-label="Story progress">
          {copy.story.rail.map((label, i) => (
            <button
              key={label}
              type="button"
              className={act + 1 === i ? "is-active" : ""}
              onClick={() => jumpTo(i)}
            >
              <span>0{i}</span>
              <span className="v2-rail-label">{label}</span>
            </button>
          ))}
        </nav>
      )}

      <span className={`v2-scroll-hint ${heroHidden ? "is-hidden" : ""}`}>
        {copy.hero.hint} ↓
      </span>
    </section>
  );
}
