"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  ShoppingBag,
  Truck,
  Check,
  ArrowRight,
  Maximize2,
  Clock,
  Lock,
} from "lucide-react";
import type { CatalogProduct } from "@/features/storefront";
import { useCartStore, AVAILABLE_SHIPPING_METHODS } from "@/features/storefront";

interface PDPClientViewProps {
  product: CatalogProduct;
  relatedProducts: CatalogProduct[];
}

export function PDPClientView({ product, relatedProducts }: PDPClientViewProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const setStoreShipping = useCartStore((state) => state.setShippingMethod);
  const setStoreCep = useCartStore((state) => state.setCep);

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Size state
  const [selectedSize, setSelectedSize] = useState(product.size);

  // Cart action state
  const [isAdded, setIsAdded] = useState(false);

  // Shipping calculator state
  const [simulatedCep, setSimulatedCep] = useState("");
  const [shippingCalculated, setShippingCalculated] = useState(false);
  const [selectedShippingId, setSelectedShippingId] = useState<string>("sedex");

  const handleAddToCart = () => {
    addItem(product, selectedSize);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2500);
  };

  const handleBuyNow = () => {
    addItem(product, selectedSize);
    router.push("/checkout");
  };

  const handleCalculateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (simulatedCep.trim().length >= 8) {
      setShippingCalculated(true);
      setStoreCep(simulatedCep);
      const chosen = AVAILABLE_SHIPPING_METHODS.find((m) => m.id === selectedShippingId);
      if (chosen) setStoreShipping(chosen);
    }
  };

  return (
    <div className="min-h-screen bg-canvas-base text-text-optic py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* 1. Breadcrumbs Bar */}
        <nav className="flex items-center gap-2 font-mono text-xs text-text-slate border-b border-border-subtle pb-4 flex-wrap">
          <Link href="/" className="hover:text-text-optic transition-colors">
            Início
          </Link>
          <span>/</span>
          <Link href="/produtos" className="hover:text-text-optic transition-colors">
            Catálogo
          </Link>
          <span>/</span>
          <Link
            href={`/produtos?category=${encodeURIComponent(product.category)}`}
            className="hover:text-text-optic transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <Link
            href={`/produtos?subcategory=${encodeURIComponent(product.subcategory)}`}
            className="hover:text-text-optic transition-colors"
          >
            {product.subcategory}
          </Link>
          <span>/</span>
          <span className="text-text-optic font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* 2. Main Two-Column Viewport */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: Photographic Gallery + Forensic Certificate (NO 3D garment) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Specular Liquid Glass Photo Container */}
            <div className="relative aspect-[4/5] w-full bg-glass-substrate backdrop-blur-[36px] border-t border-border-specular border-b border-border-subtle shadow-2xl overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={`${product.brand} ${product.name} - Ângulo ${activeImageIndex + 1}`}
                className={`w-full h-full object-cover transition-transform duration-500 cursor-crosshair ${
                  isZoomed ? "scale-150" : "group-hover:scale-105"
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
                <span className="bg-canvas-well/90 backdrop-blur border border-border-subtle text-text-optic px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider">
                  {product.condition}
                </span>

                {product.tag && (
                  <span className="bg-text-optic text-canvas-base px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider shadow">
                    {product.tag}
                  </span>
                )}
              </div>

              {/* Zoom Action Pill */}
              <button
                type="button"
                onClick={() => setIsZoomed(!isZoomed)}
                className="absolute top-4 right-4 bg-canvas-well/90 hover:bg-canvas-well border border-border-subtle text-text-optic px-2.5 py-1 font-mono text-[10px] uppercase flex items-center gap-1.5 transition cursor-pointer"
              >
                <Maximize2 className="w-3 h-3" />
                <span>{isZoomed ? "Reduzir" : "Zoom Óptico"}</span>
              </button>

              {/* Bottom Angle Indicator */}
              <div className="absolute bottom-4 right-4 bg-canvas-well/80 backdrop-blur px-3 py-1 border border-border-subtle text-[10px] font-mono text-text-platinum font-bold">
                ÂNGULO {activeImageIndex + 1} DE {product.images.length}
              </div>

              <div className="absolute bottom-4 left-4 bg-canvas-well/80 backdrop-blur px-3 py-1 border border-border-subtle text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>FOTOGRAFIA MACRO AUTÊNTICA</span>
              </div>
            </div>

            {/* Gallery Thumbnail Strip */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActiveImageIndex(idx);
                    setIsZoomed(false);
                  }}
                  className={`relative aspect-square bg-canvas-well border overflow-hidden transition cursor-pointer ${
                    activeImageIndex === idx
                      ? "border-text-optic ring-1 ring-text-optic"
                      : "border-border-subtle opacity-70 hover:opacity-100 hover:border-border-specular"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`Miniatura ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 bg-canvas-base/90 px-1 text-[8px] font-mono text-text-platinum">
                    #{idx + 1}
                  </div>
                </button>
              ))}
            </div>

            {/* FORENSIC INSPECTION CERTIFICATE BLOCK (High-Contrast Well) */}
            <div className="bg-canvas-well border border-border-subtle p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-text-optic">
                    CERTIFICADO DE AUTENTICIDADE // SELO DESAPEGADO
                  </span>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                  CERTIFICADO ATIVO
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
                <div>
                  <span className="text-text-slate block text-[10px] uppercase">Protocolo</span>
                  <span className="text-text-optic font-bold">{product.forensicReport.certificateId}</span>
                </div>
                <div>
                  <span className="text-text-slate block text-[10px] uppercase">Especialista</span>
                  <span className="text-text-optic font-bold">{product.forensicReport.inspector}</span>
                </div>
                <div>
                  <span className="text-text-slate block text-[10px] uppercase">Data de Verificação</span>
                  <span className="text-text-optic font-bold">{product.forensicReport.inspectionDate}</span>
                </div>
                <div>
                  <span className="text-text-slate block text-[10px] uppercase">Nota Global</span>
                  <span className="text-emerald-400 font-bold">{product.forensicReport.overallGrade}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-border-subtle font-mono text-xs">
                <span className="text-[11px] text-text-slate uppercase tracking-wider block font-bold">
                  Parâmetros Inspecionados Fisicamente:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-text-platinum">
                  <div className="p-2 bg-canvas-base border border-border-subtle flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{product.forensicReport.details.stitchPrecision}</span>
                  </div>
                  <div className="p-2 bg-canvas-base border border-border-subtle flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{product.forensicReport.details.labelHologram}</span>
                  </div>
                  <div className="p-2 bg-canvas-base border border-border-subtle flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{product.forensicReport.details.fabricDensity}</span>
                  </div>
                  <div className="p-2 bg-canvas-base border border-border-subtle flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{product.forensicReport.details.serialMatch}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Monolithic Data Well (Brand, Name, Condition, Price, CTAs, Shipping) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary High-Contrast Data Well (--color-canvas-well) */}
            <div className="bg-canvas-well border border-border-subtle p-6 sm:p-8 space-y-6 shadow-2xl">
              {/* Brand & Subcategory */}
              <div className="space-y-2 border-b border-border-subtle pb-4">
                <div className="flex items-center justify-between font-mono text-xs">
                  <Link
                    href={`/produtos?brand=${encodeURIComponent(product.brand)}`}
                    className="font-black uppercase tracking-[0.2em] text-text-optic text-sm hover:underline"
                  >
                    {product.brand}
                  </Link>
                  <span className="text-text-slate uppercase tracking-wider">
                    {product.category} {"//"} {product.subcategory}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-bold font-mono text-text-optic leading-snug">
                  {product.name}
                </h1>
              </div>

              {/* Price & Payment terms */}
              <div className="space-y-2">
                <div className="flex items-baseline justify-between font-mono">
                  <div>
                    <span className="text-[10px] text-text-slate uppercase block">Valor Curadoria</span>
                    <span className="text-3xl sm:text-4xl font-black text-text-optic">
                      R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  {product.originalRetailPrice && (
                    <div className="text-right">
                      <span className="text-[10px] text-text-slate uppercase block">Valor Original</span>
                      <span className="text-sm line-through text-text-slate">
                        R$ {product.originalRetailPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-canvas-base border border-border-subtle p-3 flex items-center justify-between font-mono text-xs">
                  <span className="text-text-platinum">
                    ou em até <strong>12x de R$ {(product.price / 12).toFixed(2).replace(".", ",")}</strong> sem juros
                  </span>
                  <span className="text-emerald-400 font-bold text-[11px] uppercase">
                    5% OFF NO PIX
                  </span>
                </div>
              </div>

              {/* Condition Inspector Box */}
              <div className="space-y-2 font-mono text-xs border-t border-border-subtle pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-slate uppercase font-bold text-[11px]">
                    Condição da Peça:
                  </span>
                  <span className="font-bold text-text-optic px-2 py-0.5 bg-canvas-base border border-border-subtle uppercase">
                    {product.conditionLabel}
                  </span>
                </div>
                <p className="text-text-platinum text-xs bg-canvas-base border border-border-subtle p-3 leading-relaxed">
                  {product.conditionNotes}
                </p>
              </div>

              {/* Size Selector */}
              <div className="space-y-2.5 font-mono text-xs border-t border-border-subtle pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-slate uppercase font-bold text-[11px]">
                    Tamanho Disponível:
                  </span>
                  <span className="text-text-platinum text-[11px]">Peça Única em Estoque</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSize(product.size)}
                    className={`h-11 px-5 border text-xs uppercase tracking-wider font-bold transition cursor-pointer ${
                      selectedSize === product.size
                        ? "bg-text-optic text-canvas-base border-text-optic"
                        : "bg-canvas-base text-text-optic border-border-subtle hover:border-text-optic"
                    }`}
                  >
                    {product.size}
                  </button>
                  <span className="text-text-slate text-[11px]">
                    (Medidas auditadas milimetricamente abaixo)
                  </span>
                </div>
              </div>

              {/* Physical Measurements Table */}
              <div className="bg-canvas-base border border-border-subtle p-3 space-y-2 font-mono text-xs">
                <span className="text-[10px] text-text-slate uppercase tracking-wider block font-bold">
                  Dimensões Físicas Reais:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                  {product.measurements.chest && (
                    <div>
                      <span className="text-text-slate block">Tórax / Busto:</span>
                      <span className="text-text-optic font-bold">{product.measurements.chest}</span>
                    </div>
                  )}
                  {product.measurements.length && (
                    <div>
                      <span className="text-text-slate block">Comprimento:</span>
                      <span className="text-text-optic font-bold">{product.measurements.length}</span>
                    </div>
                  )}
                  {product.measurements.shoulders && (
                    <div>
                      <span className="text-text-slate block">Ombro a Ombro:</span>
                      <span className="text-text-optic font-bold">{product.measurements.shoulders}</span>
                    </div>
                  )}
                  {product.measurements.insole && (
                    <div>
                      <span className="text-text-slate block">Palmilha:</span>
                      <span className="text-text-optic font-bold">{product.measurements.insole}</span>
                    </div>
                  )}
                  <div className="col-span-2">
                    <span className="text-text-slate block">Caimento:</span>
                    <span className="text-text-optic font-bold">{product.measurements.fit}</span>
                  </div>
                </div>
              </div>

              {/* Primary Call-to-Actions */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`w-full h-14 min-h-[50px] font-mono text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 transition cursor-pointer border ${
                    isAdded
                      ? "bg-emerald-500 text-canvas-base border-emerald-500"
                      : "bg-text-optic text-canvas-base border-text-optic hover:bg-neutral-200 active:scale-[0.99]"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Item Adicionado à Sacola!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Adicionar à Sacola</span>
                    </>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="h-12 bg-canvas-base border border-border-subtle text-text-optic hover:border-text-optic font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <span>Comprar Agora</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <Link
                    href="/carrinho"
                    className="h-12 bg-canvas-base border border-border-subtle text-text-platinum hover:text-text-optic hover:border-border-specular font-mono text-xs uppercase tracking-wider flex items-center justify-center transition"
                  >
                    Ir para Sacola &rarr;
                  </Link>
                </div>
              </div>

              {/* SHIPPING CALCULATOR (Calculadora de Frete) */}
              <div className="space-y-3 font-mono text-xs border-t border-border-subtle pt-4">
                <div className="flex items-center gap-2 text-text-optic">
                  <Truck className="w-4 h-4 text-text-platinum" />
                  <span className="font-bold uppercase tracking-wider text-[11px]">
                    Simular Frete e Prazo
                  </span>
                </div>

                <form onSubmit={handleCalculateShipping} className="flex gap-2">
                  <input
                    type="text"
                    value={simulatedCep}
                    onChange={(e) => setSimulatedCep(e.target.value)}
                    placeholder="Digite seu CEP (Ex: 01310-100)"
                    maxLength={9}
                    className="flex-1 h-11 bg-canvas-base border border-border-subtle px-3 text-xs font-mono text-text-optic outline-none focus:border-text-optic"
                  />
                  <button
                    type="submit"
                    className="h-11 px-4 bg-canvas-base border border-border-subtle hover:border-text-optic text-text-optic font-mono font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                  >
                    Calcular
                  </button>
                </form>

                {shippingCalculated && (
                  <div className="space-y-2 pt-2 animate-in fade-in duration-200">
                    {AVAILABLE_SHIPPING_METHODS.map((method) => (
                      <div
                        key={method.id}
                        onClick={() => {
                          setSelectedShippingId(method.id);
                          setStoreShipping(method);
                        }}
                        className={`p-3 border flex items-center justify-between cursor-pointer transition ${
                          selectedShippingId === method.id
                            ? "bg-canvas-base border-text-optic text-text-optic"
                            : "bg-canvas-base/50 border-border-subtle text-text-platinum hover:border-border-specular"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-text-optic">{method.label}</span>
                            <span className="text-[10px] text-text-slate">({method.estimatedDays})</span>
                          </div>
                          <p className="text-[10px] text-text-slate">{method.description}</p>
                        </div>
                        <span className="font-bold font-mono text-xs">
                          R$ {method.price.toFixed(2).replace(".", ",")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Provenance & Monolith Guarantees */}
              <div className="space-y-3 pt-4 border-t border-border-subtle font-mono text-xs text-text-slate">
                <div className="flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-text-platinum shrink-0 mt-0.5" />
                  <div>
                    <span className="text-text-optic font-bold block">Garantia Incondicional de Autenticidade</span>
                    <span className="text-[11px]">
                      Se for constatada qualquer divergência de autenticidade, reembolso de 100% do valor com estorno imediato.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-text-platinum shrink-0 mt-0.5" />
                  <div>
                    <span className="text-text-optic font-bold block">Envio Rápido com Seguro Total</span>
                    <span className="text-[11px]">
                      Embalagem de segurança com lacre inviolável e código de rastreamento em tempo real.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Editorial Card */}
            <div className="bg-canvas-well border border-border-subtle p-6 space-y-3 font-mono">
              <span className="text-[11px] text-text-slate uppercase tracking-wider block font-bold">
                História &amp; Notas de Curadoria
              </span>
              <p className="text-xs sm:text-sm text-text-platinum leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Cross-Sell / Related Products Section */}
        <section className="border-t border-border-subtle pt-12 space-y-6">
          <div className="flex items-center justify-between border-b border-border-subtle pb-4">
            <div className="space-y-1">
              <span className="font-mono text-xs text-text-slate uppercase tracking-widest block">
                CURADORIA EXPANDIDA
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-mono uppercase text-text-optic">
                Peças Relacionadas do Acervo
              </h2>
            </div>
            <Link
              href="/produtos"
              className="text-xs font-mono text-text-platinum hover:text-text-optic uppercase underline"
            >
              Ver Todo o Catálogo &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <Link
                key={rel.id}
                href={`/produtos/${rel.slug}`}
                className="group bg-canvas-well border border-border-subtle hover:border-text-optic flex flex-col justify-between overflow-hidden transition-all duration-300"
              >
                <div className="relative aspect-[4/5] w-full bg-canvas-base overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={rel.images[0]}
                    alt={rel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 bg-canvas-well/90 px-2 py-0.5 border border-border-subtle text-[9px] font-mono text-text-optic font-bold">
                    {rel.condition}
                  </div>
                </div>

                <div className="p-4 space-y-2 border-t border-border-subtle font-mono">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-text-optic uppercase">{rel.brand}</span>
                    <span className="text-[10px] text-text-slate">{rel.subcategory}</span>
                  </div>
                  <h3 className="text-xs text-text-platinum line-clamp-1 group-hover:text-text-optic transition-colors">
                    {rel.name}
                  </h3>
                  <div className="pt-2 border-t border-border-subtle flex items-baseline justify-between text-xs">
                    <span className="font-bold text-text-optic">
                      R$ {rel.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-text-slate">TAM: {rel.size}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
