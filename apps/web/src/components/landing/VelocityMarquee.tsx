"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, ShieldCheck, Cpu, Cloud, Network, BookOpen } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function VelocityMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track1 = track1Ref.current;
    const track2 = track2Ref.current;
    if (!container || !track1 || !track2) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x1 = 0;
    let x2 = 0;
    const speed = 0.65;
    let velocityMultiplier = 1;

    // Track scroll velocity via ScrollTrigger
    const st = ScrollTrigger.create({
      trigger: container,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const vel = Math.abs(self.getVelocity() / 350);
        velocityMultiplier = 1 + Math.min(vel, 4.5);
      },
    });

    const ticker = gsap.ticker.add(() => {
      // Decay velocity multiplier smoothly back to 1
      velocityMultiplier += (1 - velocityMultiplier) * 0.05;

      x1 -= speed * velocityMultiplier;
      x2 += speed * velocityMultiplier;

      // Wrap-around resets for infinite loop
      if (track1) {
        if (x1 <= -50) x1 = 0;
        track1.style.transform = `translate3d(${x1}%, 0, 0)`;
      }
      if (track2) {
        if (x2 >= 0) x2 = -50;
        track2.style.transform = `translate3d(${x2}%, 0, 0)`;
      }
    });

    return () => {
      st.kill();
      gsap.ticker.remove(ticker);
    };
  }, []);

  const items1 = [
    { text: "GOOGLE #BUILDHYBRIDAI 2026", icon: Sparkles, color: "text-[var(--accent-cyan)]" },
    { text: "GEMINI NANO 4 (ON-DEVICE)", icon: Cpu, color: "text-[var(--accent-emerald)]" },
    { text: "CLIENT PII SANDBOX", icon: ShieldCheck, color: "text-[var(--accent-emerald)]" },
    { text: "ZERO DATA LEAKAGE", icon: ShieldCheck, color: "text-[var(--text-primary)]" },
    { text: "FIREBASE AI LOGIC RUNTIME", icon: Cloud, color: "text-[var(--accent-blue)]" },
    { text: "GEMINI 3.8 FLASH CLOUD", icon: Cloud, color: "text-[var(--accent-cyan)]" },
  ];

  const items2 = [
    { text: "INTERACTIVE KNOWLEDGE GRAPH", icon: Network, color: "text-[var(--accent-purple)]" },
    { text: "LEITNER SPACED REPETITION", icon: BookOpen, color: "text-[var(--accent-amber)]" },
    { text: "SUB-50MS LOCAL INFERENCE", icon: Cpu, color: "text-[var(--accent-emerald)]" },
    { text: "CHROME BUILT-IN AI ENGINE", icon: Sparkles, color: "text-[var(--accent-cyan)]" },
    { text: "SYNTHESIS STUDIO", icon: Network, color: "text-[var(--accent-purple)]" },
    { text: "TIPTAP SMART EDITOR", icon: BookOpen, color: "text-[var(--text-primary)]" },
  ];

  return (
    <div ref={containerRef} className="velocity-marquee-section" aria-hidden="true">
      {/* Top Track (Moving Left) */}
      <div className="marquee-row top-row">
        <div ref={track1Ref} className="marquee-track">
          {[...items1, ...items1].map((item, index) => (
            <div key={`m1-${index}`} className="marquee-pill">
              <item.icon size={15} className={item.color} />
              <span className="marquee-text">{item.text}</span>
              <span className="marquee-dot">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Track (Moving Right) */}
      <div className="marquee-row bottom-row">
        <div ref={track2Ref} className="marquee-track">
          {[...items2, ...items2].map((item, index) => (
            <div key={`m2-${index}`} className="marquee-pill">
              <item.icon size={15} className={item.color} />
              <span className="marquee-text">{item.text}</span>
              <span className="marquee-dot">✦</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
