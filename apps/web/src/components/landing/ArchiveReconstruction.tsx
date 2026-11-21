"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STEPS = ["The fragment", "The extraction", "The topology", "The synthesis"];

const ENTITIES = [
  { kind: "On-Device", label: "Gemini Nano", x: 190, y: 92, width: 220, dotColor: "#E8A838" },
  { kind: "Cloud AI", label: "Gemini 3.8 Flash", x: 710, y: 92, width: 250, dotColor: "#F0BC5A" },
  { kind: "Sandbox", label: "Client PII Shield", x: 190, y: 345, width: 230, dotColor: "#E8C060" },
  { kind: "Topology", label: "Knowledge Graph", x: 710, y: 345, width: 250, dotColor: "#E8A838" },
];

function RelationshipMap() {
  const [hoveredKind, setHoveredKind] = useState<string | null>(null);

  return (
    <div className="lm-reconstruction__map">
      <svg viewBox="0 0 900 440" className="lm-reconstruction__graph" role="img" aria-label="Interactive note entity extraction topology">
        <g className="lm-reconstruction__orbits" aria-hidden="true">
          <ellipse cx="450" cy="220" rx="340" ry="175" />
          <circle cx="450" cy="220" r="115" />
          <path d="M450 15V425M30 220H870" />
        </g>
        <g className="lm-reconstruction__edges" aria-hidden="true">
          {ENTITIES.map((entity) => {
            const isHovered = hoveredKind === entity.kind;
            const isDimmed = hoveredKind !== null && !isHovered;
            return (
              <path
                key={entity.kind}
                d={`M450 220 Q${entity.x} 220 ${entity.x} ${entity.y}`}
                pathLength="1"
                data-graph-edge
                data-active={isHovered ? "true" : undefined}
                data-dimmed={isDimmed ? "true" : undefined}
              />
            );
          })}
        </g>
        <g transform="translate(450 220)">
          <g data-graph-node className="lm-reconstruction__graph-center">
            <circle r="52" />
            <text textAnchor="middle" y="8">Your Note</text>
          </g>
        </g>
        {ENTITIES.map((entity) => {
          const isHovered = hoveredKind === entity.kind;
          const isDimmed = hoveredKind !== null && !isHovered;
          return (
            <g
              key={entity.kind}
              transform={`translate(${entity.x} ${entity.y})`}
              onMouseEnter={() => setHoveredKind(entity.kind)}
              onMouseLeave={() => setHoveredKind(null)}
            >
              <g
                data-graph-node
                className="lm-reconstruction__graph-node"
                data-hovered={isHovered ? "true" : undefined}
                data-dimmed={isDimmed ? "true" : undefined}
              >
                <rect x={-entity.width / 2} y="-46" width={entity.width} height="92" rx="14" />
                <circle cx={-entity.width / 2 + 24} cy="-17" r="4.5" fill={entity.dotColor} />
                <text className="lm-reconstruction__graph-kind" textAnchor="start" x={-entity.width / 2 + 37} y="-13">
                  {entity.kind}
                </text>
                <text className="lm-reconstruction__graph-label" textAnchor="start" x={-entity.width / 2 + 24} y="22">
                  {entity.label}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function ArchiveReconstruction() {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentStep, setCurrentStep] = useState(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia(section);
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const stage = section.querySelector<HTMLElement>(".lm-reconstruction__stage");
      const panels = gsap.utils.toArray<HTMLElement>("[data-reconstruction-panel]", section);
      if (!stage || panels.length !== 4) return;

      gsap.set(panels.slice(1), { autoAlpha: 0, y: 30 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "+=220%",
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.28) setCurrentStep(0);
            else if (p < 0.58) setCurrentStep(1);
            else if (p < 0.85) setCurrentStep(2);
            else setCurrentStep(3);
          },
        },
      });

      tl.to(panels[0], { autoAlpha: 0, y: -25, duration: 0.35 }, 0.25)
        .to(panels[1], { autoAlpha: 1, y: 0, duration: 0.4 }, 0.3)
        .to(panels[1], { autoAlpha: 0, y: -25, duration: 0.35 }, 0.55)
        .to(panels[2], { autoAlpha: 1, y: 0, duration: 0.4 }, 0.6)
        .to(panels[2], { autoAlpha: 0, y: -25, duration: 0.35 }, 0.82)
        .to(panels[3], { autoAlpha: 1, y: 0, duration: 0.45 }, 0.87);
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="reconstruction" className="lm-chapter lm-reconstruction" aria-labelledby="reconstruction-title">
      <div className="lm-reconstruction__stage">
        <div className="lm-container lm-reconstruction__inner">
          <header className="lm-reconstruction__header">
            <div>
              <p className="lm-kicker">CHAPTER II · THE EXTRACTION</p>
              <h2 id="reconstruction-title" className="lm-title">
                A single sentence.<br />
                <em>A connected universe.</em>
              </h2>
            </div>
            <p className="lm-copy">
              A passing insight. An article excerpt. A research hypothesis.<br />
              The connections were waiting all along.
            </p>
          </header>

          <ol className="lm-reconstruction__progress" aria-label="How knowledge takes shape">
            {STEPS.map((step, index) => (
              <li key={step} className={currentStep === index ? "is-current" : ""}>
                <span>{step}</span>
                <i aria-hidden="true" />
              </li>
            ))}
          </ol>

          <div className="lm-reconstruction__panels">
            {/* Step 1: The Fragment */}
            <article className="lm-reconstruction__panel" data-reconstruction-panel>
              <div className="lm-reconstruction__note">
                <div className="lm-meta flex justify-between">
                  <span>UNSTRUCTURED RAW THOUGHT</span>
                  <span>LOCAL ON-DEVICE</span>
                </div>
                <blockquote>
                  &ldquo;Built-in browser AI changes everything: we can parse private research instantly on client NPU, while routing deep cross-document synthesis to the cloud.&rdquo;
                </blockquote>
                <span className="text-xs text-[#5b6768] font-mono">Captured in 48ms · Zero cloud footprint</span>
              </div>
              <p className="lm-copy mt-6">It begins with something you almost didn&apos;t write down.</p>
            </article>

            {/* Step 2: The Extraction */}
            <article className="lm-reconstruction__panel" data-reconstruction-panel>
              <p className="lm-reconstruction__annotated-note">
                Process <mark className="lm-reconstruction__entity-mark">private research</mark> locally on client <mark className="lm-reconstruction__entity-mark">Gemini Nano</mark>, while streaming complex <mark className="lm-reconstruction__entity-mark">multi-document synthesis</mark> through <mark className="lm-reconstruction__entity-mark">Gemini Flash.</mark>
              </p>
              <p className="lm-copy mt-6">Local intelligence automatically extracts concepts, keywords, and entity clusters without leaking data.</p>
            </article>

            {/* Step 3: The Topology */}
            <article className="lm-reconstruction__panel" data-reconstruction-panel>
              <RelationshipMap />
              <p className="lm-copy mt-4">One raw thought. Linked across your entire second brain.</p>
            </article>

            {/* Step 4: The Synthesis (With Topics Screenshot) */}
            <article className="lm-reconstruction__panel" data-reconstruction-panel>
              <div className="w-full max-w-3xl overflow-hidden rounded shadow-2xl border border-[rgba(255,255,255,0.08)] mb-6">
                <Image
                  src="/topics-desktop-dark.png"
                  alt="BrainDrop AI Topic Graph & Entity Synthesis View"
                  width={1400}
                  height={800}
                  className="w-full h-auto object-cover"
                />
              </div>
              <p className="lm-title text-4xl">
                It wasn&apos;t just <em>a note.</em>
              </p>
              <p className="lm-copy mt-3">It is a living node in your intellectual knowledge topology.</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
