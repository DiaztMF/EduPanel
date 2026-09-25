import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  type MathDifficulty,
  type GeneratedMathQuestion,
  generateSymmetricMathPair,
  generateMathQuestion,
} from "@/lib/math-engine";

export type { MathDifficulty, GeneratedMathQuestion };

interface MathTugState {
  difficulty: MathDifficulty;
  ropePosition: number;
  p1Question: GeneratedMathQuestion;
  p2Question: GeneratedMathQuestion;
  lastAnswerResult: { player: 1 | 2; correct: boolean } | null;
  p1AnsweredIds: Set<string>;
  p2AnsweredIds: Set<string>;

  submitAnswer: (player: 1 | 2, selectedAnswer: number) => boolean;
  nextQuestion: (player: 1 | 2) => void;
  reset: (difficulty?: MathDifficulty) => void;
}

const ROPE_SHIFT = 10;
const WIN_THRESHOLD = 50;

const initialDifficulty: MathDifficulty = "medium";
const initialPair = generateSymmetricMathPair(initialDifficulty);

export const useMathTugStore = create<MathTugState>()(
  devtools(
    (set, get) => ({
      difficulty: initialDifficulty,
      ropePosition: 0,
      p1Question: initialPair.p1,
      p2Question: initialPair.p2,
      lastAnswerResult: null,
      p1AnsweredIds: new Set(),
      p2AnsweredIds: new Set(),

      submitAnswer: (player, selectedAnswer) => {
        const { p1Question, p2Question, ropePosition, p1AnsweredIds, p2AnsweredIds } = get();
        const currentQuestion = player === 1 ? p1Question : p2Question;

        const answeredSet = player === 1 ? p1AnsweredIds : p2AnsweredIds;
        if (answeredSet.has(currentQuestion.id)) return false;

        const correct = selectedAnswer === currentQuestion.answer;
        const delta = correct ? ROPE_SHIFT : -ROPE_SHIFT;
        const directedDelta = player === 1 ? delta : -delta;
        const newPos = Math.max(-WIN_THRESHOLD, Math.min(WIN_THRESHOLD, ropePosition + directedDelta));

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
        const { difficulty } = get();
        const newQ = generateMathQuestion(difficulty);
        if (player === 1) {
          set({ p1Question: newQ, lastAnswerResult: null });
        } else {
          set({ p2Question: newQ, lastAnswerResult: null });
        }
      },

      reset: (newDifficulty) => {
        const diff = newDifficulty || get().difficulty;
        const pair = generateSymmetricMathPair(diff);
        set({
          difficulty: diff,
          ropePosition: 0,
          p1Question: pair.p1,
          p2Question: pair.p2,
          lastAnswerResult: null,
          p1AnsweredIds: new Set(),
          p2AnsweredIds: new Set(),
        });
      },
    }),
    { name: "MathTug-Store" }
  )
);
