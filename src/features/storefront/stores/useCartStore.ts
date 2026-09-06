"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CatalogProduct } from "../data/products";

export interface CartItem {
  id: string;
  slug: string;
  brand: string;
  name: string;
  price: number;
  size: string;
  image: string;
  condition: string;
  conditionLabel: string;
  quantity: number;
}

export interface ShippingMethod {
  id: "sedex" | "pac" | "concierge";
  label: string;
  carrier: string;
  price: number;
  estimatedDays: string;
  description: string;
}

export const AVAILABLE_SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: "pac",
    label: "PAC com Seguro Total",
    carrier: "Correios",
    price: 24.9,
    estimatedDays: "4 a 6 dias úteis",
    description: "Envio rastreado com embalagem de segurança inviolável e seguro total.",
  },
  {
    id: "sedex",
    label: "Sedex Expresso",
    carrier: "Correios Sedex",
    price: 46.5,
    estimatedDays: "1 a 2 dias úteis",
    description: "Entrega prioritária rápida com seguro de valor integral declarado.",
  },
  {
    id: "concierge",
    label: "Entrega Expressa / White Glove",
    carrier: "Transportadora Especializada",
    price: 120.0,
    estimatedDays: "Mesmo dia (Grande SP)",
    description: "Entrega expressa personalizada em mãos com horário agendado.",
  },
];

interface CartStore {
  items: CartItem[];
  selectedShipping: ShippingMethod | null;
  cep: string;
  couponCode: string | null;
  discountRate: number; // e.g. 0.1 for 10%
  couponError: string | null;

  // Actions
  addItem: (product: CatalogProduct, size?: string) => void;
  removeItem: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  setShippingMethod: (method: ShippingMethod | null) => void;
  setCep: (cep: string) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;

  // Selectors
  getItemCount: () => number;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getShippingPrice: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [
        {
          id: "prod-1",
          slug: "supreme-box-logo-crewneck-heavyweight-fleece",
          brand: "Supreme",
          name: "Box Logo Crewneck Heavyweight Fleece",
          price: 2450,
          size: "L",
          image: "https://picsum.photos/800/1000?random=101",
          condition: "DSWT",
          conditionLabel: "Novo com Tags",
          quantity: 1,
        },
        {
          id: "prod-5",
          slug: "stussy-cable-knit-wool-beanie-optic-white",
          brand: "Stüssy",
          name: "Cable Knit Wool Beanie Optic White",
          price: 680,
          size: "ÚNICO",
          image: "https://picsum.photos/800/1000?random=105",
          condition: "DSWT",
          conditionLabel: "Novo com Tags",
          quantity: 1,
        },
      ],
      selectedShipping: AVAILABLE_SHIPPING_METHODS[1], // default sedex
      cep: "01310-100",
      couponCode: null,
      discountRate: 0,
      couponError: null,

      addItem: (product: CatalogProduct, chosenSize?: string) => {
        const size = chosenSize || product.size;
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.id === product.id && item.size === size
          );

          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + 1,
            };
            return { items: updated };
          }

          return {
            items: [
              ...state.items,
              {
                id: product.id,
                slug: product.slug,
                brand: product.brand,
                name: product.name,
                price: product.price,
                size,
                image: product.images[0],
                condition: product.condition,
                conditionLabel: product.conditionLabel,
                quantity: 1,
              },
            ],
          };
        });
      },

      removeItem: (id: string, size: string) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.id === id && item.size === size)
          ),
        }));
      },

      updateQuantity: (id: string, size: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id, size);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id && item.size === size
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], couponCode: null, discountRate: 0 });
      },

      setShippingMethod: (method: ShippingMethod | null) => {
        set({ selectedShipping: method });
      },

      setCep: (cep: string) => {
        set({ cep });
      },

      applyCoupon: (code: string) => {
        const clean = code.trim().toUpperCase();
        if (clean === "ONYX10" || clean === "DESAPEGADO10") {
          set({
            couponCode: clean,
            discountRate: 0.1,
            couponError: null,
          });
          return true;
        } else if (clean === "VIP15") {
          set({
            couponCode: clean,
            discountRate: 0.15,
            couponError: null,
          });
          return true;
        } else {
          set({ couponError: "Cupom inválido ou expirado" });
          return false;
        }
      },

      removeCoupon: () => {
        set({ couponCode: null, discountRate: 0, couponError: null });
      },

      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        return Math.round(subtotal * get().discountRate * 100) / 100;
      },

      getShippingPrice: () => {
        return get().selectedShipping ? get().selectedShipping!.price : 0;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const shipping = get().getShippingPrice();
        return Math.max(0, subtotal - discount + shipping);
      },
    }),
    {
      name: "desapegado_cart_store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
