import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { type WordChallenge, getNextWord, resetWordPool } from "@/data/word-challenges";

interface PinisiState {
  currentWord: WordChallenge;
  // Per-player guessed options (Set of words they've clicked)
  p1Guessed: Set<string>;
  p2Guessed: Set<string>;
  // How many wrong guesses each player has made for the current word
  p1Errors: number;
  p2Errors: number;

  // Actions
  submitAnswer: (player: 1 | 2, option: string) => "correct" | "wrong" | "already";
  nextWord: () => void;
  reset: () => void;
}

const MAX_ERRORS = 6; // 6 wrong guesses before word is "lost"

export const usePinisiStore = create<PinisiState>()(
  devtools(
    (set, get) => ({
      currentWord: getNextWord(),
      p1Guessed: new Set(),
      p2Guessed: new Set(),
      p1Errors: 0,
      p2Errors: 0,

      submitAnswer: (player, option) => {
        const { currentWord, p1Guessed, p2Guessed } = get();
        const guessed = player === 1 ? p1Guessed : p2Guessed;
        const upper = option.toUpperCase();

        if (guessed.has(upper)) return "already";

        const newGuessed = new Set(guessed);
        newGuessed.add(upper);

        const isCorrect = currentWord.answer === upper;

        if (player === 1) {
          set({
            p1Guessed: newGuessed,
            ...(isCorrect ? {} : { p1Errors: get().p1Errors + 1 }),
          });
        } else {
          set({
            p2Guessed: newGuessed,
            ...(isCorrect ? {} : { p2Errors: get().p2Errors + 1 }),
          });
        }

        return isCorrect ? "correct" : "wrong";
      },

      nextWord: () =>
        set({ currentWord: getNextWord(), p1Guessed: new Set(), p2Guessed: new Set() }),

      reset: () => {
        resetWordPool();
        set({ currentWord: getNextWord(), p1Guessed: new Set(), p2Guessed: new Set(), p1Errors: 0, p2Errors: 0 });
      },
    }),
    { name: "Pinisi-Store" }
  )
);

export { MAX_ERRORS };
