import { create } from "zustand";
import type { SellerListingState, PhotoItem, ItemCondition, Dimensions } from "../types";
import type { TaxonomyCategory, TaxonomyGender } from "../taxonomy";
import { TAXONOMY_SUBCATEGORIES, PACKAGE_PRESETS } from "../taxonomy";
import { createProductAction } from "../actions/create-product";

const INITIAL_DIMENSIONS: Dimensions = {
  length: "30",
  width: "20",
  height: "10",
};

export const useSellerListingStore = create<SellerListingState>((set, get) => ({
  // Form Data
  photos: [],
  brand: "",
  gender: "",
  category: "",
  subcategory: "",
  condition: "",
  title: "",
  price: "",
  weight: "0.5",
  packageSize: "P",
  dimensions: INITIAL_DIMENSIONS,
  notes: "",

  // Backward compatibility
  photoUrl: null,
  photoFile: null,

  // Processing state
  isSubmitting: false,
  isSubmitted: false,
  processingStep: "",
  submissionTimestamp: null,
  createdSlug: null,
  errorMessage: null,

  addPhotos: (files: File[]) => {
    if (!files.length) return;
    const newItems: PhotoItem[] = files.map((file, idx) => ({
      id: `${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 8)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      order: get().photos.length + idx,
      isPrimary: get().photos.length === 0 && idx === 0,
      name: file.name,
      size: file.size,
    }));

    const updatedPhotos = [...get().photos, ...newItems];
    const primary = updatedPhotos.find((p) => p.isPrimary) || updatedPhotos[0];

    set({
      photos: updatedPhotos,
      photoUrl: primary ? primary.previewUrl : null,
      photoFile: primary ? primary.file : null,
    });
  },

  removePhoto: (id: string) => {
    const current = get().photos;
    const target = current.find((p) => p.id === id);
    if (target && target.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(target.previewUrl);
    }

    const filtered = current.filter((p) => p.id !== id);
    // Re-index and ensure a primary photo exists if any remain
    const updated = filtered.map((p, idx) => ({
      ...p,
      order: idx,
      isPrimary: idx === 0,
    }));

    const primary = updated[0];
    set({
      photos: updated,
      photoUrl: primary ? primary.previewUrl : null,
      photoFile: primary ? primary.file : null,
    });
  },

  setPrimaryPhoto: (id: string) => {
    const updated = get().photos.map((p) => ({
      ...p,
      isPrimary: p.id === id,
    }));
    const primary = updated.find((p) => p.isPrimary);
    set({
      photos: updated,
      photoUrl: primary ? primary.previewUrl : null,
      photoFile: primary ? primary.file : null,
    });
  },

  clearPhotos: () => {
    get().photos.forEach((p) => {
      if (p.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(p.previewUrl);
      }
    });
    set({
      photos: [],
      photoUrl: null,
      photoFile: null,
    });
  },

  setBrand: (brand: string) => set({ brand }),
  setGender: (gender: TaxonomyGender | "") => set({ gender }),
  setCategory: (category: TaxonomyCategory | "") => {
    const subs = category ? TAXONOMY_SUBCATEGORIES[category] || [] : [];
    set({
      category,
      subcategory: subs.length > 0 ? subs[0] : "",
    });
  },
  setSubcategory: (subcategory: string) => set({ subcategory }),
  setCondition: (condition: ItemCondition | "") => set({ condition }),
  setTitle: (title: string) => set({ title }),
  setPrice: (price: string) => set({ price }),
  setWeight: (weight: string) => set({ weight }),
  setPackageSize: (packageSize: string) => {
    const preset = PACKAGE_PRESETS.find((p) => p.id === packageSize);
    set({
      packageSize,
      weight: preset?.defaultWeight || get().weight,
    });
  },
  setDimensions: (dim: Partial<Dimensions>) => {
    set({
      dimensions: { ...get().dimensions, ...dim },
    });
  },
  setNotes: (notes: string) => set({ notes }),

  // Legacy bridge
  setPhoto: (file: File) => {
    get().addPhotos([file]);
  },

  resetListing: () => {
    get().clearPhotos();
    set({
      photos: [],
      photoUrl: null,
      photoFile: null,
      brand: "",
      gender: "",
      category: "",
      subcategory: "",
      condition: "",
      title: "",
      price: "",
      weight: "0.5",
      packageSize: "P",
      dimensions: INITIAL_DIMENSIONS,
      notes: "",
      isSubmitting: false,
      isSubmitted: false,
      processingStep: "",
      submissionTimestamp: null,
      createdSlug: null,
      errorMessage: null,
    });
  },

  submitListing: async () => {
    const state = get();
    set({
      isSubmitting: true,
      processingStep: "Enviando fotos e gerando metadados...",
      errorMessage: null,
    });

    try {
      // 1. Upload photos via /api/upload
      const uploadedImages: Array<{ url: string; storageKey?: string; isPrimary: boolean; orderIndex: number }> = [];

      if (state.photos.length > 0) {
        const formData = new FormData();
        let fileCount = 0;
        state.photos.forEach((p) => {
          if (p.file) {
            formData.append("files", p.file);
            fileCount++;
          }
        });

        if (fileCount > 0) {
          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!uploadRes.ok) {
            const err = await uploadRes.json();
            throw new Error(err.error || "Erro no upload das fotos.");
          }

          const uploadData = await uploadRes.json();
          if (uploadData.files && Array.isArray(uploadData.files)) {
            uploadData.files.forEach((f: { url: string; storageKey: string }, idx: number) => {
              uploadedImages.push({
                url: f.url,
                storageKey: f.storageKey,
                isPrimary: idx === 0,
                orderIndex: idx,
              });
            });
          }
        }
      }

      // Fallback if no binary file was attached but previewUrl exists
      if (uploadedImages.length === 0 && state.photos.length > 0) {
        state.photos.forEach((p, idx) => {
          uploadedImages.push({
            url: p.previewUrl,
            storageKey: `local-${p.id}`,
            isPrimary: idx === 0,
            orderIndex: idx,
          });
        });
      }

      set({ processingStep: "Gravando produto no Neon PostgreSQL (São Paulo)..." });

      // 2. Call server action to insert into Neon
      const result = await createProductAction({
        title: state.title || `${state.brand} - ${state.subcategory || state.category}`,
        brand: state.brand,
        gender: state.gender || "Unissex",
        category: state.category,
        subcategory: state.subcategory,
        condition: state.condition,
        price: Number(state.price) || 0,
        size: state.notes?.includes("Tamanho:") ? state.notes.split("Tamanho:")[1].trim() : "M",
        weightKg: Number(state.weight) || 0.5,
        description: state.notes || undefined,
        images: uploadedImages,
      });

      if (!result.success) {
        throw new Error(result.error || "Erro ao salvar produto no banco.");
      }

      set({
        isSubmitting: false,
        isSubmitted: true,
        createdSlug: result.slug || null,
        processingStep: "Publicado no Acervo com Sucesso!",
        submissionTimestamp: Date.now(),
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Falha ao processar produto.";
      console.error("Erro no envio:", error);
      set({
        isSubmitting: false,
        errorMessage: message,
        processingStep: "",
      });
    }
  },
}));
