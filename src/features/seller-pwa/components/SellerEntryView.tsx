"use client";

import React, { useRef, ChangeEvent } from "react";
import { Camera, Trash2, CheckCircle2, ChevronDown, ShieldAlert } from "lucide-react";
import { useSellerListingStore } from "../stores/useSellerListingStore";
import type { ConditionOption, ItemCondition } from "../types";

const BRANDS = [
  "Balenciaga",
  "Rick Owens",
  "Prada",
  "Chrome Hearts",
  "Saint Laurent",
  "Maison Margiela",
  "Bottega Veneta",
  "Vetements",
  "Off-White",
  "Goyard",
  "Raf Simons",
  "Undercover",
  "Outra / Personalizada",
];

const CONDITIONS: ConditionOption[] = [
  {
    value: "DSWT",
    label: "Novo com Tags (D.S.W.T)",
    description: "Nunca usado, embalagem ou etiquetas originais intactas.",
  },
  {
    value: "PRISTINE",
    label: "Impecável / Sem Marcas",
    description: "Sem marcas visíveis de desgaste ou uso.",
  },
  {
    value: "GENTLY_USED",
    label: "Usado em Bom Estado",
    description: "Pouco uso, sem avarias estruturais ou manchas.",
  },
  {
    value: "VINTAGE",
    label: "Vintage / Marcas de Uso",
    description: "Desgaste natural ou estética vintage preservada.",
  },
];

