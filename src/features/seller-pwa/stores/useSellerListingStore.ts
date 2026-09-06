import { create } from "zustand";
import type { SellerListingState, PhotoItem, ItemCondition, Dimensions } from "../types";
import type { TaxonomyCategory, TaxonomyGender } from "../taxonomy";
import { TAXONOMY_SUBCATEGORIES, PACKAGE_PRESETS } from "../taxonomy";

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

  addPhotos: (files: File[]) => {
    if (!files.length) return;
    const newItems: PhotoItem[] = files.map((file, idx) => ({
      id: `${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 8)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));

    set((state) => {
      const updatedPhotos = [...state.photos, ...newItems];
      return {
        photos: updatedPhotos,
        photoUrl: updatedPhotos[0]?.previewUrl || null,
        photoFile: updatedPhotos[0]?.file || null,
      };
    });
  },

  removePhoto: (id: string) => {
    set((state) => {
      const target = state.photos.find((p) => p.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      const remaining = state.photos.filter((p) => p.id !== id);
      return {
        photos: remaining,
        photoUrl: remaining[0]?.previewUrl || null,
        photoFile: remaining[0]?.file || null,
      };
    });
  },

  setPrimaryPhoto: (id: string) => {
    set((state) => {
      const index = state.photos.findIndex((p) => p.id === id);
      if (index <= 0) return state; // Already primary or not found
      const target = state.photos[index];
      const remaining = state.photos.filter((p) => p.id !== id);
      const reordered = [target, ...remaining];
      return {
        photos: reordered,
        photoUrl: reordered[0]?.previewUrl || null,
        photoFile: reordered[0]?.file || null,
      };
    });
  },

  clearPhotos: () => {
    const { photos } = get();
    photos.forEach((p) => {
      if (p.previewUrl) URL.revokeObjectURL(p.previewUrl);
    });
    set({
      photos: [],
      photoUrl: null,
      photoFile: null,
    });
  },

  // Backward-compat single-photo setter
  setPhoto: (file: File) => {
    const { photos } = get();
    photos.forEach((p) => {
      if (p.previewUrl) URL.revokeObjectURL(p.previewUrl);
    });
    const previewUrl = URL.createObjectURL(file);
    const item: PhotoItem = {
      id: `${Date.now()}`,
      file,
      previewUrl,
      name: file.name,
      size: file.size,
    };
    set({
      photos: [item],
      photoUrl: previewUrl,
      photoFile: file,
    });
  },

  setBrand: (brand: string) => set({ brand }),
  setGender: (gender: TaxonomyGender | "") => set({ gender }),

  setCategory: (category: TaxonomyCategory | "") => {
    set((state) => {
      let subcategory = state.subcategory;
      // Auto-clear subcategory if it doesn't belong to the newly selected category
      if (category && subcategory) {
        const allowed = TAXONOMY_SUBCATEGORIES[category] || [];
        if (!allowed.includes(subcategory)) {
          subcategory = "";
        }
      }
      return { category, subcategory };
    });
  },

  setSubcategory: (subcategory: string) => {
    set((state) => {
      // If category is not set, attempt to infer from subcategory
      let category = state.category;
      if (!category && subcategory) {
        for (const [cat, subs] of Object.entries(TAXONOMY_SUBCATEGORIES)) {
          if (subs.includes(subcategory)) {
            category = cat as TaxonomyCategory;
            break;
          }
        }
      }
      return { subcategory, category };
    });
  },

  setCondition: (condition: ItemCondition | "") => set({ condition }),
  setTitle: (title: string) => set({ title }),
  setPrice: (price: string) => set({ price }),
  setWeight: (weight: string) => set({ weight }),

  setPackageSize: (packageSize: string) => {
    const preset = PACKAGE_PRESETS.find((p) => p.id === packageSize);
    set({
      packageSize,
      weight: preset?.defaultWeight ? preset.defaultWeight : get().weight,
    });
  },

  setDimensions: (dim: Partial<Dimensions>) => {
    set((state) => ({
      dimensions: { ...state.dimensions, ...dim },
    }));
  },

  setNotes: (notes: string) => set({ notes }),

  resetListing: () => {
    const { photos } = get();
    photos.forEach((p) => {
      if (p.previewUrl) URL.revokeObjectURL(p.previewUrl);
    });

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
    });
  },

  submitListing: () => {
    set({ isSubmitting: true, processingStep: "Otimizando imagens e extraindo metadados..." });

    setTimeout(() => {
      set({ processingStep: "Validando taxonomia e integridade de arquivo..." });
    }, 450);

    setTimeout(() => {
      set({ processingStep: "Indexando produto no banco de curadoria..." });
    }, 850);

    setTimeout(() => {
      set({
        isSubmitting: false,
        isSubmitted: true,
        processingStep: "Concluído",
        submissionTimestamp: Date.now(),
      });
    }, 1250);
  },
}));
