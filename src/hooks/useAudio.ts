import { useCallback, useRef } from "react";
import { useGameStore } from "@/store/useGameStore";

type SoundEvent = "tap" | "correct" | "wrong" | "victory" | "defeat" | "tick" | "countdown";

// Sound frequency presets for Web Audio API (no external files needed initially)
const SOUND_CONFIG: Record<SoundEvent, { freq: number; duration: number; type: OscillatorType }> = {
  tap: { freq: 440, duration: 0.05, type: "square" },
  correct: { freq: 880, duration: 0.2, type: "sine" },
  wrong: { freq: 220, duration: 0.3, type: "sawtooth" },
  victory: { freq: 1046, duration: 0.5, type: "sine" },
  defeat: { freq: 196, duration: 0.5, type: "sawtooth" },
  tick: { freq: 600, duration: 0.05, type: "square" },
  countdown: { freq: 700, duration: 0.1, type: "square" },
};

export function useAudio() {
  const isMuted = useGameStore((s) => s.isMuted);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    return audioCtxRef.current;
  }, []);

  const playSound = useCallback(
    (event: SoundEvent) => {
      if (isMuted) return;
      try {
        const ctx = getCtx();
        const cfg = SOUND_CONFIG[event];
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = cfg.type;
        oscillator.frequency.setValueAtTime(cfg.freq, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + cfg.duration);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + cfg.duration);
      } catch {
        // AudioContext may be blocked until user interaction — silent fail
      }
    },
    [isMuted, getCtx]
  );

  return { playSound };
}