export function SellerEntryView() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    photoUrl,
    brand,
    condition,
    title,
    price,
    isSubmitting,
    isSubmitted,
    setPhoto,
    removePhoto,
    setBrand,
    setCondition,
    setTitle,
    setPrice,
    resetListing,
    submitListing,
  } = useSellerListingStore();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
    }
  };

  const handleCameraTrigger = () => {
    fileInputRef.current?.click();
  };

  const isFormValid = Boolean(photoUrl && brand && condition && price);

  if (isSubmitted) {
    return (
      <main className="w-full max-w-md mx-auto min-h-screen bg-canvas-base text-text-optic flex flex-col justify-between p-6">
        <div className="pt-12 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-canvas-well border border-border-subtle">
            <CheckCircle2 className="w-8 h-8 text-text-optic" />
          </div>
          <h1 className="text-xl font-bold tracking-tight uppercase">Peça Registrada</h1>
          <p className="text-sm text-text-platinum">
            Sua peça foi cadastrada com sucesso e enviada para triagem da curadoria Desapegado.
          </p>

          <div className="bg-canvas-well border border-border-subtle p-4 text-left space-y-2 text-xs">
            <div className="flex justify-between border-b border-border-subtle pb-2">
              <span className="text-text-slate">Marca</span>
              <span className="font-semibold text-text-optic">{brand}</span>
            </div>
            <div className="flex justify-between border-b border-border-subtle pb-2">
              <span className="text-text-slate">Condição</span>
              <span className="font-semibold text-text-optic">{condition}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-slate">Valor Solicitado</span>
              <span className="font-semibold text-text-optic">R$ {price}</span>
            </div>
          </div>
        </div>

        <div className="py-6">
          <button
            type="button"
            onClick={resetListing}
            className="w-full h-16 min-h-[48px] bg-text-optic text-canvas-base font-bold text-sm uppercase tracking-widest cursor-pointer"
          >
            Cadastrar Nova Peça
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-canvas-base text-text-optic flex flex-col justify-between">
      {/* 1. TOP PINNED NATIVE CAMERA BAR */}
      <header className="sticky top-0 z-30 w-full bg-canvas-well border-b border-border-subtle p-3">
        {/* Hidden Native Camera Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          id="native-camera-input"
          className="sr-only"
          onChange={handleFileChange}
        />

        {!photoUrl ? (
          <button
            type="button"
            onClick={handleCameraTrigger}
            aria-label="Abrir câmera e fotografar peça"
            className="w-full h-16 min-h-[48px] bg-canvas-base border-2 border-dashed border-border-subtle flex items-center justify-center gap-3 px-4 text-text-optic font-bold text-sm tracking-wider uppercase cursor-pointer"
          >
            <Camera className="w-6 h-6 text-text-optic" />
            <span>Capturar Foto da Peça</span>
          </button>
        ) : (
          <div className="flex items-center justify-between gap-3 bg-canvas-base p-2 border border-border-subtle">
            <div className="flex items-center gap-3 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl}
                alt="Registro da Peça"
                className="w-12 h-12 object-cover border border-border-subtle flex-shrink-0"
              />
              <div className="truncate">
                <span className="text-xs font-bold text-text-optic block uppercase tracking-wider">
                  Foto Registrada
                </span>
                <span className="text-[11px] text-text-slate block truncate">Pronta para submissão</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCameraTrigger}
                className="h-10 px-3 min-h-[40px] bg-canvas-well border border-border-subtle text-xs uppercase tracking-wider font-semibold text-text-optic cursor-pointer"
              >
                Refazer
              </button>
              <button
                type="button"
                onClick={removePhoto}
                aria-label="Remover foto"
                className="h-10 w-10 min-h-[40px] bg-canvas-well border border-border-subtle flex items-center justify-center text-text-slate hover:text-text-optic cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. FLAT UTILITARIAN FORM BODY */}
      <main className="flex-1 px-4 py-6 space-y-6">
        {/* Utilitarian Badge Header */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div>
            <h1 className="text-xs font-mono font-bold tracking-widest uppercase text-text-platinum">
              VENDEDOR PWA // ADDCLOTHES
            </h1>
            <p className="text-[11px] font-mono text-text-slate">MODO ALTO DESEMPENHO</p>
          </div>
          <div className="flex items-center gap-1 bg-canvas-well px-2 py-1 border border-border-subtle text-[10px] font-mono text-text-slate">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block"></span>
            <span>DIRETO</span>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); if (isFormValid) submitListing(); }} className="space-y-5">
          {/* BRAND SELECT */}
          <div className="space-y-2">
            <label htmlFor="seller-brand" className="block text-xs font-bold uppercase tracking-wider text-text-platinum">
              1. Marca da Peça
            </label>
            <div className="relative">
              <select
                id="seller-brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full h-14 min-h-[48px] bg-canvas-well border border-border-subtle px-4 text-sm font-medium text-text-optic appearance-none focus:outline-none focus:border-text-optic rounded-none cursor-pointer"
              >
                <option value="" disabled className="bg-canvas-well text-text-slate">
                  Selecione a Marca...
                </option>
                {BRANDS.map((item) => (
                  <option key={item} value={item} className="bg-canvas-well text-text-optic">
                    {item}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-slate">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* CONDITION SELECT */}
          <div className="space-y-2">
            <label htmlFor="seller-condition" className="block text-xs font-bold uppercase tracking-wider text-text-platinum">
              2. Estado de Conservação
            </label>
            <div className="relative">
              <select
                id="seller-condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value as ItemCondition)}
                className="w-full h-14 min-h-[48px] bg-canvas-well border border-border-subtle px-4 text-sm font-medium text-text-optic appearance-none focus:outline-none focus:border-text-optic rounded-none cursor-pointer"
              >
                <option value="" disabled className="bg-canvas-well text-text-slate">
                  Selecione o Estado...
                </option>
                {CONDITIONS.map((cond) => (
                  <option key={cond.value} value={cond.value} className="bg-canvas-well text-text-optic">
                    {cond.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-slate">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* TITLE / ITEM DESCRIPTION */}
          <div className="space-y-2">
            <label htmlFor="seller-title" className="block text-xs font-bold uppercase tracking-wider text-text-platinum">
              3. Identificação do Modelo
            </label>
            <input
              type="text"
              id="seller-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Track 2 Sneaker / Zip Hoodie"
              className="w-full h-14 min-h-[48px] bg-canvas-well border border-border-subtle px-4 text-sm text-text-optic placeholder:text-text-slate focus:outline-none focus:border-text-optic rounded-none"
            />
          </div>

          {/* PAYOUT VALUE / PRICE */}
          <div className="space-y-2">
            <label htmlFor="seller-price" className="block text-xs font-bold uppercase tracking-wider text-text-platinum">
              4. Preço Desejado (R$)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-mono text-text-slate pointer-events-none">
                R$
              </span>
              <input
                type="number"
                id="seller-price"
                min="0"
                step="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full h-14 min-h-[48px] bg-canvas-well border border-border-subtle pl-12 pr-4 text-sm font-mono text-text-optic placeholder:text-text-slate focus:outline-none focus:border-text-optic rounded-none"
              />
            </div>
          </div>

          {!photoUrl && (
            <div className="bg-canvas-well border border-border-subtle p-3 flex items-start gap-2.5 text-xs text-text-slate">
              <ShieldAlert className="w-4 h-4 text-text-platinum flex-shrink-0 mt-0.5" />
              <span>
                Fotografe a peça pelo botão no topo para liberar o envio imediato para a curadoria.
              </span>
            </div>
          )}
        </form>
      </main>

      {/* 3. MASSIVE PRIMARY CTA PINNED TO BOTTOM */}
      <footer className="sticky bottom-0 z-30 w-full bg-canvas-base border-t border-border-subtle p-4">
        <button
          type="button"
          disabled={!isFormValid || isSubmitting}
          onClick={submitListing}
          className={`w-full h-16 min-h-[48px] font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer ${
            isFormValid && !isSubmitting
              ? "bg-text-optic text-canvas-base hover:opacity-90 active:opacity-80"
              : "bg-canvas-well text-text-slate border border-border-subtle cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "REGISTRANDO..." : "ENVIAR PARA CURADORIA"}
        </button>
      </footer>
    </div>
  );
}
