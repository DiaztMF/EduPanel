"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect } from "react";

interface VersusScoreBoardProps {
  p1Score: number;
  p2Score: number;
  p1Label?: string;
  p2Label?: string;
}

function ScoreDisplay({
  score,
  player,
  label,
}: {
  score: number;
  player: 1 | 2;
  label: string;
}) {
  const prevScore = useRef(score);
  const justScored = score > prevScore.current;

  useEffect(() => {
    prevScore.current = score;
  });

  const color = player === 1 ? "#6c8eff" : "#ff6b6b";
  const dimColor = player === 1 ? "rgba(108,142,255,0.12)" : "rgba(255,107,107,0.12)";
  const align = player === 1 ? "flex-start" : "flex-end";

  return (
    <div
      className="flex flex-col gap-1 flex-1"
      style={{ alignItems: align }}
    >
      {/* Player label */}
      <div
        className="flex items-center gap-2 px-3 py-1 rounded-lg"
        style={{ background: dimColor, flexDirection: player === 1 ? "row" : "row-reverse" }}
      >
        <div
          className="rounded-full"
          style={{ width: "clamp(8px, 1vw, 12px)", height: "clamp(8px, 1vw, 12px)", background: color }}
        />
        <span
          className="font-bold tracking-wide uppercase"
          style={{ fontSize: "clamp(10px, 1.1vw, 14px)", color }}
        >
          {label}
        </span>
      </div>

      {/* Score */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={score}
          initial={justScored ? { scale: 1.4, y: -8 } : { scale: 1 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.4 }}
          className="font-black leading-none tabular-nums"
          style={{
            fontSize: "clamp(28px, 5vw, 72px)",
            color,
            textShadow: justScored ? `0 0 24px ${color}` : "none",
          }}
        >
          {score}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function VersusScoreBoard({
  p1Score,
  p2Score,
  p1Label = "Player 1",
  p2Label = "Player 2",
}: VersusScoreBoardProps) {
  return (
    <div className="flex items-center gap-3" style={{ minWidth: "clamp(180px, 22vw, 320px)" }}>
      <ScoreDisplay score={p1Score} player={1} label={p1Label} />

      {/* VS Divider */}
      <div
        className="flex flex-col items-center justify-center rounded-xl px-2 py-1 flex-shrink-0"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <span
          className="font-black text-white/30 tracking-widest"
          style={{ fontSize: "clamp(10px, 1.2vw, 16px)" }}
        >
          VS
        </span>
      </div>

      <ScoreDisplay score={p2Score} player={2} label={p2Label} />
    </div>
  );
}
