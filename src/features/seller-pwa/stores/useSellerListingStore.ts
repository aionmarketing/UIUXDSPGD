import { create } from "zustand";
import type { SellerListingState } from "../types";

export const useSellerListingStore = create<SellerListingState>((set) => ({
  photoUrl: null,
  photoFile: null,
  brand: "",
  condition: "",
  title: "",
  price: "",
  isSubmitting: false,
  isSubmitted: false,

  setPhoto: (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    set({ photoFile: file, photoUrl: previewUrl });
  },

  removePhoto: () => {
    set((state) => {
      if (state.photoUrl) {
        URL.revokeObjectURL(state.photoUrl);
      }
      return { photoFile: null, photoUrl: null };
    });
  },

  setBrand: (brand: string) => set({ brand }),
  setCondition: (condition) => set({ condition }),
  setTitle: (title: string) => set({ title }),
  setPrice: (price: string) => set({ price }),

  resetListing: () => {
    set((state) => {
      if (state.photoUrl) {
        URL.revokeObjectURL(state.photoUrl);
      }
      return {
        photoUrl: null,
        photoFile: null,
        brand: "",
        condition: "",
        title: "",
        price: "",
        isSubmitting: false,
        isSubmitted: false,
      };
    });
  },

  submitListing: () => {
    set({ isSubmitting: true });
    // Utilitarian instant action
    setTimeout(() => {
      set({ isSubmitting: false, isSubmitted: true });
    }, 400);
  },
}));
