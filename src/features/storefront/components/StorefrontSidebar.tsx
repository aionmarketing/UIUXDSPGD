"use client";

import React, { useState, useRef, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from "framer-motion";
import {
  Sparkle,
  TShirt,
  Footprints,
  Sunglasses,
  Tag,
  ShieldCheck,
  MagnifyingGlass,
  Bag,
  User,
  Globe,
  CaretDown,
  ArrowUpRight,
  SidebarSimple,
  List,
  X,
  PushPin,
} from "@phosphor-icons/react";
import {
  TAXONOMY_SUBCATEGORIES,
  TAXONOMY_BRANDS,
} from "@/features/seller-pwa/taxonomy";
import { useCartStore } from "../stores/useCartStore";

const emptySubscribe = () => () => {};

export function StorefrontSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  // Desktop sidebar states
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Search & Currency states
  const [searchQuery, setSearchQuery] = useState("");
  const [currency, setCurrency] = useState<"BRL" | "USD">("BRL");
  const [showCurrencyTooltip, setShowCurrencyTooltip] = useState(false);

  // Mobile drawer state
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const itemCount = useCartStore((state) => state.getItemCount());

  // Spotlight mouse tracking (Aceternity pattern)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent<HTMLElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const spotlightBg = useMotionTemplate`radial-gradient(280px circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.08), transparent 80%)`;
  const borderSpotlight = useMotionTemplate`radial-gradient(200px circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.35), transparent 70%)`;

  const isOpen = isPinned || isHovered;

  // Collapse accordions when sidebar collapses
  useEffect(() => {
    if (!isOpen) {
      setExpandedSection(null);
    }
  }, [isOpen]);

  // Handle ESC key to close mobile drawer or collapse
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setExpandedSection(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/produtos?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileOpen(false);
    } else {
      router.push("/produtos");
    }
  };

  const navItems = [
    {
      id: "novidades",
      label: "Novidades",
      tag: "GRAILS",
      icon: Sparkle,
      href: "/produtos",
      isAccordion: false,
    },
    {
      id: "roupas",
      label: "Roupas",
      icon: TShirt,
      href: "/produtos?category=Roupas",
      isAccordion: true,
      subcategories: TAXONOMY_SUBCATEGORIES.Roupas,
    },
    {
      id: "sneakers",
      label: "Sneakers",
      icon: Footprints,
      href: "/produtos?category=Sneakers",
      isAccordion: true,
      subcategories: TAXONOMY_SUBCATEGORIES.Sneakers,
    },
    {
      id: "acessorios",
      label: "Acessórios",
      icon: Sunglasses,
      href: "/produtos?category=Acessórios",
      isAccordion: true,
      subcategories: TAXONOMY_SUBCATEGORIES.Acessórios,
    },
    {
      id: "marcas",
      label: "Marcas",
      icon: Tag,
      href: "/produtos",
      isAccordion: true,
      subcategories: TAXONOMY_BRANDS.slice(0, 8),
    },
  ];

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. DESKTOP DYNAMIC SIDEBAR (Aceternity UI + Magic UI Glassmorphism Rail)  */}
      {/* ========================================================================= */}
      <motion.aside
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={false}
        animate={{ width: isOpen ? 288 : 72 }}
        transition={{ type: "spring", stiffness: 350, damping: 32 }}
        className="hidden lg:flex fixed left-0 top-0 bottom-0 z-50 flex-col bg-canvas-base/95 backdrop-blur-[36px] border-r border-border-subtle shadow-2xl select-none"
        style={{
          boxShadow: isOpen
            ? "12px 0 40px -10px rgba(0,0,0,0.8), 0 0 1px 1px rgba(255,255,255,0.06)"
            : "4px 0 24px -6px rgba(0,0,0,0.5)",
        }}
      >
        {/* Dynamic Specular Glare & Border Glow (Aceternity effect) */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 opacity-60"
          style={{ background: spotlightBg }}
        />
        <motion.div
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-[1px] opacity-70"
          style={{ background: borderSpotlight }}
        />

        {/* Magic UI Border Beam (Animated subtle vertical pulse on the rail edge) */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-[1px] overflow-hidden">
          <div className="w-full h-24 bg-gradient-to-b from-transparent via-white/40 to-transparent animate-[pulse_3s_ease-in-out_infinite]" />
        </div>

        {/* --- TOP BRAND HEADER --- */}
        <div className="relative z-10 h-20 px-4 flex items-center border-b border-border-subtle shrink-0">
          <Link
            href="/"
            className="flex items-center gap-3 w-full group overflow-hidden"
            title="Desapegado // Acervo de Streetwear & Luxo"
          >
            {/* Diamond Emblem with 45deg -> 90deg hover animation */}
            <motion.div
              animate={{ rotate: isHovered ? 90 : 45 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-4 h-4 bg-text-optic shrink-0 shadow-[0_0_12px_rgba(255,255,255,0.5)] border border-white"
            />

            {/* Brand Monolith Typography (Fades in when expanded) */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col whitespace-nowrap overflow-hidden"
                >
                  <span className="font-mono text-sm font-black tracking-[0.25em] text-text-optic leading-none uppercase">
                    DESAPEGADO
                  </span>
                  <span className="text-[8px] font-mono tracking-[0.3em] text-text-slate uppercase mt-1">
                    ARCHIVE // LUXURY
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>

          {/* Pin/Unpin Toggle Button (Visible when expanded) */}
          <AnimatePresence>
            {isOpen && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPinned(!isPinned);
                }}
                className={`p-1.5 border transition-colors cursor-pointer shrink-0 ml-auto ${
                  isPinned
                    ? "bg-text-optic text-canvas-base border-text-optic shadow-sm"
                    : "bg-canvas-well text-text-slate border-border-subtle hover:text-text-optic"
                }`}
                title={isPinned ? "Desafixar menu lateral" : "Fixar menu lateral aberto"}
              >
                {isPinned ? (
                  <PushPin weight="fill" className="w-3.5 h-3.5" />
                ) : (
                  <SidebarSimple weight="light" className="w-3.5 h-3.5" />
                )}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* --- UTILITY SEARCH COMMAND BAR --- */}
        <div className="relative z-10 px-3 py-3 border-b border-border-subtle shrink-0">
          {isOpen ? (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSearchSubmit}
              className="relative w-full flex items-center bg-canvas-well border border-border-subtle hover:border-border-specular focus-within:border-text-optic px-2.5 py-1.5 transition-colors"
            >
              <MagnifyingGlass weight="light" className="w-3.5 h-3.5 text-text-platinum mr-2 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="BUSCAR ACERVO..."
                className="w-full bg-transparent text-text-optic placeholder:text-text-slate font-mono text-[10px] tracking-wider uppercase outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-text-slate hover:text-text-optic text-[9px] font-mono px-1"
                >
                  <X weight="light" className="w-3 h-3" />
                </button>
              )}
              <kbd className="hidden xl:inline-flex items-center text-[8px] font-mono text-text-slate bg-canvas-base px-1 border border-border-subtle ml-1">
                ↵
              </kbd>
            </motion.form>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsHovered(true);
                setTimeout(() => searchInputRef.current?.focus(), 150);
              }}
              title="Buscar no acervo"
              className="w-full h-9 flex items-center justify-center bg-canvas-well border border-border-subtle hover:border-border-specular text-text-platinum hover:text-text-optic transition-colors cursor-pointer"
            >
              <MagnifyingGlass weight="light" className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* --- SCROLLABLE NAVIGATION LIST --- */}
        <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-1.5 scrollbar-thin scrollbar-thumb-border-subtle">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSectionExpanded = expandedSection === item.id;
            const isActive =
              pathname === item.href ||
              (item.id === "roupas" && pathname.includes("category=Roupas")) ||
              (item.id === "sneakers" && pathname.includes("category=Sneakers")) ||
              (item.id === "acessorios" && pathname.includes("category=Acess%C3%B3rios"));

            return (
              <div key={item.id} className="relative">
                {/* Main Link / Accordion Trigger */}
                <div
                  className={`group relative flex items-center justify-between w-full h-11 px-2.5 transition-all border ${
                    isActive
                      ? "bg-canvas-well/80 border-border-specular text-text-optic"
                      : "border-transparent hover:bg-canvas-well/50 hover:border-border-subtle text-text-platinum hover:text-text-optic"
                  }`}
                >
                  {/* Active Indicator Pill (Magic UI / Framer Motion layoutId) */}
                  {isActive && (
                    <motion.div
                      layoutId="active-sidebar-pill"
                      className="absolute left-0 top-1 bottom-1 w-1 bg-text-optic shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Left Icon & Label */}
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 flex-1 overflow-hidden"
                    title={item.label}
                  >
                    <Icon
                      weight={isActive ? "bold" : "light"}
                      className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110"
                    />

                    {isOpen && (
                      <span className="font-mono text-xs tracking-[0.15em] uppercase whitespace-nowrap overflow-hidden">
                        {item.label}
                      </span>
                    )}
                  </Link>

                  {/* Right: Tag or Accordion Caret */}
                  {isOpen && item.tag && (
                    <span className="text-[9px] font-mono tracking-widest px-1.5 py-0.5 bg-canvas-base border border-border-subtle text-text-slate uppercase">
                      {item.tag}
                    </span>
                  )}

                  {isOpen && item.isAccordion && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedSection(isSectionExpanded ? null : item.id);
                      }}
                      className="p-1 text-text-slate hover:text-text-optic transition-colors cursor-pointer"
                    >
                      <CaretDown
                        weight="light"
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isSectionExpanded ? "rotate-180 text-text-optic" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Subcategory Accordion (When expanded) */}
                <AnimatePresence>
                  {isOpen && item.isAccordion && isSectionExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden bg-canvas-well/40 border-l border-border-subtle ml-4 my-1 pl-2 space-y-1"
                    >
                      {item.subcategories?.map((sub) => (
                        <Link
                          key={sub}
                          href={
                            item.id === "marcas"
                              ? `/produtos?brand=${encodeURIComponent(sub)}`
                              : `/produtos?category=${encodeURIComponent(
                                  item.id === "roupas"
                                    ? "Roupas"
                                    : item.id === "sneakers"
                                    ? "Sneakers"
                                    : "Acessórios"
                                )}&subcategory=${encodeURIComponent(sub)}`
                          }
                          className="flex items-center justify-between py-1.5 px-2 text-[11px] font-mono text-text-slate hover:text-text-optic hover:bg-canvas-base/80 transition-colors group"
                        >
                          <span className="truncate">{sub}</span>
                          <ArrowUpRight
                            weight="light"
                            className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-text-optic shrink-0 ml-1"
                          />
                        </Link>
                      ))}

                      {/* View All link for category */}
                      <Link
                        href={item.href}
                        className="flex items-center gap-1 py-1.5 px-2 text-[10px] font-mono font-bold text-text-optic hover:underline pt-1 border-t border-border-subtle/50"
                      >
                        <span>Ver tudo de {item.label}</span>
                        <ArrowUpRight weight="light" className="w-3 h-3" />
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* Originality Assurance Badge */}
          <div className="pt-2">
            <Link
              href="/produtos"
              className={`group flex items-center gap-3 w-full h-11 px-2.5 border transition-all ${
                isOpen
                  ? "bg-emerald-500/5 border-emerald-500/20 text-text-optic hover:border-emerald-500/40"
                  : "border-transparent hover:bg-canvas-well/50 text-text-platinum"
              }`}
              title="100% ORIGINAL // Autenticidade Pericial Certificada"
            >
              <div className="relative shrink-0">
                <ShieldCheck weight="light" className="w-5 h-5 text-emerald-400" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              </div>

              {isOpen && (
                <div className="flex flex-col whitespace-nowrap overflow-hidden">
                  <span className="font-mono text-[10px] font-bold tracking-wider text-emerald-400 uppercase leading-tight">
                    100% ORIGINAL
                  </span>
                  <span className="font-mono text-[8px] text-text-slate tracking-widest uppercase">
                    LAUDO PERICIAL DIGITAL
                  </span>
                </div>
              )}
            </Link>
          </div>
        </div>

        {/* --- BOTTOM UTILITY DOCK --- */}
        <div className="relative z-10 border-t border-border-subtle p-3 space-y-2 bg-canvas-well/60 shrink-0">
          {/* Currency Toggle */}
          <div className="relative">
            {isOpen ? (
              <div
                className="flex items-center justify-between bg-canvas-base border border-border-subtle p-1"
                onMouseEnter={() => setShowCurrencyTooltip(true)}
                onMouseLeave={() => setShowCurrencyTooltip(false)}
              >
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-text-slate pl-1">
                  <Globe weight="light" className="w-3.5 h-3.5" />
                  <span>MOEDA</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[10px]">
                  <button
                    type="button"
                    onClick={() => setCurrency("BRL")}
                    className={`px-2 py-0.5 tracking-wider transition-all cursor-pointer ${
                      currency === "BRL"
                        ? "bg-text-optic text-canvas-base font-bold shadow-sm"
                        : "text-text-slate hover:text-text-platinum"
                    }`}
                  >
                    BRL
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrency("USD");
                      setShowCurrencyTooltip(true);
                      setTimeout(() => setShowCurrencyTooltip(false), 2500);
                    }}
                    className={`px-2 py-0.5 tracking-wider transition-all cursor-pointer ${
                      currency === "USD"
                        ? "bg-text-optic text-canvas-base font-bold shadow-sm"
                        : "text-text-slate hover:text-text-platinum"
                    }`}
                  >
                    USD
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setCurrency(currency === "BRL" ? "USD" : "BRL")}
                title={`Moeda ativa: ${currency}. Clique para alternar.`}
                className="w-full h-8 flex items-center justify-center bg-canvas-base border border-border-subtle text-[9px] font-mono text-text-platinum hover:text-text-optic cursor-pointer"
              >
                {currency}
              </button>
            )}

            {showCurrencyTooltip && isOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-60 p-2.5 bg-canvas-well border border-border-subtle shadow-2xl z-50 text-[10px] text-text-platinum space-y-1">
                <div className="flex items-center gap-1 text-text-optic font-bold">
                  <Globe weight="light" className="w-3.5 h-3.5 text-emerald-400" />
                  <span>PARIDADE CAMBIAL EM TEMPO REAL</span>
                </div>
                <p className="text-text-slate text-[9px] leading-tight font-mono">
                  Conversão instantânea BRL / USD para compras e remessas internacionais seguras.
                </p>
              </div>
            )}
          </div>

          {/* User Account Link */}
          <Link
            href="/entrar"
            className="flex items-center gap-3 w-full h-10 px-2.5 bg-canvas-base border border-border-subtle hover:border-border-specular text-text-platinum hover:text-text-optic text-xs font-mono transition-colors"
            title="Conta do Usuário / Entrar"
          >
            <User weight="light" className="w-4 h-4 shrink-0" />
            {isOpen && (
              <span className="truncate tracking-widest text-[11px] uppercase">
                Entrar / Perfil
              </span>
            )}
          </Link>

          {/* Shopping Bag Button (Live Counter) */}
          <Link
            href="/carrinho"
            className="group relative flex items-center justify-between w-full h-10 px-2.5 bg-text-optic text-canvas-base font-mono text-xs font-bold transition-transform active:scale-[0.98] shadow-lg"
            title="Ver Sacola de Compras"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <Bag weight="bold" className="w-4 h-4 shrink-0" />
              {isOpen && <span className="tracking-widest uppercase">Sacola</span>}
            </div>

            {/* Dynamic Counter with pulse */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs bg-canvas-base text-text-optic px-1.5 py-0.5 rounded-none font-mono">
                {mounted ? itemCount : 0}
              </span>
              {mounted && itemCount > 0 && (
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping shrink-0" />
              )}
            </div>
          </Link>
        </div>
      </motion.aside>

      {/* ========================================================================= */}
      {/* 2. MOBILE TOP BAR & SLIDE-IN SHEET (< lg Viewports)                       */}
      {/* ========================================================================= */}
      <div className="lg:hidden sticky top-0 z-50 w-full bg-canvas-base/95 backdrop-blur-xl border-b border-border-subtle px-4 py-3 flex items-center justify-between">
        {/* Mobile Brand Monolith */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-3.5 h-3.5 bg-text-optic rotate-45 shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
          <span className="font-mono text-base font-black tracking-[0.2em] text-text-optic uppercase">
            DESAPEGADO
          </span>
        </Link>

        {/* Mobile Right Controls: Search, Cart, Hamburger Menu */}
        <div className="flex items-center gap-2">
          {/* Cart button */}
          <Link
            href="/carrinho"
            className="relative p-2 bg-canvas-well border border-border-subtle text-text-optic flex items-center justify-center"
            title="Sacola"
          >
            <Bag weight="light" className="w-4 h-4" />
            {mounted && itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 text-canvas-base font-mono text-[9px] font-bold flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 bg-canvas-well border border-border-subtle text-text-optic flex items-center justify-center cursor-pointer"
            aria-label="Abrir menu"
          >
            {mobileOpen ? <X weight="light" className="w-4 h-4" /> : <List weight="light" className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-In Sheet Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            />

            {/* Sheet Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed top-0 bottom-0 left-0 z-50 w-4/5 max-w-sm bg-canvas-base border-r border-border-subtle p-5 flex flex-col justify-between font-mono text-xs overflow-y-auto"
            >
              <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-text-optic rotate-45" />
                    <span className="font-bold tracking-widest uppercase text-text-optic">
                      ACERVO // MENU
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="p-1 text-text-slate hover:text-text-optic cursor-pointer"
                  >
                    <X weight="light" className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Search */}
                <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                  <div className="w-full flex items-center bg-canvas-well border border-border-subtle px-3 py-2">
                    <MagnifyingGlass weight="light" className="w-4 h-4 text-text-platinum mr-2 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="BUSCAR GRAILS..."
                      className="w-full bg-transparent text-text-optic placeholder:text-text-slate text-[11px] tracking-wider uppercase outline-none"
                    />
                  </div>
                </form>

                {/* Navigation Items */}
                <div className="space-y-2">
                  <Link
                    href="/produtos"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between p-3 bg-canvas-well border border-border-subtle text-text-optic font-bold uppercase tracking-wider"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkle weight="light" className="w-4 h-4 text-emerald-400" />
                      Novidades Recentes
                    </span>
                    <ArrowUpRight weight="light" className="w-4 h-4 text-text-slate" />
                  </Link>

                  {/* Accordions for Roupas, Sneakers, Acessórios */}
                  {(["Roupas", "Sneakers", "Acessórios"] as const).map((cat) => (
                    <div key={cat} className="border border-border-subtle bg-canvas-well">
                      <button
                        type="button"
                        onClick={() =>
                          setMobileExpandedSection(mobileExpandedSection === cat ? null : cat)
                        }
                        className="w-full p-3 flex items-center justify-between text-left font-bold text-text-optic uppercase tracking-wider cursor-pointer"
                      >
                        <span>{cat}</span>
                        <CaretDown
                          weight="light"
                          className={`w-4 h-4 transition-transform ${
                            mobileExpandedSection === cat ? "rotate-180 text-text-optic" : "text-text-slate"
                          }`}
                        />
                      </button>

                      {mobileExpandedSection === cat && (
                        <div className="p-3 border-t border-border-subtle grid grid-cols-1 gap-1.5 bg-canvas-base">
                          {TAXONOMY_SUBCATEGORIES[cat].map((sub) => (
                            <Link
                              key={sub}
                              href={`/produtos?category=${encodeURIComponent(cat)}&subcategory=${encodeURIComponent(sub)}`}
                              onClick={() => setMobileOpen(false)}
                              className="py-1.5 px-2 text-text-platinum hover:text-text-optic flex items-center justify-between text-[11px]"
                            >
                              <span>{sub}</span>
                              <ArrowUpRight weight="light" className="w-3 h-3 text-text-slate" />
                            </Link>
                          ))}
                          <Link
                            href={`/produtos?category=${encodeURIComponent(cat)}`}
                            onClick={() => setMobileOpen(false)}
                            className="pt-2 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border-t border-border-subtle/50"
                          >
                            <span>Explorar Todas ({cat})</span>
                            <ArrowUpRight weight="light" className="w-3 h-3" />
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Marcas Accordion */}
                  <div className="border border-border-subtle bg-canvas-well">
                    <button
                      type="button"
                      onClick={() =>
                        setMobileExpandedSection(mobileExpandedSection === "Marcas" ? null : "Marcas")
                      }
                      className="w-full p-3 flex items-center justify-between text-left font-bold text-text-optic uppercase tracking-wider cursor-pointer"
                    >
                      <span>Marcas ({TAXONOMY_BRANDS.length})</span>
                      <CaretDown
                        weight="light"
                        className={`w-4 h-4 transition-transform ${
                          mobileExpandedSection === "Marcas" ? "rotate-180 text-text-optic" : "text-text-slate"
                        }`}
                      />
                    </button>

                    {mobileExpandedSection === "Marcas" && (
                      <div className="p-3 border-t border-border-subtle grid grid-cols-2 gap-2 bg-canvas-base">
                        {TAXONOMY_BRANDS.map((brand) => (
                          <Link
                            key={brand}
                            href={`/produtos?brand=${encodeURIComponent(brand)}`}
                            onClick={() => setMobileOpen(false)}
                            className="py-1 px-1.5 text-text-platinum hover:text-text-optic text-[10px] truncate"
                          >
                            {brand}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Bottom Utilities */}
              <div className="space-y-3 pt-4 border-t border-border-subtle">
                <div className="flex items-center justify-between bg-canvas-well border border-border-subtle p-2">
                  <span className="text-[10px] text-text-slate uppercase">Moeda</span>
                  <div className="flex items-center gap-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setCurrency("BRL")}
                      className={`px-2 py-0.5 ${
                        currency === "BRL" ? "bg-text-optic text-canvas-base font-bold" : "text-text-slate"
                      }`}
                    >
                      BRL
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrency("USD")}
                      className={`px-2 py-0.5 ${
                        currency === "USD" ? "bg-text-optic text-canvas-base font-bold" : "text-text-slate"
                      }`}
                    >
                      USD
                    </button>
                  </div>
                </div>

                <Link
                  href="/entrar"
                  onClick={() => setMobileOpen(false)}
                  className="w-full p-2.5 bg-canvas-well border border-border-subtle text-text-optic flex items-center justify-center gap-2 uppercase tracking-wider text-[11px]"
                >
                  <User weight="light" className="w-4 h-4" />
                  Entrar / Criar Conta
                </Link>

                <Link
                  href="/carrinho"
                  onClick={() => setMobileOpen(false)}
                  className="w-full p-3 bg-text-optic text-canvas-base font-bold flex items-center justify-between uppercase tracking-wider"
                >
                  <span className="flex items-center gap-2">
                    <Bag weight="bold" className="w-4 h-4" />
                    Sacola de Compras
                  </span>
                  <span>{mounted ? itemCount : 0} itens</span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
