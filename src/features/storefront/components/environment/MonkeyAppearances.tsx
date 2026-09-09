"use client";

import React, { useEffect, useState, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks";

/**
 * DESAPEGO // DIGITAL JUNGLE ARCHIVE
 * Occasional Animated Monkey / Ape Micro-Appearances (Phase 5)
 * 
 * Subtle, surprising, infrequent glimpses:
 * - "Wait — was that a monkey?"
 * - Never constantly visible
 * - Lightweight SVG silhouettes with zero layout reflows
 * - Auto-pauses on prefers-reduced-motion and background tab
 */

type MonkeyEventType = "canopy-traverse" | "foliage-peek" | "distant-leap";

export function MonkeyAppearances() {
  const [activeEvent, setActiveEvent] = useState<MonkeyEventType | null>(null);
  const isReducedMotion = useReducedMotion();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isReducedMotion) return;

    // Schedule periodic appearances: first after 18 seconds, then every 45-75 seconds
    const scheduleNextAppearance = (delayMs: number) => {
      timerRef.current = setTimeout(() => {
        if (document.hidden) {
          scheduleNextAppearance(15000);
          return;
        }

        const events: MonkeyEventType[] = ["canopy-traverse", "foliage-peek", "distant-leap"];
        const chosen = events[Math.floor(Math.random() * events.length)];
        setActiveEvent(chosen);

        // Hide after event duration (3.2 seconds)
        setTimeout(() => {
          setActiveEvent(null);
          // Next event in 45-75 seconds
          const nextDelay = 45000 + Math.random() * 30000;
          scheduleNextAppearance(nextDelay);
        }, 3200);
      }, delayMs);
    };

    // Initial appearance after 18 seconds of exploration
    scheduleNextAppearance(18000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isReducedMotion]);

  if (isReducedMotion || !activeEvent) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none z-10 overflow-hidden"
    >
      {/* 1. CANOPY TRAVERSE: Silhouette crossing the upper background behind foliage */}
      {activeEvent === "canopy-traverse" ? (
        <div
          className="absolute top-[8%] left-[-120px] w-28 h-28 opacity-[0.25] text-emerald-950 fill-current"
          style={{
            animation: "monkeyTraverse 3.2s cubic-bezier(0.25, 1, 0.5, 1) forwards",
          }}
        >
          {/* Stylized agile ape silhouette */}
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
            <ellipse cx="48" cy="42" rx="16" ry="12" fill="#05150a" />
            <circle cx="64" cy="34" r="8" fill="#05150a" />
            {/* Long arm swinging forward */}
            <path
              d="M58,38 Q75,25 88,14 Q82,18 70,30 Q60,40 56,42 Z"
              fill="#05150a"
            />
            {/* Trailing arm */}
            <path
              d="M40,42 Q28,30 20,18 Q26,24 36,36 Z"
              fill="#05150a"
            />
            {/* Legs */}
            <path
              d="M42,50 Q36,65 30,78 Q36,70 46,54 Z"
              fill="#05150a"
            />
            <path
              d="M52,50 Q56,66 64,74 Q58,64 50,52 Z"
              fill="#05150a"
            />
            {/* Amber Glint Eye */}
            <circle cx="67" cy="33" r="1.2" fill="#f59e0b" opacity="0.9" />
          </svg>
        </div>
      ) : null}

      {/* 2. FOLIAGE PEEK: Curious ape peeking from behind left foliage with glowing amber eyes */}
      {activeEvent === "foliage-peek" ? (
        <div
          className="absolute top-[28%] left-1 sm:left-4 w-24 h-24 opacity-[0.32]"
          style={{
            animation: "monkeyPeek 3.2s ease-in-out forwards",
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Head and shoulder silhouette behind foliage */}
            <circle cx="35" cy="45" r="18" fill="#041208" />
            <ellipse cx="45" cy="65" rx="24" ry="18" fill="#041208" />
            {/* Brow ridge */}
            <path d="M26,38 Q35,34 44,38" stroke="#0a2a14" strokeWidth="2.5" fill="none" />
            {/* Reflective Optic Amber Eyes (Glint in nocturnal canopy) */}
            <circle cx="31" cy="42" r="2" fill="#f59e0b" className="animate-pulse" />
            <circle cx="41" cy="42" r="2" fill="#f59e0b" className="animate-pulse" />
          </svg>
        </div>
      ) : null}

      {/* 3. DISTANT LEAP: High-altitude distant leap across atmospheric haze */}
      {activeEvent === "distant-leap" ? (
        <div
          className="absolute top-[14%] right-[-100px] w-20 h-20 opacity-[0.20]"
          style={{
            animation: "monkeyLeap 3.0s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <ellipse cx="50" cy="50" rx="14" ry="9" fill="#030f06" />
            <circle cx="36" cy="44" r="6" fill="#030f06" />
            <path d="M42,48 Q20,38 8,26 Q18,36 38,46 Z" fill="#030f06" />
            <path d="M56,52 Q74,62 88,72 Q76,60 58,50 Z" fill="#030f06" />
          </svg>
        </div>
      ) : null}

      {/* CSS Keyframes for Monkey Movements */}
      <style jsx>{`
        @keyframes monkeyTraverse {
          0% {
            transform: translate3d(0, 0, 0) rotate(-6deg);
            opacity: 0;
          }
          20% {
            opacity: 0.28;
          }
          80% {
            opacity: 0.28;
          }
          100% {
            transform: translate3d(calc(100vw + 200px), 15px, 0) rotate(4deg);
            opacity: 0;
          }
        }

        @keyframes monkeyPeek {
          0% {
            transform: translate3d(-30px, 0, 0);
            opacity: 0;
          }
          25% {
            transform: translate3d(0, 0, 0);
            opacity: 0.35;
          }
          75% {
            transform: translate3d(0, 0, 0);
            opacity: 0.35;
          }
          100% {
            transform: translate3d(-35px, 0, 0);
            opacity: 0;
          }
        }

        @keyframes monkeyLeap {
          0% {
            transform: translate3d(0, 40px, 0) rotate(12deg);
            opacity: 0;
          }
          30% {
            transform: translate3d(-40vw, -30px, 0) rotate(-4deg);
            opacity: 0.22;
          }
          70% {
            transform: translate3d(-70vw, 10px, 0) rotate(-10deg);
            opacity: 0.22;
          }
          100% {
            transform: translate3d(calc(-100vw - 120px), 80px, 0) rotate(-16deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
