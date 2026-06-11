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
  const onCompleteRef = useRef(onComplete);
  const onCriticalRef = useRef(onCritical);
  const calledComplete = useRef(false);
  const calledCritical = useRef(false);

  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);
  useEffect(() => { onCriticalRef.current = onCritical; }, [onCritical]);

  useEffect(() => {
    setRemaining(duration);
    calledComplete.current = false;
    calledCritical.current = false;
  }, [duration]);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;
        if (next <= criticalThreshold && !calledCritical.current) {
          calledCritical.current = true;
          onCriticalRef.current?.();
        }
        if (next <= 0 && !calledComplete.current) {
          calledComplete.current = true;
          onCompleteRef.current?.();
          clearInterval(id);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning, criticalThreshold]);

  const pct = (remaining / duration) * 100;
  const isCritical = remaining <= criticalThreshold;
  const color = isCritical ? "#ff6b6b" : remaining <= duration * 0.4 ? "#ffaa5e" : "#4adeab";

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Circular timer */}
      <div className="relative" style={{ width: "clamp(56px, 7vw, 88px)", height: "clamp(56px, 7vw, 88px)" }}>
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="17" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
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
              textShadow: isCritical ? `0 0 12px ${color}` : "none",
            }}
          >
            {remaining}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-white/40 font-medium tracking-widest uppercase" style={{ fontSize: "clamp(8px, 0.9vw, 11px)" }}>
        TIME
      </span>
    </div>
  );
}
