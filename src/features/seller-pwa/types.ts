import type { TaxonomyBrand, TaxonomyCategory, TaxonomyGender } from "./taxonomy";

export type ItemCondition =
  | "DSWT"
  | "PRISTINE"
  | "GENTLY_USED"
  | "VINTAGE";

export interface ConditionOption {
  value: ItemCondition;
  label: string;
  description: string;
}

export interface PhotoItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: number;
  order?: number;
  isPrimary?: boolean;
}

export interface Dimensions {
  length: string; // cm
  width: string;  // cm
  height: string; // cm
}

export interface SellerProductFormData {
  photos: PhotoItem[];
  brand: TaxonomyBrand | string;
  gender: TaxonomyGender | "";
  category: TaxonomyCategory | "";
  subcategory: string;
  condition: ItemCondition | "";
  title: string;
  price: string;
  weight: string; // kg
  packageSize: string; // P, M, G, CUSTOM
  dimensions: Dimensions;
  notes: string;
}

export interface SellerListingState extends SellerProductFormData {
  // Processing & UI state
  isSubmitting: boolean;
  isSubmitted: boolean;
  processingStep: string;
  submissionTimestamp: number | null;
  createdSlug: string | null;
  errorMessage: string | null;

  // Single-photo backward compatibility
  photoUrl: string | null;
  photoFile: File | null;

  // Action dispatches
  addPhotos: (files: File[]) => void;
  removePhoto: (id: string) => void;
  setPrimaryPhoto: (id: string) => void;
  clearPhotos: () => void;

  setBrand: (brand: string) => void;
  setGender: (gender: TaxonomyGender | "") => void;
  setCategory: (category: TaxonomyCategory | "") => void;
  setSubcategory: (subcategory: string) => void;
  setCondition: (condition: ItemCondition | "") => void;
  setTitle: (title: string) => void;
  setPrice: (price: string) => void;
  setWeight: (weight: string) => void;
  setPackageSize: (size: string) => void;
  setDimensions: (dim: Partial<Dimensions>) => void;
  setNotes: (notes: string) => void;

  resetListing: () => void;
  submitListing: () => void;

  // Backward compatibility methods
  setPhoto: (file: File) => void;
}
