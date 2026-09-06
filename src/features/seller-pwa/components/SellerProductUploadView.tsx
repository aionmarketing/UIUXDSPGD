"use client";

import React, { useRef, ChangeEvent, useState } from "react";
import {
  UploadCloud,
  Trash2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
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
  Camera,
  Ruler,
  FileText,
  Bookmark,
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
import type { ItemCondition, EditorialTag } from "../types";

const EDITORIAL_TAGS: EditorialTag[] = [
  "ARQUIVO",
  "GRAIL",
  "ICÔNICO",
  "VANGUARDA",
  "ESSENCIAL",
  "PASSARELA",
];

const CLOTHING_SIZES = ["PP", "P", "M", "G", "GG", "XGG", "ÚNICO"];
const SNEAKER_SIZES = ["37", "38", "39", "40", "41", "42", "43", "44", "45"];
const ACCESSORY_SIZES = ["ÚNICO"];

export function SellerProductUploadView() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [customSizeInput, setCustomSizeInput] = useState("");

  const {
    photos,
    brand,
    isCustomBrand,
    customBrand,
    gender,
    category,
    subcategory,
    condition,
    title,
    price,
    size,
    tag,
    description,
    weight,
    packageSize,
    measurements,
    isSubmitting,
    isSubmitted,
    processingStep,
    createdSlug,
    errorMessage,
    addPhotos,
    removePhoto,
    setPrimaryPhoto,
    clearPhotos,
    setBrand,
    setIsCustomBrand,
    setCustomBrand,
    setGender,
    setCategory,
    setSubcategory,
    setCondition,
    setTitle,
    setPrice,
    setSize,
    setTag,
    setDescription,
    setWeight,
    setPackageSize,
    setMeasurements,
    resetListing,
    submitListing,
  } = useSellerListingStore();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      addPhotos(selectedFiles);
    }
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

  // Size options based on category
  const recommendedSizes =
    category === "Sneakers"
      ? SNEAKER_SIZES
      : category === "Acessórios"
      ? ACCESSORY_SIZES
      : CLOTHING_SIZES;

  // Validation rules
  const hasPhotos = photos.length > 0;
  const effectiveBrand = isCustomBrand ? customBrand.trim() : brand;
  const hasBrand = Boolean(effectiveBrand);
  const hasCategory = Boolean(category);
  const hasSubcategory = Boolean(subcategory);
  const hasCondition = Boolean(condition);
  const hasPrice = Boolean(price && Number(price) > 0);
  const hasSize = Boolean(size && size.trim().length > 0);

  const isFormValid =
    hasPhotos &&
    hasBrand &&
    hasCategory &&
    hasSubcategory &&
    hasCondition &&
    hasPrice &&
    hasSize;

  // Render Submitted Confirmation View
  if (isSubmitted) {
    return (
      <div className="w-full max-w-xl mx-auto min-h-screen bg-canvas-base text-text-optic flex flex-col justify-between p-4 md:p-6">
        <div className="pt-6 md:pt-10 space-y-6">
          <div className="bg-canvas-well border border-border-subtle p-6 space-y-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-canvas-base border border-border-subtle text-text-optic mx-auto">
              <CheckCircle2 className="w-9 h-9 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 block mb-1">
                STATUS: LOTE PUBLICADO COM SUCESSO
              </span>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight uppercase font-mono">
                Peça Registrada no Acervo
              </h1>
              <p className="text-xs text-text-platinum mt-1">
                Fotos processadas em WebP, laudo pericial gerado e metadados ativos no Neon PostgreSQL.
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
              <span className="font-bold text-text-optic">{effectiveBrand}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border-subtle pb-2">
              <span className="text-text-slate uppercase">Categoria</span>
              <span className="text-text-platinum">
                {gender ? `${gender} / ` : ""}
                {category} / {subcategory}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-border-subtle pb-2">
              <span className="text-text-slate uppercase">Tamanho</span>
              <span className="font-bold text-text-optic">{size}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border-subtle pb-2">
              <span className="text-text-slate uppercase">Selo Editorial</span>
              <span className="px-2 py-0.5 bg-canvas-base border border-border-subtle text-text-optic font-bold text-[10px]">
                {tag}
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
          {createdSlug && (
            <a
              href={`/produtos/${createdSlug}`}
              className="w-full h-16 min-h-[48px] bg-emerald-400 text-canvas-base font-bold text-sm uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 hover:bg-emerald-300 active:scale-[0.99] transition-all font-mono shadow-lg"
            >
              <span>Ver Peça no Storefront</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          )}
          <button
            type="button"
            onClick={resetListing}
            className="w-full h-16 min-h-[48px] bg-canvas-well border border-border-subtle text-text-optic font-bold text-sm uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 hover:bg-white/10 active:scale-[0.99] transition-all font-mono"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Cadastrar Outra Peça</span>
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
                VENDEDOR PWA // CADASTRO DE PEÇAS
              </h1>
              <p className="text-[10px] font-mono text-text-slate">
                ONYX BASALT // CURADORIA &amp; ARQUIVO
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-canvas-base px-2 py-1 border border-border-subtle text-text-platinum">
            v3.0
          </span>
        </div>
      </header>

      {errorMessage && (
        <div className="bg-red-500/10 border-b border-red-500/30 p-4 font-mono text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 2. FORM BODY */}
      <main className="flex-1 px-4 py-6 space-y-6">
        {/* Pinned Native Camera Input for iOS & Android */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          id="seller-camera-input"
          className="sr-only"
          onChange={handleFileChange}
        />

        {/* Native Multi-File Library Picker */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          id="seller-native-files-input"
          className="sr-only"
          onChange={handleFileChange}
        />

        {/* SECTION 1: PHOTO UPLOAD */}
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

          {/* Dual Camera / Gallery Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="h-14 min-h-[48px] px-4 bg-canvas-well border border-border-subtle hover:border-text-optic text-text-optic font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99] transition-all shadow-sm"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Câmera Direta (iOS)</span>
            </button>
            <button
              type="button"
              onClick={triggerFileInput}
              className="h-14 min-h-[48px] px-4 bg-canvas-well border border-border-subtle hover:border-text-optic text-text-optic font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99] transition-all shadow-sm"
            >
              <UploadCloud className="w-4 h-4 text-text-platinum" />
              <span>Galeria de Fotos</span>
            </button>
          </div>

          {/* Upload Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            className={`w-full p-4 border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-2 min-h-[90px] ${
              isDragOver
                ? "border-text-optic bg-canvas-well"
                : photos.length > 0
                ? "border-border-subtle bg-canvas-well/60 hover:border-text-platinum"
                : "border-border-subtle bg-canvas-well hover:border-text-optic"
            }`}
          >
            <div className="w-8 h-8 bg-canvas-base border border-border-subtle flex items-center justify-center text-text-optic">
              {photos.length === 0 ? (
                <UploadCloud className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-text-optic uppercase tracking-wider block">
                {photos.length === 0
                  ? "Arraste fotos ou clique aqui"
                  : "Adicionar Mais Fotos"}
              </span>
              <span className="text-[10px] text-text-slate block mt-0.5">
                Compressão WebP automática a 85% com retenção de detalhes macro
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
                Toque na estrela de qualquer foto para torná-la a capa principal do produto.
              </p>
            </div>
          )}
        </section>

        {/* SECTION 2: BRAND, CATEGORY & SIZE */}
        <section className="space-y-4 pt-2 border-t border-border-subtle">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-text-platinum">
            <Tag className="w-4 h-4 text-text-optic" />
            <span>2. Marca, Categoria &amp; Tamanho</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* BRAND SELECT / CUSTOM BRAND */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="seller-brand"
                  className="block text-xs font-bold uppercase tracking-wider text-text-platinum"
                >
                  Marca da Peça <span className="text-red-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomBrand(!isCustomBrand)}
                  className="text-[10px] font-mono text-text-platinum hover:text-text-optic underline cursor-pointer"
                >
                  {isCustomBrand ? "Escolher da lista de marcas" : "+ Outra marca não listada"}
                </button>
              </div>

              {!isCustomBrand ? (
                <div className="relative">
                  <select
                    id="seller-brand"
                    value={brand}
                    onChange={(e) => {
                      if (e.target.value === "__OTHER__") {
                        setIsCustomBrand(true);
                      } else {
                        setBrand(e.target.value);
                      }
                    }}
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
                    <option value="__OTHER__" className="bg-canvas-well text-emerald-400 font-bold">
                      + Outra Marca (Digitar livremente)...
                    </option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-slate">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              ) : (
                <input
                  type="text"
                  value={customBrand}
                  onChange={(e) => setCustomBrand(e.target.value)}
                  placeholder="Digite o nome da marca (Ex: Undercover, Rick Owens, Vetements)"
                  className="w-full h-14 min-h-[48px] bg-canvas-well border border-border-subtle px-4 text-sm font-medium text-text-optic placeholder:text-text-slate focus:outline-none focus:border-text-optic rounded-none font-mono"
                  autoFocus
                />
              )}
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
                    Unissex / Geral
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

            {/* SUBCATEGORY SELECT */}
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
                      : "Selecione primeiro uma Categoria..."}
                  </option>
                  {category ? (
                    availableSubcategories.map((sub) => (
                      <option key={sub} value={sub} className="bg-canvas-well text-text-optic">
                        {sub}
                      </option>
                    ))
                  ) : (
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

            {/* SIZE SELECTOR (Tamanho da Peça) */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-text-platinum">
                  Tamanho da Peça <span className="text-red-400">*</span>
                </label>
                <span className="text-[10px] font-mono text-text-slate">
                  Atual: <strong className="text-text-optic">{size}</strong>
                </span>
              </div>

              {/* Quick Tap Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap font-mono text-xs">
                {recommendedSizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSize(s);
                      setCustomSizeInput("");
                    }}
                    className={`h-11 px-3.5 border transition-all cursor-pointer font-bold ${
                      size === s && !customSizeInput
                        ? "bg-text-optic text-canvas-base border-text-optic shadow-sm"
                        : "bg-canvas-well text-text-platinum border-border-subtle hover:text-text-optic hover:border-border-specular"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Custom Size Text Input */}
              <div className="relative pt-1">
                <input
                  type="text"
                  value={customSizeInput}
                  onChange={(e) => {
                    setCustomSizeInput(e.target.value);
                    setSize(e.target.value);
                  }}
                  placeholder="Ou digite tamanho customizado (Ex: US 10.5, W32 L34, 48 EU)"
                  className="w-full h-11 bg-canvas-well border border-border-subtle px-3 text-xs font-mono text-text-optic placeholder:text-text-slate focus:outline-none focus:border-text-optic rounded-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: EDITORIAL TAG, CONDITION & IDENTIFICATION */}
        <section className="space-y-4 pt-2 border-t border-border-subtle">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-text-platinum">
            <Layers className="w-4 h-4 text-text-optic" />
            <span>3. Condição &amp; Selo Editorial</span>
          </div>

          {/* EDITORIAL TAG SELECTOR */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-text-platinum flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-text-optic" />
              <span>Selo Editorial do Catálogo</span>
            </label>
            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              {EDITORIAL_TAGS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  className={`h-10 border transition cursor-pointer font-bold text-[11px] uppercase tracking-wider ${
                    tag === t
                      ? "bg-text-optic text-canvas-base border-text-optic shadow-sm"
                      : "bg-canvas-well text-text-platinum border-border-subtle hover:border-border-specular"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
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
              Identificação do Modelo / Nome da Peça
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

          {/* DESCRIPTION / NOTAS DE CURADORIA */}
          <div className="space-y-1.5">
            <label
              htmlFor="seller-description"
              className="block text-xs font-bold uppercase tracking-wider text-text-platinum flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-text-optic" />
              <span>História &amp; Notas de Curadoria (Descrição)</span>
            </label>
            <textarea
              id="seller-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Peça rara de acervo, tecido pesado de algodão escovado, bordado perfeito. Sem avarias funcionais."
              className="w-full bg-canvas-well border border-border-subtle p-3 text-xs font-mono text-text-optic placeholder:text-text-slate focus:outline-none focus:border-text-optic rounded-none"
            />
          </div>
        </section>

        {/* SECTION 4: PHYSICAL MEASUREMENTS (OPTIONAL ACCORDION) */}
        <section className="space-y-3 pt-2 border-t border-border-subtle">
          <button
            type="button"
            onClick={() => setShowMeasurements(!showMeasurements)}
            className="w-full flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-text-platinum hover:text-text-optic py-1 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-text-optic" />
              <span>4. Medidas Reais Auditadas (Opcional)</span>
            </div>
            {showMeasurements ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showMeasurements && (
            <div className="bg-canvas-well border border-border-subtle p-3.5 space-y-3 font-mono text-xs animate-in fade-in duration-150">
              <p className="text-[11px] text-text-slate">
                Alimente o laudo pericial da peça inserindo as dimensões em centímetros:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-text-slate uppercase">Tórax / Busto</label>
                  <input
                    type="text"
                    value={measurements.chest || ""}
                    onChange={(e) => setMeasurements({ chest: e.target.value })}
                    placeholder="Ex: 62 cm"
                    className="w-full h-10 bg-canvas-base border border-border-subtle px-3 text-xs text-text-optic outline-none focus:border-text-optic"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-text-slate uppercase">Comprimento</label>
                  <input
                    type="text"
                    value={measurements.length || ""}
                    onChange={(e) => setMeasurements({ length: e.target.value })}
                    placeholder="Ex: 74 cm"
                    className="w-full h-10 bg-canvas-base border border-border-subtle px-3 text-xs text-text-optic outline-none focus:border-text-optic"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-text-slate uppercase">Ombro a Ombro</label>
                  <input
                    type="text"
                    value={measurements.shoulders || ""}
                    onChange={(e) => setMeasurements({ shoulders: e.target.value })}
                    placeholder="Ex: 54 cm"
                    className="w-full h-10 bg-canvas-base border border-border-subtle px-3 text-xs text-text-optic outline-none focus:border-text-optic"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-text-slate uppercase">Palmilha (Sneakers)</label>
                  <input
                    type="text"
                    value={measurements.insole || ""}
                    onChange={(e) => setMeasurements({ insole: e.target.value })}
                    placeholder="Ex: 28.5 cm"
                    className="w-full h-10 bg-canvas-base border border-border-subtle px-3 text-xs text-text-optic outline-none focus:border-text-optic"
                  />
                </div>
              </div>
              <div className="space-y-1 pt-1">
                <label className="text-[10px] text-text-slate uppercase">Caimento / Fit</label>
                <input
                  type="text"
                  value={measurements.fit || "Regular / Fiel ao tamanho"}
                  onChange={(e) => setMeasurements({ fit: e.target.value })}
                  placeholder="Ex: Oversized Boxy Fit"
                  className="w-full h-10 bg-canvas-base border border-border-subtle px-3 text-xs text-text-optic outline-none focus:border-text-optic"
                />
              </div>
            </div>
          )}
        </section>

        {/* SECTION 5: SHIPPING & LOGISTICS (PESO / PACOTE) */}
        <section className="space-y-4 pt-2 border-t border-border-subtle">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-text-platinum">
            <Scale className="w-4 h-4 text-text-optic" />
            <span>5. Peso e Logística</span>
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
              <span>Pendências para salvar e publicar:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-text-slate pl-1">
              {!hasPhotos && <li>Adicione pelo menos 1 foto da peça</li>}
              {!hasBrand && <li>Selecione ou digite a marca</li>}
              {!hasCategory && <li>Selecione a categoria principal</li>}
              {!hasSubcategory && <li>Selecione a subcategoria</li>}
              {!hasSize && <li>Selecione o tamanho da peça</li>}
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
              ? "bg-text-optic text-canvas-base hover:bg-neutral-200 active:scale-[0.99] shadow-lg"
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
              <span>Salvar e publicar no acervo</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          )}
        </button>
      </footer>
    </div>
  );
}
