"use client";

import { useState, useEffect, useRef } from "react";

export interface NaturalTypewriterProps {
  text?: string;
  className?: string;
  cursorClassName?: string;
  speedMultiplier?: number;
  wordPauseDuration?: number;
  punctuationPauseDuration?: number;
  onComplete?: () => void;
}

export function NaturalTypewriter({
  text = "",
  className = "",
  cursorClassName = "",
  speedMultiplier = 1.4,
  wordPauseDuration = 70,
  punctuationPauseDuration = 180,
  onComplete,
}: NaturalTypewriterProps) {
  const [displayedLength, setDisplayedLength] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Reset when text changes
  useEffect(() => {
    if (!text) {
      setDisplayedLength(0);
      setIsTyping(false);
      return;
    }

    // Check for reduced motion
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplayedLength(text.length);
      setIsTyping(false);
      onCompleteRef.current?.();
      return;
    }

    setDisplayedLength(0);
    setIsTyping(true);

    let currentIndex = 0;
    let timerId: NodeJS.Timeout | null = null;

    const typeNextChar = () => {
      if (currentIndex >= text.length) {
        setIsTyping(false);
        onCompleteRef.current?.();
        return;
      }

      currentIndex++;
      setDisplayedLength(currentIndex);

      const currentChar = text[currentIndex - 1];
      let delay = (Math.random() * 18 + 14) / speedMultiplier;

      // Realistic cadence for punctuation & word boundaries
      if (currentChar === "." || currentChar === "!" || currentChar === "?") {
        delay += punctuationPauseDuration / speedMultiplier;
      } else if (currentChar === "," || currentChar === ";" || currentChar === ":") {
        delay += (punctuationPauseDuration * 0.6) / speedMultiplier;
      } else if (currentChar === " " || currentChar === "\n") {
        delay += wordPauseDuration / speedMultiplier;
      }

      timerId = setTimeout(typeNextChar, delay);
    };

    timerId = setTimeout(typeNextChar, 40 / speedMultiplier);

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [text, speedMultiplier, wordPauseDuration, punctuationPauseDuration]);

  const displayedText = text.slice(0, displayedLength);

  return (
    <span className={`inline ${className}`}>
      <span className="whitespace-pre-wrap">{displayedText}</span>
      {isTyping && (
        <span
          className={`inline-block w-1.5 h-4 ml-0.5 align-middle bg-[var(--accent-cyan)] animate-pulse rounded-sm ${cursorClassName}`}
          aria-hidden="true"
        />
      )}
    </span>
  );
}
