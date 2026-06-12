"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAnimalStore } from "@/store/useAnimalStore";
import { GameHeader } from "@/components/game/GameHeader";
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
      className={`touch-btn flex flex-col items-center justify-center gap-1 font-bold w-full h-full rounded-xl border-2 border-b-4 shadow-sm active:translate-y-1 active:border-b-2 transition-all ${bgClass} ${textClass} ${borderClass}`}
      style={{ minHeight: "clamp(50px, 6vh, 80px)", opacity: disabled && !lastResult ? 0.6 : 1, touchAction: "manipulation" }}
    >
      <span style={{ fontSize: "clamp(20px, 2.8vw, 40px)" }}>{cfg.emoji}</span>
      <span style={{ fontSize: "clamp(10px, 1.2vw, 16px)" }}>{cfg.label}</span>
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
      <div className="flex items-center justify-center text-white shadow-inner flex-shrink-0" style={{ backgroundColor: headerColor, paddingBlock: "clamp(10px, 1.5vh, 20px)" }}>
        <h2 className="font-bold tracking-widest" style={{ fontSize: "clamp(14px, 1.4vw, 22px)" }}>{teamName}</h2>
      </div>

      <div className="flex-1 flex flex-col min-h-0" style={{ padding: "clamp(12px, 1.8vh, 22px)", background: "#f8fafc", gap: "clamp(8px, 1.2vh, 16px)" }}>
        <div className="flex-shrink-0" style={{ minHeight: "clamp(28px, 3.5vh, 44px)" }}>
          <AnimatePresence mode="wait">
            {lastResult && lastFact && (
              <motion.div key={lastFact + lastResult}
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="rounded-xl text-center shadow-sm w-full"
                style={{ padding: "clamp(6px, 0.8vh, 12px) clamp(10px, 1.2vw, 18px)", background: lastResult === "correct" ? "#d1fae5" : "#fee2e2", border: `1px solid ${lastResult === "correct" ? "#34d399" : "#f87171"}` }}>
                <p className="font-bold" style={{ fontSize: "clamp(10px, 1.1vw, 14px)", color: lastResult === "correct" ? "#059669" : "#b91c1c" }}>
                  {lastResult === "correct" ? "✅ Benar! +10" : "❌ Salah! -3"} · {lastFact}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-full grid grid-cols-3 flex-1 min-h-0" style={{ gap: "clamp(8px, 1.2vh, 16px)" }}>
          {ALL_CLASSES.map((cls) => (
            <ClassBtn key={cls} cls={cls} player={player}
              onPress={() => onClassify(cls)}
              lastResult={null}
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

  // Progress logic based on a max score, e.g., 200
  const maxScore = 200;
  const p1Pct = Math.min(Math.max(p1Score, 0) / maxScore, 1) * 100;
  const p2Pct = Math.min(Math.max(p2Score, 0) / maxScore, 1) * 100;

  return (
    <div className="w-full h-full flex flex-col bg-[#e0f2fe] relative overflow-hidden text-gray-900 font-sans">

      {/* ── SHARED GAME HEADER ── */}
      <GameHeader
        title="Klasifikasi Hewan"
        subtitle="Animal Classification"
        timerDuration={GAME_DURATION}
        isTimerRunning={phase === "playing"}
        onTimerComplete={finishGame}
      />

      {/* SCOREBOARD */}
      <div className="w-full z-10 flex-shrink-0" style={{ padding: "clamp(12px, 2vh, 24px) clamp(20px, 4vw, 60px) 0" }}>
         <div className="w-full bg-white border-2 border-gray-200 shadow-lg rounded-2xl flex flex-col" style={{ padding: "clamp(12px, 1.5vh, 20px)", gap: "clamp(8px, 1vh, 14px)" }}>
           
            {/* Tim Biru (P1) */}
            <div className="flex items-center gap-4 w-full">
               <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ background: "#1e3a8a" }}></div>
               <div className="w-28 font-bold tracking-wider flex-shrink-0" style={{ fontSize: "clamp(13px, 1.3vw, 18px)", color: "#1e3a8a" }}>TIM BIRU</div>
               <div className="flex-1 h-6 bg-[#e0f2fe] rounded-full border overflow-hidden relative shadow-inner" style={{ borderColor: "#b9ddf5" }}>
                  <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #1e3a8a, #3b82f6)" }} animate={{ width: `${p1Pct}%` }} transition={{ type: "spring" }} />
               </div>
               <div className="font-bold text-center rounded-xl border-2 shadow-sm" style={{ padding: "clamp(4px, 0.6vh, 8px) clamp(10px, 1.2vw, 20px)", fontSize: "clamp(13px, 1.3vw, 18px)", color: "#1e3a8a", borderColor: "#1e3a8a", background: "#eff6ff" }}>{p1Score}</div>
            </div>

            {/* Tim Merah (P2) */}
            <div className="flex items-center gap-4 w-full">
               <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ background: "#7f1d1d" }}></div>
               <div className="w-28 font-bold tracking-wider flex-shrink-0" style={{ fontSize: "clamp(13px, 1.3vw, 18px)", color: "#7f1d1d" }}>TIM MERAH</div>
               <div className="flex-1 h-6 bg-[#fef2f2] rounded-full border overflow-hidden relative shadow-inner" style={{ borderColor: "#f5c6c6" }}>
                  <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #7f1d1d, #ef4444)" }} animate={{ width: `${p2Pct}%` }} transition={{ type: "spring" }} />
               </div>
               <div className="font-bold text-center rounded-xl border-2 shadow-sm" style={{ padding: "clamp(4px, 0.6vh, 8px) clamp(10px, 1.2vw, 20px)", fontSize: "clamp(13px, 1.3vw, 18px)", color: "#7f1d1d", borderColor: "#7f1d1d", background: "#fef2f2" }}>{p2Score}</div>
            </div>

         </div>
      </div>

      {/* CENTER ANIMAL DISPLAY */}
      <div className="w-full z-10 flex-shrink-0" style={{ padding: "clamp(8px, 1.5vh, 18px) clamp(20px, 4vw, 60px)" }}>
         <AnimatePresence mode="wait">
           {currentAnimal && (
             <motion.div 
               key={currentAnimal.id}
               initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.2 }}
               className="bg-white rounded-2xl shadow-md border border-gray-200 text-center w-full flex flex-col items-center justify-center"
               style={{ minHeight: "clamp(100px, 16vh, 200px)", padding: "clamp(12px, 1.8vh, 24px)" }}
             >
                <span style={{ fontSize: "clamp(48px, 8vw, 110px)", lineHeight: 1 }}>
                  {currentAnimal.emoji}
                </span>
                <h2 className="font-black text-[#1f2937] mt-1" style={{ fontSize: "clamp(20px, 2.5vw, 40px)" }}>
                 {currentAnimal.name}
               </h2>
             </motion.div>
           )}
         </AnimatePresence>
      </div>

      {/* TEAM PANELS */}
      <div className="flex-1 w-full z-10 flex gap-8 min-h-0" style={{ padding: "clamp(4px, 0.8vh, 10px) clamp(20px, 4vw, 60px) clamp(12px, 2vh, 24px)" }}>
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
