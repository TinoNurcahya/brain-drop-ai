"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// Exact Newsreader glyph outlines for "BrainDrop" extracted from Newsreader variable font.
const LETTER_PATHS = [
  {
    char: "B",
    capital: true,
    d: "M76.64 65.07L76.64 61.33L89.16 61.33Q94.53 61.33 97.86 62.82Q101.19 64.32 102.70 66.91Q104.21 69.50 104.21 72.78Q104.21 77.35 101.31 80.41Q98.42 83.47 93.30 83.97L93.41 83.40Q99.75 83.76 103.37 87.01Q106.98 90.27 106.98 95.31Q106.98 99.60 105.15 102.93Q103.31 106.26 99.39 108.13Q95.46 110.00 89.13 110.00L76.67 110.00L76.67 106.26L88.84 106.26Q92.55 106.26 95.16 105.18Q97.77 104.10 99.15 101.77Q100.54 99.45 100.54 95.78Q100.54 92.90 99.35 90.70Q98.16 88.51 95.64 87.27Q93.12 86.02 89.13 86.02L76.60 86.02L76.64 82.28L88.70 82.28Q93.12 82.28 95.64 80.08Q98.16 77.89 98.16 73.35Q98.16 70.83 97.05 69.00Q95.93 67.16 93.65 66.12Q91.36 65.07 87.83 65.07L76.64 65.07ZM67.28 110.00L67.28 108.20L73.11 106.36L73.11 64.96L67.28 63.13L67.28 61.33L79.23 61.33L79.23 110.00L67.28 110.00Z",
  },
  {
    char: "r",
    capital: false,
    d: "M133.64 77.78Q135.44 77.78 136.32 78.68Q137.20 79.58 137.20 81.06Q137.20 82.78 136.23 83.81Q135.26 84.84 133.60 84.84Q132.66 84.84 131.71 84.57Q130.76 84.30 129.75 84.04Q128.74 83.79 127.59 83.79Q126.76 83.79 125.79 84.01Q124.82 84.22 123.84 84.64Q122.87 85.05 122.12 85.63L121.25 84.37Q123.56 82.60 125.39 81.36Q127.23 80.12 128.74 79.33Q130.25 78.54 131.46 78.16Q132.66 77.78 133.64 77.78ZM122.94 84.33L122.94 106.62L128.70 108.31L128.70 110.00L111.78 110.00L111.78 108.31L117.36 106.62L117.36 85.16Q116.90 84.69 116.10 84.26Q115.31 83.83 114.23 83.34Q113.15 82.86 111.82 82.35L111.82 81.34L121.43 77.53L122.30 77.53L122.94 84.33Z",
  },
  {
    char: "a",
    capital: false,
    d: "M160.97 89.73L161.15 92.65Q156.62 93.58 153.74 94.56Q150.86 95.53 149.29 96.55Q147.72 97.58 147.13 98.77Q146.54 99.96 146.54 101.40Q146.54 103.84 148.01 105.16Q149.49 106.47 151.79 106.47Q153.63 106.47 155.12 105.61Q156.62 104.74 157.52 103.32Q158.42 101.90 158.42 100.24L158.42 87.28Q158.42 84.44 157.01 82.84Q155.61 81.24 152.30 81.24Q151.04 81.24 149.54 81.54Q148.05 81.85 146.68 82.50L148.66 80.66Q148.52 81.78 148.30 82.80Q148.08 83.83 147.81 84.64Q147.54 85.45 147.11 85.95Q146.54 86.71 145.65 87.01Q144.77 87.32 143.80 87.32Q142.50 87.32 141.78 86.74Q141.06 86.17 141.06 85.30Q141.06 84.15 142.18 82.87Q143.30 81.60 145.20 80.44Q147.11 79.29 149.51 78.57Q151.90 77.85 154.49 77.85Q157.91 77.85 160.00 78.88Q162.09 79.90 163.04 81.85Q164.00 83.79 164.00 86.64L164.00 103.16Q164.00 104.35 164.34 105.10Q164.68 105.86 165.36 106.24Q166.05 106.62 167.06 106.62Q167.88 106.62 168.82 106.33Q169.76 106.04 170.69 105.57L170.69 107.48Q169.18 109.10 167.47 109.86Q165.76 110.61 164.28 110.61Q162.48 110.61 161.17 109.78Q159.86 108.96 159.17 107.37Q158.49 105.79 158.49 103.52L158.70 103.23Q158.24 105.46 156.92 107.14Q155.61 108.81 153.70 109.77Q151.79 110.72 149.52 110.72Q145.60 110.72 143.15 108.61Q140.70 106.51 140.70 102.55Q140.70 100.42 141.57 98.68Q142.43 96.93 144.63 95.42Q146.82 93.91 150.80 92.52Q154.78 91.14 160.97 89.73Z",
  },
  {
    char: "i",
    capital: false,
    d: "M180.06 67.30Q178.05 67.30 176.77 66.06Q175.49 64.82 175.49 62.91Q175.49 61.00 176.77 59.76Q178.05 58.52 180.06 58.52Q182.08 58.52 183.34 59.76Q184.60 61.00 184.60 62.91Q184.60 64.82 183.34 66.06Q182.08 67.30 180.06 67.30ZM183.52 77.56L183.27 83.79L183.27 106.62L188.85 108.31L188.85 110.00L172.14 110.00L172.14 108.31L177.69 106.62L177.69 84.69Q177.29 84.30 176.39 83.76Q175.49 83.22 174.39 82.68Q173.30 82.14 172.18 81.78L172.18 80.48L182.62 77.56L183.52 77.56Z",
  },
  {
    char: "n",
    capital: false,
    d: "M202.76 84.33L202.76 106.62L208.34 108.31L208.34 110.00L191.60 110.00L191.60 108.31L197.18 106.62L197.18 85.16Q196.60 84.58 195.34 83.92Q194.08 83.25 191.63 82.35L191.63 81.34L200.63 77.53L201.50 77.53L202.76 84.33ZM213.20 108.31L218.81 106.62L218.81 89.34Q218.81 87.28 217.97 85.84Q217.12 84.40 215.46 83.63Q213.81 82.86 211.32 82.86Q208.52 82.86 206.05 83.83Q203.58 84.80 202.43 86.17L201.14 84.98Q203.30 82.82 205.08 81.40Q206.86 79.98 208.46 79.13Q210.06 78.28 211.72 77.92Q213.38 77.56 215.25 77.56Q219.89 77.56 222.12 80.39Q224.36 83.22 224.36 89.23L224.36 106.62L230.01 108.31L230.01 110.00L213.20 110.00L213.20 108.31Z",
  },
  {
    char: "D",
    capital: true,
    d: "M274.95 85.02Q274.95 74.86 268.83 69.97Q262.71 65.07 251.73 65.07L241.65 65.07L241.65 61.33L253.60 61.33Q262.96 61.33 269.15 63.85Q275.34 66.37 278.44 71.48Q281.54 76.59 281.54 84.30Q281.54 92.47 277.90 98.21Q274.26 103.95 267.95 106.98Q261.63 110.00 253.60 110.00L241.65 110.00L241.65 106.26L252.70 106.26Q259.47 106.26 264.45 104.06Q269.44 101.86 272.19 97.18Q274.95 92.50 274.95 85.02ZM233.37 110.00L233.37 108.20L239.31 106.36L239.31 64.96L233.37 63.13L233.37 61.33L245.39 61.33L245.39 110.00L233.37 110.00Z",
  },
  {
    char: "r",
    capital: false,
    d: "M308.40 77.78Q310.20 77.78 311.09 78.68Q311.97 79.58 311.97 81.06Q311.97 82.78 311.00 83.81Q310.02 84.84 308.37 84.84Q307.43 84.84 306.48 84.57Q305.52 84.30 304.52 84.04Q303.51 83.79 302.36 83.79Q301.53 83.79 300.56 84.01Q299.58 84.22 298.61 84.64Q297.64 85.05 296.88 85.63L296.02 84.37Q298.32 82.60 300.16 81.36Q302.00 80.12 303.51 79.33Q305.02 78.54 306.23 78.16Q307.43 77.78 308.40 77.78ZM297.71 84.33L297.71 106.62L303.47 108.31L303.47 110.00L286.55 110.00L286.55 108.31L292.13 106.62L292.13 85.16Q291.66 84.69 290.87 84.26Q290.08 83.83 289.00 83.34Q287.92 82.86 286.59 82.35L286.59 81.34L296.20 77.53L297.06 77.53L297.71 84.33Z",
  },
  {
    char: "o",
    capital: false,
    d: "M331.24 107.52Q334.16 107.52 336.39 106.18Q338.62 104.85 339.86 102.08Q341.10 99.31 341.10 95.02Q341.10 90.34 339.90 87.19Q338.69 84.04 336.48 82.41Q334.26 80.77 331.17 80.77Q328.25 80.77 326.04 82.10Q323.82 83.43 322.56 86.20Q321.30 88.98 321.30 93.30Q321.30 97.90 322.51 101.09Q323.72 104.28 325.95 105.90Q328.18 107.52 331.24 107.52ZM331.06 110.72Q326.31 110.72 322.71 108.67Q319.11 106.62 317.13 102.93Q315.15 99.24 315.15 94.45Q315.15 89.52 317.24 85.70Q319.32 81.88 322.98 79.72Q326.63 77.56 331.35 77.56Q336.14 77.56 339.72 79.63Q343.30 81.70 345.30 85.36Q347.30 89.01 347.30 93.84Q347.30 98.77 345.21 102.58Q343.12 106.40 339.47 108.56Q335.81 110.72 331.06 110.72Z",
  },
  {
    char: "p",
    capital: false,
    d: "M380.90 94.34Q380.90 88.26 378.03 85.07Q375.17 81.88 370.46 81.88Q368.37 81.88 366.44 82.24Q364.52 82.60 362.79 83.31Q361.06 84.01 359.55 85.09L359.55 82.32Q361.71 81.02 363.60 80.12Q365.49 79.22 367.14 78.64Q368.80 78.07 370.22 77.82Q371.64 77.56 372.83 77.56Q377.55 77.56 380.75 79.45Q383.96 81.34 385.61 84.73Q387.27 88.11 387.27 92.58Q387.27 98.19 384.93 102.26Q382.59 106.33 378.72 108.52Q374.85 110.72 370.17 110.72Q368.15 110.72 366.32 110.23Q364.48 109.75 362.73 108.85Q360.99 107.95 359.30 106.65L361.92 106.65L361.92 124.62L368.15 126.27L368.15 127.96L350.76 127.96L350.76 126.27L356.34 124.62L356.34 85.16Q355.88 84.69 355.10 84.26Q354.33 83.83 353.25 83.34Q352.17 82.86 350.84 82.35L350.84 81.34L359.84 77.53L360.70 77.53L361.92 82.28L361.92 100.17Q361.92 102.30 363.04 103.93Q364.16 105.57 366.17 106.47Q368.19 107.37 370.89 107.37Q374.06 107.37 376.29 105.79Q378.52 104.20 379.71 101.25Q380.90 98.30 380.90 94.34Z",
  },
];

