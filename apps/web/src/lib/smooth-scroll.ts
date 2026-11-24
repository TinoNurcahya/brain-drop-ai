"use client";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;
let tickerCallback: ((time: number) => void) | null = null;

export function initSmoothScroll(): Lenis {
  if (lenisInstance) return lenisInstance;

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    smoothWheel: true,
    anchors: true,
  });

  // Sync Lenis with GSAP ScrollTrigger
  lenis.on("scroll", ScrollTrigger.update);
  tickerCallback = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  lenisInstance = lenis;
  return lenis;
}

export function scrollToTarget(selector: string) {
  if (typeof window === "undefined") return;
  if (lenisInstance) {
    lenisInstance.scrollTo(selector, { duration: 1.35 });
    return;
  }
  const el = document.querySelector(selector);
  el?.scrollIntoView({ behavior: "smooth" });
}

export function scrollToY(y: number) {
  if (typeof window === "undefined") return;
  if (lenisInstance) {
    lenisInstance.scrollTo(y, { duration: 1.2 });
    return;
  }
  window.scrollTo({ top: y, behavior: "smooth" });
}

export function destroySmoothScroll() {
  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback);
    tickerCallback = null;
  }
  if (lenisInstance) {
    lenisInstance.off("scroll", ScrollTrigger.update);
    lenisInstance.destroy();
    lenisInstance = null;
  }
}
