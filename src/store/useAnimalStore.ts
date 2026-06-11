import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { type Animal, type AnimalClass, getGameAnimals } from "@/data/animals";

interface AnimalClassStore {
  currentAnimal: Animal | null;
  queue: Animal[];
  p1Score: number;
  p2Score: number;
  p1LastResult: "correct" | "wrong" | null;
  p2LastResult: "correct" | "wrong" | null;
  p1LastFact: string;
  p2LastFact: string;
  p1Answered: boolean;
  p2Answered: boolean;

  classify: (player: 1 | 2, guess: AnimalClass) => boolean;
  nextAnimal: () => void;
  reset: () => void;
}

function buildQueue(): Animal[] {
  // Each round: use 12 animals for a slightly longer game
  return getGameAnimals(12);
}

export const useAnimalStore = create<AnimalClassStore>()(
  devtools(
    (set, get) => {
      const initial = buildQueue();
      return {
        currentAnimal: initial[0] ?? null,
        queue: initial.slice(1),
        p1Score: 0,
        p2Score: 0,
        p1LastResult: null,
        p2LastResult: null,
        p1LastFact: "",
        p2LastFact: "",
        p1Answered: false,
        p2Answered: false,

        classify: (player, guess) => {
          const { currentAnimal, p1Score, p2Score, p1Answered, p2Answered } = get();
          if (!currentAnimal) return false;

          // Prevent spamming points if already correctly answered
          if (player === 1 && p1Answered) return false;
          if (player === 2 && p2Answered) return false;

          const correct = guess === currentAnimal.class;
          const pts = correct ? 10 : -3;
          const fact = currentAnimal.fact;

          if (player === 1) {
            set({ p1Score: Math.max(0, p1Score + pts), p1LastResult: correct ? "correct" : "wrong", p1LastFact: fact });
            if (correct) set({ p1Answered: true });
            setTimeout(() => set({ p1LastResult: null }), 800);
          } else {
            set({ p2Score: Math.max(0, p2Score + pts), p2LastResult: correct ? "correct" : "wrong", p2LastFact: fact });
            if (correct) set({ p2Answered: true });
            setTimeout(() => set({ p2LastResult: null }), 800);
          }

          // Advance to next animal after the FIRST correct answer, giving the other player a brief window to also answer
          if (correct && !p1Answered && !p2Answered) {
            setTimeout(() => {
              get().nextAnimal();
            }, 1200);
          }

          return correct;
        },

        nextAnimal: () => {
          const { queue } = get();
          if (queue.length === 0) {
            const newQ = buildQueue();
            set({ currentAnimal: newQ[0], queue: newQ.slice(1), p1Answered: false, p2Answered: false });
          } else {
            set({ currentAnimal: queue[0], queue: queue.slice(1), p1Answered: false, p2Answered: false });
          }
        },

        reset: () => {
          const fresh = buildQueue();
          set({ 
            currentAnimal: fresh[0] ?? null, 
            queue: fresh.slice(1), 
            p1Score: 0, 
            p2Score: 0, 
            p1LastResult: null, 
            p2LastResult: null, 
            p1LastFact: "", 
            p2LastFact: "",
            p1Answered: false,
            p2Answered: false
          });
        },
      };
    },
    { name: "AnimalClass-Store" }
  )
);
