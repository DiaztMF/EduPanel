import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  type MathDifficulty,
  type GeneratedMathQuestion,
  generateSymmetricMathPair,
  generateMathQuestion,
} from "@/lib/math-engine";

export type { MathDifficulty, GeneratedMathQuestion };

interface PipetteState {
  difficulty: MathDifficulty;
  p1Level: number; // 0 to 100
  p2Level: number;
  p1Question: GeneratedMathQuestion;
  p2Question: GeneratedMathQuestion;
  p1LastResult: "correct" | "wrong" | null;
  p2LastResult: "correct" | "wrong" | null;

  submitAnswer: (player: 1 | 2, value: number) => boolean;
  reset: (difficulty?: MathDifficulty) => void;
}

const ANSWER_FILL = 10; // 10% per correct answer

const initialDifficulty: MathDifficulty = "medium";
const initialPair = generateSymmetricMathPair(initialDifficulty);

export const usePipetteStore = create<PipetteState>()(
  devtools(
    (set, get) => ({
      difficulty: initialDifficulty,
      p1Level: 0,
      p2Level: 0,
      p1Question: initialPair.p1,
      p2Question: initialPair.p2,
      p1LastResult: null,
      p2LastResult: null,

      submitAnswer: (player, value) => {
        const state = get();
        const question = player === 1 ? state.p1Question : state.p2Question;
        const correct = value === question.answer;

        if (player === 1) {
          const newLevel = Math.min(100, state.p1Level + (correct ? ANSWER_FILL : 0));
          set({ p1LastResult: correct ? "correct" : "wrong", p1Level: newLevel });
          setTimeout(() => {
            const nextQ = generateMathQuestion(get().difficulty);
            set({ p1Question: nextQ, p1LastResult: null });
          }, 700);
        } else {
          const newLevel = Math.min(100, state.p2Level + (correct ? ANSWER_FILL : 0));
          set({ p2LastResult: correct ? "correct" : "wrong", p2Level: newLevel });
          setTimeout(() => {
            const nextQ = generateMathQuestion(get().difficulty);
            set({ p2Question: nextQ, p2LastResult: null });
          }, 700);
        }
        return correct;
      },

      reset: (newDifficulty) => {
        const diff = newDifficulty || get().difficulty;
        const pair = generateSymmetricMathPair(diff);
        set({
          difficulty: diff,
          p1Level: 0,
          p2Level: 0,
          p1Question: pair.p1,
          p2Question: pair.p2,
          p1LastResult: null,
          p2LastResult: null,
        });
      },
    }),
    { name: "Pipette-Store" }
  )
);
