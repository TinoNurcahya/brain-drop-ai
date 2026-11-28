"use client";

import type { PortalCurtainItem, SquareDataCardItem } from "@/lib/landing-walton-copy";

/**
 * Crisp 1px white vector schematic diagrams with Electric Acid-Lime (#e7e72b)
 * data nodes. Every stroke carries pathLength={1} so CSS --draw (0..1)
 * progressively draws lines and arcs smoothly in sync with scroll!
 */
export function PortalSchematicDiagram({
  kind,
  badge,
}: {
  kind: PortalCurtainItem["id"];
  badge: string;
}) {
  if (kind === "local") {
    const angles = Array.from({ length: 10 }, (_, i) => (i * 36 - 90) * (Math.PI / 180));
    return (
      <div className="wf-diagram-stage">
        <svg viewBox="0 0 360 360" className="wf-diagram-svg" fill="none" aria-hidden="true">
          {angles.map((rad, idx) => {
            const r = 132;
            const x = 180 + Math.cos(rad) * r;
            const y = 180 + Math.sin(rad) * r;
            const isHollow = idx === 7;
            return (
              <g key={idx}>
                <line
                  x1="180"
                  y1="180"
                  x2={x.toFixed(1)}
                  y2={y.toFixed(1)}
                  pathLength={1}
                  className={isHollow ? "wf-stroke-dashed" : "wf-stroke-draw"}
                  stroke="rgba(255,255,255,0.82)"
                  strokeWidth="1.15"
                />
                <circle
                  cx={x.toFixed(1)}
                  cy={y.toFixed(1)}
                  r="9.5"
                  className="wf-node-pop"
                  fill={isHollow ? "transparent" : "#fffcf8"}
                  stroke="#fffcf8"
                  strokeWidth="1.35"
                />
              </g>
            );
          })}
          <circle
            cx="180"
            cy="180"
            r="68"
            stroke="rgba(255,255,255,0.26)"
            strokeWidth="1"
            strokeDasharray="3 4"
          />
        </svg>
        <span className="wf-lime-node">{badge}</span>
      </div>
    );
  }

  if (kind === "speed") {
    return (
      <div className="wf-diagram-stage">
        <svg viewBox="0 0 360 360" className="wf-diagram-svg" fill="none" aria-hidden="true">
          <circle
            cx="180"
            cy="180"
            r="134"
            stroke="rgba(255,255,255,0.38)"
            strokeWidth="1"
            strokeDasharray="4 5"
          />
          <circle
            cx="180"
            cy="180"
            r="98"
            pathLength={1}
            className="wf-stroke-draw"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth="1.2"
          />
          <circle
            cx="180"
            cy="180"
            r="58"
            pathLength={1}
            className="wf-stroke-draw"
            stroke="rgba(255,255,255,0.58)"
            strokeWidth="1"
          />
          <line
            x1="32"
            y1="180"
            x2="328"
            y2="180"
            pathLength={1}
            className="wf-stroke-draw"
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="1"
          />
          <line
            x1="180"
            y1="32"
            x2="180"
            y2="328"
            pathLength={1}
            className="wf-stroke-draw"
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="1"
          />
          <circle cx="278" cy="180" r="8" className="wf-node-pop" fill="#fffcf8" />
          <circle cx="180" cy="82" r="6.5" className="wf-node-pop" fill="#e7e72b" />
          <circle cx="122" cy="180" r="5.5" className="wf-node-pop" stroke="#fffcf8" strokeWidth="1.3" />
        </svg>
        <span className="wf-lime-node">{badge}</span>
      </div>
    );
  }

  return (
    <div className="wf-diagram-stage">
      <svg viewBox="0 0 360 360" className="wf-diagram-svg" fill="none" aria-hidden="true">
        <rect
          x="108"
          y="78"
          width="144"
          height="204"
          rx="72"
          pathLength={1}
          className="wf-stroke-draw"
          stroke="rgba(255,255,255,0.88)"
          strokeWidth="1.2"
        />
        {[120, 150, 180, 210, 240].map((y, idx) => (
          <g key={y}>
            <line
              x1="34"
              y1={y}
              x2="148"
              y2="180"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="1.1"
              strokeDasharray="4 4"
            />
            <circle cx="34" cy={y} r="4.5" className="wf-node-pop" stroke="#fffcf8" strokeWidth="1.2" />
            {idx % 2 === 0 && (
              <>
                <line
                  x1="212"
                  y1="180"
                  x2="326"
                  y2={y}
                  pathLength={1}
                  className="wf-stroke-draw"
                  stroke="#fffcf8"
                  strokeWidth="1.25"
                />
                <circle cx="326" cy={y} r="6" className="wf-node-pop" fill="#fffcf8" />
              </>
            )}
          </g>
        ))}
      </svg>
      <span className="wf-lime-node">{badge}</span>
    </div>
  );
}

