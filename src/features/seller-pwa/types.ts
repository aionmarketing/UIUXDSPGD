import type { TaxonomyBrand, TaxonomyCategory, TaxonomyGender } from "./taxonomy";

export type ItemCondition =
  | "DSWT"
  | "PRISTINE"
  | "GENTLY_USED"
  | "VINTAGE";

export type EditorialTag =
  | "GRAIL"
  | "ICÔNICO"
  | "VANGUARDA"
  | "ESSENCIAL"
  | "PASSARELA"
  | "ARQUIVO";

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

export interface ProductMeasurementsInput {
  chest?: string;
  length?: string;
  shoulders?: string;
  insole?: string;
  fit?: string;
}

export interface SellerProductFormData {
  photos: PhotoItem[];
  brand: TaxonomyBrand | string;
  isCustomBrand: boolean;
  customBrand: string;
  gender: TaxonomyGender | "";
  category: TaxonomyCategory | "";
  subcategory: string;
  condition: ItemCondition | "";
  title: string;
  price: string;
  size: string;
  tag: EditorialTag;
  description: string;
  weight: string; // kg
  packageSize: string; // P, M, G, CUSTOM
  dimensions: Dimensions;
  measurements: ProductMeasurementsInput;
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
  setIsCustomBrand: (isCustom: boolean) => void;
  setCustomBrand: (brand: string) => void;
  setGender: (gender: TaxonomyGender | "") => void;
  setCategory: (category: TaxonomyCategory | "") => void;
  setSubcategory: (subcategory: string) => void;
  setCondition: (condition: ItemCondition | "") => void;
  setTitle: (title: string) => void;
  setPrice: (price: string) => void;
  setSize: (size: string) => void;
  setTag: (tag: EditorialTag) => void;
  setDescription: (desc: string) => void;
  setWeight: (weight: string) => void;
  setPackageSize: (size: string) => void;
  setDimensions: (dim: Partial<Dimensions>) => void;
  setMeasurements: (measurements: Partial<ProductMeasurementsInput>) => void;
  setNotes: (notes: string) => void;

  resetListing: () => void;
  submitListing: () => void;

  // Backward compatibility methods
  setPhoto: (file: File) => void;
}
