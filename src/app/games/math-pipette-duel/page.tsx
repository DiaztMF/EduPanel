"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePipetteStore } from "@/store/usePipetteStore";
import { VictoryResultModal } from "@/components/game/VictoryResultModal";
import { GameHeader } from "@/components/game/GameHeader";

const GAME_DURATION = 60;

type Phase = "countdown" | "playing" | "finished";

function PipetteTube({ level, player }: { level: number; player: 1 | 2 }) {
  const isP1 = player === 1;
  const color = isP1 ? "#1e3a8a" : "#7f1d1d";
  const liquidColor = isP1 ? "linear-gradient(180deg, #3b82f6 0%, #1e3a8a 100%)" : "linear-gradient(180deg, #ef4444 0%, #7f1d1d 100%)";
  const glowColor = isP1 ? "rgba(30,58,138,0.5)" : "rgba(127,29,29,0.5)";

  return (
    <div className="flex flex-col items-center h-full relative" style={{ width: "clamp(60px, 8vw, 120px)" }}>
      <div className="font-black mb-2 drop-shadow-sm" style={{ color: color, fontSize: "clamp(18px, 2.5vw, 36px)" }}>{level}%</div>

      {/* Pipette Structure */}
      <div className="relative flex-1 w-full flex flex-col items-center">
        {/* Top Rim */}
        <div className="absolute top-0 bg-gray-100 border-4 border-gray-800 rounded-full z-10" style={{ width: "120%", height: "clamp(16px, 2vh, 32px)", transform: "translateY(-50%)" }}></div>

        {/* Tube Body */}
        <div className="relative w-full h-full border-4 border-gray-800 rounded-b-full bg-white/50 overflow-hidden shadow-inner flex flex-col justify-end" style={{ backdropFilter: "blur(4px)" }}>
          {/* Liquid Fill */}
          <motion.div
            className="w-full relative"
            initial={{ height: 0 }}
            animate={{ height: `${level}%` }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
            style={{ background: liquidColor, boxShadow: `0 -4px 12px ${glowColor}` }}
          >
            <div className="absolute top-0 left-0 right-0 h-2 bg-white/30 rounded-t-full"></div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function NumpadPanel({
  player,
  question,
  disabled,
  feedback,
  onKirim
}: {
  player: 1 | 2;
  question: string;
  disabled: boolean;
  feedback: "correct" | "wrong" | null;
  onKirim: (val: number) => void;
}) {
  const [input, setInput] = useState("");
  const isP1 = player === 1;
  const headerColor = isP1 ? "#1e1b4b" : "#7f1d1d";
  const teamName = isP1 ? "Tim Biru" : "Tim Merah";

  useEffect(() => {
    if (feedback === null) setInput("");
  }, [feedback]);

  const handleKirim = () => {
    if (input === "" || disabled) return;
    onKirim(Number(input));
  };

  const handleKeyPress = (key: string) => {
    if (disabled || feedback !== null) return;
    if (key === "clear") setInput("");
    else setInput(prev => (prev.length < 4 ? prev + key : prev));
  };

  return (
    <motion.div
      animate={
        feedback === "correct" ? { scale: [1, 1.05, 1], boxShadow: "0 0 50px rgba(74,222,171,0.8)" } :
          feedback === "wrong" ? { x: [-15, 15, -15, 15, 0], boxShadow: "0 0 50px rgba(255,68,68,0.8)" } :
            { scale: 1, boxShadow: "0 10px 40px rgba(0,0,0,0.15)" }
      }
      className="bg-white rounded-2xl flex flex-col"
      style={{ width: "clamp(320px, 26vw, 480px)", overflow: "hidden" }}
    >
      {/* Header */}
      <div className="flex flex-col items-center justify-center text-white shadow-inner" style={{ backgroundColor: headerColor, padding: "clamp(16px, 2vh, 32px)" }}>
        <h2 className="font-bold mb-2 opacity-80 uppercase tracking-wider" style={{ fontSize: "clamp(14px, 1vw, 20px)" }}>{teamName}</h2>
        <div className="font-black tracking-widest" style={{ fontSize: "clamp(32px, 3vw, 56px)" }}>
          {question}
        </div>
      </div>

      {/* Input Display */}
      <div style={{ padding: "clamp(16px, 2vh, 32px) clamp(16px, 2vw, 32px) 0" }}>
        <div className="bg-white border-2 border-gray-300 rounded-xl flex items-center justify-center text-gray-800 font-bold" style={{ height: "clamp(60px, 6vh, 100px)", fontSize: "clamp(36px, 3.5vw, 64px)" }}>
          {input}
        </div>
      </div>

      {/* Numpad */}
      <div className="grid grid-cols-3" style={{ gap: "clamp(12px, 1.5vh, 24px)", padding: "clamp(16px, 2vh, 32px)" }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onPointerDown={(e) => { e.stopPropagation(); handleKeyPress(num.toString()); }}
            disabled={disabled}
            className="touch-btn bg-[#f3f4f6] active:bg-[#e5e7eb] text-gray-800 font-bold rounded-xl shadow-sm border-b-4 border-gray-300 active:border-b-0 active:translate-y-1 transition-all"
            style={{ height: "clamp(70px, 8vh, 120px)", fontSize: "clamp(32px, 2.5vw, 56px)" }}
          >
            {num}
          </button>
        ))}
        <button
          onPointerDown={(e) => { e.stopPropagation(); handleKeyPress("clear"); }}
          disabled={disabled}
          className="touch-btn bg-[#ef4444] active:bg-[#dc2626] text-white font-bold rounded-xl shadow-sm border-b-4 border-[#b91c1c] active:border-b-0 active:translate-y-1 transition-all"
          style={{ height: "clamp(70px, 8vh, 120px)", fontSize: "clamp(32px, 2.5vw, 56px)" }}
        >
          C
        </button>
        <button
          onPointerDown={(e) => { e.stopPropagation(); handleKeyPress("0"); }}
          disabled={disabled}
          className="touch-btn bg-[#f3f4f6] active:bg-[#e5e7eb] text-gray-800 font-bold rounded-xl shadow-sm border-b-4 border-gray-300 active:border-b-0 active:translate-y-1 transition-all"
          style={{ height: "clamp(70px, 8vh, 120px)", fontSize: "clamp(32px, 2.5vw, 56px)" }}
        >
          0
        </button>
        <button
          onPointerDown={(e) => { e.stopPropagation(); handleKirim(); }}
          disabled={disabled}
          className="touch-btn bg-[#0ea5e9] active:bg-[#0284c7] text-white font-bold rounded-xl shadow-sm border-b-4 border-[#0369a1] active:border-b-0 active:translate-y-1 transition-all"
          style={{ height: "clamp(70px, 8vh, 120px)", fontSize: "clamp(32px, 2.5vw, 56px)" }}
        >
          Go
        </button>
      </div>
    </motion.div>
  )
}

export default function MathPipetteDuelPage() {
  const { p1Level, p2Level, p1Question, p2Question, p1LastResult, p2LastResult, submitAnswer, reset } = usePipetteStore();

  const [phase, setPhase] = useState<Phase>("countdown");
  const [countdown, setCountdown] = useState(3);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [winner, setWinner] = useState<"p1" | "p2" | "draw" | null>(null);

  // Countdown
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown <= 0) { setPhase("playing"); reset(); return; }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, countdown, reset]);

  // Win by filling cylinder
  useEffect(() => {
    if (phase !== "playing") return;
    if (p1Level >= 100) finishGame("p1");
    else if (p2Level >= 100) finishGame("p2");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p1Level, p2Level, phase]);

  const finishGame = useCallback((forced?: "p1" | "p2") => {
    if (phase === "finished") return;
    setPhase("finished");
    if (forced) { setWinner(forced); return; }
    if (p1Level > p2Level) setWinner("p1");
    else if (p2Level > p1Level) setWinner("p2");
    else setWinner("draw");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, p1Level, p2Level]);

  const handleAnswer = (player: 1 | 2, value: number) => {
    if (phase !== "playing") return;
    const correct = submitAnswer(player, value);
    if (correct) (player === 1 ? setP1Score : setP2Score)((s) => s + 10);
  };

  const handleRematch = () => {
    setPhase("countdown"); setCountdown(3); setP1Score(0); setP2Score(0); setWinner(null); reset();
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#e0f2fe] relative overflow-hidden text-gray-900 font-sans">

      {/* ── SHARED GAME HEADER ── */}
      <GameHeader
        title="Duel Pipet Matematika"
        subtitle="Math Pipette Duel"
        timerDuration={GAME_DURATION}
        isTimerRunning={phase === "playing"}
        onTimerComplete={() => finishGame()}
      />

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 w-full flex items-center justify-between min-h-0" style={{ padding: "clamp(14px, 2.5vh, 28px) clamp(24px, 4vw, 80px)" }}>

        {/* Left P1 Panel + Score */}
        <div className="flex flex-col items-center z-10 flex-shrink-0 gap-4">
          <NumpadPanel
            player={1}
            question={p1Question.problem}
            disabled={phase !== "playing"}
            feedback={p1LastResult}
            onKirim={(val) => handleAnswer(1, val)}
          />
          <div
            className="bg-white border border-sky-200 rounded-xl font-bold text-center shadow-sm"
            style={{ padding: "clamp(10px, 1.2vh, 16px) clamp(16px, 2vw, 28px)", fontSize: "clamp(14px, 1.5vw, 22px)", color: "#1e3a8a" }}
          >
            Skor: {p1Score}
          </div>
        </div>

        {/* Center Pipettes */}
        <div className="flex-1 flex items-center justify-center gap-6 relative z-10 h-full min-w-0" style={{ padding: "0 clamp(8px, 2vw, 32px)" }}>
          <PipetteTube level={p1Level} player={1} />

          {/* VS Badge */}
          <div className="flex flex-col items-center justify-center gap-5">
            <div className="bg-white border border-gray-300 rounded-2xl flex flex-col items-center justify-center shadow-md" style={{ padding: "clamp(10px, 1.5vh, 20px) clamp(16px, 2vw, 32px)" }}>
              <span className="text-[#1f2937] font-black italic" style={{ fontSize: "clamp(32px, 4vw, 64px)" }}>VS</span>
            </div>
            <div className="bg-gray-800 rounded-full text-white font-bold shadow-md" style={{ padding: "clamp(8px, 1.2vh, 14px) clamp(16px, 2vw, 32px)", fontSize: "clamp(14px, 1.5vw, 20px)" }}>
              Target: 100%
            </div>
          </div>

          <PipetteTube level={p2Level} player={2} />
        </div>

        {/* Right P2 Panel + Score */}
        <div className="flex flex-col items-center z-10 flex-shrink-0 gap-4">
          <NumpadPanel
            player={2}
            question={p2Question.problem}
            disabled={phase !== "playing"}
            feedback={p2LastResult}
            onKirim={(val) => handleAnswer(2, val)}
          />
          <div
            className="bg-white border border-red-200 rounded-xl font-bold text-center shadow-sm"
            style={{ padding: "clamp(10px, 1.2vh, 16px) clamp(16px, 2vw, 28px)", fontSize: "clamp(14px, 1.5vw, 22px)", color: "#7f1d1d" }}
          >
            Skor: {p2Score}
          </div>
        </div>
      </div>

      {/* ── COUNTDOWN OVERLAY ── */}
      <AnimatePresence>
        {phase === "countdown" && (
          <motion.div
            className="absolute inset-0 z-40 flex flex-col items-center justify-center"
            style={{ background: "rgba(224,242,254,0.95)", backdropFilter: "blur(12px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <p className="text-gray-600 font-bold mb-6" style={{ fontSize: "clamp(32px, 3vw, 56px)" }}>Bersiap...</p>
            <AnimatePresence mode="wait">
              <motion.div
                key={countdown}
                initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="font-black text-[#0284c7]"
                style={{ fontSize: "clamp(160px, 20vw, 320px)", lineHeight: 1 }}
              >
                {countdown > 0 ? countdown : "GO!"}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── VICTORY MODAL ── */}
      <VictoryResultModal isOpen={phase === "finished"} winner={winner} p1Score={p1Level} p2Score={p2Level} p1Label="Tim Biru (Level)" p2Label="Tim Merah (Level)" onRematch={handleRematch} />
    </div>
  );
}
