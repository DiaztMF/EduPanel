"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { GlobalTimer } from "./GlobalTimer";

interface GameHeaderProps {
  title: string;
  subtitle?: string;
  timerDuration?: number;       // optional — omit for timer-less games
  isTimerRunning?: boolean;
  onTimerComplete?: () => void;
  /** Optional left-side element. Defaults to back button. */
  leftSlot?: ReactNode;
  /** Optional right-side element. Defaults to fullscreen button. */
  rightSlot?: ReactNode;
}

function FullscreenBtn() {
  const toggle = () => {
    if (typeof window === "undefined") return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  return (
    <button
      onPointerDown={toggle}
      aria-label="Toggle fullscreen"
      className="flex items-center justify-center rounded-xl border border-sky-200 bg-white/80 text-gray-600 font-bold shadow-sm hover:bg-white transition-colors"
      style={{
        minWidth: "clamp(40px, 5vw, 64px)",
        minHeight: "clamp(40px, 5vw, 64px)",
        fontSize: "clamp(18px, 2vw, 28px)",
      }}
    >
      🖥️
    </button>
  );
}

export function GameHeader({
  title,
  subtitle,
  timerDuration,
  isTimerRunning,
  onTimerComplete,
  leftSlot,
  rightSlot,
}: GameHeaderProps) {
  return (
    <header
      className="w-full flex-shrink-0 flex items-center gap-4 z-20"
      style={{
        padding: "clamp(10px, 1.5vh, 18px) clamp(16px, 3vw, 40px)",
        background: "rgba(255,255,255,0.70)",
        backdropFilter: "blur(10px)",
        borderBottom: "1.5px solid rgba(186,230,253,0.8)", // sky-200
        boxShadow: "0 2px 12px rgba(14,165,233,0.07)",
      }}
    >
      {/* ── LEFT: back button or custom slot ── */}
      <div className="flex items-center" style={{ minWidth: "clamp(80px, 10vw, 140px)" }}>
        {leftSlot ?? (
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl border border-sky-200 bg-white/80 text-gray-600 font-bold shadow-sm hover:bg-white transition-colors"
            style={{
              padding: "clamp(8px, 1vh, 14px) clamp(12px, 1.5vw, 20px)",
              fontSize: "clamp(12px, 1.2vw, 16px)",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            ← Menu
          </Link>
        )}
      </div>

      {/* ── CENTER: game title ── */}
      <div className="flex-1 flex flex-col items-center justify-center text-center min-w-0">
        <h1
          className="font-black leading-tight text-gray-800 truncate w-full"
          style={{ fontSize: "clamp(16px, 2vw, 28px)" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="text-sky-500 font-semibold tracking-wide mt-0.5 truncate w-full"
            style={{ fontSize: "clamp(10px, 1vw, 14px)" }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* ── RIGHT: timer (optional) + fullscreen ── */}
      <div
        className="flex items-center justify-end gap-3"
        style={{ minWidth: "clamp(80px, 10vw, 140px)" }}
      >
        {timerDuration !== undefined && (
          <GlobalTimer
            duration={timerDuration}
            isRunning={isTimerRunning ?? false}
            onComplete={onTimerComplete}
          />
        )}
        {rightSlot ?? <FullscreenBtn />}
      </div>
    </header>
  );
}
