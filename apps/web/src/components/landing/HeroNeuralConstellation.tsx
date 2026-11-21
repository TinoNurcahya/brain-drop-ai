"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Cpu, Database, BookmarkCheck, BrainCircuit } from "lucide-react";

interface ThoughtNode {
  id: string;
  title: string;
  shortLabel: string;
  excerpt: string;
  tag: string;
  badge: string;
  icon: typeof Sparkles;
  accent: string;
  xPercent: number; // base percent X within container
  yPercent: number; // base percent Y within container
  parallaxWeight: number; // parallax multiplier
  connections: string[]; // ids of connected nodes
}

const THOUGHT_NODES: ThoughtNode[] = [
  {
    id: "transformer",
    title: "Attention Is All You Need",
    shortLabel: "Attention",
    excerpt: "Self-attention mechanisms replace recurrence in deep contextual sequence modeling.",
    tag: "#research · transformer",
    badge: "GEMINI FLASH REASONING",
    icon: Sparkles,
    accent: "#79d9de",
    xPercent: 22,
    yPercent: 20,
    parallaxWeight: 0.85,
    connections: ["core", "clipper"],
  },
  {
    id: "nano",
    title: "Local Gemini Nano on NPU",
    shortLabel: "Nano NPU",
    excerpt: "Raw thoughts parsed on-device in ~48ms. Zero data packets dispatched to cloud.",
    tag: "window.ai · on-device",
    badge: "48MS // ZERO LEAK",
    icon: Cpu,
    accent: "#6edbb3",
    xPercent: 78,
    yPercent: 22,
    parallaxWeight: 1.25,
    connections: ["core", "vector"],
  },
  {
    id: "vector",
    title: "Offline Vector Similarity",
    shortLabel: "1536-D Vector",
    excerpt: "Local embedding dot-products in IndexedDB. Autonomous semantic cluster formation.",
    tag: "cosine · indexeddb",
    badge: "SEMANTIC TOPOLOGY",
    icon: Database,
    accent: "#6edbb3",
    xPercent: 80,
    yPercent: 68,
    parallaxWeight: 0.95,
    connections: ["core", "spaced"],
  },
  {
    id: "clipper",
    title: "Chrome MV3 Web Clipper",
    shortLabel: "Web Clipper",
    excerpt: "1-click highlight capture from arXiv and papers straight into cognitive memory.",
    tag: "instant capture · MV3",
    badge: "ACTIVE EXTENSION",
    icon: BookmarkCheck,
    accent: "#efc568",
    xPercent: 20,
    yPercent: 70,
    parallaxWeight: 1.15,
    connections: ["core", "transformer"],
  },
  {
    id: "spaced",
    title: "Spaced Retrieval Recall",
    shortLabel: "Active Recall",
    excerpt: "Ebbinghaus forgetting curve inverted via daily active recall flashcards.",
    tag: "leitner · active recall",
    badge: "SPACED INTERVAL",
    icon: BrainCircuit,
    accent: "#c3a0ef",
    xPercent: 50,
    yPercent: 84,
    parallaxWeight: 0.7,
    connections: ["core"],
  },
];

interface HeroNeuralConstellationProps {
  visible?: boolean;
  embedded?: boolean;
}

