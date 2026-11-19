"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BookOpen,
  Brain,
  Cloud,
  Cpu,
  FileText,
  Network,
  Plus,
  Sparkles,
} from "lucide-react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { useTextReveal } from "@/hooks/useTextReveal";
import { useMagnetic } from "@/hooks/useMagnetic";
import { PinnedExperience } from "@/components/landing/PinnedExperience";
import { HybridDiagram } from "@/components/landing/HybridDiagram";
import "./landing.css";

gsap.registerPlugin(ScrollTrigger);

/* ---------- Hero Preview Card ---------- */
function ConceptMap({ compact = false }: { compact?: boolean }) {
  return (
    <svg
      className={`concept-map ${compact ? "compact-map" : ""}`}
      viewBox="0 0 500 280"
      role="img"
      aria-label="Learning connects to active recall, spaced practice, and lasting knowledge"
    >
      <g className="map-lines" fill="none" strokeWidth="1.5">
        <path d="M250 135 C180 135 190 57 100 57" />
        <path d="M250 135 C330 135 300 57 408 57" />
        <path d="M250 135 C160 135 190 232 100 232" />
        <path d="M250 135 C335 135 300 232 400 232" />
        <path d="M100 57 C30 90 35 195 100 232" strokeDasharray="4 6" />
      </g>
      <g className="map-node">
        <rect x="174" y="104" width="152" height="62" rx="31" />
        <text x="250" y="141" textAnchor="middle">
          Learning
        </text>
      </g>
      <g className="map-leaf">
        <rect x="30" y="35" width="145" height="44" rx="8" />
        <text x="102" y="62" textAnchor="middle">
          Active recall
        </text>
        <rect x="330" y="35" width="150" height="44" rx="8" />
        <text x="405" y="62" textAnchor="middle">
          Spaced practice
        </text>
        <rect x="25" y="210" width="160" height="44" rx="8" />
        <text x="105" y="237" textAnchor="middle">
          Retrieval practice
        </text>
        <rect x="320" y="210" width="160" height="44" rx="8" />
        <text x="400" y="237" textAnchor="middle">
          Lasting knowledge
        </text>
      </g>
      <circle cx="174" cy="135" r="4" className="map-dot" />
      <circle cx="326" cy="135" r="4" className="map-dot" />
    </svg>
  );
}

function HeroPreview() {
  return (
    <div className="hero-preview" aria-label="Illustrative knowledge workspace">
      <div className="preview-topline">
        <span>
          <Brain size={16} /> YOUR SECOND BRAIN
        </span>
        <span>Sample collection</span>
      </div>
      <div className="preview-note">
        <div className="preview-note-label">
          <FileText size={15} />
          <span>A small discovery</span>
          <span className="note-corner">Saved thought</span>
        </div>
        <h3>
          Learning is a practice,
          <br />
          not a destination.
        </h3>
        <p>
          Don&apos;t just collect what you read.
          <br />
          Connect it. Question it. Make it yours.
        </p>
        <div className="topic-tags">
          <span>learning</span>
          <span>curiosity</span>
        </div>
      </div>
      <div className="preview-connection">
        <span className="connector-stem" />
        <span>One idea opens another</span>
      </div>
      <ConceptMap compact />
      <div className="preview-bottomline">
        <span>
          <Network size={14} /> A place for connected thinking
        </span>
        <Plus size={16} />
      </div>
    </div>
  );
}

/* ---------- Hero Section ---------- */
function HeroSection() {
  const reduced = useReducedMotion();
  const headingRef = useTextReveal({
    trigger: "load",
    stagger: 0.055,
    y: 50,
    delay: 0.35,
    duration: 0.85,
  });
  const descRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const footnoteRef = useRef<HTMLParagraphElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const eyebrowRuleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      // Eyebrow fade in
      gsap.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.1, ease: "power2.out" }
      );

      // Eyebrow rule width
      gsap.fromTo(
        eyebrowRuleRef.current,
        { width: 0 },
        { width: 28, duration: 0.6, delay: 0.15, ease: "power2.out" }
      );

      // Description
      gsap.fromTo(
        descRef.current,
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, delay: 1.0, ease: "power3.out" }
      );

      // CTA buttons
      if (actionsRef.current) {
        gsap.fromTo(
          actionsRef.current.children,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            delay: 1.15,
            ease: "power3.out",
          }
        );
      }

      // Footnote
      gsap.fromTo(
        footnoteRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, delay: 1.4 }
      );

      // Hero visual parallax on scroll
      if (visualRef.current) {
        gsap.to(visualRef.current, {
          y: -50,
          ease: "none",
          scrollTrigger: {
            trigger: visualRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }
    });

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      className="landing-hero landing-container"
      aria-labelledby="hero-heading"
    >
      <div className="hero-copy">
        <p className="eyebrow" ref={eyebrowRef} style={{ opacity: 0 }}>
          <span className="eyebrow-rule" ref={eyebrowRuleRef} /> A LITTLE SPACE
          FOR A BIGGER MIND
        </p>
        <h1 id="hero-heading" ref={headingRef}>
          Capture
          <br />
          anything.
          <br />
          <span className="hero-accent">Forget nothing.</span>
        </h1>
        <p
          className="hero-description"
          ref={descRef}
          style={{ opacity: 0 }}
        >
          Give your thoughts somewhere to grow. Capture what matters, connect
          your ideas, and turn curiosity into knowledge.
        </p>
        <div
          className="hero-actions"
          ref={actionsRef}
        >
          <Link className="landing-button primary" href="/capture">
            Start capturing <Plus size={18} />
          </Link>
          <a href="#experience" className="landing-button secondary">
            Explore the experience
          </a>
        </div>
        <p
          className="hero-footnote"
          ref={footnoteRef}
          style={{ opacity: 0 }}
        >
          <Cpu size={15} /> On-device when available. Cloud when needed.
        </p>
      </div>

      <div className="hero-visual" ref={visualRef}>
        <div className="hero-orbit" aria-hidden="true" />
        <HeroPreview />
        <div className="visual-caption">
          <span>THINK FREELY. KEEP THE CONNECTIONS.</span>
          <span>BrainDrop AI</span>
        </div>
      </div>
    </section>
  );
}

