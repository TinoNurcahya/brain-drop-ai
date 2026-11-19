"use client";
import { useEffect, useRef } from "react";
import type Lenis from "lenis";
import { initSmoothScroll, destroySmoothScroll } from "@/lib/smooth-scroll";

export function useSmoothScroll() {
  const lenis = useRef<Lenis | null>(null);
  useEffect(() => {
    lenis.current = initSmoothScroll();
    return () => {
      destroySmoothScroll();
      lenis.current = null;
    };
  }, []);
  return lenis;
}