export function HeroNeuralConstellation({ visible = true, embedded = false }: HeroNeuralConstellationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [firedNodeId, setFiredNodeId] = useState<string | null>(null);

  // Parallax smooth interpolation
  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const rawNx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const rawNy = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      if (isNaN(rawNx) || isNaN(rawNy)) return;

      mousePos.current = {
        x: Math.max(-1, Math.min(1, rawNx)),
        y: Math.max(-1, Math.min(1, rawNy)),
      };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let t = 0;
    const animate = () => {
      t += 0.015;
      const ambientX = Math.sin(t) * 0.12;
      const ambientY = Math.cos(t * 0.8) * 0.12;

      const targetX = mousePos.current.x + ambientX;
      const targetY = mousePos.current.y + ambientY;

      if (isNaN(currentPos.current.x) || isNaN(currentPos.current.y)) {
        currentPos.current = { x: 0, y: 0 };
      }

      currentPos.current.x += (targetX - currentPos.current.x) * 0.06;
      currentPos.current.y += (targetY - currentPos.current.y) * 0.06;

      const container = containerRef.current;
      if (container) {
        // Shift nodes
        THOUGHT_NODES.forEach((node) => {
          const el = container.querySelector<HTMLElement>(`[data-node-id="${node.id}"]`);
          if (el) {
            const offsetX = (currentPos.current.x || 0) * 16 * node.parallaxWeight;
            const offsetY = (currentPos.current.y || 0) * 16 * node.parallaxWeight;
            el.style.transform = `translate(-50%, -50%) translate3d(${offsetX}px, ${offsetY}px, 0)`;
          }
        });

        // Shift center core
        const coreEl = container.querySelector<HTMLElement>(".constellation-core");
        if (coreEl) {
          const coreOffsetX = (currentPos.current.x || 0) * 6;
          const coreOffsetY = (currentPos.current.y || 0) * 6;
          coreEl.style.transform = `translate(-50%, -50%) translate3d(${coreOffsetX}px, ${coreOffsetY}px, 0)`;
        }
      }

      animFrameId.current = requestAnimationFrame(animate);
    };

    animFrameId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  const handleNodeClick = (id: string) => {
    setFiredNodeId(id);
    setTimeout(() => setFiredNodeId(null), 800);
  };

  // Center coordinate of core inside container (in percentage)
  const coreX = 50;
  const coreY = 46;

  return (
    <div
      ref={containerRef}
      className={`hero-neural-constellation ${embedded ? "constellation-embedded" : ""}`}
      style={
        embedded
          ? {
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              zIndex: 5,
              opacity: 1,
              pointerEvents: "auto",
              overflow: "hidden",
            }
          : {
              position: "fixed",
              top: 0,
              right: 0,
              width: "50vw",
              height: "100vh",
              zIndex: 35,
              opacity: visible ? 1 : 0,
              pointerEvents: visible ? "auto" : "none",
              visibility: visible ? "visible" : "hidden",
              transform: visible ? "scale(1)" : "scale(0.92)",
              transition:
                "opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.45s ease",
            }
      }
      aria-label="Interactive Living Neural Synapse Constellation"
    >
      {/* Ambient Emerald/Cyan Nebula Glow */}
      <div className="constellation-glow-aura" aria-hidden="true" />

      {/* SVG Dynamic Synapse Strands */}
      <svg
        className="constellation-svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="amber-strand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#79d9de" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#6edbb3" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#efc568" stopOpacity="0.1" />
          </linearGradient>

          <filter id="core-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Strands connecting Central Core (50, 46) to each Node */}
        {THOUGHT_NODES.map((node) => {
          const isConnected =
            hoveredNodeId === node.id ||
            hoveredNodeId === "core" ||
            firedNodeId === node.id;

          const startX = coreX;
          const startY = coreY;
          const endX = node.xPercent;
          const endY = node.yPercent;
          const midX = (startX + endX) / 2 + (node.parallaxWeight > 1 ? 3 : -3);
          const midY = (startY + endY) / 2 + (node.parallaxWeight > 1 ? -3 : 3);

          return (
            <g key={`core-to-${node.id}`}>
              <path
                d={`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`}
                className={`constellation-strand ${isConnected ? "strand-active" : ""}`}
                vectorEffect="non-scaling-stroke"
              />
              {/* Traveling Synaptic Energy Pulse */}
              <circle
                r="1.2"
                className={`constellation-pulse-particle ${isConnected ? "pulse-fast" : ""}`}
              >
                <animateMotion
                  path={`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`}
                  dur={isConnected ? "1.4s" : "3.2s"}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          );
        })}

        {/* Inter-Node Synaptic Bridge: Transformer <-> Clipper */}
        <path
          d="M 22 20 C 14 38 14 54 20 70"
          className={`constellation-strand strand-dashed ${
            hoveredNodeId === "transformer" || hoveredNodeId === "clipper" ? "strand-active" : ""
          }`}
          vectorEffect="non-scaling-stroke"
        />

        {/* Inter-Node Synaptic Bridge: Nano <-> Vector */}
        <path
          d="M 78 22 C 86 40 86 54 80 68"
          className={`constellation-strand strand-dashed ${
            hoveredNodeId === "nano" || hoveredNodeId === "vector" ? "strand-active" : ""
          }`}
          vectorEffect="non-scaling-stroke"
        />

        {/* Inter-Node Synaptic Bridge: Clipper <-> Spaced */}
        <path
          d="M 20 70 Q 34 80 50 84"
          className={`constellation-strand strand-dashed ${
            hoveredNodeId === "clipper" || hoveredNodeId === "spaced" ? "strand-active" : ""
          }`}
          vectorEffect="non-scaling-stroke"
        />

        {/* Inter-Node Synaptic Bridge: Vector <-> Spaced */}
        <path
          d="M 80 68 Q 66 80 50 84"
          className={`constellation-strand strand-dashed ${
            hoveredNodeId === "vector" || hoveredNodeId === "spaced" ? "strand-active" : ""
          }`}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Central Synaptic Nucleus: The Second Brain Gravitational Center */}
      <div
        className={`constellation-core ${hoveredNodeId === "core" ? "core-hovered" : ""}`}
        style={{ left: `${coreX}%`, top: `${coreY}%` }}
        onMouseEnter={() => setHoveredNodeId("core")}
        onMouseLeave={() => setHoveredNodeId(null)}
      >
        <div className="core-orbit ring-1" />
        <div className="core-orbit ring-2" />
        <div className="core-beacon">
          <div className="core-beacon-dot" />
        </div>
        <div className="core-label">
          <span className="core-title">Cognitive Nexus</span>
          <span className="core-telemetry">Gemini Hybrid Runtime</span>
        </div>
      </div>

      {/* Minimalist Glowing Orbital Node Beacons */}
      {THOUGHT_NODES.map((node) => {
        const isHovered = hoveredNodeId === node.id;
        const isFired = firedNodeId === node.id;
        const IconComponent = node.icon;

        return (
          <div
            key={node.id}
            data-node-id={node.id}
            className={`constellation-beacon-node ${isHovered ? "beacon-active" : ""} ${
              isFired ? "beacon-fired" : ""
            }`}
            style={{
              left: `${node.xPercent}%`,
              top: `${node.yPercent}%`,
            }}
            onMouseEnter={() => setHoveredNodeId(node.id)}
            onMouseLeave={() => setHoveredNodeId(null)}
            onClick={() => handleNodeClick(node.id)}
            role="button"
            tabIndex={0}
            aria-label={`${node.title} — ${node.shortLabel}`}
          >
            {/* Sleek Circular Glowing Icon Button */}
            <div
              className="beacon-circle"
              style={{
                borderColor: isHovered ? node.accent : `${node.accent}55`,
                boxShadow: isHovered
                  ? `0 0 24px ${node.accent}80, 0 0 10px ${node.accent}`
                  : `0 0 14px ${node.accent}30`,
              }}
            >
              <div
                className="beacon-ping"
                style={{ borderColor: node.accent }}
              />
              <IconComponent size={15} style={{ color: node.accent }} />
            </div>

            {/* Clean Compact Monospace Label */}
            <span
              className="beacon-label"
              style={{ color: isHovered ? node.accent : "var(--spatial-text-secondary)" }}
            >
              {node.shortLabel}
            </span>

            {/* Elegant Floating Glass Popover on Hover (Does not block view) */}
            {isHovered && (
              <div
                className="beacon-popover-card"
                style={{
                  borderTopColor: node.accent,
                }}
              >
                <div className="popover-badge" style={{ color: node.accent }}>
                  {node.badge}
                </div>
                <div className="popover-title">{node.title}</div>
                <div className="popover-desc">{node.excerpt}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
