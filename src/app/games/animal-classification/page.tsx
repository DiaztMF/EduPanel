"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAnimalStore } from "@/store/useAnimalStore";
import { GlobalTimer } from "@/components/game/GlobalTimer";
import { VictoryResultModal } from "@/components/game/VictoryResultModal";
import { CLASS_CONFIG, type AnimalClass } from "@/data/animals";

const GAME_DURATION = 60;
const ALL_CLASSES = Object.keys(CLASS_CONFIG) as AnimalClass[];
type Phase = "countdown" | "playing" | "finished";

// ─── Category Button ───
function ClassBtn({ cls, player, onPress, lastResult, disabled }: {
  cls: AnimalClass; player: 1 | 2; onPress: () => void;
  lastResult: "correct" | "wrong" | null; disabled: boolean;
}) {
  const cfg = CLASS_CONFIG[cls];
  let bgClass = "bg-[#f3f4f6]";
  let textClass = "text-[#1f2937]";
  let borderClass = "border-gray-300";

  if (lastResult === "correct") {
    bgClass = "bg-[#4adeab]";
    textClass = "text-white";
    borderClass = "border-[#10b981]";
  } else if (lastResult === "wrong") {
    bgClass = "bg-[#ef4444]";
    textClass = "text-white";
    borderClass = "border-[#b91c1c]";
  }

  return (
    <motion.button
      onPointerDown={(e) => { e.stopPropagation(); if (!disabled) onPress(); }}
      animate={{ scale: lastResult ? [1, 1.05, 1] : 1 }}
      transition={{ duration: 0.2 }}
      className={`touch-btn flex flex-col items-center justify-center gap-1 font-bold w-full rounded-xl border-2 border-b-4 shadow-sm active:translate-y-1 active:border-b-2 transition-all ${bgClass} ${textClass} ${borderClass}`}
      style={{
        minHeight: "clamp(60px, 10vh, 100px)",
        opacity: disabled && !lastResult ? 0.6 : 1,
        touchAction: "manipulation",
      }}
    >
      <span style={{ fontSize: "clamp(24px, 3.5vw, 48px)" }}>{cfg.emoji}</span>
      <span style={{ fontSize: "clamp(12px, 1.5vw, 20px)" }}>{cfg.label}</span>
    </motion.button>
  );
}

