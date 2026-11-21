"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SpatialHUD } from "./SpatialHUD";
import { HeroNeuralConstellation } from "./HeroNeuralConstellation";
import { InteractiveSimulators } from "./InteractiveSimulators";
import "@/styles/spatial-canvas.css";

gsap.registerPlugin(ScrollTrigger);

export function SpatialCanvasJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cameraRigRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [currentWaypoint, setCurrentWaypoint] = useState(0);
  const [isHudVisible, setIsHudVisible] = useState(true);

  const handleSelectWaypoint = (idx: number) => {
    const tl = timelineRef.current;
    if (!tl || !tl.scrollTrigger) return;
    const st = tl.scrollTrigger;
    const targetY = st.start + (idx / 4) * (st.end - st.start);
    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  };

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const cameraRig = cameraRigRef.current;
    if (!stage || !cameraRig) return;

    const mm = gsap.matchMedia();

    // Cinematic scrub camera voyage for screens >= 768px
    mm.add("(min-width: 768px)", () => {
      const computeWaypoints = (vw: number, vh: number) => {
        const isNarrow = vw < 1320;
        const targetX = Math.round(vw * (isNarrow ? 0.70 : 0.68));
        const targetY = Math.round(vh / 2);

        const calcCam = (nodeCenterX: number, nodeCenterY: number, scale: number) => ({
          x: Math.round(targetX - nodeCenterX * scale),
          y: Math.round(targetY - nodeCenterY * scale),
          scale,
        });

        return [
          // Waypoint 0: Hero Neural Constellation & Living Nexus (center: 1630, 525)
          calcCam(1630, 525, isNarrow ? 0.88 : 0.95),

          // Waypoint 1: Frictionless Capture (Dashboard & Timeline envelope center: 3280, 1480)
          calcCam(3280, 1480, isNarrow ? 0.82 : 0.88),

          // Waypoint 2: Autonomous Knowledge Graph (node center: 4800, 750)
          calcCam(4800, 750, isNarrow ? 0.88 : 0.95),

          // Waypoint 3: Deep Hybrid Synthesis (Chat & Insights envelope center: 6310, 1500)
          calcCam(6310, 1500, isNarrow ? 0.82 : 0.88),

          // Waypoint 4: Memory Horizon & Active Retrieval Study Cards (node center: 4600, 2540)
          calcCam(4600, 2540, isNarrow ? 0.88 : 0.95),
        ];
      };

      const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
      const vh = typeof window !== "undefined" ? window.innerHeight : 900;
      const waypoints = computeWaypoints(vw, vh);

      // Set initial camera coordinates
      gsap.set(cameraRig, {
        transformOrigin: "0 0",
        x: waypoints[0].x,
        y: waypoints[0].y,
        scale: waypoints[0].scale,
      });

      // Scrubbed Pinned Timeline (3600px of scrollable voyage)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "+=3600",
          pin: true,
          pinSpacing: true,
          scrub: 1.2,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.2) setCurrentWaypoint(0);
            else if (p < 0.42) setCurrentWaypoint(1);
            else if (p < 0.68) setCurrentWaypoint(2);
            else if (p < 0.88) setCurrentWaypoint(3);
            else setCurrentWaypoint(4);

            // Fade out the fixed HUD gracefully as we descend into editorial essays
            setIsHudVisible(p < 0.96);
          },
        },
      });

      timelineRef.current = tl;

      // Camera Glide between Waypoints
      tl.to(cameraRig, {
        transformOrigin: "0 0",
        x: waypoints[1].x,
        y: waypoints[1].y,
        scale: waypoints[1].scale,
        duration: 1,
        ease: "power2.inOut",
      })
        .to(".synapse-0-1", { strokeDashoffset: 0, opacity: 1, duration: 0.5 }, "-=0.4")
        .to(cameraRig, {
          transformOrigin: "0 0",
          x: waypoints[2].x,
          y: waypoints[2].y,
          scale: waypoints[2].scale,
          duration: 1.1,
          ease: "power2.inOut",
        })
        .to(".synapse-1-2", { strokeDashoffset: 0, opacity: 1, duration: 0.5 }, "-=0.4")
        .to(cameraRig, {
          transformOrigin: "0 0",
          x: waypoints[3].x,
          y: waypoints[3].y,
          scale: waypoints[3].scale,
          duration: 1.2,
          ease: "power2.inOut",
        })
        .to(".synapse-2-3", { strokeDashoffset: 0, opacity: 1, duration: 0.5 }, "-=0.4")
        .to(cameraRig, {
          transformOrigin: "0 0",
          x: waypoints[4].x,
          y: waypoints[4].y,
          scale: waypoints[4].scale,
          duration: 1.3,
          ease: "power2.inOut",
        })
        .to(".synapse-loop", { strokeDashoffset: 0, opacity: 0.8, duration: 0.6 }, "-=0.5");
    });

    const rafId = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    let resizeTimer: NodeJS.Timeout | null = null;
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
      mm.revert();
      timelineRef.current = null;
    };
  }, []);

  return (
    <div ref={containerRef} id="canvas-journey" className="spatial-journey-root">
      {/* ====================================================================
          DESKTOP: FULL PINNED CINEMATIC SPATIAL CANVAS
          ==================================================================== */}
      <div className="hidden md:block">
        <div ref={stageRef} className="spatial-pin-stage">
          {/* Ambient Cosmic Dust */}
          <div className="spatial-cosmic-dust" aria-hidden="true" />

          {/* Endless Grid Coordinates */}
          <div className="spatial-grid-mesh" aria-hidden="true" />

          {/* Atmospheric Scrim Protecting Left Typography Zone */}
          <div className="spatial-hud-scrim" aria-hidden="true" />

          {/* Virtual 7600px Camera Rig */}
          <div ref={cameraRigRef} className="spatial-camera-rig">
            {/* SVG Glowing Synapse Connections */}
            <svg className="spatial-synapses-svg" aria-hidden="true">
              <defs>
                <linearGradient id="synapse-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6edbb3" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#79d9de" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#77b6ff" stopOpacity="0.3" />
                </linearGradient>
                <filter id="synapse-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Synapse Path 0 -> 1 */}
              <path
                className="spatial-synapse-path synapse-0-1 active"
                d="M 2000 525 C 2240 525, 2360 1420, 2600 1420"
                filter="url(#synapse-glow)"
              />

              {/* Synapse Path 1 -> 2 */}
              <path
                className="spatial-synapse-path synapse-1-2"
                d="M 3960 1500 C 4180 1500, 4220 750, 4400 750"
                filter="url(#synapse-glow)"
              />

              {/* Synapse Path 2 -> 3 */}
              <path
                className="spatial-synapse-path synapse-2-3"
                d="M 5200 750 C 5500 750, 5550 1450, 5800 1450"
                filter="url(#synapse-glow)"
              />

              {/* Synapse Path 3 -> 4 */}
              <path
                className="spatial-synapse-path synapse-loop"
                d="M 6820 1500 C 6200 2350, 5500 2540, 5000 2540"
                filter="url(#synapse-glow)"
              />
            </svg>

            {/* WAYPOINT 0: Cognitive Nexus & Living Neural Architecture (Hero Voyage) */}
            <div
              className="spatial-node spatial-hero-showcase"
              style={{
                left: 1260,
                top: 280,
                width: 740,
                height: 490,
              }}
            >
              <div className="spatial-node-header">
                <div className="spatial-node-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <span>Cognitive Nexus · Hybrid Neural Architecture</span>
                <span className="text-[var(--accent-emerald)] font-medium">Gemini Nano · ~48ms Latency</span>
              </div>
              <div className="spatial-node-body" style={{ height: 446, position: "relative" }}>
                <HeroNeuralConstellation embedded visible />
              </div>
            </div>

            {/* WAYPOINT 1: Frictionless Capture */}
            <div
              className="spatial-node"
              style={{
                left: 2600,
                top: 1200,
                width: 760,
              }}
            >
              <div className="spatial-node-header">
                <div className="spatial-node-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <span>Workspace Dashboard</span>
                <span className="text-[var(--accent-emerald)] font-medium">Latency: ~48ms</span>
              </div>
              <div className="spatial-node-body">
                <Image
                  src="/dashboard-desktop-dark.png"
                  alt="BrainDrop AI Research Workspace Dashboard"
                  width={1400}
                  height={800}
                  priority
                  className="spatial-node-img"
                />
              </div>
            </div>

            <div
              className="spatial-node"
              style={{
                left: 3260,
                top: 1420,
                width: 700,
              }}
            >
              <div className="spatial-node-header">
                <div className="spatial-node-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <span>Stream of Thought Timeline</span>
                <span className="text-[var(--accent-emerald)] font-medium">Zero Hierarchy</span>
              </div>
              <div className="spatial-node-body">
                <Image
                  src="/timeline-desktop-dark.png"
                  alt="BrainDrop AI Stream of Consciousness Timeline"
                  width={1200}
                  height={700}
                  className="spatial-node-img"
                />
              </div>
            </div>

            {/* Floating Spark near Waypoint 1 */}
            <div
              className="spatial-spark-card"
              style={{ left: 3040, top: 1820, maxWidth: 320 }}
            >
              <span className="spatial-spark-tag">Client Intelligence</span>
              <p className="spatial-spark-quote">
                &ldquo;Spontaneous ideas land instantly. Built-in AI categorizes keywords in background threads.&rdquo;
              </p>
            </div>

            {/* WAYPOINT 2: Topology Formation */}
            <div
              className="spatial-node"
              style={{
                left: 4400,
                top: 500,
                width: 800,
              }}
            >
              <div className="spatial-node-header">
                <div className="spatial-node-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <span>Autonomous Knowledge Graph</span>
                <span className="text-[var(--accent-cyan)] font-medium">1536-Dim Vectors</span>
              </div>
              <div className="spatial-node-body">
                <Image
                  src="/topics-desktop-dark.png"
                  alt="BrainDrop AI Force-Directed Topic Graph"
                  width={1300}
                  height={750}
                  className="spatial-node-img"
                />
              </div>
            </div>

            {/* WAYPOINT 3: Deep Hybrid Synthesis */}
            <div
              className="spatial-node"
              style={{
                left: 5800,
                top: 1300,
                width: 500,
              }}
            >
              <div className="spatial-node-header">
                <div className="spatial-node-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <span>Cross-Document AI Synthesis</span>
                <span className="text-[var(--accent-cyan)] font-medium">Gemini 3.8 Flash</span>
              </div>
              <div className="spatial-node-body">
                <Image
                  src="/chat-desktop-dark.png"
                  alt="BrainDrop AI Hybrid Conversational Synthesizer"
                  width={1200}
                  height={700}
                  className="spatial-node-img"
                />
              </div>
            </div>

            <div
              className="spatial-node"
              style={{
                left: 6340,
                top: 1300,
                width: 480,
              }}
            >
              <div className="spatial-node-header">
                <div className="spatial-node-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <span>Thematic Synthesis Clusters</span>
                <span className="text-[var(--accent-cyan)] font-medium">Multi-Doc Reasoning</span>
              </div>
              <div className="spatial-node-body">
                <Image
                  src="/insights-desktop-dark.png"
                  alt="BrainDrop AI Synthesis Insights Analytics"
                  width={1200}
                  height={650}
                  className="spatial-node-img"
                />
              </div>
            </div>

            {/* WAYPOINT 4: Memory Horizon & Retrieval */}
            <div
              className="spatial-node"
              style={{
                left: 4200,
                top: 2300,
                width: 800,
              }}
            >
              <div className="spatial-node-header">
                <div className="spatial-node-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <span>Active Retrieval & Study Cards</span>
                <span className="text-[#c3a0ef] font-medium">Leitner Curve</span>
              </div>
              <div className="spatial-node-body">
                <Image
                  src="/reflection-desktop-dark.png"
                  alt="BrainDrop AI Spaced Retrieval and Reflection"
                  width={1300}
                  height={720}
                  className="spatial-node-img"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Fixed HUD Navigation Overlay */}
        <SpatialHUD
          currentWaypoint={currentWaypoint}
          onSelectWaypoint={handleSelectWaypoint}
          visible={isHudVisible}
        />
      </div>

      {/* ====================================================================
          MOBILE: RESPONSIVE ADAPTIVE SHOWCASE FLOW (<768px)
          ==================================================================== */}
      <div className="block md:hidden">
        {/* Mobile Hero */}
        <section className="px-5 pt-24 pb-12">
          <div className="max-w-lg mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] text-[11px] font-mono text-[var(--accent-emerald)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-emerald)] animate-pulse" />
              <span>GEMINI NANO ON-DEVICE · 48MS</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif tracking-tight text-[var(--spatial-text-main)] leading-tight">
              Capture anything. <br />
              <em className="text-[var(--accent-cyan)] italic">Forget nothing.</em>
            </h1>

            <p className="text-sm text-[var(--spatial-text-muted)] leading-relaxed">
              The privacy-first hybrid second brain. Process private notes on-device with Gemini Nano, 
              and synthesize complex research with cloud intelligence.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/notes"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm bg-[var(--accent-cyan)] text-[#0b1116] hover:bg-[#a0f0f4] transition-all shadow-[0_0_20px_rgba(121,217,222,0.35)]"
              >
                <span>Launch Workspace</span>
                <ArrowUpRight size={16} />
              </Link>
              <Link
                href="/capture"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
              >
                <span>Quick Capture Note</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Mobile Milestones Stack */}
        <section className="px-4 space-y-6 pb-12 max-w-lg mx-auto">
          {/* Milestone 1: Dashboard */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]/90 backdrop-blur-xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--accent-emerald)] font-semibold">Workspace Dashboard</span>
              <span className="text-[var(--spatial-text-muted)]">~48ms Latency</span>
            </div>
            <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[#0b1116]">
              <Image
                src="/dashboard-desktop-dark.png"
                alt="BrainDrop Workspace"
                width={800}
                height={460}
                className="w-full h-auto"
              />
            </div>
            <p className="text-xs text-[var(--spatial-text-muted)] leading-relaxed">
              Zero folder hierarchies. Local Gemini Nano parses unstructured research notes directly on your device NPU without network latency.
            </p>
          </div>

          {/* Milestone 2: Knowledge Graph */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]/90 backdrop-blur-xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--accent-cyan)] font-semibold">Autonomous Knowledge Graph</span>
              <span className="text-[var(--spatial-text-muted)]">1536-Dim Vectors</span>
            </div>
            <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[#0b1116]">
              <Image
                src="/topics-desktop-dark.png"
                alt="BrainDrop Knowledge Graph"
                width={800}
                height={460}
                className="w-full h-auto"
              />
            </div>
            <p className="text-xs text-[var(--spatial-text-muted)] leading-relaxed">
              Your thoughts form an organic knowledge graph. Related passages, concepts, and papers link autonomously through neural proximity.
            </p>
          </div>

          {/* Milestone 3: Synthesis Studio */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]/90 backdrop-blur-xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--accent-cyan)] font-semibold">Cross-Document AI Synthesis</span>
              <span className="text-[var(--spatial-text-muted)]">Gemini 3.8 Flash</span>
            </div>
            <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[#0b1116]">
              <Image
                src="/chat-desktop-dark.png"
                alt="BrainDrop Synthesis"
                width={800}
                height={460}
                className="w-full h-auto"
              />
            </div>
            <p className="text-xs text-[var(--spatial-text-muted)] leading-relaxed">
              When research demands macroscopic understanding, Gemini 3.8 Flash fuses disparate threads into cohesive literature reviews.
            </p>
          </div>

          {/* Milestone 4: Active Recall */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]/90 backdrop-blur-xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#c3a0ef] font-semibold">Active Retrieval & Study Cards</span>
              <span className="text-[var(--spatial-text-muted)]">Leitner Curve</span>
            </div>
            <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[#0b1116]">
              <Image
                src="/reflection-desktop-dark.png"
                alt="BrainDrop Reflection"
                width={800}
                height={460}
                className="w-full h-auto"
              />
            </div>
            <p className="text-xs text-[var(--spatial-text-muted)] leading-relaxed">
              Invert the forgetting curve with spaced retrieval flashcards and active testing generated from your verified vault notes.
            </p>
          </div>
        </section>
      </div>

      {/* Interactive Intelligence Playground (Web Clipper & Vector Similarity Simulators) */}
      <InteractiveSimulators />

      {/* Clean Minimal Finale & Footer */}
      <SpatialCanvasFinale />
    </div>
  );
}

