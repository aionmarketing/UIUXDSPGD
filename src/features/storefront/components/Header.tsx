"use client";

import React, { useState, useRef, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ShoppingBag,
  Search,
  Menu,
  X,
  ShieldCheck,
  ArrowUpRight,
  User,
} from "lucide-react";
import {
  TAXONOMY_SUBCATEGORIES,
  TAXONOMY_BRANDS,
} from "@/features/seller-pwa/taxonomy";
import { useCartStore } from "../stores/useCartStore";

const emptySubscribe = () => () => {};

export function Header() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const itemCount = useCartStore((state) => state.getItemCount());

  const handleMouseEnter = (menuKey: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(menuKey);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  // Close dropdown on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* 1. Top Specular Micro-Bar */}
      <div className="w-full bg-canvas-well border-b border-border-subtle px-4 sm:px-6 py-1.5 flex items-center justify-between text-[11px] font-mono text-text-slate">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-text-platinum">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block"></span>
            CURADORIA EXCLUSIVA &amp; AUTENTICADA
          </span>
          <span className="hidden md:inline text-text-slate">
            ENVIO SEGURO PARA TODO O BRASIL COM CERTIFICADO
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/admin/produtos"
            className="text-text-platinum hover:text-text-optic transition-colors flex items-center gap-1 font-bold"
          >
            <span>QUERO VENDER // PAINEL</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
          <span className="hidden sm:inline text-text-slate">BRL (R$)</span>
        </div>
      </div>

      {/* 2. Main Liquid Specular Glass Navbar */}
      <div className="relative w-full bg-glass-substrate backdrop-blur-[36px] border-t border-border-specular border-b border-border-subtle shadow-xl px-4 sm:px-6 py-3.5 flex items-center justify-between transition-all">
        {/* Left: Brand Monolith */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-3 h-3 bg-text-optic rotate-45 group-hover:rotate-90 transition-transform duration-300 shadow-[0_0_12px_rgba(255,255,255,0.4)]" />
            <div className="flex flex-col">
              <span className="font-mono text-base sm:text-lg font-black tracking-[0.22em] text-text-optic leading-none uppercase">
                DESAPEGADO
              </span>
              <span className="text-[9px] font-mono tracking-widest text-text-slate uppercase">
                STREETWEAR &amp; LUXO // ACERVO
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links with Taxonomy Dropdowns */}
          <nav className="hidden lg:flex items-center gap-1 font-mono text-xs">
            {/* NOVIDADES LINK */}
            <Link
              href="/produtos"
              className="px-3.5 py-2 text-text-platinum hover:text-text-optic tracking-wider transition-colors uppercase font-medium"
            >
              Novidades
            </Link>

            {/* ROUPAS DROPDOWN */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("Roupas")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "Roupas" ? null : "Roupas")}
                className={`px-3.5 py-2 flex items-center gap-1.5 uppercase tracking-wider transition-colors cursor-pointer ${
                  activeDropdown === "Roupas"
                    ? "text-text-optic font-bold"
                    : "text-text-platinum hover:text-text-optic"
                }`}
              >
                <span>Roupas</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === "Roupas" ? "rotate-180 text-text-optic" : "text-text-slate"
                  }`}
                />
              </button>

              {/* Liquid Glass Specular Dropdown Container for Roupas */}
              {activeDropdown === "Roupas" && (
                <div
                  className="absolute left-0 top-full pt-2 w-[420px] animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseEnter={() => handleMouseEnter("Roupas")}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="bg-glass-substrate backdrop-blur-[36px] border-t border-border-specular border-b-black/90 border-x border-border-subtle shadow-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                      <span className="text-[11px] font-mono font-bold tracking-widest text-text-optic uppercase">
                        CATEGORIAS // ROUPAS
                      </span>
                      <span className="text-[10px] font-mono text-text-slate">
                        {TAXONOMY_SUBCATEGORIES.Roupas.length} CATEGORIAS
                      </span>
                    </div>

                    {/* Contrast Mandate: Solid bg-canvas-well block */}
                    <div className="bg-canvas-well border border-border-subtle p-3.5">
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        {TAXONOMY_SUBCATEGORIES.Roupas.map((item) => (
                          <Link
                            key={item}
                            href={`/produtos?category=Roupas&subcategory=${encodeURIComponent(item)}`}
                            onClick={() => setActiveDropdown(null)}
                            className="p-2 hover:bg-canvas-base border border-transparent hover:border-border-subtle text-text-platinum hover:text-text-optic flex items-center justify-between group transition-all"
                          >
                            <span>{item}</span>
                            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-text-optic" />
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-text-slate">
                      <span>Arquivo Streetwear &amp; Passarela</span>
                      <Link
                        href="/produtos?category=Roupas"
                        onClick={() => setActiveDropdown(null)}
                        className="text-text-optic hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Explorar Todas</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ACESSÓRIOS DROPDOWN */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("Acessórios")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown(activeDropdown === "Acessórios" ? null : "Acessórios")
                }
                className={`px-3.5 py-2 flex items-center gap-1.5 uppercase tracking-wider transition-colors cursor-pointer ${
                  activeDropdown === "Acessórios"
                    ? "text-text-optic font-bold"
                    : "text-text-platinum hover:text-text-optic"
                }`}
              >
                <span>Acessórios</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === "Acessórios"
                      ? "rotate-180 text-text-optic"
                      : "text-text-slate"
                  }`}
                />
              </button>

              {/* Liquid Glass Dropdown Container for Acessórios */}
              {activeDropdown === "Acessórios" && (
                <div
                  className="absolute left-0 top-full pt-2 w-[440px] animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseEnter={() => handleMouseEnter("Acessórios")}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="bg-glass-substrate backdrop-blur-[36px] border-t border-border-specular border-b-black/90 border-x border-border-subtle shadow-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                      <span className="text-[11px] font-mono font-bold tracking-widest text-text-optic uppercase">
                        CATEGORIAS // ACESSÓRIOS
                      </span>
                      <span className="text-[10px] font-mono text-text-slate">
                        {TAXONOMY_SUBCATEGORIES.Acessórios.length} SUBCATEGORIAS
                      </span>
                    </div>

                    {/* Solid bg-canvas-well block for WCAG AAA Contrast */}
                    <div className="bg-canvas-well border border-border-subtle p-3.5">
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        {TAXONOMY_SUBCATEGORIES.Acessórios.map((item) => (
                          <Link
                            key={item}
                            href={`/produtos?category=${encodeURIComponent("Acessórios")}&subcategory=${encodeURIComponent(item)}`}
                            onClick={() => setActiveDropdown(null)}
                            className="p-2 hover:bg-canvas-base border border-transparent hover:border-border-subtle text-text-platinum hover:text-text-optic flex items-center justify-between group transition-all"
                          >
                            <span>{item}</span>
                            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-text-optic" />
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-text-slate">
                      <span>Bonés, Buckets, Bolsas e Acessórios</span>
                      <Link
                        href={`/produtos?category=${encodeURIComponent("Acessórios")}`}
                        onClick={() => setActiveDropdown(null)}
                        className="text-text-optic hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Ver Acessórios</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SNEAKERS DROPDOWN */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("Sneakers")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown(activeDropdown === "Sneakers" ? null : "Sneakers")
                }
                className={`px-3.5 py-2 flex items-center gap-1.5 uppercase tracking-wider transition-colors cursor-pointer ${
                  activeDropdown === "Sneakers"
                    ? "text-text-optic font-bold"
                    : "text-text-platinum hover:text-text-optic"
                }`}
              >
                <span>Sneakers</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === "Sneakers" ? "rotate-180 text-text-optic" : "text-text-slate"
                  }`}
                />
              </button>

              {/* Liquid Glass Dropdown Container for Sneakers */}
              {activeDropdown === "Sneakers" && (
                <div
                  className="absolute left-0 top-full pt-2 w-[400px] animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseEnter={() => handleMouseEnter("Sneakers")}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="bg-glass-substrate backdrop-blur-[36px] border-t border-border-specular border-b-black/90 border-x border-border-subtle shadow-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                      <span className="text-[11px] font-mono font-bold tracking-widest text-text-optic uppercase">
                        SNEAKERS // SELEÇÃO DE GRAILS
                      </span>
                      <span className="text-[10px] font-mono text-text-slate">
                        SELEÇÃO DE LUXO &amp; GRAILS
                      </span>
                    </div>

                    {/* Solid bg-canvas-well block */}
                    <div className="bg-canvas-well border border-border-subtle p-3.5 space-y-2">
                      <div className="grid grid-cols-1 gap-1.5 text-xs font-mono">
                        {TAXONOMY_SUBCATEGORIES.Sneakers.map((brandItem) => (
                          <Link
                            key={brandItem}
                            href={`/produtos?category=Sneakers&brand=${encodeURIComponent(brandItem)}`}
                            onClick={() => setActiveDropdown(null)}
                            className="p-2.5 hover:bg-canvas-base border border-transparent hover:border-border-subtle text-text-platinum hover:text-text-optic flex items-center justify-between group transition-all"
                          >
                            <span className="font-bold text-text-optic">{brandItem}</span>
                            <span className="text-[10px] text-text-slate flex items-center gap-1 group-hover:text-text-optic">
                              <span>Acervo Autenticado</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-text-slate">
                      <span>Nike, Adidas, Balenciaga, Lanvin, LV</span>
                      <Link
                        href="/produtos?category=Sneakers"
                        onClick={() => setActiveDropdown(null)}
                        className="text-text-optic hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Explorar Sneakers</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* MARCAS LINK */}
            <Link
              href="/produtos"
              className="px-3.5 py-2 text-text-platinum hover:text-text-optic tracking-wider transition-colors uppercase font-medium"
            >
              Marcas
            </Link>
          </nav>
        </div>

        {/* Right: Actions (Search, Authenticity, Bag, Auth, PWA CTA) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Search Button */}
          <Link
            href="/produtos"
            aria-label="Pesquisar catálogo"
            className="h-10 px-3 bg-canvas-well border border-border-subtle text-text-slate hover:text-text-optic hover:border-border-specular flex items-center gap-2 text-xs font-mono transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-text-platinum" />
            <span className="hidden md:inline">Buscar...</span>
            <kbd className="hidden lg:inline-block bg-canvas-base px-1.5 py-0.5 border border-border-subtle text-[10px] text-text-slate">
              /
            </kbd>
          </Link>

          {/* Authenticity Badge */}
          <div className="hidden xl:flex items-center gap-1.5 bg-canvas-well border border-border-subtle px-3 py-2 text-xs font-mono text-text-platinum">
            <ShieldCheck className="w-3.5 h-3.5 text-text-optic" />
            <span className="text-[11px] tracking-wider uppercase font-medium">100% ORIGINAL</span>
          </div>

          {/* User Auth Link */}
          <Link
            href="/entrar"
            aria-label="Conta do Usuário"
            className="h-10 px-3 bg-canvas-well border border-border-subtle text-text-platinum hover:text-text-optic hover:border-border-specular flex items-center gap-1.5 text-xs font-mono transition-colors"
          >
            <User className="w-3.5 h-3.5 text-text-platinum" />
            <span className="hidden md:inline">Entrar</span>
          </Link>

          {/* Shopping Bag Button (Links to /carrinho with live count) */}
          <Link
            href="/carrinho"
            aria-label="Sacola de Compras"
            className="h-10 px-3 sm:px-3.5 bg-canvas-well border border-border-subtle text-text-optic flex items-center gap-2 text-xs font-mono hover:border-border-specular transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-text-optic" />
            <span className="font-bold">{mounted ? itemCount : 0}</span>
          </Link>

          {/* Seller PWA Direct CTA */}
          <Link
            href="/admin/produtos"
            className="hidden sm:flex h-10 px-3.5 min-h-[40px] bg-text-optic text-canvas-base font-mono font-bold text-xs uppercase tracking-wider items-center gap-1.5 hover:bg-neutral-200 active:scale-[0.99] transition cursor-pointer"
          >
            <span>Vender Peça</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menu de navegação"
            className="lg:hidden h-10 w-10 bg-canvas-well border border-border-subtle flex items-center justify-center text-text-optic cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 3. Mobile Navigation Drawer (Full Taxonomy Accordion) */}
      {mobileMenuOpen && (
        <div className="lg:hidden w-full bg-canvas-base border-b border-border-subtle p-5 space-y-5 animate-in fade-in slide-in-from-top-4 duration-200 font-mono text-xs max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
            <span className="text-text-platinum uppercase tracking-widest font-bold text-xs">
              CATEGORIAS DO ACERVO
            </span>
            <span className="text-[10px] text-text-slate">DESAPEGADO // BRASIL</span>
          </div>

          <div className="space-y-3">
            {/* Mobile Roupas Accordion */}
            <div className="border border-border-subtle bg-canvas-well">
              <button
                type="button"
                onClick={() =>
                  setMobileExpandedCat(mobileExpandedCat === "Roupas" ? null : "Roupas")
                }
                className="w-full p-3.5 flex items-center justify-between text-left font-bold text-text-optic uppercase tracking-wider cursor-pointer"
              >
                <span>Roupas ({TAXONOMY_SUBCATEGORIES.Roupas.length})</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    mobileExpandedCat === "Roupas" ? "rotate-180 text-text-optic" : "text-text-slate"
                  }`}
                />
              </button>
              {mobileExpandedCat === "Roupas" && (
                <div className="p-3 border-t border-border-subtle grid grid-cols-2 gap-2 bg-canvas-base">
                  {TAXONOMY_SUBCATEGORIES.Roupas.map((item) => (
                    <Link
                      key={item}
                      href={`/produtos?category=Roupas&subcategory=${encodeURIComponent(item)}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 text-text-platinum hover:text-text-optic border border-border-subtle bg-canvas-well text-center"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Acessórios Accordion */}
            <div className="border border-border-subtle bg-canvas-well">
              <button
                type="button"
                onClick={() =>
                  setMobileExpandedCat(mobileExpandedCat === "Acessórios" ? null : "Acessórios")
                }
                className="w-full p-3.5 flex items-center justify-between text-left font-bold text-text-optic uppercase tracking-wider cursor-pointer"
              >
                <span>Acessórios ({TAXONOMY_SUBCATEGORIES.Acessórios.length})</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    mobileExpandedCat === "Acessórios"
                      ? "rotate-180 text-text-optic"
                      : "text-text-slate"
                  }`}
                />
              </button>
              {mobileExpandedCat === "Acessórios" && (
                <div className="p-3 border-t border-border-subtle grid grid-cols-2 gap-2 bg-canvas-base">
                  {TAXONOMY_SUBCATEGORIES.Acessórios.map((item) => (
                    <Link
                      key={item}
                      href={`/produtos?category=${encodeURIComponent("Acessórios")}&subcategory=${encodeURIComponent(item)}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 text-text-platinum hover:text-text-optic border border-border-subtle bg-canvas-well text-center"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Sneakers Accordion */}
            <div className="border border-border-subtle bg-canvas-well">
              <button
                type="button"
                onClick={() =>
                  setMobileExpandedCat(mobileExpandedCat === "Sneakers" ? null : "Sneakers")
                }
                className="w-full p-3.5 flex items-center justify-between text-left font-bold text-text-optic uppercase tracking-wider cursor-pointer"
              >
                <span>Sneakers ({TAXONOMY_SUBCATEGORIES.Sneakers.length})</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    mobileExpandedCat === "Sneakers"
                      ? "rotate-180 text-text-optic"
                      : "text-text-slate"
                  }`}
                />
              </button>
              {mobileExpandedCat === "Sneakers" && (
                <div className="p-3 border-t border-border-subtle grid grid-cols-1 gap-1.5 bg-canvas-base">
                  {TAXONOMY_SUBCATEGORIES.Sneakers.map((brandItem) => (
                    <Link
                      key={brandItem}
                      href={`/produtos?category=Sneakers&brand=${encodeURIComponent(brandItem)}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 text-text-optic border border-border-subtle bg-canvas-well flex items-center justify-between font-bold"
                    >
                      <span>{brandItem}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-text-slate" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Marcas Quick Link */}
            <Link
              href="/produtos"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-3.5 bg-canvas-well border border-border-subtle font-bold text-text-optic uppercase tracking-wider text-center"
            >
              Explorar Todas as Marcas ({TAXONOMY_BRANDS.length})
            </Link>

            {/* Mobile Entrar / Minha Conta */}
            <Link
              href="/entrar"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-3.5 bg-canvas-well border border-border-subtle font-bold text-text-platinum hover:text-text-optic uppercase tracking-wider text-center"
            >
              Minha Conta // Entrar
            </Link>

            {/* Mobile Sacola */}
            <Link
              href="/carrinho"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-3.5 bg-canvas-well border border-border-subtle font-bold text-text-optic uppercase tracking-wider text-center"
            >
              Sacola de Compras ({mounted ? itemCount : 0})
            </Link>

            {/* Mobile Vender CTA */}
            <Link
              href="/admin/produtos"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-4 bg-text-optic text-canvas-base font-bold uppercase tracking-widest text-center"
            >
              Painel do Vendedor // Upload PWA &rarr;
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
