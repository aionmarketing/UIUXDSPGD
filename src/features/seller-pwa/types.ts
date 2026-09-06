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

export interface SellerListingState {
  photoUrl: string | null;
  photoFile: File | null;
  brand: string;
  condition: ItemCondition | "";
  title: string;
  price: string;
  isSubmitting: boolean;
  isSubmitted: boolean;

  setPhoto: (file: File) => void;
  removePhoto: () => void;
  setBrand: (brand: string) => void;
  setCondition: (condition: ItemCondition) => void;
  setTitle: (title: string) => void;
  setPrice: (price: string) => void;
  resetListing: () => void;
  submitListing: () => void;
}
