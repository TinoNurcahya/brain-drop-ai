"use client";

import Image from "next/image";
import { useImperativeHandle, useLayoutEffect, useRef, type Ref } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { RedPushPin } from "@/components/ui/RedPushPin";
import { RollingText } from "@/components/ui/RollingText";

gsap.registerPlugin(ScrollTrigger);

export type ArchiveHeroHandle = { reveal: () => void };

export function ArchiveHero({ ref }: { ref?: Ref<ArchiveHeroHandle> }) {
  const root = useRef<HTMLElement>(null);
  const entrance = useRef<gsap.core.Timeline | null>(null);
  const introReady = useRef(false);
  const stringPathRef = useRef<SVGPathElement>(null);
  const knot1Ref = useRef<SVGCircleElement>(null);
  const knot2Ref = useRef<SVGCircleElement>(null);

  useImperativeHandle(ref, () => ({
    reveal() {
      introReady.current = true;
      entrance.current?.play();
    },
  }), []);

  useLayoutEffect(() => {
    if (!root.current) return;

    // Calculate natural gravitational sag for the crimson string between pins
    const updateStringDOM = () => {
      const photoPin = root.current?.querySelector(".lm-detective-pin-photo");
      const fragPin = root.current?.querySelector(".lm-detective-pin-fragment");
      const stage = root.current?.querySelector(".lm-hero-stage");
      if (!photoPin || !fragPin || !stage || !stringPathRef.current) return;

      const sRect = stage.getBoundingClientRect();
      const pRect = photoPin.getBoundingClientRect();
      const fRect = fragPin.getBoundingClientRect();

      const x1 = Math.round(pRect.left + pRect.width / 2 - sRect.left);
      const y1 = Math.round(pRect.top + pRect.height * 0.45 - sRect.top);
      const x2 = Math.round(fRect.left + fRect.width / 2 - sRect.left);
      const y2 = Math.round(fRect.top + fRect.height * 0.45 - sRect.top);

      const dx = x1 - x2;
      const dy = y1 - y2;
      const distance = Math.hypot(dx, dy);

      // Natural gravitational sag
      const droop = Math.round(Math.max(26, Math.min(50, distance * 0.13)));
      const midX = Math.round((x1 + x2) / 2);
      const midY = Math.round((y1 + y2) / 2 + droop);

      stringPathRef.current.setAttribute("d", `M ${x2} ${y2} Q ${midX} ${midY} ${x1} ${y1}`);
      knot1Ref.current?.setAttribute("cx", String(x1));
      knot1Ref.current?.setAttribute("cy", String(y1));
      knot2Ref.current?.setAttribute("cx", String(x2));
      knot2Ref.current?.setAttribute("cy", String(y2));
    };

    updateStringDOM();
    const timer1 = setTimeout(updateStringDOM, 100);
    const timer2 = setTimeout(updateStringDOM, 400);

    const stageEl = root.current?.querySelector<HTMLElement>(".lm-hero-stage");
    let ro: ResizeObserver | null = null;
    if (stageEl && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => updateStringDOM());
      ro.observe(stageEl);
    }
    window.addEventListener("resize", updateStringDOM);

    const mm = gsap.matchMedia(root);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const heroTl = gsap.timeline();
      entrance.current = heroTl;

      heroTl.from(".lm-hero-line > span", {
        yPercent: 110,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
      });

      heroTl.from(
        ".lm-hero-bottom",
        {
          opacity: 0,
          y: 20,
          duration: 0.75,
          ease: "power2.out",
        },
        "-=0.4"
      );

      heroTl.from(
        ".lm-hero-photo",
        {
          opacity: 0,
          scale: 0.92,
          rotate: 0,
          duration: 0.9,
          ease: "power2.out",
        },
        "-=0.6"
      );

      heroTl.from(
        [".lm-detective-pin-photo", ".lm-detective-string-svg", ".lm-hero-fragment"],
        {
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.3"
      );
    });

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      ro?.disconnect();
      window.removeEventListener("resize", updateStringDOM);
      mm.revert();
    };
  }, []);

  return (
    <section id="hero" ref={root} className="lm-hero" aria-labelledby="archive-title">
      <div className="lm-hero-stage">
        <div className="lm-hero-overline lm-meta">
          <span>Google #BuildHybridAI 2026</span>
          <span>Zero-Leakage Local Sandbox</span>
        </div>

        {/* Detective Board: Red String Overlay */}
        <svg className="lm-detective-string-svg" aria-hidden="true">
          <defs>
            <filter id="detective-string-shadow" x="-20%" y="-20%" width="160%" height="160%">
              <feDropShadow dx="1" dy="2.5" stdDeviation="1.5" floodColor="#091b25" floodOpacity="0.4" />
            </filter>
          </defs>
          <g filter="url(#detective-string-shadow)">
            <path
              ref={stringPathRef}
              stroke="#dc2626"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />
          </g>
          <circle ref={knot1Ref} r="3.5" stroke="#991b1b" strokeWidth="1.6" fill="none" />
          <circle ref={knot2Ref} r="3.5" stroke="#991b1b" strokeWidth="1.6" fill="none" />
        </svg>

        {/* Floating Screenshot with Red Push Pin */}
        <div className="lm-hero-photo">
          <Image
            src="/dashboard-desktop-dark.png"
            alt="BrainDrop AI High-Density Research Workspace Dashboard"
            fill
            priority
            sizes="(max-width: 1023px) 85vw, 45vw"
          />
          <div className="lm-hero-photo-caption">
            <span className="lm-meta">ON-DEVICE RUNTIME · ~48MS</span>
            <p>
              Your thoughts,<br />
              <em>kept safe.</em>
            </p>
          </div>
        </div>

        {/* Grand Centered / Offset Editorial Title */}
        <div className="lm-hero-copy">
          <h1 id="archive-title">
            <span className="lm-hero-line"><span>Capture anything.</span></span>
            <span className="lm-hero-line lm-hero-line-second"><span>Forget <em>nothing.</em></span></span>
          </h1>
          <div className="lm-hero-bottom">
            <p>
              Your privacy-first hybrid second brain.<br />
              Process notes instantly on-device with Gemini Nano,<br />
              <span>and synthesize complex research with cloud intelligence.</span>
            </p>
            <a href="#ordinary" className="lm-enter-link group">
              <RollingText text="Enter the archive" />
              <ArrowDown size={17} strokeWidth={1.4} />
            </a>
          </div>
        </div>

        {/* Detective Board Details & Pinned Fragment */}
        <div className="lm-hero-details lm-meta">
          {/* Push Pin on Photo */}
          <RedPushPin className="lm-detective-pin-photo" />

          {/* Paper Fragment Note */}
          <div className="lm-hero-fragment">
            <RedPushPin className="lm-detective-pin-fragment" />
            <span>FIELD NOTE / LOCAL</span>
            <blockquote>
              &ldquo;Learning is a practice, not a destination. Connect the spark before it fades.&rdquo;
            </blockquote>
            <span>GEMINI NANO · PRIVATE</span>
          </div>

          <span className="lm-hero-side">THINK FREELY. KEEP CONNECTIONS.</span>
          <span className="lm-hero-edition">
            BrainDrop AI <ArrowUpRight size={13} />
          </span>
        </div>
      </div>
    </section>
  );
}
