"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePinisiStore, MAX_ERRORS } from "@/store/usePinisiStore";
import { GameHeader } from "@/components/game/GameHeader";
import { VictoryResultModal } from "@/components/game/VictoryResultModal";
import { GameSetupModal } from "@/components/game/GameSetupModal";
import { CATEGORY_LABEL } from "@/data/word-challenges";
import { Sailboat, CheckCircle2, AlertTriangle, SlidersHorizontal } from "lucide-react";

type Phase = "setup" | "countdown" | "playing" | "finished";

function ShipDisplay({ errors, player }: { errors: number; player: 1 | 2 }) {
  const livesLeft = Math.max(0, MAX_ERRORS - errors);
  const pct = Math.min(errors / MAX_ERRORS, 1);
  const color = player === 1 ? "#1e3a8a" : "#7f1d1d";
  const isCritical = errors >= MAX_ERRORS - 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        key={errors}
        animate={{
          rotate: errors > 0 ? [-4, 4, -2, 0] : 0,
          scale: errors >= MAX_ERRORS ? [1, 1.25, 0.85] : 1,
        }}
        transition={{ duration: 0.35 }}
        className={`p-3 rounded-2xl flex items-center justify-center shadow-sm border-2 ${
          errors >= MAX_ERRORS
            ? "bg-slate-200 border-slate-300 text-slate-400"
            : isCritical
            ? "bg-rose-50 border-rose-300 text-rose-600 animate-pulse"
            : player === 1
            ? "bg-blue-50 border-blue-200 text-blue-700"
            : "bg-red-50 border-red-200 text-red-700"
        }`}
      >
        <Sailboat size={32} />
      </motion.div>
      <div
        className="rounded-full overflow-hidden border border-slate-300 bg-slate-200"
        style={{ width: "clamp(70px, 9vw, 110px)", height: "clamp(8px, 1.2vh, 14px)" }}
      >
        <motion.div
          className="h-full rounded-full"
          animate={{ width: `${(1 - pct) * 100}%` }}
          style={{ background: color }}
          transition={{ type: "spring", stiffness: 120 }}
        />
      </div>
      <span className="font-black text-slate-600 text-xs tracking-wide">
        {livesLeft} / {MAX_ERRORS} Daya Tahan
      </span>
    </div>
  );
}

function MultipleChoiceOptions({
  options, answer, guessed, onGuess, disabled
}: {
  options: string[]; answer: string; guessed: Set<string>; onGuess: (opt: string) => void; disabled: boolean;
}) {
  return (
    <div className="flex flex-col w-full flex-1 min-h-0" style={{ gap: "clamp(8px, 1.2vh, 14px)" }}>
      {options.map((opt) => {
        const isGuessed = guessed.has(opt);
        const isCorrect = opt === answer;
        
        let bgClass = "bg-[#f3f4f6]";
        let textClass = "text-[#1f2937]";
        let borderClass = "border-gray-300";
        let hoverClass = "active:bg-[#e5e7eb] active:border-b-0 active:translate-y-1";

        if (isGuessed) {
          hoverClass = "";
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
            className={`font-black rounded-xl touch-btn flex items-center justify-center border-2 border-b-4 shadow-sm w-full flex-1 transition-all ${bgClass} ${textClass} ${borderClass} ${hoverClass}`}
            style={{
              minHeight: "clamp(44px, 5vh, 72px)",
              fontSize: "clamp(16px, 1.8vw, 28px)",
              padding: "clamp(6px, 1vh, 12px)",
              lineHeight: 1.1,
              userSelect: "none"
            }}
          >
            {opt}
          </motion.button>
        );
      })}
    </div>
  );
}

