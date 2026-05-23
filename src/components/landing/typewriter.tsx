"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

interface TypewriterProps {
  text: string;
  speed?: number; // ms per character
  delay?: number; // ms before typing starts (after coming into view)
  className?: string;
  cursorClassName?: string;
  onComplete?: () => void;
}

/**
 * Character-by-character typing reveal triggered when scrolled into view.
 * GPU-friendly (only updates a single text node + cursor). The cursor
 * disappears once typing completes (no infinite animation cost after that).
 */
export function Typewriter({
  text,
  speed = 35,
  delay = 0,
  className,
  cursorClassName,
  onComplete,
}: TypewriterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [shown, setShown] = useState(0);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!inView) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(text.length);
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete?.();
      }
      return;
    }

    const startAt = performance.now() + delay;
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - startAt;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const next = Math.min(text.length, Math.floor(elapsed / speed));
      setShown(next);
      if (next < text.length) {
        raf = requestAnimationFrame(tick);
      } else if (!completedRef.current) {
        completedRef.current = true;
        onComplete?.();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, text, speed, delay, onComplete]);

  const done = shown >= text.length;

  return (
    <span ref={ref} className={className}>
      <span aria-hidden>{text.slice(0, shown)}</span>
      {!done && (
        <span
          aria-hidden
          className={
            cursorClassName ??
            "inline-block w-[0.08em] h-[0.85em] translate-y-[0.06em] ml-[0.04em] bg-primary blinking-cursor"
          }
        />
      )}
      {/* SR-only full text for accessibility */}
      <span className="sr-only">{text}</span>
    </span>
  );
}
