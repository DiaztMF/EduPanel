import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { type MathQuestion, getNextQuestion, resetQuestionPool } from "@/data/math-questions";

interface PipetteState {
  p1Level: number; // 0–100
  p2Level: number;
  p1Question: MathQuestion;
  p2Question: MathQuestion;
  p1LastResult: "correct" | "wrong" | null;
  p2LastResult: "correct" | "wrong" | null;

  submitAnswer: (player: 1 | 2, value: number) => boolean;
  reset: () => void;
}

const ANSWER_FILL = 10; // 10% per correct answer

export const usePipetteStore = create<PipetteState>()(
  devtools(
    (set, get) => ({
      p1Level: 0,
      p2Level: 0,
      p1Question: getNextQuestion(),
      p2Question: getNextQuestion(),
      p1LastResult: null,
      p2LastResult: null,

      submitAnswer: (player, value) => {
        const state = get();
        const question = player === 1 ? state.p1Question : state.p2Question;
        const correct = value === question.answer;

        if (player === 1) {
          const newLevel = Math.min(100, state.p1Level + (correct ? ANSWER_FILL : 0));
          set({ p1LastResult: correct ? "correct" : "wrong", p1Level: newLevel });
          setTimeout(() => set({ p1Question: getNextQuestion(), p1LastResult: null }), 700);
        } else {
          const newLevel = Math.min(100, state.p2Level + (correct ? ANSWER_FILL : 0));
          set({ p2LastResult: correct ? "correct" : "wrong", p2Level: newLevel });
          setTimeout(() => set({ p2Question: getNextQuestion(), p2LastResult: null }), 700);
        }
        return correct;
      },

      reset: () => {
        resetQuestionPool();
        set({
          p1Level: 0, p2Level: 0,
          p1Question: getNextQuestion(), p2Question: getNextQuestion(),
          p1LastResult: null, p2LastResult: null,
        });
      },
    }),
    { name: "Pipette-Store" }
  )
);
