"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { splitTextIntoWords } from "@/lib/split-text";

gsap.registerPlugin(ScrollTrigger);

interface TextRevealOptions {
  trigger?: "scroll" | "load";
  stagger?: number;
  duration?: number;
  y?: number;
  delay?: number;
}

export function useTextReveal<T extends HTMLElement = HTMLHeadingElement>(
  options: TextRevealOptions = {}
) {
  const ref = useRef<T>(null);
  const {
    trigger = "load",
    stagger = 0.04,
    duration = 0.8,
    y = 40,
    delay = 0,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const { words, revert } = splitTextIntoWords(el);

    gsap.set(words, { y, opacity: 0 });

    const config: gsap.TweenVars = {
      y: 0,
      opacity: 1,
      duration,
      stagger,
      delay,
      ease: "power3.out",
    };

    let animation: gsap.core.Tween;

    if (trigger === "scroll") {
      animation = gsap.to(words, {
        ...config,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    } else {
      animation = gsap.to(words, config);
    }

    return () => {
      animation.kill();
      revert();
    };
  }, [trigger, stagger, duration, y, delay]);

  return ref;
}
