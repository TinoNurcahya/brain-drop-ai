"use client";

import { useEffect, useState, useRef } from "react";

export interface RollingNumberCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function RollingNumberCounter({
  value,
  duration = 850,
  prefix = "",
  suffix = "",
  className = "",
}: RollingNumberCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const prevValueRef = useRef(0);

  useEffect(() => {
    // If reduced motion is preferred, jump straight to target value
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplayValue(value);
      prevValueRef.current = value;
      return;
    }

    const startVal = prevValueRef.current;
    const diff = value - startVal;
    if (diff === 0) {
      setDisplayValue(value);
      return;
    }

    const startTime = performance.now();
    let animId: number;

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + diff * easeOut);
      setDisplayValue(current);

      if (progress < 1) {
        animId = requestAnimationFrame(frame);
      } else {
        prevValueRef.current = value;
      }
    };

    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      prevValueRef.current = value;
    };
  }, [value, duration]);

  return (
    <span className={`inline-flex items-center tabular-nums ${className}`}>
      {prefix}
      <span>{displayValue.toLocaleString()}</span>
      {suffix}
    </span>
  );
}
