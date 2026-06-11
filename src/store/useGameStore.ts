import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type Player = "p1" | "p2";
export type GamePhase = "idle" | "countdown" | "playing" | "paused" | "finished";

export interface GameScore {
  p1: number;
  p2: number;
}

interface GameState {
  // State
  currentGame: string | null;
  gamePhase: GamePhase;
  timerDuration: number;
  timeRemaining: number;
  scores: GameScore;
  winner: Player | "draw" | null;
  isMuted: boolean;

  // Actions
  startGame: (gameId: string, duration?: number) => void;
  setPhase: (phase: GamePhase) => void;
  endGame: () => void;
  updateScore: (player: Player, delta: number) => void;
  setWinner: (winner: Player | "draw") => void;
  tick: () => void;
  resetGame: () => void;
  toggleMute: () => void;
  navigateToMenu: () => void;
}

export const useGameStore = create<GameState>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentGame: null,
      gamePhase: "idle",
      timerDuration: 60,
      timeRemaining: 60,
      scores: { p1: 0, p2: 0 },
      winner: null,
      isMuted: false,

      // Actions
      startGame: (gameId, duration = 60) => {
        set({
          currentGame: gameId,
          gamePhase: "countdown",
          timerDuration: duration,
          timeRemaining: duration,
          scores: { p1: 0, p2: 0 },
          winner: null,
        });
      },

      setPhase: (phase) => set({ gamePhase: phase }),

      endGame: () => {
        const { scores } = get();
        let winner: Player | "draw";
        if (scores.p1 > scores.p2) winner = "p1";
        else if (scores.p2 > scores.p1) winner = "p2";
        else winner = "draw";
        set({ gamePhase: "finished", winner });
      },

      updateScore: (player, delta) =>
        set((state) => ({
          scores: {
            ...state.scores,
            [player]: Math.max(0, state.scores[player] + delta),
          },
        })),

      setWinner: (winner) => set({ winner, gamePhase: "finished" }),

      tick: () => {
        const { timeRemaining, endGame } = get();
        if (timeRemaining <= 1) {
          endGame();
        } else {
          set((state) => ({ timeRemaining: state.timeRemaining - 1 }));
        }
      },

      resetGame: () => {
        const { currentGame, timerDuration } = get();
        set({
          gamePhase: "countdown",
          timeRemaining: timerDuration,
          scores: { p1: 0, p2: 0 },
          winner: null,
          currentGame,
        });
      },

      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

      navigateToMenu: () =>
        set({
          currentGame: null,
          gamePhase: "idle",
          timeRemaining: 60,
          scores: { p1: 0, p2: 0 },
          winner: null,
        }),
    }),
    { name: "EduPanel-GameStore" }
  )
);
