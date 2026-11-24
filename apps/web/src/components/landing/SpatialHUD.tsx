"use client";

import Link from "next/link";
import { useLocale } from "@/components/layout/LocaleProvider";
import { RollingText } from "@/components/ui/RollingText";

export interface WaypointData {
  index: number;
  badge: string;
  headline: string;
  accent: string;
  subtext: string;
}

interface SpatialHUDProps {
  currentWaypoint: number;
  onSelectWaypoint?: (index: number) => void;
  visible?: boolean;
}

export function SpatialHUD({ currentWaypoint, onSelectWaypoint, visible = true }: SpatialHUDProps) {
  const { copy } = useLocale();
  const waypoints = copy.hud.waypoints;
  const wp = waypoints[currentWaypoint] || waypoints[0];

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
          <div className="flex flex-wrap items-center gap-6 mt-8 pointer-events-auto">
            <Link
              href="/notes"
              className="aw-closing-primary group"
            >
              <RollingText text={copy.hud.launchWorkspace} />{" "}
              <span aria-hidden="true">↗</span>
            </Link>
            <Link
              href="/capture"
              className="aw-text-link group"
            >
              <RollingText text={copy.hud.quickCapture} />{" "}
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        )}
      </main>

      {/* Right Waypoint Progress Track */}
      <nav className="spatial-hud-track" aria-label="Spatial Journey Steps">
        {waypoints.map((item, idx) => (
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
          onClick={() => onSelectWaypoint?.(Math.min(currentWaypoint + 1, waypoints.length - 1))}
          className="spatial-scroll-hint cursor-pointer transition-opacity hover:opacity-100 flex items-center gap-2.5 text-left"
        >
          <span aria-hidden="true">↓</span>
          <span>{copy.hud.scrollCue}</span>
        </button>
      </footer>
    </div>
  );
}
