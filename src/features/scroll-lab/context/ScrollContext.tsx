"use client";

import React, { createContext, useContext, useState } from "react";
import type Lenis from "lenis";

export interface ScrollSettings {
  duration: number;
  smoothWheel: boolean;
  wheelMultiplier: number;
  touchMultiplier: number;
}

interface ScrollContextValue {
  lenis: Lenis | null;
  setLenis: (instance: Lenis | null) => void;
  progress: number;
  velocity: number;
  direction: number;
  isScrolling: boolean;
  settings: ScrollSettings;
  setSettings: React.Dispatch<React.SetStateAction<ScrollSettings>>;
  scrollTo: (target: string | number | HTMLElement, options?: Record<string, unknown>) => void;
}

const DEFAULT_SETTINGS: ScrollSettings = {
  duration: 1.2,
  smoothWheel: true,
  wheelMultiplier: 1.0,
  touchMultiplier: 1.5,
};

const ScrollContext = createContext<ScrollContextValue>({
  lenis: null,
  setLenis: () => {},
  progress: 0,
  velocity: 0,
  direction: 0,
  isScrolling: false,
  settings: DEFAULT_SETTINGS,
  setSettings: () => {},
  scrollTo: () => {},
});

export const useScrollLab = () => useContext(ScrollContext);

export function ScrollLabContextProvider({
  children,
  lenis,
  setLenis,
  progress,
  velocity,
  direction,
  isScrolling,
  settings,
  setSettings,
  scrollTo,
}: {
  children: React.ReactNode;
  lenis: Lenis | null;
  setLenis: (instance: Lenis | null) => void;
  progress: number;
  velocity: number;
  direction: number;
  isScrolling: boolean;
  settings: ScrollSettings;
  setSettings: React.Dispatch<React.SetStateAction<ScrollSettings>>;
  scrollTo: (target: string | number | HTMLElement, options?: Record<string, unknown>) => void;
}) {
  return (
    <ScrollContext.Provider
      value={{
        lenis,
        setLenis,
        progress,
        velocity,
        direction,
        isScrolling,
        settings,
        setSettings,
        scrollTo,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
}
