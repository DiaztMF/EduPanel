"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { RotateCcw, Home } from "lucide-react";

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

const CONFETTI_COLORS = ["#3b82f6", "#ef4444", "#a78bff", "#4adeab", "#ffaa5e", "#0ea5e9"];

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
  rematchLabel = "Rematch",
}: VictoryResultModalProps) {
  const winnerLabel =
    winner === "p1" ? p1Label : winner === "p2" ? p2Label : null;
  const winnerColor =
    winner === "p1" ? "#1e3a8a" : winner === "p2" ? "#7f1d1d" : "#6b7280";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{ background: "rgba(224,242,254,0.95)", backdropFilter: "blur(12px)" }}
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
            className="relative z-10 flex flex-col items-center text-center bg-white rounded-3xl shadow-2xl"
            style={{
              padding: "clamp(32px, 5vw, 64px)",
              minWidth: "clamp(320px, 26vw, 480px)",
              gap: "clamp(16px, 2.5vh, 32px)",
              border: `2px solid ${winnerColor}25`,
              boxShadow: `0 0 60px ${winnerColor}20, 0 20px 60px rgba(0,0,0,0.08)`,
            }}
            initial={{ scale: 0.7, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 40 }}
            transition={{ type: "spring", bounce: 0.4, delay: 0.1 }}
          >
            {/* Trophy */}
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
                style={{ fontSize: "clamp(36px, 4vw, 72px)", color: winnerColor }}
              >
                {winner === "draw" ? "Seri!" : "Menang!"}
              </h2>
              {winnerLabel && (
                <p className="text-gray-500 mt-2 font-bold" style={{ fontSize: "clamp(14px, 1.5vw, 22px)" }}>
                  {winnerLabel} memenangkan pertandingan
                </p>
              )}
            </div>

            {/* Score card */}
            <div
              className="flex items-center gap-6 rounded-2xl"
              style={{
                padding: "clamp(12px, 2vh, 24px) clamp(24px, 4vw, 48px)",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <div className="flex flex-col items-center gap-1">
                <span
                  className="font-black"
                  style={{ fontSize: "clamp(24px, 3vw, 48px)", color: "#1e3a8a" }}
                >
                  {p1Score}
                </span>
                <span className="text-gray-400 font-bold" style={{ fontSize: "clamp(10px, 1vw, 14px)" }}>
                  {p1Label}
                </span>
              </div>
              <span className="text-gray-300 font-bold" style={{ fontSize: "clamp(20px, 2.5vw, 36px)" }}>
                :
              </span>
              <div className="flex flex-col items-center gap-1">
                <span
                  className="font-black"
                  style={{ fontSize: "clamp(24px, 3vw, 48px)", color: "#7f1d1d" }}
                >
                  {p2Score}
                </span>
                <span className="text-gray-400 font-bold" style={{ fontSize: "clamp(10px, 1vw, 14px)" }}>
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
                  className="touch-btn font-bold inline-flex items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${winnerColor}, ${winnerColor}dd)`,
                    color: "white",
                    padding: "clamp(12px, 2vh, 20px) clamp(24px, 4vw, 48px)",
                    fontSize: "clamp(16px, 1.8vw, 28px)",
                    borderRadius: "14px",
                    minHeight: "var(--touch-lg)",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <RotateCcw size={20} />
                  {rematchLabel}
                </motion.button>
              )}
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 font-bold no-underline"
                style={{
                  background: "#f3f4f6",
                  color: "#374151",
                  padding: "clamp(12px, 2vh, 20px) clamp(24px, 4vw, 48px)",
                  fontSize: "clamp(16px, 1.8vw, 28px)",
                  borderRadius: "14px",
                  minHeight: "var(--touch-lg)",
                  border: "2px solid #d1d5db",
                  cursor: "pointer",
                }}
              >
                <Home size={20} />
                Menu
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
