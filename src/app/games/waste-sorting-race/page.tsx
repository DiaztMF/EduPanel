"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { GlobalTimer } from "@/components/game/GlobalTimer";
import { VictoryResultModal } from "@/components/game/VictoryResultModal";
import { useWasteStore } from "@/store/useWasteStore";
import { WASTE_CONFIG, type WasteCategory } from "@/data/waste-items";

const GAME_DURATION = 90; // seconds

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
  const color = player === 1 ? "#3b82f6" : "#ef4444";
  const title = player === 1 ? "TIM BIRU" : "TIM MERAH";

  return (
    <div className="flex flex-col bg-white rounded-3xl shadow-lg border-4 overflow-hidden h-full" style={{ borderColor: color }}>
      <div className="flex items-center justify-between text-white py-3 px-6 shadow-inner relative" style={{ backgroundColor: color }}>
        <h2 className="font-bold tracking-widest" style={{ fontSize: "clamp(16px, 2vw, 24px)" }}>{title}</h2>
        <div className="font-black bg-white/20 px-3 py-1 rounded-lg" style={{ fontSize: "clamp(14px, 1.5vw, 20px)" }}>{score} pts</div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#f8fafc] gap-6 relative">
        <AnimatePresence>
          {lastResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -20 }}
              className="absolute font-black z-20"
              style={{
                top: "10%",
                color: lastResult === "correct" ? "#10b981" : "#ef4444",
                fontSize: "clamp(48px, 6vw, 80px)",
                filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
              }}
            >
              {lastResult === "correct" ? "+10" : "-5"}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col gap-4 w-full max-w-sm">
          {options.map((cat, idx) => {
            const cfg = WASTE_CONFIG[cat];
            return (
              <button
                key={`${cat}-${idx}`}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  onGuess(cat);
                }}
                disabled={disabled}
                className="touch-btn w-full bg-white border-2 rounded-2xl shadow-sm flex items-center justify-center gap-4 active:scale-95 transition-transform"
                style={{
                  borderColor: cfg.color,
                  padding: "clamp(12px, 2vh, 24px)",
                  opacity: disabled ? 0.6 : 1
                }}
              >
                <span style={{ fontSize: "clamp(32px, 3vw, 48px)" }}>{cfg.emoji}</span>
                <span className="font-bold" style={{ fontSize: "clamp(20px, 2vw, 32px)", color: cfg.color }}>{cfg.label}</span>
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

  const cooldown = useRef(false);

  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown <= 0) {
      setPhase("playing");
      reset();
      return;
    }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, countdown, reset]);

  const handleGuess = (player: 1 | 2, cat: WasteCategory) => {
    if (phase !== "playing" || cooldown.current) return;
    const correct = submitAnswer(player, cat);
    if (correct) {
      cooldown.current = true;
      setTimeout(() => {
        nextWaste();
        cooldown.current = false;
      }, 600);
    }
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

  const isFullscreen = () => {
    if (typeof window !== "undefined" && document.fullscreenElement) {
      document.exitFullscreen();
    } else if (typeof window !== "undefined") {
      document.documentElement.requestFullscreen().catch(() => { });
    }
  };

  // SCORE PCT
  const maxScore = Math.max(100, p1Score, p2Score);
  const p1Pct = (p1Score / maxScore) * 100;
  const p2Pct = (p2Score / maxScore) * 100;

  return (
    <div className="w-full h-full flex flex-col items-center bg-[#e0f2fe] relative overflow-hidden text-gray-900 font-sans">
      
      {/* TOP HEADER */}
      <div className="w-full flex items-center justify-between px-6 py-4 shadow-sm bg-[#e0f2fe] z-10 flex-shrink-0">
        <div className="w-32 flex justify-start"></div>
        <div className="flex-1 flex justify-center items-center">
          <div className="font-bold text-[#0ea5e9] tracking-wide" style={{ fontSize: "clamp(20px, 2vw, 32px)" }}>
             Pilah Sampah
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



      {/* CENTER CLUE CARD */}
      <div className="w-full max-w-6xl px-8 z-10 mb-4 flex justify-center">
         <AnimatePresence mode="wait">
           <motion.div 
             key={currentWaste.id}
             initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
             className="bg-white rounded-2xl shadow-md border border-gray-200 text-center w-full flex flex-col items-center justify-center p-6 gap-2"
             style={{ minHeight: "clamp(100px, 15vh, 180px)" }}
           >
             <span style={{ fontSize: "clamp(48px, 5vw, 80px)" }}>{currentWaste.emoji}</span>
             <h2 className="font-black text-[#1f2937] leading-tight" style={{ fontSize: "clamp(24px, 2.5vw, 40px)" }}>
               {currentWaste.name}
             </h2>
           </motion.div>
         </AnimatePresence>
      </div>

      {/* TEAM PANELS */}
      <div className="flex-1 w-full max-w-7xl px-8 pb-24 z-10 flex gap-8 min-h-0">
        <div className="flex-1 min-w-0">
          <TeamPanel 
            player={2} 
            options={p2Options}
            lastResult={p2LastResult}
            score={p2Score}
            onGuess={(cat) => handleGuess(2, cat)} 
            disabled={phase !== "playing"} 
          />
        </div>
        <div className="flex-1 min-w-0">
          <TeamPanel 
            player={1} 
            options={p1Options}
            lastResult={p1LastResult}
            score={p1Score}
            onGuess={(cat) => handleGuess(1, cat)} 
            disabled={phase !== "playing"} 
          />
        </div>
      </div>

      {/* COUNTDOWN OVERLAY */}
      <AnimatePresence>
        {phase === "countdown" && (
          <motion.div
            className="absolute inset-0 z-40 flex flex-col items-center justify-center"
            style={{ background: "rgba(224,242,254,0.95)" }}
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