// ─── Player Panel ───
function TeamPanel({ player, score, lastResult, lastFact, onClassify, disabled }: {
  player: 1 | 2; score: number;
  lastResult: "correct" | "wrong" | null; lastFact: string;
  onClassify: (cls: AnimalClass) => void; disabled: boolean;
}) {
  const isP1 = player === 1;
  const headerColor = isP1 ? "#1e1b4b" : "#7f1d1d";
  const borderColor = isP1 ? "#1e3a8a" : "#b91c1c";
  const teamName = isP1 ? "TIM BIRU" : "TIM MERAH";

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-lg border-2 overflow-hidden w-full h-full" style={{ borderColor: borderColor }}>
      <div className="flex items-center justify-center text-white py-3 shadow-inner" style={{ backgroundColor: headerColor }}>
        <h2 className="font-bold tracking-widest" style={{ fontSize: "clamp(16px, 1.5vw, 24px)" }}>{teamName}</h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start relative" style={{ padding: "clamp(16px, 2vh, 32px)", background: "#f8fafc" }}>
        
        {/* Feedback fact overlay */}
        <div className="h-12 w-full flex justify-center items-center mb-2">
          <AnimatePresence mode="wait">
            {lastResult && lastFact && (
              <motion.div key={lastFact + lastResult}
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="rounded-xl px-4 py-2 text-center shadow-sm w-full"
                style={{ background: lastResult === "correct" ? "#d1fae5" : "#fee2e2", border: `1px solid ${lastResult === "correct" ? "#34d399" : "#f87171"}` }}>
                <p className="font-bold" style={{ fontSize: "clamp(11px, 1.2vw, 16px)", color: lastResult === "correct" ? "#059669" : "#b91c1c" }}>
                  {lastResult === "correct" ? "✅ Benar! +10" : "❌ Salah! -3"} · {lastFact}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Category grid — 3×2 */}
        <div className="w-full grid grid-cols-3 gap-3 flex-1">
          {ALL_CLASSES.map((cls) => (
            <ClassBtn key={cls} cls={cls} player={player}
              onPress={() => onClassify(cls)}
              lastResult={null} // Button flashing could be handled differently if needed
              disabled={disabled} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───
export default function AnimalClassificationPage() {
  const { currentAnimal, p1Score, p2Score, p1LastResult, p2LastResult, p1LastFact, p2LastFact, classify, reset } = useAnimalStore();

  const [phase, setPhase] = useState<Phase>("countdown");
  const [countdown, setCountdown] = useState(3);
  const [winner, setWinner] = useState<"p1" | "p2" | "draw" | null>(null);

  // Countdown
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown <= 0) { setPhase("playing"); reset(); return; }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, countdown, reset]);

  const finishGame = useCallback(() => {
    if (phase === "finished") return;
    setPhase("finished");
    if (p1Score > p2Score) setWinner("p1");
    else if (p2Score > p1Score) setWinner("p2");
    else setWinner("draw");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, p1Score, p2Score]);

  const handleClassify = (player: 1 | 2, cls: AnimalClass) => {
    if (phase !== "playing") return;
    classify(player, cls);
  };

  const handleRematch = () => {
    setPhase("countdown"); setCountdown(3); setWinner(null); reset();
  };

  const isFullscreen = () => {
    if (typeof window !== "undefined" && document.fullscreenElement) {
      document.exitFullscreen();
    } else if (typeof window !== "undefined") {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  // Progress logic based on a max score, e.g., 200
  const maxScore = 200;
  const p1Pct = Math.min(Math.max(p1Score, 0) / maxScore, 1) * 100;
  const p2Pct = Math.min(Math.max(p2Score, 0) / maxScore, 1) * 100;

  return (
    <div className="w-full h-full flex flex-col items-center bg-[#e0f2fe] relative overflow-hidden text-gray-900 font-sans">
      


      {/* TOP HEADER */}
      <div className="w-full flex items-center justify-between px-6 py-4 shadow-sm bg-[#e0f2fe] z-10 flex-shrink-0">
        <div className="w-32 flex justify-start"></div>
        <div className="flex-1 flex justify-center items-center">
          <div className="font-bold text-[#0ea5e9] tracking-wide" style={{ fontSize: "clamp(20px, 2vw, 32px)" }}>
             Klasifikasi Hewan
          </div>
        </div>
        <div className="w-32 flex justify-end">
           <button onPointerDown={isFullscreen} className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-bold px-4 py-2 rounded-lg shadow-sm transition-colors">
             🖥️
           </button>
        </div>
      </div>

      {/* TIMER */}
      <div className="w-full flex justify-center z-20 mt-4 mb-2">
        <GlobalTimer duration={GAME_DURATION} isRunning={phase === "playing"} onComplete={finishGame} />
      </div>

      {/* SCOREBOARD (PROGRESS BARS IN A BEIGE BOARD) */}
      <div className="w-full max-w-6xl px-8 py-4 z-10 flex flex-col items-center">
         <div className="w-full bg-[#ffedd5] border border-[#fdba74] shadow-sm rounded-2xl p-4 flex flex-col gap-3">
           
           {/* Tim Merah (P2) */}
           <div className="flex items-center gap-4 w-full">
              <div className="w-6 h-6 rounded-full bg-[#ef4444] shadow-inner flex-shrink-0"></div>
              <div className="w-20 font-bold text-[#b91c1c] tracking-wider" style={{ fontSize: "clamp(12px, 1.5vw, 18px)" }}>MERAH</div>
              <div className="flex-1 h-6 bg-[#fef3c7] rounded-full border-2 border-[#fcd34d] overflow-hidden relative shadow-inner">
                 <motion.div className="h-full bg-gradient-to-r from-[#fcd34d] to-[#fbbf24]" animate={{ width: `${p2Pct}%` }} transition={{ type: "spring" }} />
              </div>
              <div className="w-16 bg-white font-bold text-center py-1 rounded-lg border shadow-sm text-gray-700">{p2Score} pts</div>
           </div>

           {/* Tim Biru (P1) */}
           <div className="flex items-center gap-4 w-full">
              <div className="w-6 h-6 rounded-full bg-[#3b82f6] shadow-inner flex-shrink-0"></div>
              <div className="w-20 font-bold text-[#1d4ed8] tracking-wider" style={{ fontSize: "clamp(12px, 1.5vw, 18px)" }}>BIRU</div>
              <div className="flex-1 h-6 bg-[#fef3c7] rounded-full border-2 border-[#fcd34d] overflow-hidden relative shadow-inner">
                 <motion.div className="h-full bg-gradient-to-r from-[#fcd34d] to-[#fbbf24]" animate={{ width: `${p1Pct}%` }} transition={{ type: "spring" }} />
              </div>
              <div className="w-16 bg-white font-bold text-center py-1 rounded-lg border shadow-sm text-gray-700">{p1Score} pts</div>
           </div>

         </div>
      </div>

      {/* CENTER ANIMAL DISPLAY */}
      <div className="w-full max-w-6xl px-8 z-10 mb-4 flex justify-center">
         <AnimatePresence mode="wait">
           {currentAnimal && (
             <motion.div 
               key={currentAnimal.id}
               initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.2 }}
               className="bg-white rounded-2xl shadow-md border border-gray-200 text-center w-full flex flex-col items-center justify-center p-6"
               style={{ minHeight: "clamp(120px, 20vh, 250px)" }}
             >
               <span style={{ fontSize: "clamp(64px, 10vw, 120px)", lineHeight: 1 }}>
                 {currentAnimal.emoji}
               </span>
               <h2 className="font-black text-[#1f2937] mt-2" style={{ fontSize: "clamp(24px, 3vw, 48px)" }}>
                 {currentAnimal.name}
               </h2>
             </motion.div>
           )}
         </AnimatePresence>
      </div>

      {/* TEAM PANELS */}
      <div className="flex-1 w-full max-w-7xl px-8 pb-8 z-10 flex gap-8 min-h-0">
        <div className="flex-1 min-w-0">
          <TeamPanel 
            player={2} 
            score={p2Score} 
            lastResult={p2LastResult} 
            lastFact={p2LastFact} 
            onClassify={(cls) => handleClassify(2, cls)} 
            disabled={phase !== "playing"} 
          />
        </div>
        <div className="flex-1 min-w-0">
          <TeamPanel 
            player={1} 
            score={p1Score} 
            lastResult={p1LastResult} 
            lastFact={p1LastFact} 
            onClassify={(cls) => handleClassify(1, cls)} 
            disabled={phase !== "playing"} 
          />
        </div>
      </div>

      {/* COUNTDOWN OVERLAY */}
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

      {/* BOTTOM MENU BUTTON */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
        <Link href="/" className="bg-white hover:bg-gray-50 border-2 border-[#bae6fd] text-gray-700 font-bold px-8 py-3 rounded-full shadow-lg transition-all flex items-center gap-2" style={{ textDecoration: "none", fontSize: "clamp(14px, 1.5vw, 20px)" }}>
          ← Menu Utama
        </Link>
      </div>

      <VictoryResultModal isOpen={phase === "finished"} winner={winner} p1Score={p1Score} p2Score={p2Score} p1Label="Tim Biru" p2Label="Tim Merah" onRematch={handleRematch} />
    </div>
  );
}
