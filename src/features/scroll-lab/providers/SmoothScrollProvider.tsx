"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollLabContextProvider, type ScrollSettings } from "../context/ScrollContext";
import "lenis/dist/lenis.css";

interface SmoothScrollProviderProps {
  children: React.ReactNode;
  initialSettings?: Partial<ScrollSettings>;
  enableGsapIntegration?: boolean;
}

export function SmoothScrollProvider({
  children,
  initialSettings,
  enableGsapIntegration = true,
}: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  const [settings, setSettings] = useState<ScrollSettings>({
    duration: 1.2,
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.5,
    ...initialSettings,
  });

  const [progress, setProgress] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  // Initialize and re-bind Lenis instance
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (enableGsapIntegration) {
      gsap.registerPlugin(ScrollTrigger);
    }

    const lenis = new Lenis({
      duration: settings.duration,
      smoothWheel: settings.smoothWheel,
      wheelMultiplier: settings.wheelMultiplier,
      touchMultiplier: settings.touchMultiplier,
      autoRaf: false, // We drive RAF through GSAP Ticker for perfect sync
    });

    lenisRef.current = lenis;

    // Synchronize Lenis scroll with GSAP ScrollTrigger and State
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = (e: Lenis) => {
      setProgress(e.progress ?? 0);
      setVelocity(Math.round((e.velocity ?? 0) * 100) / 100);
      setDirection(e.direction ?? 0);
      setIsScrolling(true);

      if (enableGsapIntegration) {
        ScrollTrigger.update();
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    lenis.on("scroll", handleScroll);

    // Drive Lenis RAF via GSAP ticker
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      clearTimeout(scrollTimeout);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
      if (enableGsapIntegration) {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      }
    };
  }, [settings.duration, settings.smoothWheel, settings.wheelMultiplier, settings.touchMultiplier, enableGsapIntegration]);

  const scrollTo = useCallback(
    (target: string | number | HTMLElement, options?: Record<string, unknown>) => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, {
          duration: settings.duration,
          ...options,
        });
      }
    },
    [settings.duration]
  );

  const getLenis = useCallback(() => lenisRef.current, []);

  return (
    <ScrollLabContextProvider
      getLenis={getLenis}
      progress={progress}
      velocity={velocity}
      direction={direction}
      isScrolling={isScrolling}
      settings={settings}
      setSettings={setSettings}
      scrollTo={scrollTo}
    >
      {children}
    </ScrollLabContextProvider>
  );
}
