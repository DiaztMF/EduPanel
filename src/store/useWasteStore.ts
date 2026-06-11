import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { type WasteItem, type WasteCategory, getRandomWaste } from "@/data/waste-items";

interface WasteSortingState {
  currentWaste: WasteItem;
  p1Options: WasteCategory[];
  p2Options: WasteCategory[];
  p1Score: number;
  p2Score: number;
  p1LastResult: "correct" | "wrong" | null;
  p2LastResult: "correct" | "wrong" | null;

  submitAnswer: (player: 1 | 2, guess: WasteCategory) => boolean;
  nextWaste: () => void;
  reset: () => void;
}

const ALL_CATEGORIES: WasteCategory[] = ["organik", "anorganik", "b3"];

function generateOptions(correctCategory: WasteCategory): WasteCategory[] {
  const wrongCategories = ALL_CATEGORIES.filter((c) => c !== correctCategory);
  const randomWrong = wrongCategories[Math.floor(Math.random() * wrongCategories.length)];
  return Math.random() > 0.5 ? [correctCategory, randomWrong] : [randomWrong, correctCategory];
}

export const useWasteStore = create<WasteSortingState>()(
  devtools(
    (set, get) => {
      const initialWaste = getRandomWaste();
      return {
        currentWaste: initialWaste,
        p1Options: generateOptions(initialWaste.category),
        p2Options: generateOptions(initialWaste.category),
        p1Score: 0,
        p2Score: 0,
        p1LastResult: null,
        p2LastResult: null,

        submitAnswer: (player, guess) => {
          const { currentWaste, p1Score, p2Score } = get();
          const correct = currentWaste.category === guess;
          const pts = correct ? 10 : -5;

          if (player === 1) {
            set({ p1Score: Math.max(0, p1Score + pts), p1LastResult: correct ? "correct" : "wrong" });
          } else {
            set({ p2Score: Math.max(0, p2Score + pts), p2LastResult: correct ? "correct" : "wrong" });
          }
          return correct;
        },

        nextWaste: () => {
          const newWaste = getRandomWaste();
          set({
            currentWaste: newWaste,
            p1Options: generateOptions(newWaste.category),
            p2Options: generateOptions(newWaste.category),
            p1LastResult: null,
            p2LastResult: null,
          });
        },

        reset: () => {
          const w = getRandomWaste();
          set({
            currentWaste: w,
            p1Options: generateOptions(w.category),
            p2Options: generateOptions(w.category),
            p1Score: 0,
            p2Score: 0,
            p1LastResult: null,
            p2LastResult: null,
          });
        },
      };
    },
    { name: "WasteSorting-Store" }
  )
);
