"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface VictoryResultModalProps {
  isOpen: boolean;
  winner: "p1" | "p2" | "draw" | null;
  p1Score: number;
  p2Score: number;
  p1Label?: string;
  p2Label?: string;
  onRematch?: () => void;
  rematchLabel?: string;
}

const CONFETTI_COLORS = ["#6c8eff", "#ff6b6b", "#a78bff", "#4adeab", "#ffaa5e", "#ffffff"];

function ConfettiPiece({ i }: { i: number }) {
  const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
  const x = Math.random() * 100;
  const delay = Math.random() * 0.6;
  const duration = 1.5 + Math.random() * 1.5;
  const size = 6 + Math.random() * 8;

  return (
    <motion.div
      className="absolute rounded-sm"
      style={{ left: `${x}%`, top: "-10px", width: size, height: size, background: color, originX: 0.5 }}
      initial={{ y: -20, opacity: 1, rotate: 0 }}
      animate={{ y: "110vh", opacity: [1, 1, 0], rotate: 720 }}
      transition={{ delay, duration, ease: "easeIn" }}
    />
  );
}

export function VictoryResultModal({
  isOpen,
  winner,
  p1Score,
  p2Score,
  p1Label = "Player 1",
  p2Label = "Player 2",
  onRematch,
  rematchLabel = "🔄 Rematch",
}: VictoryResultModalProps) {
  const winnerLabel =
    winner === "p1" ? p1Label : winner === "p2" ? p2Label : null;
  const winnerColor =
    winner === "p1" ? "#6c8eff" : winner === "p2" ? "#ff6b6b" : "#a78bff";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Confetti */}
          {winner !== "draw" && Array.from({ length: 40 }).map((_, i) => (
            <ConfettiPiece key={i} i={i} />
          ))}

          {/* Modal */}
          <motion.div
            className="relative z-10 glass-card flex flex-col items-center text-center"
            style={{
              padding: "clamp(32px, 5vw, 64px)",
              minWidth: "clamp(320px, 50vw, 640px)",
              gap: "clamp(16px, 2.5vh, 32px)",
              border: `1px solid ${winnerColor}40`,
              boxShadow: `0 0 60px ${winnerColor}30`,
            }}
            initial={{ scale: 0.7, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 40 }}
            transition={{ type: "spring", bounce: 0.4, delay: 0.1 }}
          >
            {/* Trophy / emoji */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.6, delay: 0.3 }}
              style={{ fontSize: "clamp(48px, 8vw, 96px)" }}
            >
              {winner === "draw" ? "🤝" : "🏆"}
            </motion.div>

            {/* Heading */}
            <div>
              <h2
                className="font-black leading-none"
                style={{ fontSize: "var(--text-2xl)", color: winnerColor }}
              >
                {winner === "draw" ? "Seri!" : "Menang!"}
              </h2>
              {winnerLabel && (
                <p className="text-white/60 mt-2" style={{ fontSize: "var(--text-base)" }}>
                  {winnerLabel} memenangkan pertandingan
                </p>
              )}
            </div>

            {/* Score card */}
            <div
              className="flex items-center gap-6 rounded-2xl"
              style={{
                padding: "clamp(12px, 2vh, 24px) clamp(24px, 4vw, 48px)",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex flex-col items-center gap-1">
                <span
                  className="font-black"
                  style={{ fontSize: "var(--text-xl)", color: "#6c8eff" }}
                >
                  {p1Score}
                </span>
                <span className="text-white/40" style={{ fontSize: "var(--text-xs)" }}>
                  {p1Label}
                </span>
              </div>
              <span className="text-white/20 font-bold" style={{ fontSize: "var(--text-lg)" }}>
                :
              </span>
              <div className="flex flex-col items-center gap-1">
                <span
                  className="font-black"
                  style={{ fontSize: "var(--text-xl)", color: "#ff6b6b" }}
                >
                  {p2Score}
                </span>
                <span className="text-white/40" style={{ fontSize: "var(--text-xs)" }}>
                  {p2Label}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              {onRematch && (
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  onClick={onRematch}
                  className="touch-btn font-bold"
                  style={{
                    background: `linear-gradient(135deg, ${winnerColor}, ${winnerColor}99)`,
                    color: "white",
                    padding: "clamp(12px, 2vh, 20px) clamp(24px, 4vw, 48px)",
                    fontSize: "var(--text-base)",
                    borderRadius: "14px",
                    minHeight: "var(--touch-lg)",
                  }}
                >
                  {rematchLabel}
                </motion.button>
              )}
              <Link
                href="/"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.7)",
                  padding: "clamp(12px, 2vh, 20px) clamp(24px, 4vw, 48px)",
                  fontSize: "var(--text-base)",
                  fontWeight: 600,
                  borderRadius: "14px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  textDecoration: "none",
                  minHeight: "var(--touch-lg)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                🏠 Menu
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