function SpatialCanvasFinale() {
  return (
    <footer className="spatial-finale" aria-labelledby="finale-title">
      <div className="spatial-finale-container">
        <div className="finale-content">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--spatial-border)] bg-[var(--spatial-surface)] text-[11px] font-mono text-[var(--spatial-cyan)] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--spatial-cyan)] animate-pulse" />
            <span>HYBRID SECOND BRAIN · GEMINI NANO + CLOUD</span>
          </div>

          <h2 id="finale-title" className="finale-headline">
            Your mind, <br />
            <em>unbroken.</em>
          </h2>

          <p className="finale-subtext">
            Capture spontaneous thoughts instantly on-device with zero cloud footprint, 
            and synthesize macroscopic research when you need deep reasoning.
          </p>

          <div className="finale-actions">
            <Link href="/notes" className="finale-cta-primary">
              <span>Launch Workspace</span>
              <ArrowUpRight size={16} />
            </Link>
            <Link href="/capture" className="finale-cta-secondary">
              <span>Quick Capture</span>
            </Link>
          </div>
        </div>

        <div className="finale-bottom-bar">
          <div className="finale-brand-col">
            <span className="font-serif text-lg tracking-tight text-[var(--spatial-text-main)]">
              braindrop <em className="text-[var(--spatial-cyan)] italic">/ ai</em>
            </span>
            <p className="text-xs font-mono text-[var(--spatial-text-muted)] mt-1">
              Google #BuildHybridAI 2026 Hackathon
            </p>
            <p className="text-xs text-[var(--spatial-text-muted)] mt-0.5 opacity-60">
              Open-source Apache 2.0 License.
            </p>
          </div>

          <div className="finale-nav-col">
            <div className="nav-group">
              <span className="nav-group-title">WORKSPACE</span>
              <Link href="/notes">Notes</Link>
              <Link href="/graph">Topology Graph</Link>
              <Link href="/flashcards">Study Cards</Link>
              <Link href="/dashboard">Telemetry Dashboard</Link>
            </div>

            <div className="nav-group">
              <span className="nav-group-title">DEVELOPER</span>
              <a href="https://github.com/tinonurcahya/braindrop-ai" target="_blank" rel="noreferrer">
                GitHub Repository
              </a>
              <a href="https://devpost.com/software/braindrop-ai" target="_blank" rel="noreferrer">
                Devpost Submission
              </a>
              <Link href="/api/clips">API Endpoints</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