/* ---------- Principles Strip ---------- */
function PrinciplesStrip() {
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const items = el.querySelectorAll(".principle-item");
      gsap.fromTo(
        items,
        { y: 12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div className="landing-container">
      <div className="principles-strip" ref={stripRef}>
        <span>Built around your curiosity</span>
        <div>
          <span className="principle-item">
            <FileText size={16} /> Capture the spark
          </span>
          <span className="principle-item">
            <Network size={16} /> Connect the dots
          </span>
          <span className="principle-item">
            <BookOpen size={16} /> Keep the knowledge
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Hybrid Section (How it Works) ---------- */
function HybridSection() {
  const headingRef = useTextReveal<HTMLHeadingElement>({
    trigger: "scroll",
    stagger: 0.04,
    y: 35,
  });

  return (
    <section id="how-it-works" className="hybrid-section">
      <div className="landing-container">
        <div className="hybrid-heading">
          <p className="eyebrow">THOUGHTFUL BY DESIGN</p>
          <h2 ref={headingRef}>
            Your thinking space.
            <br />
            <span>With the right kind of help.</span>
          </h2>
          <p>
            Two ways to work with your ideas, brought together in one quiet
            workspace.
          </p>
        </div>

        {/* Animated diagram */}
        <HybridDiagram />

        <div className="hybrid-columns">
          <article>
            <span className="hybrid-icon">
              <Cpu size={25} />
            </span>
            <p className="eyebrow">CLOSE TO YOUR THOUGHTS</p>
            <h3>Small tasks. On your device.</h3>
            <p>
              On supported browsers, built-in AI helps organize and summarize
              notes locally. Availability depends on your browser, device, and
              model setup.
            </p>
            <span className="hybrid-detail">Capture · Organize · Summarize</span>
          </article>
          <article>
            <span className="hybrid-icon">
              <Cloud size={25} />
            </span>
            <p className="eyebrow">ROOM FOR THE BIGGER PICTURE</p>
            <h3>Deeper work. With cloud AI.</h3>
            <p>
              Bring multiple notes into a synthesis or generate study cards with
              cloud assistance. These workflows send relevant content for
              processing.
            </p>
            <span className="hybrid-detail">
              Synthesize · Question · Review
            </span>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ---------- Final CTA Section ---------- */
function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useTextReveal<HTMLHeadingElement>({
    trigger: "scroll",
    stagger: 0.045,
    y: 30,
  });
  const buttonRef = useMagnetic<HTMLAnchorElement>(0.25);
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section,
        { clipPath: "circle(8% at 50% 50%)" },
        {
          clipPath: "circle(100% at 50% 50%)",
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "top 35%",
            scrub: 1,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={sectionRef} className="final-section landing-container">
      <Sparkles size={27} className="final-spark" />
      <p className="eyebrow">FOLLOW YOUR NEXT THOUGHT</p>
      <h2 ref={headingRef}>
        Great ideas start
        <br />
        with a little <span>space.</span>
      </h2>
      <Link
        ref={buttonRef}
        href="/capture"
        className="landing-button primary magnetic"
      >
        Capture your first thought <Plus size={18} />
      </Link>
    </section>
  );
}

/* ---------- Landing Page ---------- */
export default function LandingPage() {
  useSmoothScroll();

  return (
    <div className="landing">
      <HeroSection />
      <PrinciplesStrip />

      <section
        id="experience"
        className="experience-section"
        aria-label="Explore Capture, Connect, and Recall"
      >
        <PinnedExperience />
      </section>

      <HybridSection />
      <FinalCTA />

      <footer className="landing-footer landing-container">
        <Link href="/" className="brand">
          <Brain size={21} />
          <span>
            braindrop
            <span className="brand-ai"> / ai</span>
          </span>
        </Link>
        <p>
          Built by{" "}
          <a
            href="https://tinonurcahya.dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tino Nurcahya
          </a>
          <span>Google #BuildHybridAI 2026</span>
        </p>
        <div>
          <Link href="/notes">Workspace</Link>
          <a
            href="https://github.com/TinoNurcahya/brain-drop-ai"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
