"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { RollingNumberCounter } from "@/components/ui/RollingNumberCounter";
import { NaturalTypewriter } from "@/components/ui/NaturalTypewriter";

gsap.registerPlugin(ScrollTrigger);

/* ==========================================================================
   CHAPTER 1: ORDINARY THOUGHTS (Zero-Card Narrative + Timeline Screenshot)
   ========================================================================== */
export function OrdinaryThoughts() {
  const containerRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    const photo = photoRef.current;
    if (!el || !photo) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        photo,
        { y: 40, opacity: 0.8 },
        {
          y: -30,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1.2,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section id="ordinary" ref={containerRef} className="lm-chapter" aria-labelledby="ordinary-title">
      <div className="lm-container">
        <p className="lm-kicker">CHAPTER I · ORDINARY THOUGHTS</p>

        <div className="lm-ordinary-grid">
          <div>
            <h2 id="ordinary-title" className="lm-title">
              Every thought,<br />
              <em>worth keeping.</em>
            </h2>
            <div className="mt-8 space-y-4">
              <p className="lm-ordinary-quote">
                &ldquo;Give your curiosity somewhere to land. Capture what matters, connect your ideas, and turn fleeting sparks into lasting knowledge.&rdquo;
              </p>
              <p className="lm-copy">
                Traditional note apps demand tags, folders, and rigid hierarchies before you even write your first sentence. BrainDrop AI removes the friction — your raw notes are held quietly, private on your machine, ready for serendipitous rediscovery.
              </p>
            </div>
          </div>

          <div ref={photoRef} className="lm-photo">
            <Image
              src="/timeline-desktop-dark.png"
              alt="BrainDrop AI Timeline View of Notes and Ideas"
              fill
              sizes="(max-width: 1023px) 90vw, 45vw"
              className="lm-photo-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   CHAPTER 3: KNOWLEDGE TAKING SHAPE (Constellation with Glowing Pulse)
   ========================================================================== */
const CONSTELLATION = {
  primary: "M60 190 L130 100 L220 80 L320 130 L450 70 L390 220 L320 130 L60 190",
  secondary: "M130 100 L320 130 M220 80 L390 220 M450 70 L460 170 L390 220",
  stars: [
    { cx: 60, cy: 190, r: 5, label: "Capture" },
    { cx: 220, cy: 80, r: 6, label: "Nano AI" },
    { cx: 450, cy: 70, r: 5, label: "Synthesis" },
    { cx: 390, cy: 220, r: 5, label: "Recall" },
  ],
  minor: [
    { cx: 130, cy: 100, r: 2.5 },
    { cx: 320, cy: 130, r: 3 },
    { cx: 460, cy: 170, r: 2 },
  ],
};

export function KnowledgeTakingShape() {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowPathRef = useRef<SVGPathElement>(null);
  const [litStar, setLitStar] = useState<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    const glowPath = glowPathRef.current;
    if (!el || !glowPath) return;

    const L = glowPath.getTotalLength();
    const beamLen = Math.max(80, L * 0.24);

    glowPath.style.strokeDasharray = `${beamLen} ${L * 2}`;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 3.5 });

      tl.set(glowPath, { strokeDashoffset: beamLen, opacity: 0 })
        .to(glowPath, { opacity: 1, duration: 0.3 }, 0)
        .to(
          glowPath,
          {
            strokeDashoffset: -L,
            duration: 3,
            ease: "power1.inOut",
            onUpdate: function () {
              const prog = this.progress();
              if (prog < 0.25) setLitStar(0);
              else if (prog < 0.5) setLitStar(1);
              else if (prog < 0.75) setLitStar(2);
              else setLitStar(3);
            },
          },
          0
        )
        .to(glowPath, { opacity: 0, duration: 0.3 }, 2.7);

      ScrollTrigger.create({
        trigger: el,
        start: "top 75%",
        onEnter: () => tl.play(),
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section id="patterns" ref={containerRef} className="lm-chapter" aria-labelledby="patterns-title">
      <div className="lm-container">
        <p className="lm-kicker">CHAPTER III · THE THREADS BETWEEN THOUGHTS</p>

        <div className="lm-patterns-heading">
          <h2 id="patterns-title" className="lm-title">
            A second brain,<br />
            <em>taking shape.</em>
          </h2>
          <p className="lm-copy">
            Look a little closer. The separate notes start to form an organic map of your intellectual curiosities.
          </p>
        </div>

        <div className="lm-patterns-body">
          <div>
            <p className="lm-meta">CROSS-DOCUMENT CONNECTIONS</p>
            <span className="lm-huge-number">
              <RollingNumberCounter value={1280} suffix="+" />
            </span>
            <p className="font-serif text-3xl mt-4">
              connections synthesized across <em>your vault.</em>
            </p>
            <div className="mt-8 overflow-hidden rounded border border-[rgba(255,255,255,0.08)]">
              <Image
                src="/insights-desktop-dark.png"
                alt="BrainDrop AI Visual Insights Analysis"
                width={700}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          <div className="lm-pattern-orbit" aria-hidden="true">
            <svg viewBox="0 0 520 300">
              {/* Base constellation lines */}
              <path d={CONSTELLATION.primary} />
              <path d={CONSTELLATION.secondary} strokeOpacity={0.3} />

              {/* Traveling Glowing Beam */}
              <path ref={glowPathRef} className="lm-orbit-glow-path" d={CONSTELLATION.primary} />

              {/* Minor Stars */}
              {CONSTELLATION.minor.map((m, i) => (
                <circle key={i} cx={m.cx} cy={m.cy} r={m.r} fill="#8C9EAA" opacity={0.6} />
              ))}

              {/* Major Stars */}
              {CONSTELLATION.stars.map((s, i) => (
                <g key={i}>
                  <circle
                    cx={s.cx}
                    cy={s.cy}
                    r={s.r}
                    className={`lm-orbit-star ${litStar === i ? "is-lit" : ""}`}
                  />
                  <text
                    x={s.cx}
                    y={s.cy + 18}
                    textAnchor="middle"
                    fill={litStar === i ? "#FFFFFF" : "#8C9EAA"}
                    fontSize="11"
                    fontFamily="var(--font-sans)"
                    letterSpacing="0.08em"
                    className="uppercase select-none"
                  >
                    {s.label.toUpperCase()}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   CHAPTER 4: DISCOVERIES & ACTIVE RECALL (Reflection Screenshot)
   ========================================================================== */
export function Discoveries() {
  return (
    <section id="firsts" className="lm-chapter" aria-labelledby="discoveries-title">
      <div className="lm-container">
        <p className="lm-kicker">CHAPTER IV · ACTIVE RECALL & RETRIEVAL</p>

        <h2 id="discoveries-title" className="lm-title">
          Make what you learn<br />
          <em>stay.</em>
        </h2>

        <div className="lm-firsts-gallery">
          <div>
            <div className="lm-card-peek">
              <span className="text-xs font-mono tracking-wider text-[#64748b]">SPACED RETRIEVAL PRACTICE</span>
              <h3>What does active recall ask you to do?</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Retrieve an idea from internal memory first, then compare with what you missed. It transforms passive reading into lasting neural pathways.
              </p>
              <div className="mt-4 pt-4 border-t border-[#d1d5db] flex justify-between text-xs font-mono text-[#64748b]">
                <span>BOX 3 · LEITNER</span>
                <span>REVIEWED TODAY</span>
              </div>
            </div>
            <p className="lm-copy mt-8">
              Turn an insight into a reflective question. Practice remembering, then return to it when your brain needs a natural refresh.
            </p>
          </div>

          <div className="overflow-hidden rounded border border-[rgba(255,255,255,0.08)] shadow-2xl">
            <Image
              src="/reflection-desktop-dark.png"
              alt="BrainDrop AI Spaced Reflection & Active Recall Interface"
              width={900}
              height={600}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   CHAPTER 5: REDISCOVERY (Conversational AI + Natural Typewriter)
   ========================================================================== */
export function Rediscovery() {
  return (
    <section id="rediscovery" className="lm-chapter" aria-labelledby="rediscovery-title">
      <div className="lm-container">
        <p className="lm-kicker">CHAPTER V · HYBRID INTELLIGENCE</p>

        <h2 id="rediscovery-title" className="lm-title">
          Quiet intelligence.<br />
          <em>When you need it.</em>
        </h2>

        <div className="lm-rediscovery-stage">
          <div className="overflow-hidden rounded border border-[rgba(255,255,255,0.08)] shadow-2xl">
            <Image
              src="/chat-desktop-dark.png"
              alt="BrainDrop AI Conversational Research Assistant"
              width={1000}
              height={600}
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="lm-ai-dialog">
            <span className="lm-meta">AI SYNTHESIS REFLECTION</span>
            <blockquote>
              <NaturalTypewriter
                text="Based on your 14 notes on cognitive architectures and hybrid inference: The common thread is local sandboxing. You consistently prioritize zero data leakage for private drafts, leveraging cloud reasoning solely for high-density multi-document synthesis."
                speedMultiplier={1.5}
                cursorClassName="bg-[var(--archive-accent)]"
              />
            </blockquote>
            <p className="lm-copy">
              Two ways to work with your ideas brought together: small private tasks on-device, and deeper synthesis with cloud AI when requested.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   FOOTER (Closing Quiet Reflection)
   ========================================================================== */
export function EditorialFooter() {
  return (
    <footer id="closing" className="lm-closing">
      <div className="lm-container">
        <p className="lm-closing-quote">
          Great ideas start with a little <em>quiet space.</em><br />
          From now on, keep what matters.
        </p>

        <div className="lm-footer-nav">
          <div>
            <span className="font-serif text-xl tracking-tight text-[var(--archive-ink)]">
              braindrop <em className="italic text-[var(--archive-accent)]">/ ai</em>
            </span>
            <p className="text-xs text-[var(--archive-muted)] mt-1">
              Built by{" "}
              <a href="https://tinonurcahya.dev" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--archive-accent)]">
                Tino Nurcahya
              </a>{" "}
              · Google #BuildHybridAI 2026
            </p>
          </div>

          <div className="flex gap-8">
            <Link href="/notes" className="hover:text-[var(--archive-accent)] transition-colors">
              Workspace <ArrowUpRight size={13} className="inline ml-1" />
            </Link>
            <a
              href="https://github.com/TinoNurcahya/brain-drop-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--archive-accent)] transition-colors"
            >
              GitHub <ArrowUpRight size={13} className="inline ml-1" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
