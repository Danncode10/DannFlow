"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

interface TypewriterProps {
  text: string;
  speed?: number; // ms per character
  delay?: number; // ms before typing starts (after coming into view)
  className?: string;
  onComplete?: () => void;
}

/**
 * Character-by-character typing reveal triggered when scrolled into view.
 *
 * Layout-stable: the FULL text is always rendered (with the unshown
 * portion at opacity 0), so word wrap is computed from the complete
 * string from the very first frame. Characters fade in by toggling
 * opacity rather than appearing/disappearing — no reflow during typing.
 *
 * Idempotent: a startedRef guard prevents Strict Mode (or parent
 * re-renders that change onComplete identity) from restarting typing.
 *
 * Honors prefers-reduced-motion (jumps to complete state immediately).
 */
export function Typewriter({
  text,
  speed = 35,
  delay = 0,
  className,
  onComplete,
}: TypewriterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [shown, setShown] = useState(0);
  const startedRef = useRef(false);
  const completedRef = useRef(false);

  // Stash onComplete in a ref so it doesn't invalidate the typing effect
  // when the parent re-renders (which would restart typing — bug).
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    if (!inView) return;
    if (startedRef.current) return; // already started — Strict Mode guard
    startedRef.current = true;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(text.length);
      if (!completedRef.current) {
        completedRef.current = true;
        onCompleteRef.current?.();
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
        onCompleteRef.current?.();
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
    };
  }, [inView, text, speed, delay]); // intentionally NOT depending on onComplete

  const done = shown >= text.length;

  return (
    <span ref={ref} className={className}>
      {/* Revealed portion */}
      <span aria-hidden>{text.slice(0, shown)}</span>

      {/* Cursor — between visible and invisible text, sits at typing position.
          Hidden via visibility (not unmounted) so width stays in the layout. */}
      <span
        aria-hidden
        className={done ? "typewriter-cursor-done" : "typewriter-cursor"}
        style={{ visibility: done ? "hidden" : "visible" }}
      />

      {/* Unrevealed portion at opacity 0 — reserves layout space so word wrap
          is computed from the full string. Nothing reflows as chars reveal. */}
      <span aria-hidden style={{ opacity: 0 }}>
        {text.slice(shown)}
      </span>

      {/* Accessible full text for screen readers */}
      <span className="sr-only">{text}</span>
    </span>
  );
}