/**
 * Chapter [03] Pinned Center Portrait Split-Wipe Diagrams:
 * - "single": Single crisp 1px white orbital ring + top marker (Photo A)
 * - "double": Concentric double 1px white orbital rings + central #e7e72b orb (Photo B)
 */
export function SplitPortraitDiagram({ variant }: { variant: "single" | "double" }) {
  if (variant === "single") {
    return (
      <div className="wf-split-diagram" aria-hidden="true">
        <svg viewBox="0 0 260 260" fill="none">
          <circle
            cx="130"
            cy="130"
            r="92"
            pathLength={1}
            className="wf-stroke-draw"
            stroke="rgba(255,255,255,0.92)"
            strokeWidth="1.25"
          />
          <circle cx="130" cy="38" r="5" fill="#fffcf8" />
          <circle cx="130" cy="130" r="9" fill="#e7e72b" />
        </svg>
      </div>
    );
  }

  return (
    <div className="wf-split-diagram" aria-hidden="true">
      <svg viewBox="0 0 260 260" fill="none">
        <circle
          cx="130"
          cy="130"
          r="98"
          pathLength={1}
          className="wf-stroke-draw"
          stroke="rgba(255,255,255,0.95)"
          strokeWidth="1.25"
        />
        <circle
          cx="130"
          cy="130"
          r="84"
          pathLength={1}
          className="wf-stroke-draw"
          stroke="rgba(255,255,255,0.72)"
          strokeWidth="1.1"
        />
        <circle cx="130" cy="228" r="4.5" fill="#fffcf8" />
        <circle cx="130" cy="130" r="16" fill="#e7e72b" />
      </svg>
    </div>
  );
}

export function CardSchematicDiagram({
  kind,
  badge,
}: {
  kind: SquareDataCardItem["id"];
  badge: string;
}) {
  if (kind === "notes") {
    return (
      <div className="wf-card-diagram" aria-hidden="true">
        <svg viewBox="0 0 240 185" fill="none">
          <circle
            cx="120"
            cy="92"
            r="74"
            pathLength={1}
            className="wf-stroke-draw"
            stroke="rgba(255,255,255,0.88)"
            strokeWidth="1.15"
          />
          <circle
            cx="120"
            cy="92"
            r="46"
            stroke="rgba(255,255,255,0.38)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <circle cx="96" cy="158" r="6" className="wf-node-pop" fill="#fffcf8" />
          <circle cx="188" cy="64" r="5" className="wf-node-pop" stroke="#fffcf8" strokeWidth="1.2" />
        </svg>
        <span className="wf-lime-node is-sm">{badge}</span>
      </div>
    );
  }

  if (kind === "recall") {
    return (
      <div className="wf-card-diagram" aria-hidden="true">
        <svg viewBox="0 0 240 185" fill="none">
          <circle
            cx="88"
            cy="94"
            r="52"
            pathLength={1}
            className="wf-stroke-draw"
            stroke="rgba(255,255,255,0.68)"
            strokeWidth="1.15"
          />
          <circle
            cx="120"
            cy="94"
            r="52"
            pathLength={1}
            className="wf-stroke-draw"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth="1.15"
          />
          <circle
            cx="152"
            cy="94"
            r="52"
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="1.15"
            strokeDasharray="3 3"
          />
          <circle cx="36" cy="94" r="4.5" className="wf-node-pop" fill="#fffcf8" />
          <circle cx="204" cy="94" r="4.5" className="wf-node-pop" fill="#e7e72b" />
        </svg>
        <span className="wf-lime-node is-sm">{badge}</span>
      </div>
    );
  }

  const pts = [
    [68, 52],
    [120, 36],
    [172, 52],
    [68, 134],
    [120, 150],
    [172, 134],
  ];
  return (
    <div className="wf-card-diagram" aria-hidden="true">
      <svg viewBox="0 0 240 185" fill="none">
        <circle
          cx="120"
          cy="93"
          r="68"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
        {pts.map(([x, y], i) => (
          <g key={i}>
            <line
              x1="120"
              y1="93"
              x2={x}
              y2={y}
              pathLength={1}
              className="wf-stroke-draw"
              stroke="rgba(255,255,255,0.78)"
              strokeWidth="1.1"
            />
            <circle cx={x} cy={y} r="6.5" className="wf-node-pop" fill={i % 2 === 0 ? "#fffcf8" : "#e7e72b"} />
          </g>
        ))}
      </svg>
      <span className="wf-lime-node is-sm">{badge}</span>
    </div>
  );
}
