import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { type MathQuestion, getNextQuestion, resetQuestionPool } from "@/data/math-questions";

interface MathTugState {
  // Rope position: -50 (P2 wins) to +50 (P1 wins), 0 = center
  ropePosition: number;
  p1Question: MathQuestion;
  p2Question: MathQuestion;
  lastAnswerResult: { player: 1 | 2; correct: boolean } | null;
  p1AnsweredIds: Set<string>;
  p2AnsweredIds: Set<string>;

  // Actions
  submitAnswer: (player: 1 | 2, selectedAnswer: number) => boolean;
  nextQuestion: (player: 1 | 2) => void;
  reset: () => void;
}

const ROPE_SHIFT = 10; // % per correct answer
const WIN_THRESHOLD = 50;

export const useMathTugStore = create<MathTugState>()(
  devtools(
    (set, get) => ({
      ropePosition: 0,
      p1Question: getNextQuestion(),
      p2Question: getNextQuestion(),
      lastAnswerResult: null,
      p1AnsweredIds: new Set(),
      p2AnsweredIds: new Set(),

      submitAnswer: (player, selectedAnswer) => {
        const { p1Question, p2Question, ropePosition, p1AnsweredIds, p2AnsweredIds } = get();
        const currentQuestion = player === 1 ? p1Question : p2Question;

        // Prevent double-answering same question by same player
        const answeredSet = player === 1 ? p1AnsweredIds : p2AnsweredIds;
        if (answeredSet.has(currentQuestion.id)) return false;

        const correct = selectedAnswer === currentQuestion.answer;

        // Update rope position
        const delta = correct ? ROPE_SHIFT : -ROPE_SHIFT;
        const directedDelta = player === 1 ? delta : -delta;
        const newPos = Math.max(-WIN_THRESHOLD, Math.min(WIN_THRESHOLD, ropePosition + directedDelta));

        // Track answered question
        const newAnsweredSet = new Set(answeredSet);
        newAnsweredSet.add(currentQuestion.id);

        set({
          ropePosition: newPos,
          lastAnswerResult: { player, correct },
          ...(player === 1
            ? { p1AnsweredIds: newAnsweredSet }
            : { p2AnsweredIds: newAnsweredSet }),
        });

        return correct;
      },

      nextQuestion: (player) => {
        if (player === 1) {
          set({ p1Question: getNextQuestion(), lastAnswerResult: null });
        } else {
          set({ p2Question: getNextQuestion(), lastAnswerResult: null });
        }
      },

      reset: () => {
        resetQuestionPool();
        set({
          ropePosition: 0,
          p1Question: getNextQuestion(),
          p2Question: getNextQuestion(),
          lastAnswerResult: null,
          p1AnsweredIds: new Set(),
          p2AnsweredIds: new Set(),
        });
      },
    }),
    { name: "MathTug-Store" }
  )
);
