"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GlobalTimerProps {
  duration: number; // seconds
  isRunning: boolean;
  onComplete?: () => void;
  onCritical?: () => void;
  criticalThreshold?: number;
}

export function GlobalTimer({
  duration,
  isRunning,
  onComplete,
  onCritical,
  criticalThreshold = 10,
}: GlobalTimerProps) {
  const [remaining, setRemaining] = useState(duration);

  // Stable callback refs — never cause the interval to restart
  const onCompleteRef = useRef(onComplete);
  const onCriticalRef = useRef(onCritical);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);
  useEffect(() => { onCriticalRef.current = onCritical; }, [onCritical]);

  // Refs for the countdown value and one-shot flags
  const remainingRef    = useRef(duration);
  const calledComplete  = useRef(false);
  const calledCritical  = useRef(false);

  useEffect(() => {
    let id: ReturnType<typeof setInterval>;
    
    // Defer reset logic to avoid React's "sync setState inside effect" warning
    const t = setTimeout(() => {
      // Sync remaining with duration when not running or when starting fresh
      remainingRef.current = duration;
      setRemaining(duration);
      calledComplete.current = false;
      calledCritical.current = false;

      if (isRunning) {
        id = setInterval(() => {
          const next = Math.max(0, remainingRef.current - 1);
          remainingRef.current = next;
          setRemaining(next);

          // Callbacks called OUTSIDE setState updater
          if (next <= criticalThreshold && !calledCritical.current) {
            calledCritical.current = true;
            onCriticalRef.current?.();
          }
          if (next <= 0 && !calledComplete.current) {
            calledComplete.current = true;
            clearInterval(id);
            onCompleteRef.current?.();
          }
        }, 1000);
      }
    }, 0);

    return () => {
      clearTimeout(t);
      if (id) clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, duration, criticalThreshold]);

  const pct        = duration > 0 ? (remaining / duration) * 100 : 0;
  const isCritical = remaining <= criticalThreshold;
  const color      = isCritical ? "#dc2626" : remaining <= duration * 0.4 ? "#d97706" : "#0284c7";
  const trackColor = "rgba(15, 23, 42, 0.12)";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: "clamp(56px, 7vw, 88px)", height: "clamp(56px, 7vw, 88px)" }}>
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 40 40">
          {/* Track ring */}
          <circle cx="20" cy="20" r="17" fill="none" stroke={trackColor} strokeWidth="3" />
          {/* Progress ring */}
          <circle
            cx="20" cy="20" r="17"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${(pct / 100) * 106.8} 106.8`}
            style={{ transition: "stroke-dasharray 0.9s linear, stroke 0.3s ease" }}
          />
        </svg>

        <AnimatePresence mode="wait">
          <motion.span
            key={remaining}
            initial={{ scale: isCritical ? 1.3 : 1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 flex items-center justify-center font-black"
            style={{
              fontSize: "clamp(16px, 2.2vw, 30px)",
              color,
              textShadow: isCritical ? `0 0 8px ${color}55` : "none",
            }}
          >
            {remaining}
          </motion.span>
        </AnimatePresence>
      </div>

      <span
        className="font-bold tracking-widest uppercase"
        style={{ fontSize: "clamp(8px, 0.9vw, 11px)", color: "rgba(15,23,42,0.45)" }}
      >
        TIME
      </span>
    </div>
  );
}
