"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePinisiStore, MAX_ERRORS } from "@/store/usePinisiStore";
import { GlobalTimer } from "@/components/game/GlobalTimer";
import { VictoryResultModal } from "@/components/game/VictoryResultModal";
import { CATEGORY_LABEL } from "@/data/word-challenges";

const GAME_DURATION = 60;
type Phase = "countdown" | "playing" | "finished";

const SHIP_STAGES = ["⛵", "🚢", "🛥️", "🚤", "⛵", "💥", "🌊"];

function ShipDisplay({ errors, player }: { errors: number; player: 1 | 2 }) {
  const pct = Math.min(errors / MAX_ERRORS, 1);
  const color = player === 1 ? "#1e3a8a" : "#7f1d1d";
  const stage = Math.min(errors, SHIP_STAGES.length - 1);

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div
        key={errors}
        animate={{ rotate: errors > 0 ? [-3, 3, -2, 0] : 0, scale: errors >= MAX_ERRORS ? [1, 1.3, 0.8] : 1 }}
        transition={{ duration: 0.4 }}
        style={{ fontSize: "clamp(24px, 3vw, 48px)", filter: errors >= MAX_ERRORS ? "grayscale(1)" : "none" }}
      >
        {SHIP_STAGES[stage]}
      </motion.div>
      <div className="rounded-full overflow-hidden border" style={{ width: "clamp(60px, 8vw, 100px)", height: "clamp(8px, 1vh, 12px)", background: "#e5e7eb", borderColor: "#d1d5db" }}>
        <motion.div
          className="h-full rounded-full"
          animate={{ width: `${(1 - pct) * 100}%` }}
          style={{ background: color }}
          transition={{ type: "spring", stiffness: 100 }}
        />
      </div>
      <span className="font-bold text-gray-500" style={{ fontSize: "clamp(10px, 1vw, 14px)" }}>{MAX_ERRORS - errors} Nyawa</span>
    </div>
  );
}

function MultipleChoiceOptions({
  options, answer, guessed, onGuess, disabled
}: {
  options: string[]; answer: string; guessed: Set<string>; onGuess: (opt: string) => void; disabled: boolean;
}) {
  return (
    <div className="flex flex-col w-full h-full justify-center" style={{ gap: "clamp(8px, 1.5vh, 16px)" }}>
      {options.map((opt) => {
        const isGuessed = guessed.has(opt);
        const isCorrect = opt === answer;
        
        let bgClass = "bg-[#f3f4f6]";
        let textClass = "text-[#1f2937]";
        let borderClass = "border-gray-300";
        let hoverClass = "active:bg-[#e5e7eb] active:border-b-0 active:translate-y-1";

        if (isGuessed) {
          hoverClass = ""; // disable interaction effect
          if (isCorrect) {
            bgClass = "bg-[#4adeab]";
            textClass = "text-white";
            borderClass = "border-[#10b981]";
          } else {
            bgClass = "bg-[#ef4444]";
            textClass = "text-white";
            borderClass = "border-[#b91c1c]";
          }
        }

        return (
          <motion.button
            key={opt}
            onPointerDown={(e) => { e.stopPropagation(); if (!disabled && !isGuessed) onGuess(opt); }}
            disabled={disabled || isGuessed}
            className={`font-black rounded-xl touch-btn flex items-center justify-center border-2 border-b-4 shadow-sm w-full transition-all ${bgClass} ${textClass} ${borderClass} ${hoverClass}`}
            style={{
              height: "clamp(48px, 7vh, 80px)",
              fontSize: "clamp(18px, 2vw, 32px)",
              opacity: disabled && !isGuessed ? 0.7 : 1,
            }}
          >
            {opt}
          </motion.button>
        );
      })}
    </div>
  );
}

