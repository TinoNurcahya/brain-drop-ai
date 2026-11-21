"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Maximize2 } from "lucide-react";
import { useTextReveal } from "@/hooks/useTextReveal";

gsap.registerPlugin(ScrollTrigger);

export function ImageRevealSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const callout1Ref = useRef<HTMLDivElement>(null);
  const callout2Ref = useRef<HTMLDivElement>(null);

  const headingRef = useTextReveal<HTMLHeadingElement>({
    trigger: "scroll",
    stagger: 0.04,
    y: 30,
  });

  useEffect(() => {
    const container = containerRef.current;
    const frame = frameRef.current;
    const glow = glowRef.current;
    const c1 = callout1Ref.current;
    const c2 = callout2Ref.current;

    if (!container || !frame || !glow) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Scrubbed expansion from compact framed perspective to full-bleed view
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
          end: "top 18%",
          scrub: 1.2,
        },
      });

      tl.fromTo(
        frame,
        {
          scale: 0.84,
          borderRadius: "24px",
          boxShadow: "0 25px 60px -20px rgba(0, 0, 0, 0.7)",
          rotateX: 4,
          transformPerspective: 1200,
        },
        {
          scale: 1,
          borderRadius: "12px",
          boxShadow: "0 35px 90px -15px rgba(232, 168, 56, 0.25)",
          rotateX: 0,
          ease: "power2.out",
        }
      );

      tl.fromTo(
        glow,
        { opacity: 0.2, scale: 0.75 },
        { opacity: 0.9, scale: 1.15, ease: "power2.out" },
        0
      );

      // Callouts drift outward with depth
      if (c1 && c2) {
        tl.fromTo(
          c1,
          { opacity: 0, x: -35, y: -20 },
          { opacity: 1, x: 0, y: 0, ease: "power2.out" },
          0.2
        );
        tl.fromTo(
          c2,
          { opacity: 0, x: 35, y: 20 },
          { opacity: 1, x: 0, y: 0, ease: "power2.out" },
          0.25
        );
      }
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="image-reveal-section" aria-labelledby="reveal-heading">
      <div className="landing-container">
        {/* Section Intro */}
        <div className="image-reveal-intro">
          <h2 id="reveal-heading" ref={headingRef}>
            Your entire second brain.
            <br />
            <span>Harmonized in one glass canvas.</span>
          </h2>
          <p className="section-intro">
            A high-density research environment built for intellectual deep work. Experience real-time on-device
            categorization, interactive topology, and effortless multi-document synthesis.
          </p>
        </div>

        {/* The Expanding Window Container */}
        <div className="image-reveal-viewport">
          {/* Ambient Cosmic Glow Backlight */}
          <div ref={glowRef} className="image-reveal-glow" aria-hidden="true" />

          {/* Browser Window Frame */}
          <div ref={frameRef} className="browser-mockup-frame">
            {/* Top Browser Bar */}
            <div className="browser-titlebar">
              <div className="browser-dots">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
              </div>
              <div className="browser-address">
                <span>braindrop.ai / workspace — Gemini Nano 4 Runtime</span>
              </div>
              <div className="browser-actions">
                <Maximize2 size={13} className="text-[var(--text-muted)]" />
              </div>
            </div>

            {/* Inner Mockup Image Viewport */}
            <div className="browser-content-wrap">
              <Image
                src="/workspace-showcase.jpg"
                alt="BrainDrop AI High-Density Research Workspace Dashboard"
                width={1920}
                height={1080}
                priority
                className="workspace-showcase-img"
              />

              {/* Floating Depth Callout 1 (Top Left) */}
              <div ref={callout1Ref} className="floating-callout callout-top-left">
                <span>On-Device Nano · 42ms Latency</span>
              </div>

              {/* Floating Depth Callout 2 (Bottom Right) */}
              <div ref={callout2Ref} className="floating-callout callout-bottom-right">
                <span>Force-Directed Knowledge Graph</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
