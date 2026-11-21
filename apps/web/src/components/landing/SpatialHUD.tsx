"use client";

import Link from "next/link";
import { ArrowUpRight, ArrowDown } from "lucide-react";

export interface WaypointData {
  index: number;
  badge: string;
  headline: string;
  accent: string;
  subtext: string;
}

export const WAYPOINTS: WaypointData[] = [
  {
    index: 0,
    badge: "[WAYPOINT 00 // THE VOID]",
    headline: "Capture anything.",
    accent: "Forget nothing.",
    subtext: "The privacy-first hybrid second brain. Process private notes on-device with Gemini Nano, and synthesize complex research with cloud intelligence.",
  },
  {
    index: 1,
    badge: "[WAYPOINT 01 // LOCAL NANO INFERENCE]",
    headline: "Capture without",
    accent: "friction.",
    subtext: "Zero folder hierarchies. Zero latency lag. Local Gemini Nano parses unstructured research notes in ~48ms directly on your device NPU.",
  },
  {
    index: 2,
    badge: "[WAYPOINT 02 // TOPOLOGY FORMATION]",
    headline: "Thoughts naturally",
    accent: "connect.",
    subtext: "Your curiosity forms an organic knowledge graph. Related passages, concepts, and research papers link autonomously through neural proximity.",
  },
  {
    index: 3,
    badge: "[WAYPOINT 03 // DEEP HYBRID SYNTHESIS]",
    headline: "Synthesize the",
    accent: "unseen.",
    subtext: "When research demands macroscopic understanding, Gemini 3.8 Flash fuses disparate threads into cohesive literature reviews and insights.",
  },
  {
    index: 4,
    badge: "[WAYPOINT 04 // ACTIVE RECALL & HORIZON]",
    headline: "Make what you learn",
    accent: "stay forever.",
    subtext: "Convert fleeting bookmarks into permanent cognitive pathways with spaced retrieval flashcards and active recall testing.",
  },
];

interface SpatialHUDProps {
  currentWaypoint: number;
  onSelectWaypoint?: (index: number) => void;
  visible?: boolean;
}

export function SpatialHUD({ currentWaypoint, onSelectWaypoint, visible = true }: SpatialHUDProps) {
  const wp = WAYPOINTS[currentWaypoint] || WAYPOINTS[0];

  return (
    <div
      className={`spatial-hud-overlay transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      aria-hidden={!visible}
    >
      {/* Middle Narrative Text Anchor */}
      <main className={`spatial-hud-middle ${currentWaypoint === 0 ? "spatial-hud-hero" : ""}`}>
        <h1 className="spatial-hud-headline">
          {wp.headline} <br />
          <em>{wp.accent}</em>
        </h1>
        <p className="spatial-hud-subtext">{wp.subtext}</p>

        {currentWaypoint === 0 && (
          <div className="flex flex-wrap items-center gap-3.5 mt-7 pointer-events-auto">
            <Link
              href="/notes"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm bg-[var(--spatial-cyan)] text-[var(--spatial-bg)] hover:brightness-110 transition-all shadow-lg hover:-translate-y-0.5"
            >
              <span>Launch Workspace</span>
              <ArrowUpRight size={16} />
            </Link>
            <Link
              href="/capture"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm border border-[var(--spatial-border)] bg-[var(--spatial-card)] text-[var(--spatial-text-main)] hover:border-[var(--spatial-border-hover)] transition-all hover:-translate-y-0.5 shadow-sm"
            >
              <span>Quick Capture</span>
            </Link>
          </div>
        )}
      </main>

      {/* Right Waypoint Progress Track */}
      <nav className="spatial-hud-track" aria-label="Spatial Journey Steps">
        {WAYPOINTS.map((item, idx) => (
          <button
            key={item.index}
            type="button"
            onClick={() => onSelectWaypoint?.(idx)}
            className={`spatial-track-step ${currentWaypoint === idx ? "active" : ""}`}
            title={item.headline}
          >
            <span>0{idx + 1}</span>
            <span className="spatial-track-bar" />
          </button>
        ))}
      </nav>

      {/* Bottom Footer Scroll Cue */}
      <footer className="spatial-hud-bottom pointer-events-auto">
        <button
          type="button"
          onClick={() => onSelectWaypoint?.(Math.min(currentWaypoint + 1, WAYPOINTS.length - 1))}
          className="spatial-scroll-hint cursor-pointer transition-opacity hover:opacity-100 flex items-center gap-2 text-left"
        >
          <ArrowDown size={14} className="text-[var(--accent-cyan)] animate-bounce" />
          <span>SCROLL TO TRAVERSE WORKSPACE</span>
        </button>
      </footer>
    </div>
  );
}