function TeamPanel({ player, errors, guessed, options, answer, score, onGuess, disabled }: {
  player: 1 | 2; errors: number; guessed: Set<string>; options: string[]; answer: string; score: number; onGuess: (l: string) => void; disabled: boolean;
}) {
  const isP1 = player === 1;
  const headerColor = isP1 ? "#1e1b4b" : "#7f1d1d";
  const borderColor = isP1 ? "#1e3a8a" : "#b91c1c";
  const teamName = isP1 ? "TIM BIRU" : "TIM MERAH";
  const isWordDone = guessed.has(answer);
  const isGameOver = errors >= MAX_ERRORS;

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-lg border-2 overflow-hidden w-full h-full" style={{ borderColor: borderColor }}>
      <div className="flex items-center justify-between text-white py-3 px-6 shadow-inner" style={{ backgroundColor: headerColor }}>
        <h2 className="font-bold tracking-widest" style={{ fontSize: "clamp(16px, 1.5vw, 24px)" }}>{teamName}</h2>
        <div className="font-black bg-white/20 px-3 py-1 rounded-lg" style={{ fontSize: "clamp(14px, 1.5vw, 20px)" }}>{score} pts</div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start" style={{ padding: "clamp(16px, 2vh, 32px)", background: "#f8fafc" }}>
        <div className="w-full flex justify-between items-start mb-4">
           <ShipDisplay errors={errors} player={player} />
        </div>

        <div className="flex-1 w-full flex flex-col justify-center">
          {isWordDone ? (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center">
              <p style={{ fontSize: "clamp(48px,5vw,80px)" }}>🎉</p>
              <p className="font-black text-[#10b981]" style={{ fontSize: "clamp(20px,2vw,36px)" }}>Berhasil!</p>
            </motion.div>
          ) : isGameOver ? (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center">
              <p style={{ fontSize: "clamp(48px,5vw,80px)" }}>💥</p>
              <p className="font-black text-[#ef4444]" style={{ fontSize: "clamp(20px,2vw,36px)" }}>Tenggelam!</p>
            </motion.div>
          ) : (
            <MultipleChoiceOptions
               options={options}
               answer={answer}
               guessed={guessed}
               onGuess={onGuess}
               disabled={disabled}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function WordPinisiDuelPage() {
  const { currentWord, p1Guessed, p2Guessed, p1Errors, p2Errors, submitAnswer, nextWord, reset } = usePinisiStore();

  const [phase, setPhase] = useState<Phase>("countdown");
  const [countdown, setCountdown] = useState(3);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [winner, setWinner] = useState<"p1" | "p2" | "draw" | null>(null);

  const p1Done = p1Guessed.has(currentWord.answer);
  const p2Done = p2Guessed.has(currentWord.answer);

  // Countdown
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown <= 0) { setPhase("playing"); reset(); return; }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, countdown, reset]);

  // Auto-advance
  useEffect(() => {
    if (phase !== "playing") return;
    if (p1Done && !p2Done) setP1Score((s) => s + 10);
    if (p2Done && !p1Done) setP2Score((s) => s + 10);
    if (p1Done || p2Done || (p1Errors >= MAX_ERRORS && p2Errors >= MAX_ERRORS)) {
      const t = setTimeout(() => nextWord(), 1500);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p1Done, p2Done, p1Errors, p2Errors, phase]);

  const finishGame = useCallback((forced?: "p1" | "p2") => {
    if (phase === "finished") return;
    setPhase("finished");
    if (forced) { setWinner(forced); return; }
    if (p1Score > p2Score) setWinner("p1");
    else if (p2Score > p1Score) setWinner("p2");
    else setWinner("draw");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, p1Score, p2Score]);

  const handleGuess = (player: 1 | 2, option: string) => {
    if (phase !== "playing") return;
    submitAnswer(player, option);
  };

  const handleRematch = () => {
    setPhase("countdown"); setCountdown(3); setP1Score(0); setP2Score(0); setWinner(null); reset();
  };

  const isFullscreen = () => {
    if (typeof window !== "undefined" && document.fullscreenElement) {
      document.exitFullscreen();
    } else if (typeof window !== "undefined") {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  // Convert scores to progress bar percentage (assuming max score is ~100 for a typical match)
  const p1Pct = Math.min(p1Score / 100, 1) * 100;
  const p2Pct = Math.min(p2Score / 100, 1) * 100;

  return (
    <div className="w-full h-full flex flex-col items-center bg-[#e0f2fe] relative overflow-hidden text-gray-900 font-sans">
      


      {/* TOP HEADER */}
      <div className="w-full flex items-center justify-between px-6 py-4 shadow-sm bg-[#e0f2fe] z-10 flex-shrink-0">
        <div className="w-32 flex justify-start"></div>
        <div className="flex-1 flex justify-center items-center">
          <div className="font-bold text-[#0ea5e9] tracking-wide" style={{ fontSize: "clamp(20px, 2vw, 32px)" }}>
             {CATEGORY_LABEL[currentWord.category as keyof typeof CATEGORY_LABEL]}
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
        <GlobalTimer duration={GAME_DURATION} isRunning={phase === "playing"} onComplete={() => finishGame()} />
      </div>



      {/* CENTER CLUE CARD */}
      <div className="w-full max-w-6xl px-8 z-10 mb-4 flex justify-center">
         <AnimatePresence mode="wait">
           <motion.div 
             key={currentWord.id}
             initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
             className="bg-white rounded-2xl shadow-md border border-gray-200 text-center w-full flex items-center justify-center p-8"
             style={{ minHeight: "clamp(100px, 15vh, 180px)" }}
           >
             <h2 className="font-black text-[#1f2937] leading-tight" style={{ fontSize: "clamp(28px, 3vw, 56px)" }}>
               {currentWord.clue}
             </h2>
           </motion.div>
         </AnimatePresence>
      </div>

      {/* TEAM PANELS */}
      <div className="flex-1 w-full max-w-7xl px-8 pb-24 z-10 flex gap-8 min-h-0">
        <div className="flex-1 min-w-0">
          <TeamPanel 
            player={2} 
            errors={p2Errors} 
            guessed={p2Guessed} 
            options={currentWord.options}
            answer={currentWord.answer}
            score={p2Score}
            onGuess={(l) => handleGuess(2, l)} 
            disabled={phase !== "playing" || p2Done || p2Errors >= MAX_ERRORS} 
          />
        </div>
        <div className="flex-1 min-w-0">
          <TeamPanel 
            player={1} 
            errors={p1Errors} 
            guessed={p1Guessed} 
            options={currentWord.options}
            answer={currentWord.answer}
            score={p1Score}
            onGuess={(l) => handleGuess(1, l)} 
            disabled={phase !== "playing" || p1Done || p1Errors >= MAX_ERRORS} 
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
