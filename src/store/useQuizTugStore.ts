import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { type TriviaQuestion, getNextTrivia, resetTriviaPool } from "@/data/quiz-trivia";

interface QuizTugState {
  ropePosition: number;
  currentQuestion: TriviaQuestion;
  lastAnswerResult: { player: 1 | 2; correct: boolean } | null;
  p1Answered: boolean;
  p2Answered: boolean;

  submitAnswer: (player: 1 | 2, selected: string) => boolean;
  nextQuestion: () => void;
  reset: () => void;
}

const ROPE_SHIFT = 10;

export const useQuizTugStore = create<QuizTugState>()(
  devtools(
    (set, get) => ({
      ropePosition: 0,
      currentQuestion: getNextTrivia(),
      lastAnswerResult: null,
      p1Answered: false,
      p2Answered: false,

      submitAnswer: (player, selected) => {
        const { currentQuestion, ropePosition, p1Answered, p2Answered } = get();
        if (player === 1 && p1Answered) return false;
        if (player === 2 && p2Answered) return false;

        const correct = selected === currentQuestion.answer;
        const delta = correct ? ROPE_SHIFT : -ROPE_SHIFT;
        const directed = player === 1 ? delta : -delta;
        const newPos = Math.max(-50, Math.min(50, ropePosition + directed));

        set({
          ropePosition: newPos,
          lastAnswerResult: { player, correct },
          ...(player === 1 ? { p1Answered: true } : { p2Answered: true }),
        });
        return correct;
      },

      nextQuestion: () =>
        set({ currentQuestion: getNextTrivia(), lastAnswerResult: null, p1Answered: false, p2Answered: false }),

      reset: () => {
        resetTriviaPool();
        set({ ropePosition: 0, currentQuestion: getNextTrivia(), lastAnswerResult: null, p1Answered: false, p2Answered: false });
      },
    }),
    { name: "QuizTug-Store" }
  )
);
