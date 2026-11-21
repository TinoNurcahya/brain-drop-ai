"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  Check,
  FileText,
  Network,
  Plus,
  RotateCcw,
  ScanLine,
} from "lucide-react";
import { useTextReveal } from "@/hooks/useTextReveal";

gsap.registerPlugin(ScrollTrigger);

const stages = [
  {
    label: "Capture",
    icon: FileText,
    title: "A thought worth keeping.",
    description:
      "Save a passage, a link, or a thought before it slips away. Give your curiosity a place to land.",
  },
  {
    label: "Connect",
    icon: Network,
    title: "Find the thread between ideas.",
    description:
      "Bring related notes together. Follow shared concepts to see the bigger picture in your research.",
  },
  {
    label: "Recall",
    icon: BookOpen,
    title: "Make what you learn stay.",
    description:
      "Turn an insight into a question. Practice remembering, then return to it when you need a refresh.",
  },
];

/* ---------- SVG Concept Map ---------- */
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

/* ---------- Demo Panels ---------- */
function CapturePanel() {
  return (
    <div className="capture-example">
      <div className="example-source">
        <FileText size={18} />
        <span>FIELD NOTES / LEARNING</span>
      </div>
      <h3>The art of remembering</h3>
      <p>
        Reading is the beginning.{" "}
        <mark>Recalling an idea in your own words</mark> gives you a chance to
        make sense of it.
      </p>
      <div className="example-divider" />
      <p className="example-caption">A thought to come back to</p>
      <div className="topic-tags">
        <span>active recall</span>
        <span>learning</span>
      </div>
    </div>
  );
}

function ConnectPanel() {
  return (
    <div className="connect-example">
      <ConceptMap />
      <p>Connected through shared ideas, not scattered across tabs.</p>
    </div>
  );
}

function RecallPanel() {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      className={`recall-example ${flipped ? "is-flipped" : ""}`}
      aria-pressed={flipped}
      aria-label={
        flipped ? "Show flashcard question" : "Reveal flashcard answer"
      }
      onClick={() => setFlipped(!flipped)}
    >
      <span className="recall-label">
        <BookOpen size={17} />{" "}
        {flipped ? "THE ANSWER" : "A MOMENT TO REMEMBER"}
      </span>
      <span className="recall-question">
        {flipped
          ? "Retrieve an idea from memory, then check what you missed."
          : "What does active recall ask you to do?"}
      </span>
      <span className="recall-hint">
        <RotateCcw size={15} /> {flipped ? "Show question" : "Reveal answer"}
      </span>
    </button>
  );
}

const panels = [CapturePanel, ConnectPanel, RecallPanel];

/* ---------- Desktop: Pinned ScrollTrigger ---------- */
function PinnedDesktop() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reduced) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "+=250%",
        pin: true,
        anticipatePin: 1,
        scrub: 0.8,
        onUpdate: (self) => {
          const p = self.progress;
          if (p < 0.33) setActive(0);
          else if (p < 0.66) setActive(1);
          else setActive(2);
        },
      });
    }, container);

    return () => ctx.revert();
  }, [reduced]);

  const ActivePanel = panels[active];

  return (
    <div ref={containerRef} className="pinned-experience">
      <div className="pin-layout landing-container">
        {/* Left: progress + copy */}
        <div className="pin-left">
          <div className="pin-progress">
            {stages.map((s, i) => (
              <div
                key={s.label}
                className={`pin-step ${active === i ? "active" : ""} ${active > i ? "done" : ""}`}
              >
                <span className="pin-step-line" />
                <span className="pin-step-icon">
                  <s.icon size={18} />
                </span>
                <span className="pin-step-label">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="pin-copy">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 1 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2>
                  {active === 0 && (
                    <>
                      Your ideas.
                      <br />
                      In good company.
                    </>
                  )}
                  {active === 1 && (
                    <>
                      See the
                      <br />
                      bigger picture.
                    </>
                  )}
                  {active === 2 && (
                    <>
                      Remember
                      <br />
                      what matters.
                    </>
                  )}
                </h2>
                <p className="section-intro">{stages[active].description}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right: demo visual */}
        <div className="pin-visual">
          <div className="demo-stage">
            <div className="demo-stage-heading">
              <span>
                <ScanLine size={16} /> INTERACTIVE PREVIEW
              </span>
              <span>Sample content</span>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                className="demo-panel"
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 1 } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="demo-art">
                  <ActivePanel />
                </div>
                <div className="demo-explanation">
                  <h3>{stages[active].title}</h3>
                  <p>{stages[active].description}</p>
                </div>
              </motion.div>
            </AnimatePresence>
            <p className="demo-disclaimer">
              An illustrative demo. Nothing is generated or saved to your
              workspace.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Mobile: Tab fallback (no pin) ---------- */
function MobileTabs() {
  const [active, setActive] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const reduced = useReducedMotion();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number) => {
    setActive(index);
    setFlipped(false);
  };
  const onKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    let index = active;
    if (event.key === "ArrowRight" || event.key === "ArrowDown")
      index = (active + 1) % 3;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      index = (active + 2) % 3;
    else if (event.key === "Home") index = 0;
    else if (event.key === "End") index = 2;
    else return;
    event.preventDefault();
    select(index);
    tabs.current[index]?.focus();
  };

  const ActivePanel = panels[active];

  return (
    <div className="experience-layout">
      <div className="experience-copy">
        <h2>
          Your ideas.
          <br />
          In good company.
        </h2>
        <p className="section-intro">
          A little less collecting.
          <br />A lot more connecting.
        </p>
        <div
          className="demo-tabs"
          role="tablist"
          aria-label="Explore the BrainDrop workflow"
        >
          {stages.map(({ label, icon: Icon }, index) => (
            <button
              ref={(element) => {
                tabs.current[index] = element;
              }}
              type="button"
              key={label}
              id={`demo-tab-${index}`}
              role="tab"
              aria-selected={active === index}
              aria-controls={`demo-panel-${index}`}
              tabIndex={active === index ? 0 : -1}
              onKeyDown={onKey}
              onClick={() => select(index)}
            >
              <Icon size={19} />
              <span>{label}</span>
              <span className="tab-mark" aria-hidden="true">
                {active === index ? <Check size={16} /> : <Plus size={16} />}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="demo-stage">
        <div className="demo-stage-heading">
          <span>
            <ScanLine size={16} /> INTERACTIVE PREVIEW
          </span>
          <span>Sample content</span>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            role="tabpanel"
            id={`demo-panel-${active}`}
            aria-labelledby={`demo-tab-${active}`}
            tabIndex={0}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 1 } : { opacity: 0, y: -5 }}
            transition={{ duration: 0.18 }}
            className="demo-panel"
          >
            <div className="demo-art">
              <ActivePanel />
            </div>
            <div className="demo-explanation">
              <h3>{stages[active].title}</h3>
              <p>{stages[active].description}</p>
            </div>
          </motion.div>
        </AnimatePresence>
        <p className="demo-disclaimer">
          An illustrative demo. Nothing is generated or saved to your workspace.
        </p>
      </div>
    </div>
  );
}

/* ---------- Responsive Wrapper ---------- */
export function PinnedExperience() {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 801px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isDesktop ? <PinnedDesktop /> : <MobileTabs />;
}
