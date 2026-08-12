"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

interface TypewriterProps {
  text: string;
  speed?: number; // ms per character
  delay?: number; // ms before typing starts (after coming into view)
  className?: string;
  onStart?: () => void;
  onComplete?: () => void;
  skipAnimation?: boolean; // if true, show all text immediately (for anchor navigation)
  /** After typing completes, smoothly tint chars [start, end) to primary color */
  highlight?: {
    start: number;
    end: number;
    delay?: number; // ms after completion before color transition (default 300)
  };
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
  onStart,
  onComplete,
  highlight,
  skipAnimation,
}: TypewriterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  // The full sentence is server-rendered so slow connections never show a
  // blank headline while the client bundle is still downloading.
  const [shown, setShown] = useState(text.length);
  const [highlightActive, setHighlightActive] = useState(Boolean(highlight));
  const startedRef = useRef(false);
  const completedRef = useRef(false);
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stash onComplete in a ref so it doesn't invalidate the typing effect
  // when the parent re-renders (which would restart typing — bug).
  const onCompleteRef = useRef(onComplete);
  const onStartRef = useRef(onStart);
  useEffect(() => {
    onCompleteRef.current = onComplete;
    onStartRef.current = onStart;
  });

  useEffect(() => {
    if (!inView) return;
    if (startedRef.current) return; // already started — Strict Mode guard
    startedRef.current = true;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // A typewriter effect is enhancement, never a reason to hide primary
    // content. If hydration took more than three seconds, leave the complete
    // server-rendered headline visible.
    const hydrationWasSlow = performance.now() > 3000;
    if (reduce || skipAnimation || hydrationWasSlow) {
      if (!completedRef.current) {
        completedRef.current = true;
        onCompleteRef.current?.();
      }
      return;
    }

    let raf = 0;

    // Reset only after fast hydration, immediately before typing begins.
    raf = requestAnimationFrame(() => {
      setShown(0);
      setHighlightActive(false);
      onStartRef.current?.();
      const startAt = performance.now() + delay;

      const type = (now: number) => {
        const elapsed = now - startAt;
        if (elapsed < 0) {
          raf = requestAnimationFrame(type);
          return;
        }
        const next = Math.min(text.length, Math.floor(elapsed / speed));
        setShown(next);
        if (next < text.length) {
          raf = requestAnimationFrame(type);
        } else if (!completedRef.current) {
          completedRef.current = true;
          onCompleteRef.current?.();
          if (highlight) {
            highlightTimerRef.current = setTimeout(
              () => setHighlightActive(true),
              highlight.delay ?? 300
            );
          }
        }
      };

      raf = requestAnimationFrame(type);
    });

    return () => {
      cancelAnimationFrame(raf);
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    };
  }, [inView, text, speed, delay, skipAnimation]); // intentionally NOT depending on onComplete / highlight

  const done = shown >= text.length;

  // Render visible portion — split around the highlight range when done
  const renderVisible = () => {
    if (!highlight || !done) {
      return <span aria-hidden>{text.slice(0, shown)}</span>;
    }
    const { start, end } = highlight;
    return (
      <span aria-hidden>
        {text.slice(0, start)}
        <span
          style={{
            transition:
              "color 0.9s cubic-bezier(0.16, 1, 0.3, 1), text-shadow 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
            color: highlightActive ? "var(--color-primary)" : "inherit",
            textShadow: highlightActive
              ? "0 0 32px rgba(124,92,255,0.45)"
              : "0 0 0px transparent",
          }}
        >
          {text.slice(start, end)}
        </span>
        {text.slice(end)}
      </span>
    );
  };

  return (
    <span ref={ref} className={className}>
      {renderVisible()}

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