function TeamPanel({
  player, errors, guessed, options, answer, score, onGuess, disabled
}: {
  player: 1 | 2; errors: number; guessed: Set<string>; options: string[]; answer: string; score: number;
  onGuess: (l: string) => void; disabled: boolean;
}) {
  const isP1 = player === 1;
  const isGameOver = errors >= MAX_ERRORS;
  const isWordDone = guessed.has(answer);

  const headerColor = isP1 ? "#1e1b4b" : "#7f1d1d";
  const borderColor = isP1 ? "#1e3a8a" : "#7f1d1d";
  const teamName = isP1 ? "TIM BIRU" : "TIM MERAH";

  return (
    <div 
      className="flex flex-col bg-white rounded-2xl shadow-lg border-2 overflow-hidden w-full h-full"
      style={{ borderColor: borderColor }}
    >
      <div 
        className="flex items-center justify-between text-white shadow-inner flex-shrink-0"
        style={{ 
          backgroundColor: headerColor, 
          padding: "clamp(8px, 1vh, 16px) clamp(16px, 2.5vw, 32px)", 
        }}
      >
        <h2 className="font-bold tracking-widest" style={{ fontSize: "clamp(14px, 1.6vw, 22px)" }}>{teamName}</h2>
        <div className="font-black bg-white/20 rounded-lg" style={{ padding: "clamp(4px, 0.6vh, 8px) clamp(10px, 1.2vw, 16px)", fontSize: "clamp(12px, 1.3vw, 18px)" }}>{score} pts</div>
      </div>

      <div 
        className="flex-1 flex flex-col min-h-0" 
        style={{ padding: "clamp(10px, 1.5vh, 20px)", background: "#f8fafc", gap: "clamp(8px, 1.2vh, 16px)" }}
      >
        <div className="flex-shrink-0 flex items-center justify-center">
          <ShipDisplay errors={errors} player={player} />
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          {isWordDone ? (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex-1 flex flex-col items-center justify-center gap-2">
              <CheckCircle2 size={48} className="text-emerald-500" />
              <p className="font-black text-emerald-600" style={{ fontSize: "clamp(18px, 2vw, 32px)" }}>Berhasil!</p>
            </motion.div>
          ) : isGameOver ? (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex-1 flex flex-col items-center justify-center gap-2">
              <AlertTriangle size={48} className="text-rose-500" />
              <p className="font-black text-rose-600" style={{ fontSize: "clamp(18px, 2vw, 32px)" }}>Tenggelam!</p>
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

  const [phase, setPhase] = useState<Phase>("setup");
  const [countdown, setCountdown] = useState(3);
  const [gameDuration, setGameDuration] = useState(60);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [winner, setWinner] = useState<"p1" | "p2" | "draw" | null>(null);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  const p1Done = p1Guessed.has(currentWord.answer);
  const p2Done = p2Guessed.has(currentWord.answer);

  // Countdown
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown <= 0) { 
      const t = setTimeout(() => {
        setPhase("playing"); 
      }, 0);
      return () => clearTimeout(t); 
    }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, countdown]);

  const scoredRef = useRef<string | null>(null);

  const p1Answered = p1Guessed.size > 0;
  const p2Answered = p2Guessed.size > 0;
  const anyAnswered = p1Answered || p2Answered;

  const finishGame = useCallback((forced?: "p1" | "p2") => {
    if (phase === "finished") return;
    setPhase("finished");
    if (forced) { setWinner(forced); return; }
    if (p1Score > p2Score) setWinner("p1");
    else if (p2Score > p1Score) setWinner("p2");
    else setWinner("draw");
  }, [phase, p1Score, p2Score]);

  // Auto-advance
  useEffect(() => {
    if (phase !== "playing") return;
    
    // Evaluate score immediately when answered
    if (scoredRef.current !== currentWord.id && anyAnswered) {
      scoredRef.current = currentWord.id;
      if (p1Done) setTimeout(() => setP1Score((s) => s + 10), 0);
      if (p2Done) setTimeout(() => setP2Score((s) => s + 10), 0);
    }

    if (anyAnswered) {
      const t = setTimeout(() => nextWord(), 1200);
      return () => clearTimeout(t);
    }
  }, [p1Done, p2Done, anyAnswered, phase, currentWord.id, nextWord]);

  const handleGuess = (player: 1 | 2, option: string) => {
    if (phase !== "playing") return;
    submitAnswer(player, option);
  };

  const handleRematch = () => {
    reset();
    setP1Score(0);
    setP2Score(0);
    setWinner(null);
    setPhase("countdown");
    setCountdown(3);
  };

  const handleStartGame = ({
    difficulty,
    duration,
  }: {
    difficulty: "easy" | "medium" | "hard";
    duration: number;
  }) => {
    setGameDuration(duration);
    reset(difficulty);
    setP1Score(0);
    setP2Score(0);
    setWinner(null);
    setPhase("countdown");
    setCountdown(3);
  };

  if (!isMounted) return <div className="w-full h-full bg-[#e0f2fe]" />;

  return (
    <div className="w-full h-full flex flex-col bg-[#e0f2fe] relative overflow-hidden text-gray-900 font-sans">

      {/* ── SHARED GAME HEADER ── */}
      <GameHeader
        title="Duel Pinisi Kata"
        subtitle={CATEGORY_LABEL[currentWord.category as keyof typeof CATEGORY_LABEL] ?? "Word Pinisi Duel"}
        timerDuration={gameDuration}
        isTimerRunning={phase === "playing"}
        onTimerComplete={() => finishGame()}
        rightSlot={
          <button
            type="button"
            onClick={() => setPhase("setup")}
            aria-label="Pengaturan Permainan"
            className="flex items-center justify-center rounded-xl border border-sky-200 bg-white/80 text-gray-700 font-bold shadow-sm hover:bg-white transition-colors"
            style={{
              minWidth: "clamp(40px, 5vw, 64px)",
              minHeight: "clamp(40px, 5vw, 64px)",
            }}
          >
            <SlidersHorizontal size={20} />
          </button>
        }
      />

      {/* CENTER CLUE CARD */}
      <div className="w-full z-10 flex-shrink-0" style={{ padding: "clamp(12px, 1.8vh, 22px) clamp(20px, 4vw, 60px)" }}>
         <AnimatePresence mode="wait">
           <motion.div 
             key={currentWord.id}
             initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
             className="bg-white rounded-2xl shadow-md border border-gray-200 text-center w-full flex items-center justify-center"
             style={{ minHeight: "clamp(80px, 12vh, 160px)", padding: "clamp(14px, 2vh, 28px)" }}
           >
             <h2 className="font-black text-[#1f2937] leading-tight" style={{ fontSize: "clamp(22px, 2.5vw, 44px)" }}>
                {currentWord.clue}
             </h2>
           </motion.div>
         </AnimatePresence>
      </div>

      {/* TEAM PANELS */}
      <div className="flex-1 w-full z-10 flex gap-8 min-h-0" style={{ padding: "0 clamp(20px, 4vw, 60px) clamp(12px, 1.8vh, 22px)" }}>
        <div className="flex-1 min-w-0">
          <TeamPanel 
            player={2} 
            errors={p2Errors} 
            guessed={p2Guessed} 
            options={currentWord.options}
            answer={currentWord.answer}
            score={p2Score}
            onGuess={(l) => handleGuess(2, l)} 
            disabled={phase !== "playing" || anyAnswered || p2Errors >= MAX_ERRORS || p1Errors >= MAX_ERRORS} 
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
            disabled={phase !== "playing" || anyAnswered || p1Errors >= MAX_ERRORS || p2Errors >= MAX_ERRORS} 
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

      {/* PRE-GAME SETUP MODAL */}
      <GameSetupModal
        isOpen={phase === "setup"}
        gameTitle="Duel Pinisi Kata"
        gameSubtitle="Word Pinisi Duel"
        defaultDifficulty="medium"
        defaultDuration={60}
        onStart={handleStartGame}
      />
    </div>
  );
}
