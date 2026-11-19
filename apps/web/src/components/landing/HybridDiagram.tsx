"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cpu, Cloud, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function HybridDiagram() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: svg,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });

      // 1. Device node
      tl.fromTo(
        ".diag-node-device",
        { scale: 0, opacity: 0, transformOrigin: "center" },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      );

      // 2. Path from device to router
      tl.fromTo(
        ".diag-path-1",
        { strokeDashoffset: 180 },
        { strokeDashoffset: 0, duration: 0.55, ease: "power2.inOut" },
        "-=0.15"
      );

      // 3. Router node
      tl.fromTo(
        ".diag-node-router",
        { scale: 0, opacity: 0, transformOrigin: "center" },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
        "-=0.15"
      );

      // 4. Path from router to cloud
      tl.fromTo(
        ".diag-path-2",
        { strokeDashoffset: 180 },
        { strokeDashoffset: 0, duration: 0.55, ease: "power2.inOut" },
        "-=0.15"
      );

      // 5. Cloud node
      tl.fromTo(
        ".diag-node-cloud",
        { scale: 0, opacity: 0, transformOrigin: "center" },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
        "-=0.15"
      );

      // 6. Labels fade in
      tl.fromTo(
        ".diag-label",
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" },
        "-=0.3"
      );

      // 7. Flowing data dots pulse
      tl.fromTo(
        ".diag-dot",
        { opacity: 0 },
        { opacity: 1, duration: 0.3, stagger: 0.15 }
      );
    }, svg);

    return () => ctx.revert();
  }, []);

  return (
    <div className="hybrid-diagram-wrap">
      <svg
        ref={svgRef}
        viewBox="0 0 760 240"
        className="hybrid-diagram"
        role="img"
        aria-label="Hybrid AI architecture: On-device processing routes to cloud when needed"
      >
        {/* Device Node */}
        <g className="diag-node-device">
          <rect
            x="20"
            y="65"
            width="180"
            height="110"
            rx="16"
            fill="var(--accent-soft)"
            stroke="var(--accent-emerald)"
            strokeWidth="1.5"
          />
          <text
            x="110"
            y="108"
            textAnchor="middle"
            fill="var(--accent-emerald)"
            fontSize="14"
            fontWeight="600"
          >
            On-Device
          </text>
          <text
            x="110"
            y="128"
            textAnchor="middle"
            fill="var(--text-muted)"
            fontSize="11"
          >
            Gemini Nano 4
          </text>
          <text
            x="110"
            y="148"
            textAnchor="middle"
            fill="var(--accent-emerald)"
            fontSize="10"
            fontWeight="500"
          >
            ~50ms · Private · Free
          </text>
        </g>

        {/* Path Device → Router */}
        <path
          className="diag-path-1"
          d="M200 120 L290 120"
          stroke="var(--accent-emerald)"
          strokeWidth="2"
          strokeDasharray="180"
          fill="none"
          opacity="0.7"
        />
        {/* Animated dot on path 1 */}
        <circle className="diag-dot" r="4" fill="var(--accent-emerald)" opacity="0">
          <animateMotion dur="1.8s" repeatCount="indefinite" path="M200 120 L290 120" />
        </circle>

        {/* Router Node */}
        <g className="diag-node-router">
          <rect
            x="290"
            y="75"
            width="180"
            height="90"
            rx="16"
            fill="var(--bg-tertiary)"
            stroke="var(--accent-cyan)"
            strokeWidth="1.5"
          />
          <text
            x="380"
            y="112"
            textAnchor="middle"
            fill="var(--accent-cyan)"
            fontSize="14"
            fontWeight="600"
          >
            Smart Router
          </text>
          <text
            x="380"
            y="132"
            textAnchor="middle"
            fill="var(--text-muted)"
            fontSize="11"
          >
            Firebase AI Logic
          </text>
          <text
            x="380"
            y="150"
            textAnchor="middle"
            fill="var(--text-muted)"
            fontSize="10"
          >
            Routes by task type
          </text>
        </g>

        {/* Path Router → Cloud */}
        <path
          className="diag-path-2"
          d="M470 120 L560 120"
          stroke="var(--accent-blue)"
          strokeWidth="2"
          strokeDasharray="180"
          fill="none"
          opacity="0.7"
        />
        {/* Animated dot on path 2 */}
        <circle className="diag-dot" r="4" fill="var(--accent-blue)" opacity="0">
          <animateMotion dur="2.2s" repeatCount="indefinite" path="M470 120 L560 120" />
        </circle>

        {/* Cloud Node */}
        <g className="diag-node-cloud">
          <rect
            x="560"
            y="65"
            width="180"
            height="110"
            rx="16"
            fill="var(--accent-soft)"
            stroke="var(--accent-blue)"
            strokeWidth="1.5"
          />
          <text
            x="650"
            y="108"
            textAnchor="middle"
            fill="var(--accent-blue)"
            fontSize="14"
            fontWeight="600"
          >
            Cloud
          </text>
          <text
            x="650"
            y="128"
            textAnchor="middle"
            fill="var(--text-muted)"
            fontSize="11"
          >
            Gemini 3.8 Flash
          </text>
          <text
            x="650"
            y="148"
            textAnchor="middle"
            fill="var(--accent-blue)"
            fontSize="10"
            fontWeight="500"
          >
            ~800ms · Deep · Anonymized
          </text>
        </g>

        {/* Bottom labels */}
        <text
          className="diag-label"
          x="110"
          y="210"
          textAnchor="middle"
          fill="var(--text-muted)"
          fontSize="10"
          opacity="0"
        >
          Summarize · Tag · Search · Link
        </text>
        <text
          className="diag-label"
          x="380"
          y="210"
          textAnchor="middle"
          fill="var(--text-muted)"
          fontSize="10"
          opacity="0"
        >
          Auto-detects task complexity
        </text>
        <text
          className="diag-label"
          x="650"
          y="210"
          textAnchor="middle"
          fill="var(--text-muted)"
          fontSize="10"
          opacity="0"
        >
          Synthesize · Translate · Expand
        </text>
      </svg>
    </div>
  );
}
