import { useEffect, useRef, useCallback } from "react";

interface UseCountdownOptions {
  duration: number;
  onTick?: (remaining: number) => void;
  onComplete?: () => void;
  onCritical?: (remaining: number) => void;
  criticalThreshold?: number;
  autoStart?: boolean;
}

export function useCountdown({
  duration,
  onTick,
  onComplete,
  onCritical,
  criticalThreshold = 10,
  autoStart = false,
}: UseCountdownOptions) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const remainingRef = useRef(duration);
  const isRunningRef = useRef(false);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;

    intervalRef.current = setInterval(() => {
      remainingRef.current -= 1;
      const r = remainingRef.current;

      onTick?.(r);

      if (r <= criticalThreshold) {
        onCritical?.(r);
      }

      if (r <= 0) {
        clear();
        isRunningRef.current = false;
        onComplete?.();
      }
    }, 1000);
  }, [clear, onTick, onComplete, onCritical, criticalThreshold]);

  const pause = useCallback(() => {
    clear();
    isRunningRef.current = false;
  }, [clear]);

  const reset = useCallback(() => {
    clear();
    isRunningRef.current = false;
    remainingRef.current = duration;
  }, [clear, duration]);

  const stop = useCallback(() => {
    clear();
    isRunningRef.current = false;
    remainingRef.current = 0;
  }, [clear]);

  useEffect(() => {
    if (autoStart) start();
    return clear;
  }, [autoStart, start, clear]);

  return { start, pause, reset, stop };
}
