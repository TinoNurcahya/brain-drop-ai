"use client";

import Link from "next/link";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";

type Variant = "ink" | "lime" | "light" | "outline-light";
type IconKind = "arrow" | "download" | "down";

interface BaseProps {
  label: string;
  variant?: Variant;
  icon?: IconKind;
  size?: "sm" | "md";
  className?: string;
}

function SlotLabel({ text }: { text: string }) {
  const chars = Array.from(text);
  return (
    <>
      <span className="sr-only">{text}</span>
      <span className="wf-slot-text" aria-hidden="true">
        {chars.map((ch, idx) => (
          <span
            key={idx}
            className="wf-slot-char"
            style={{ ["--ci" as string]: idx }}
          >
            <span>{ch === " " ? "\u00A0" : ch}</span>
            <span>{ch === " " ? "\u00A0" : ch}</span>
          </span>
        ))}
      </span>
    </>
  );
}

function CircleBadge({ icon = "arrow", size = "md" }: { icon?: IconKind; size?: "sm" | "md" }) {
  const px = size === "sm" ? 13 : 15;
  return (
    <span className="wf-conjoined-circle" aria-hidden="true">
      {icon === "download" ? (
        <Download size={px} />
      ) : icon === "down" ? (
        <ArrowDown size={px} />
      ) : (
        <ArrowUpRight size={px} />
      )}
    </span>
  );
}

/**
 * Walton-inspired conjoined [ STADIUM PILL ](↗) Link with character-by-character
 * mechanical slot-flap hover ripple.
 */
export function ConjoinedLink({
  href,
  label,
  variant = "ink",
  icon = "arrow",
  size = "md",
  download,
  onClick,
  className = "",
}: BaseProps & {
  href: string;
  download?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const cls = `wf-conjoined is-${variant} is-${size} ${className}`.trim();

  if (download || href.startsWith("#")) {
    return (
      <a href={href} download={download} onClick={onClick} className={cls}>
        <span className="wf-conjoined-pill">
          <SlotLabel text={label} />
        </span>
        <CircleBadge icon={icon} size={size} />
      </a>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={cls}>
      <span className="wf-conjoined-pill">
        <SlotLabel text={label} />
      </span>
      <CircleBadge icon={icon} size={size} />
    </Link>
  );
}