// Cubic-bezier(0.4, 0, 0.2, 1) matching ThemeProvider's iris transition.
function irisEase(x: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const cx = 3 * 0.4;
  const bx = 3 * (0.2 - 0.4) - cx;
  const ax = 1 - cx - bx;
  const cy = 0;
  const by = 3 * 1 - cy;
  const ay = 1 - cy - by;
  let t = x;
  for (let i = 0; i < 6; i++) {
    const xt = ((ax * t + bx) * t + cx) * t - x;
    const dx = (3 * ax * t + 2 * bx) * t + cx;
    if (Math.abs(dx) < 1e-6) break;
    t -= xt / dx;
  }
  return ((ay * t + by) * t + cy) * t;
}

function buildEllipticalCutoutPolygon(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  vw: number,
  vh: number,
  segments = 40
) {
  if (rx <= 0.5 || ry <= 0.5) {
    return "polygon(0px 0px, 100% 0px, 100% 100%, 0px 100%, 0px 0px)";
  }
  let poly = `polygon(0px 0px, ${vw}px 0px, ${vw}px ${vh}px, 0px ${vh}px, 0px 0px`;
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * 2 * Math.PI;
    const px = (cx + rx * Math.cos(angle)).toFixed(1);
    const py = (cy - ry * Math.sin(angle)).toFixed(1);
    poly += `, ${px}px ${py}px`;
  }
  poly += ")";
  return poly;
}

