"use client";

import React, { useRef, ChangeEvent, useState } from "react";
import {
  UploadCloud,
  Trash2,
  CheckCircle2,
  ChevronDown,
  Image as ImageIcon,
  Star,
  Plus,
  ArrowRight,
  Layers,
  Sparkles,
  Loader2,
  AlertCircle,
  Tag,
  Scale,
  RefreshCw,
} from "lucide-react";
import { useSellerListingStore } from "../stores/useSellerListingStore";
import {
  TAXONOMY_BRANDS,
  TAXONOMY_CATEGORIES,
  TAXONOMY_SUBCATEGORIES,
  TAXONOMY_GENDERS,
  CONDITIONS,
  PACKAGE_PRESETS,
  type TaxonomyCategory,
  type TaxonomyGender,
} from "../taxonomy";
import type { ItemCondition } from "../types";

export function SellerProductUploadView() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const {
    photos,
    brand,
    gender,
    category,
    subcategory,
    condition,
    title,
    price,
    weight,
    packageSize,
    isSubmitting,
    isSubmitted,
    processingStep,
    addPhotos,
    removePhoto,
    setPrimaryPhoto,
    clearPhotos,
    setBrand,
    setGender,
    setCategory,
    setSubcategory,
    setCondition,
    setTitle,
    setPrice,
    setWeight,
    setPackageSize,
    resetListing,
    submitListing,
  } = useSellerListingStore();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      addPhotos(selectedFiles);
    }
    // Clear input value so same files can be re-selected if removed
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/")
      );
      if (files.length > 0) {
        addPhotos(files);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Subcategory options based on selected category
  const availableSubcategories = category
    ? TAXONOMY_SUBCATEGORIES[category as TaxonomyCategory] || []
    : [];

  // Validation rules
  const hasPhotos = photos.length > 0;
  const hasBrand = Boolean(brand);
  const hasCategory = Boolean(category);
  const hasSubcategory = Boolean(subcategory);
  const hasCondition = Boolean(condition);
  const hasPrice = Boolean(price && Number(price) > 0);

  const isFormValid =
    hasPhotos &&
    hasBrand &&
    hasCategory &&
    hasSubcategory &&
    hasCondition &&
    hasPrice;

  // Render Submitted Confirmation View
  if (isSubmitted) {
    return (
      <div className="w-full max-w-xl mx-auto min-h-screen bg-canvas-base text-text-optic flex flex-col justify-between p-4 md:p-6">
        <div className="pt-6 md:pt-10 space-y-6">
          <div className="bg-canvas-well border border-border-subtle p-6 space-y-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-canvas-base border border-border-subtle text-text-optic mx-auto">
              <CheckCircle2 className="w-9 h-9 text-text-optic" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 block mb-1">
                STATUS: LOTE PROCESSADO E ATIVO
              </span>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight uppercase font-mono">
                Produto Registrado
              </h1>
              <p className="text-xs text-text-platinum mt-1">
                Fotos processadas, metadados indexados e triagem iniciada.
              </p>
            </div>
          </div>

          {/* Photo Strip */}
          {photos.length > 0 && (
            <div className="bg-canvas-well border border-border-subtle p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-text-platinum">
                <span>FOTOS ANEXADAS ({photos.length})</span>
                <span className="text-text-slate">#1 DEFINIDA COMO CAPA</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {photos.map((photo, idx) => (
                  <div
                    key={photo.id}
                    className="relative aspect-square bg-canvas-base border border-border-subtle overflow-hidden"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.previewUrl}
                      alt={`Foto ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {idx === 0 && (
                      <span className="absolute bottom-0 inset-x-0 bg-text-optic text-canvas-base text-[9px] font-mono font-bold text-center py-0.5 uppercase">
                        Capa
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary Breakdown */}
          <div className="bg-canvas-well border border-border-subtle p-4 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-border-subtle pb-2">
              <span className="text-text-slate uppercase">Marca</span>
              <span className="font-bold text-text-optic">{brand}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border-subtle pb-2">
              <span className="text-text-slate uppercase">Taxonomia</span>
              <span className="text-text-platinum">
                {gender ? `${gender} / ` : ""}
                {category} / {subcategory}
              </span>
            </div>
            {title && (
              <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                <span className="text-text-slate uppercase">Modelo / Título</span>
                <span className="text-text-optic truncate max-w-[200px] text-right">
                  {title}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between border-b border-border-subtle pb-2">
              <span className="text-text-slate uppercase">Condição</span>
              <span className="text-text-optic font-bold">{condition}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border-subtle pb-2">
              <span className="text-text-slate uppercase">Logística / Peso</span>
              <span className="text-text-platinum">
                {packageSize} ({weight} kg)
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 text-sm">
              <span className="text-text-slate uppercase font-bold">Preço Desejado</span>
              <span className="text-text-optic font-bold text-base">
                R$ {Number(price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        <div className="py-6 space-y-3">
          <button
            type="button"
            onClick={resetListing}
            className="w-full h-16 min-h-[48px] bg-text-optic text-canvas-base font-bold text-sm uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-[0.99] transition-all font-mono"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Cadastrar Novo Produto</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto min-h-screen bg-canvas-base text-text-optic flex flex-col justify-between">
      {/* 1. TOP HEADER & METADATA BAR */}
      <header className="sticky top-0 z-30 w-full bg-canvas-well border-b border-border-subtle px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-none inline-block"></span>
            <div>
              <h1 className="text-xs font-mono font-bold tracking-widest uppercase text-text-optic">
                VENDEDOR PWA // UPLOAD DE PRODUTOS
              </h1>
              <p className="text-[10px] font-mono text-text-slate">
                ONYX BASALT // MODO ALTO DESEMPENHO
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-canvas-base px-2 py-1 border border-border-subtle text-text-platinum">
            v2.4
          </span>
        </div>
      </header>

      {/* 2. FORM BODY */}
      <main className="flex-1 px-4 py-6 space-y-6">
        {/* Hidden Native File Input: Explicitly supports multiple and NO capture='environment' */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          id="seller-native-files-input"
          className="sr-only"
          onChange={handleFileChange}
        />

        {/* SECTION: PHOTO UPLOAD */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <label
              htmlFor="seller-native-files-input"
              className="text-xs font-mono font-bold uppercase tracking-wider text-text-platinum flex items-center gap-2"
            >
              <ImageIcon className="w-4 h-4 text-text-optic" />
              <span>1. Fotos da Peça</span>
              <span className="text-[10px] text-text-slate">
                ({photos.length} selecionada{photos.length === 1 ? "" : "s"})
              </span>
            </label>
            {photos.length > 0 && (
              <button
                type="button"
                onClick={clearPhotos}
                className="text-[10px] font-mono uppercase text-text-slate hover:text-text-optic flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Limpar Todas</span>
              </button>
            )}
          </div>

          {/* Upload Dropzone / Trigger Button */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            className={`w-full p-4 border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-2 min-h-[120px] ${
              isDragOver
                ? "border-text-optic bg-canvas-well"
                : photos.length > 0
                ? "border-border-subtle bg-canvas-well/60 hover:border-text-platinum"
                : "border-border-subtle bg-canvas-well hover:border-text-optic"
            }`}
          >
            <div className="w-10 h-10 bg-canvas-base border border-border-subtle flex items-center justify-center text-text-optic">
              {photos.length === 0 ? (
                <UploadCloud className="w-5 h-5" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-text-optic uppercase tracking-wider block">
                {photos.length === 0
                  ? "Selecionar ou Fotografar Peça"
                  : "Adicionar Mais Fotos"}
              </span>
              <span className="text-[11px] text-text-slate block mt-0.5">
                Abre galeria ou câmera nativa • Suporta múltiplas imagens
              </span>
            </div>
          </div>

          {/* Photo Gallery Grid */}
          {photos.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {photos.map((photo, idx) => {
                  const isPrimary = idx === 0;
                  return (
                    <div
                      key={photo.id}
                      className={`relative aspect-square bg-canvas-well border transition-all group overflow-hidden ${
                        isPrimary
                          ? "border-text-optic ring-1 ring-text-optic"
                          : "border-border-subtle hover:border-text-platinum"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.previewUrl}
                        alt={`Upload ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Cover Badge */}
                      {isPrimary && (
                        <div className="absolute top-1 left-1 bg-text-optic text-canvas-base px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                          <Star className="w-2.5 h-2.5 fill-canvas-base" />
                          <span>Capa</span>
                        </div>
                      )}

                      {/* Photo Index Number */}
                      {!isPrimary && (
                        <div className="absolute top-1 left-1 bg-canvas-base/90 text-text-platinum px-1.5 py-0.5 text-[9px] font-mono border border-border-subtle">
                          #{idx + 1}
                        </div>
                      )}

                      {/* Action buttons overlay */}
                      <div className="absolute bottom-1 right-1 flex items-center gap-1">
                        {!isPrimary && (
                          <button
                            type="button"
                            title="Tornar foto principal de capa"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPrimaryPhoto(photo.id);
                            }}
                            className="w-7 h-7 bg-canvas-base border border-border-subtle flex items-center justify-center text-text-platinum hover:text-text-optic cursor-pointer"
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          title="Remover foto"
                          onClick={(e) => {
                            e.stopPropagation();
                            removePhoto(photo.id);
                          }}
                          className="w-7 h-7 bg-canvas-base border border-border-subtle flex items-center justify-center text-text-slate hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] font-mono text-text-slate">
                Dica: Toque na estrela para definir a foto como capa principal do catálogo.
              </p>
            </div>
          )}
        </section>

        {/* SECTION: TAXONOMY SELECTS */}
        <section className="space-y-4 pt-2 border-t border-border-subtle">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-text-platinum">
            <Tag className="w-4 h-4 text-text-optic" />
            <span>2. Classificação e Taxonomia</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* BRAND SELECT */}
            <div className="space-y-1.5">
              <label
                htmlFor="seller-brand"
                className="block text-xs font-bold uppercase tracking-wider text-text-platinum"
              >
                Marca da Peça <span className="text-red-400">*</span>
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
                  {TAXONOMY_BRANDS.map((item) => (
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

            {/* GENDER SELECT */}
            <div className="space-y-1.5">
              <label
                htmlFor="seller-gender"
                className="block text-xs font-bold uppercase tracking-wider text-text-platinum"
              >
                Gênero
              </label>
              <div className="relative">
                <select
                  id="seller-gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as TaxonomyGender | "")}
                  className="w-full h-14 min-h-[48px] bg-canvas-well border border-border-subtle px-4 text-sm font-medium text-text-optic appearance-none focus:outline-none focus:border-text-optic rounded-none cursor-pointer"
                >
                  <option value="" className="bg-canvas-well text-text-slate">
                    Gênero (Opcional / Unissex)
                  </option>
                  {TAXONOMY_GENDERS.map((g) => (
                    <option key={g} value={g} className="bg-canvas-well text-text-optic">
                      {g}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-slate">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* CATEGORY SELECT */}
            <div className="space-y-1.5">
              <label
                htmlFor="seller-category"
                className="block text-xs font-bold uppercase tracking-wider text-text-platinum"
              >
                Categoria Principal <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  id="seller-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TaxonomyCategory | "")}
                  className="w-full h-14 min-h-[48px] bg-canvas-well border border-border-subtle px-4 text-sm font-medium text-text-optic appearance-none focus:outline-none focus:border-text-optic rounded-none cursor-pointer"
                >
                  <option value="" disabled className="bg-canvas-well text-text-slate">
                    Selecione a Categoria (Roupas, Sneakers, Acessórios)...
                  </option>
                  {TAXONOMY_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-canvas-well text-text-optic">
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-slate">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* SUBCATEGORY SELECT (Cascaded) */}
            <div className="space-y-1.5">
              <label
                htmlFor="seller-subcategory"
                className="block text-xs font-bold uppercase tracking-wider text-text-platinum"
              >
                Subcategoria <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  id="seller-subcategory"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full h-14 min-h-[48px] bg-canvas-well border border-border-subtle px-4 text-sm font-medium text-text-optic appearance-none focus:outline-none focus:border-text-optic rounded-none cursor-pointer"
                >
                  <option value="" disabled className="bg-canvas-well text-text-slate">
                    {category
                      ? `Selecione a Subcategoria de ${category}...`
                      : "Selecione primeiro uma Categoria ou escolha abaixo..."}
                  </option>
                  {category ? (
                    availableSubcategories.map((sub) => (
                      <option key={sub} value={sub} className="bg-canvas-well text-text-optic">
                        {sub}
                      </option>
                    ))
                  ) : (
                    // When category is not yet selected, provide grouped optgroups of the entire taxonomy
                    TAXONOMY_CATEGORIES.map((cat) => (
                      <optgroup
                        key={cat}
                        label={`--- ${cat.toUpperCase()} ---`}
                        className="bg-canvas-base text-text-platinum font-bold"
                      >
                        {TAXONOMY_SUBCATEGORIES[cat].map((sub) => (
                          <option
                            key={`${cat}-${sub}`}
                            value={sub}
                            className="bg-canvas-well text-text-optic"
                          >
                            {sub} ({cat})
                          </option>
                        ))}
                      </optgroup>
                    ))
                  )}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-slate">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: CONDITION & DETAILS */}
        <section className="space-y-4 pt-2 border-t border-border-subtle">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-text-platinum">
            <Layers className="w-4 h-4 text-text-optic" />
            <span>3. Condição e Identificação</span>
          </div>

          {/* CONDITION SELECT */}
          <div className="space-y-1.5">
            <label
              htmlFor="seller-condition"
              className="block text-xs font-bold uppercase tracking-wider text-text-platinum"
            >
              Estado de Conservação <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select
                id="seller-condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value as ItemCondition)}
                className="w-full h-14 min-h-[48px] bg-canvas-well border border-border-subtle px-4 text-sm font-medium text-text-optic appearance-none focus:outline-none focus:border-text-optic rounded-none cursor-pointer"
              >
                <option value="" disabled className="bg-canvas-well text-text-slate">
                  Selecione a Condição...
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
            {condition && (
              <p className="text-[11px] font-mono text-text-slate mt-1 px-1">
                {CONDITIONS.find((c) => c.value === condition)?.description}
              </p>
            )}
          </div>

          {/* TITLE / ITEM IDENTIFIER */}
          <div className="space-y-1.5">
            <label
              htmlFor="seller-title"
              className="block text-xs font-bold uppercase tracking-wider text-text-platinum"
            >
              Identificação do Modelo / Nome
            </label>
            <input
              type="text"
              id="seller-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Box Logo Crewneck, Triple S, Retro Nuptse 1996"
              className="w-full h-14 min-h-[48px] bg-canvas-well border border-border-subtle px-4 text-sm text-text-optic placeholder:text-text-slate focus:outline-none focus:border-text-optic rounded-none font-mono"
            />
          </div>

          {/* PRICE INPUT */}
          <div className="space-y-1.5">
            <label
              htmlFor="seller-price"
              className="block text-xs font-bold uppercase tracking-wider text-text-platinum"
            >
              Preço Desejado (R$) <span className="text-red-400">*</span>
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
        </section>

        {/* SECTION: SHIPPING & LOGISTICS (PESO / DIMENSÕES) */}
        <section className="space-y-4 pt-2 border-t border-border-subtle">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-text-platinum">
            <Scale className="w-4 h-4 text-text-optic" />
            <span>4. Peso e Dimensões (Logística)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* PACKAGE PRESET */}
            <div className="space-y-1.5">
              <label
                htmlFor="seller-package-preset"
                className="block text-xs font-bold uppercase tracking-wider text-text-platinum"
              >
                Formato do Pacote
              </label>
              <div className="relative">
                <select
                  id="seller-package-preset"
                  value={packageSize}
                  onChange={(e) => setPackageSize(e.target.value)}
                  className="w-full h-14 min-h-[48px] bg-canvas-well border border-border-subtle px-3 text-sm font-medium text-text-optic appearance-none focus:outline-none focus:border-text-optic rounded-none cursor-pointer"
                >
                  {PACKAGE_PRESETS.map((p) => (
                    <option key={p.id} value={p.id} className="bg-canvas-well text-text-optic">
                      {p.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-slate">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* WEIGHT INPUT */}
            <div className="space-y-1.5">
              <label
                htmlFor="seller-weight"
                className="block text-xs font-bold uppercase tracking-wider text-text-platinum"
              >
                Peso Aproximado (kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  id="seller-weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0.5"
                  className="w-full h-14 min-h-[48px] bg-canvas-well border border-border-subtle px-4 text-sm font-mono text-text-optic placeholder:text-text-slate focus:outline-none focus:border-text-optic rounded-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-text-slate pointer-events-none">
                  KG
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* VALIDATION HELPER CARD */}
        {!isFormValid && (
          <div className="bg-canvas-well border border-border-subtle p-3.5 space-y-1.5 text-xs text-text-slate font-mono">
            <div className="flex items-center gap-2 text-text-platinum font-bold uppercase">
              <AlertCircle className="w-4 h-4 text-text-platinum" />
              <span>Pendências para salvar e processar:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-text-slate pl-1">
              {!hasPhotos && <li>Adicione pelo menos 1 foto da peça</li>}
              {!hasBrand && <li>Selecione a marca</li>}
              {!hasCategory && <li>Selecione a categoria</li>}
              {!hasSubcategory && <li>Selecione a subcategoria</li>}
              {!hasCondition && <li>Selecione o estado de conservação</li>}
              {!hasPrice && <li>Defina o preço desejado (R$)</li>}
            </ul>
          </div>
        )}
      </main>

      {/* 3. MASSIVE PRIMARY CTA PINNED TO BOTTOM */}
      <footer className="sticky bottom-0 z-40 w-full bg-canvas-base border-t border-border-subtle p-4 pb-6 md:pb-8 shadow-2xl">
        <button
          type="button"
          disabled={!isFormValid || isSubmitting}
          onClick={submitListing}
          className={`w-full h-16 md:h-18 min-h-[56px] font-bold text-sm md:text-base tracking-widest uppercase flex items-center justify-center gap-3 transition-all cursor-pointer font-mono ${
            isFormValid && !isSubmitting
              ? "bg-text-optic text-canvas-base hover:bg-neutral-200 active:scale-[0.99]"
              : "bg-canvas-well text-text-slate border border-border-subtle cursor-not-allowed opacity-70"
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-canvas-base" />
              <span>{processingStep || `PROCESSANDO ${photos.length} FOTOS...`}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span>Salvar e processar fotos</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          )}
        </button>
      </footer>
    </div>
  );
}
