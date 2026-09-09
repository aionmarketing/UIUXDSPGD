"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface RewardState {
  bananaBalance: number;
  isCelebrating: boolean;
  celebrationCount: number;
  lastRewardEarned: number;

  // Actions
  triggerCelebration: (count: number) => void;
  finishCelebration: () => void;
  addBananas: (count: number) => void;
  calculateReward: (amountInBrl: number, hasTenPercentCoupon?: boolean) => number;
}

export const useRewardStore = create<RewardState>()(
  persist(
    (set, get) => ({
      bananaBalance: 12, // Starting welcome balance for archive members
      isCelebrating: false,
      celebrationCount: 0,
      lastRewardEarned: 0,

      calculateReward: (amountInBrl: number, hasTenPercentCoupon = false) => {
        // Business Rule: Every $10 USD spent = 1 banana (approx R$ 50 BRL)
        const baseBananas = Math.max(1, Math.floor(amountInBrl / 50));
        // A 10% discount coupon grants 10 bananas bonus
        const couponBonus = hasTenPercentCoupon ? 10 : 0;
        return baseBananas + couponBonus;
      },

      triggerCelebration: (count: number) => {
        const safeCount = Math.max(1, count);
        set({
          isCelebrating: true,
          celebrationCount: safeCount,
          lastRewardEarned: safeCount,
        });
      },

      finishCelebration: () => {
        const { celebrationCount, bananaBalance } = get();
        set({
          isCelebrating: false,
          bananaBalance: bananaBalance + celebrationCount,
          celebrationCount: 0,
        });
      },

      addBananas: (count: number) => {
        set((state) => ({
          bananaBalance: Math.max(0, state.bananaBalance + count),
        }));
      },
    }),
    {
      name: "desapegado_banana_rewards",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