function measureHole(svgEl: SVGSVGElement | null, anchorEl: SVGElement | null) {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
  const vh = typeof window !== "undefined" ? window.innerHeight : 900;
  let cx = vw / 2;
  let cy = vh / 2;
  let rx = 10;
  let ry = 13.5;

  if (anchorEl) {
    const rect = anchorEl.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      cx = rect.left + rect.width / 2;
      cy = rect.top + rect.height / 2;
      rx = Math.max(5, rect.width / 2);
      ry = Math.max(7, rect.height / 2);
    }
  } else if (svgEl) {
    const sRect = svgEl.getBoundingClientRect();
    if (sRect.width > 0) {
      const contentH = sRect.width * (92 / 350);
      const topOffset = (sRect.height - contentH) / 2;
      cx = sRect.left + ((331.2 - 52) / 350) * sRect.width;
      cy = sRect.top + topOffset + ((94.14 - 48) / 92) * contentH;
      rx = (9.9 / 350) * sRect.width;
      ry = (13.37 / 92) * contentH;
    }
  }

  const maxCornerDist = Math.hypot(Math.max(cx, vw - cx), Math.max(cy, vh - cy));
  const maxRadius = Math.ceil(maxCornerDist * 1.35);
  return { cx, cy, rx, ry, maxRadius, vw, vh };
}

