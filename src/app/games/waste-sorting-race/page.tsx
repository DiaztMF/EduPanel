"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameHeader } from "@/components/game/GameHeader";
import { VictoryResultModal } from "@/components/game/VictoryResultModal";
import { useWasteStore } from "@/store/useWasteStore";
import { WASTE_CONFIG, type WasteCategory } from "@/data/waste-items";

const GAME_DURATION = 60; // seconds

type Phase = "countdown" | "playing" | "finished";

function TeamPanel({
  player,
  options,
  lastResult,
  score,
  onGuess,
  disabled,
}: {
  player: 1 | 2;
  options: WasteCategory[];
  lastResult: "correct" | "wrong" | null;
  score: number;
  onGuess: (cat: WasteCategory) => void;
  disabled: boolean;
}) {
  const isP1 = player === 1;
  const color = isP1 ? "#1e3a8a" : "#7f1d1d";
  const headerColor = isP1 ? "#1e1b4b" : "#7f1d1d";
  const title = isP1 ? "TIM BIRU" : "TIM MERAH";

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-lg border-2 overflow-hidden h-full" style={{ borderColor: color }}>
      <div className="flex items-center justify-between text-white shadow-inner flex-shrink-0" style={{ backgroundColor: headerColor, padding: "clamp(12px, 1.5vh, 20px) clamp(20px, 3vw, 32px)" }}>
        <h2 className="font-bold tracking-widest" style={{ fontSize: "clamp(14px, 1.6vw, 22px)" }}>{title}</h2>
        <div className="font-black bg-white/20 rounded-lg" style={{ padding: "clamp(6px, 0.8vh, 10px) clamp(12px, 1.5vw, 20px)", fontSize: "clamp(13px, 1.3vw, 18px)" }}>{score} pts</div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 relative" style={{ padding: "clamp(12px, 1.8vh, 22px)", background: "#f8fafc", gap: "clamp(10px, 1.4vh, 18px)" }}>
        <AnimatePresence>
          {lastResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -20 }}
              className="absolute font-black z-20 pointer-events-none"
              style={{ top: "8%", left: "50%", transform: "translateX(-50%)", color: lastResult === "correct" ? "#10b981" : "#ef4444", fontSize: "clamp(40px, 5vw, 70px)", filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }}
            >
              {lastResult === "correct" ? "+10" : "-5"}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col flex-1 min-h-0 w-full" style={{ gap: "clamp(8px, 1.2vh, 14px)" }}>
          {options.map((cat, idx) => {
            const cfg = WASTE_CONFIG[cat];
            return (
              <button
                key={`${cat}-${idx}`}
                onPointerDown={(e) => { e.stopPropagation(); onGuess(cat); }}
                disabled={disabled}
                className="flex-1 w-full bg-white border-2 rounded-2xl shadow-sm flex items-center justify-center gap-4 active:scale-95 active:translate-y-0.5 transition-all"
                style={{ borderColor: cfg.color, minHeight: "clamp(52px, 7vh, 90px)", opacity: disabled ? 0.6 : 1, touchAction: "manipulation" }}
              >
                <span style={{ fontSize: "clamp(28px, 3vw, 44px)" }}>{cfg.emoji}</span>
                <span className="font-bold" style={{ fontSize: "clamp(16px, 1.8vw, 28px)", color: cfg.color }}>{cfg.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function WasteSortingRacePage() {
  const {
    currentWaste,
    p1Options,
    p2Options,
    p1Score,
    p2Score,
    p1LastResult,
    p2LastResult,
    submitAnswer,
    nextWaste,
    reset,
  } = useWasteStore();

  const [phase, setPhase] = useState<Phase>("countdown");
  const [countdown, setCountdown] = useState(3);
  const [winner, setWinner] = useState<"p1" | "p2" | "draw" | null>(null);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown <= 0) {
      const t = setTimeout(() => {
        setPhase("playing");
        reset();
      }, 0);
      return () => clearTimeout(t);
    }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, countdown, reset]);

  const handleGuess = (player: 1 | 2, cat: WasteCategory) => {
    if (phase !== "playing" || locked) return;
    setLocked(true);
    submitAnswer(player, cat);
    
    // Auto advance immediately after someone answers
    setTimeout(() => {
      nextWaste();
      setLocked(false);
    }, 800);
  };

  const finishGame = () => {
    if (phase === "finished") return;
    setPhase("finished");
    if (p1Score > p2Score) setWinner("p1");
    else if (p2Score > p1Score) setWinner("p2");
    else setWinner("draw");
  };

  const handleRematch = () => {
    setPhase("countdown");
    setCountdown(3);
    setWinner(null);
    reset();
  };

  // SCORE PCT
  const maxScore = Math.max(100, p1Score, p2Score);

  if (!isMounted) return <div className="w-full h-full bg-[#e0f2fe]" />;

  return (
    <div className="w-full h-full flex flex-col bg-[#e0f2fe] relative overflow-hidden text-gray-900 font-sans">

      {/* ── SHARED GAME HEADER ── */}
      <GameHeader
        title="Balapan Pilah Sampah"
        subtitle="Waste Sorting Race"
        timerDuration={GAME_DURATION}
        isTimerRunning={phase === "playing"}
        onTimerComplete={finishGame}
      />

      {/* CENTER CLUE CARD */}
      <div className="w-full z-10 flex-shrink-0" style={{ padding: "clamp(10px, 1.6vh, 20px) clamp(20px, 4vw, 60px)" }}>
         <AnimatePresence mode="wait">
           <motion.div 
             key={currentWaste.id}
             initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
             className="bg-white rounded-2xl shadow-md border border-gray-200 text-center w-full flex flex-col items-center justify-center"
             style={{ minHeight: "clamp(100px, 15vh, 190px)", padding: "clamp(12px, 1.8vh, 24px)" }}
           >
             <span style={{ fontSize: "clamp(48px, 6vw, 84px)", lineHeight: 1 }}>{currentWaste.emoji}</span>
             <h2 className="font-black text-[#1f2937] mt-1 leading-tight" style={{ fontSize: "clamp(22px, 2.5vw, 38px)" }}>
               {currentWaste.name}
             </h2>
           </motion.div>
         </AnimatePresence>
      </div>

      {/* TEAM PANELS */}
      <div className="flex-1 w-full z-10 flex gap-8 min-h-0" style={{ padding: "clamp(4px, 0.8vh, 10px) clamp(20px, 4vw, 60px) clamp(12px, 2vh, 24px)" }}>
        <div className="flex-1 min-w-0">
          <TeamPanel 
            player={2} 
            options={p2Options}
            lastResult={p2LastResult}
            score={p2Score}
            onGuess={(cat) => handleGuess(2, cat)} 
            disabled={phase !== "playing" || locked} 
          />
        </div>
        <div className="flex-1 min-w-0">
          <TeamPanel 
            player={1} 
            options={p1Options}
            lastResult={p1LastResult}
            score={p1Score}
            onGuess={(cat) => handleGuess(1, cat)} 
            disabled={phase !== "playing" || locked} 
          />
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

      <VictoryResultModal isOpen={phase === "finished"} winner={winner} p1Score={p1Score} p2Score={p2Score} p1Label="Tim Biru" p2Label="Tim Merah" onRematch={handleRematch} />
    </div>
  );
}