interface V2IntroLoaderProps {
  caption: string;
  onRevealStart?: () => void;
  onComplete?: () => void;
}

export function V2IntroLoader({ caption, onRevealStart, onComplete }: V2IntroLoaderProps) {
  const [phase, setPhase] = useState<"visible" | "hidden">("visible");
  const revealCbRef = useRef(onRevealStart);
  const completeCbRef = useRef(onComplete);
  const completedRef = useRef(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const oAnchorRef = useRef<SVGEllipseElement>(null);
  const penTipRef = useRef<SVGGElement>(null);
  const strokeRefs = useRef<(SVGPathElement | null)[]>([]);
  const fillRefs = useRef<(SVGPathElement | null)[]>([]);
  const captionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    revealCbRef.current = onRevealStart;
    completeCbRef.current = onComplete;
  }, [onRevealStart, onComplete]);

  useEffect(() => {
    if (completedRef.current) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const params = new URLSearchParams(window.location.search);
    const skipRequested = params.has("skipIntro");

    let active = true;
    let revealed = false;
    let startFrame = 0;

    const triggerReveal = () => {
      if (!revealed) {
        revealed = true;
        revealCbRef.current?.();
      }
    };

    const finish = () => {
      if (!active || completedRef.current) return;
      completedRef.current = true;
      setPhase("hidden");
      triggerReveal();
      completeCbRef.current?.();
    };

    if (motionQuery.matches || skipRequested) {
      finish();
      return;
    }

    const penTip = penTipRef.current;
    if (penTip) gsap.set(penTip, { opacity: 0 });

    strokeRefs.current.forEach((el, idx) => {
      if (!el) return;
      const len = el.getTotalLength() + 2;
      gsap.set(el, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 });
      const fillEl = fillRefs.current[idx];
      if (fillEl) {
        gsap.set(fillEl, { opacity: 0, scale: 0.985, transformOrigin: "center center" });
      }
    });

    if (captionRef.current) {
      gsap.set(captionRef.current, { opacity: 0, y: 6 });
    }
    if (containerRef.current) {
      gsap.set(containerRef.current, { opacity: 1 });
    }

    const hole = { rx: 0, ry: 0 };
    let currentCx = window.innerWidth / 2;
    let currentCy = window.innerHeight / 2;

    const applyHole = () => {
      if (!containerRef.current) return;
      containerRef.current.style.clipPath = buildEllipticalCutoutPolygon(
        currentCx,
        currentCy,
        hole.rx,
        hole.ry,
        window.innerWidth,
        window.innerHeight
      );
    };

    const tl = gsap.timeline({ paused: true, onComplete: finish });
    let currentTime = 0.16;

    strokeRefs.current.forEach((el, idx) => {
      if (!el) return;
      const len = el.getTotalLength() + 2;
      const drawDuration = LETTER_PATHS[idx].capital ? 0.28 : 0.18;
      const fillEl = fillRefs.current[idx];
      const tracker = { progress: 0 };

      tl.set(el, { opacity: 1 }, currentTime);
      tl.to(el, { strokeDashoffset: 0, duration: drawDuration, ease: "power1.inOut" }, currentTime);

      if (penTip) {
        tl.add(() => {
          if (!active) return;
          const startPt = el.getPointAtLength(0);
          gsap.set(penTip, { x: startPt.x, y: startPt.y, opacity: 1 });
        }, currentTime);

        tl.to(
          tracker,
          {
            progress: 1,
            duration: drawDuration,
            ease: "power1.inOut",
            onUpdate: () => {
              if (!active || !penTip) return;
              const pt = el.getPointAtLength(Math.min(tracker.progress * len, len));
              gsap.set(penTip, { x: pt.x, y: pt.y });
            },
          },
          currentTime
        );
      }

      if (fillEl) {
        tl.to(
          fillEl,
          { opacity: 1, scale: 1, duration: 0.28, ease: "power2.out" },
          currentTime + drawDuration * 0.62
        );
      }

      tl.to(el, { opacity: 0.32, duration: 0.22, ease: "power1.out" }, currentTime + drawDuration * 0.75);

      const advance = idx === 4 ? 0.19 : 0.12; // Slight pause between Brain and Drop
      currentTime += advance;
    });

    if (penTip) {
      tl.to(penTip, { opacity: 0, scale: 0.5, duration: 0.22, ease: "power2.in" }, currentTime + 0.04);
    }

    if (captionRef.current) {
      tl.to(captionRef.current, { opacity: 0.72, y: 0, duration: 0.45, ease: "power2.out" }, currentTime + 0.06);
    }

    const finishLettersTime = currentTime + 0.52;

    tl.add(() => {
      const m = measureHole(svgRef.current, oAnchorRef.current);
      currentCx = m.cx;
      currentCy = m.cy;
    }, finishLettersTime);

    tl.to(
      hole,
      {
        rx: () => {
          const m = measureHole(svgRef.current, oAnchorRef.current);
          currentCx = m.cx;
          currentCy = m.cy;
          return m.rx;
        },
        ry: () => measureHole(svgRef.current, oAnchorRef.current).ry,
        duration: 0.34,
        ease: "power2.out",
        onUpdate: applyHole,
      },
      finishLettersTime + 0.04
    );

    const peekPauseTime = finishLettersTime + 0.04 + 0.34 + 0.3;

    tl.add(triggerReveal, peekPauseTime);

    tl.to(
      hole,
      {
        rx: () => measureHole(svgRef.current, oAnchorRef.current).maxRadius,
        ry: () => measureHole(svgRef.current, oAnchorRef.current).maxRadius,
        duration: 0.52,
        ease: irisEase,
        onUpdate: applyHole,
      },
      peekPauseTime
    );

    tl.add(finish);

    startFrame = requestAnimationFrame(() => {
      if (active && !completedRef.current) tl.play();
    });

    const handleMotionChange = () => {
      if (motionQuery.matches) {
        tl.kill();
        finish();
      }
    };
    motionQuery.addEventListener("change", handleMotionChange);

    const skip = () => {
      tl.progress(1);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") skip();
    };

    const containerEl = containerRef.current;
    containerEl?.addEventListener("click", skip);
    window.addEventListener("keydown", onKey);

    return () => {
      active = false;
      cancelAnimationFrame(startFrame);
      tl.kill();
      motionQuery.removeEventListener("change", handleMotionChange);
      containerEl?.removeEventListener("click", skip);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      ref={containerRef}
      data-v2-intro-loader
      className="v2-intro"
      aria-hidden="true"
    >
      <div className="v2-intro-inner">
        <svg ref={svgRef} viewBox="52 48 350 92" className="v2-intro-svg">
          <defs>
            <filter id="v2-pen-aura" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="1.8" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="v2-ink-bleed" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.4" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 16 -3"
                result="bleed"
              />
              <feMerge>
                <feMergeNode in="bleed" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <ellipse
            ref={oAnchorRef}
            cx="331.2"
            cy="94.14"
            rx="9.9"
            ry="13.37"
            fill="none"
            stroke="none"
            opacity="0"
            pointerEvents="none"
          />

          {LETTER_PATHS.map((item, idx) => (
            <path
              key={`fill-${item.char}-${idx}`}
              ref={(el) => {
                fillRefs.current[idx] = el;
              }}
              d={item.d}
              fill="currentColor"
              stroke="none"
              filter="url(#v2-ink-bleed)"
            />
          ))}

          {LETTER_PATHS.map((item, idx) => (
            <path
              key={`stroke-${item.char}-${idx}`}
              ref={(el) => {
                strokeRefs.current[idx] = el;
              }}
              d={item.d}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.45"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          <g ref={penTipRef} style={{ willChange: "transform, opacity", pointerEvents: "none" }}>
            <circle r="4.8" fill="var(--v2-acc)" opacity="0.32" filter="url(#v2-pen-aura)" />
            <circle r="2.2" fill="currentColor" opacity="0.92" />
            <circle cx="-0.6" cy="-0.6" r="0.7" fill="var(--bg-primary)" opacity="0.88" />
          </g>
        </svg>

        <p ref={captionRef} className="v2-intro-caption">
          {caption}
        </p>
      </div>
    </div>
  );
}
