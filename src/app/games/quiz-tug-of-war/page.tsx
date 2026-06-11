"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useQuizTugStore } from "@/store/useQuizTugStore";
import { VictoryResultModal } from "@/components/game/VictoryResultModal";
import { GlobalTimer } from "@/components/game/GlobalTimer";

const GAME_DURATION = 60; // seconds

type Phase = "countdown" | "playing" | "finished";

// ─── Pixel Art Character SVG ───
const PixelGuy = ({ color, reversed }: { color: string, reversed?: boolean }) => (
  <svg width="100%" height="100%" viewBox="0 0 80 90" style={{ transform: reversed ? "scaleX(-1)" : "none", display: "block" }}>
    <rect x="20" y="10" width="40" height="8" fill="#1a1a1a" />
    <rect x="16" y="18" width="6" height="15" fill="#1a1a1a" />
    <rect x="18" y="16" width="44" height="4" fill="#e11d48" />
    <rect x="18" y="20" width="44" height="4" fill="#ffffff" />
    <rect x="22" y="24" width="36" height="24" fill="#f5c29a" />
    <rect x="40" y="28" width="8" height="2" fill="#1a1a1a" />
    <rect x="52" y="28" width="6" height="2" fill="#1a1a1a" />
    <rect x="42" y="34" width="4" height="4" fill="#1a1a1a" />
    <rect x="54" y="34" width="4" height="4" fill="#1a1a1a" />
    <rect x="46" y="42" width="6" height="2" fill="#a36b4a" />
    <rect x="20" y="48" width="40" height="20" fill={color} />
    <rect x="20" y="66" width="40" height="4" fill="#404040" />
    <rect x="24" y="70" width="12" height="12" fill="#52525b" />
    <rect x="44" y="70" width="12" height="12" fill="#52525b" />
    <rect x="20" y="82" width="16" height="8" fill="#18181b" />
    <rect x="40" y="82" width="16" height="8" fill="#18181b" />
    <rect x="30" y="52" width="30" height="10" fill="#f5c29a" />
    <rect x="55" y="50" width="10" height="14" fill="#d99b78" />
  </svg>
);

// ─── Rope Scene Graphic ───
function RopeScene({ position }: { position: number }) {
  const pullOffset = (position / 50) * 150;

  return (
    <div className="relative flex flex-col items-center justify-center w-full" style={{ maxWidth: "clamp(400px, 40vw, 900px)", height: "clamp(200px, 25vh, 400px)" }}>
      <div className="absolute bg-gray-400 z-0" style={{ left: "50%", top: "10%", bottom: "10%", width: "clamp(2px, 0.2vw, 4px)", transform: "translateX(-50%)" }}></div>
      <motion.div
        className="relative flex items-center justify-center w-full h-full z-10"
        animate={{ x: -pullOffset }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      >
        <div className="absolute z-10 flex items-end justify-center" style={{ left: "0%", bottom: "10%", width: "clamp(100px, 12vw, 200px)", height: "clamp(120px, 14vw, 220px)" }}>
          <PixelGuy color="#1e3a8a" />
        </div>
        <div className="bg-[#b45309] border-y-2 border-[#78350f] z-0" style={{ width: "80%", height: "clamp(12px, 1.5vh, 24px)" }}></div>
        <div className="absolute bg-yellow-400 border-[3px] border-black z-20" style={{ left: "50%", transform: "translateX(-50%)", width: "clamp(24px, 2vw, 40px)", height: "clamp(48px, 4vh, 80px)" }}></div>
        <div className="absolute z-10 flex items-end justify-center" style={{ right: "0%", bottom: "10%", width: "clamp(100px, 12vw, 200px)", height: "clamp(120px, 14vw, 220px)" }}>
          <PixelGuy color="#7f1d1d" reversed />
        </div>
      </motion.div>
    </div>
  )
}

// ─── Quiz Panel ───
function QuizPanel({
  player,
  options,
  disabled,
  onSelect,
  feedback
}: {
  player: 1 | 2;
  options: string[];
  disabled: boolean;
  onSelect: (val: string) => void;
  feedback: { selected: string; correct: boolean } | null;
}) {
  const isP1 = player === 1;
  const headerColor = isP1 ? "#1e1b4b" : "#7f1d1d";

  return (
    <motion.div
      animate={
        feedback?.correct ? { scale: [1, 1.05, 1], boxShadow: "0 0 50px rgba(74,222,171,0.8)" } :
          feedback && !feedback.correct ? { x: [-15, 15, -15, 15, 0], boxShadow: "0 0 50px rgba(255,68,68,0.8)" } :
            { scale: 1, boxShadow: "0 10px 40px rgba(0,0,0,0.15)" }
      }
      className="bg-white rounded-2xl flex flex-col w-full"
      style={{ width: "clamp(320px, 26vw, 480px)", minHeight: "clamp(320px, 35vh, 500px)", overflow: "hidden" }}
    >
      {/* Header */}
      <div className="flex items-center justify-center text-white font-black tracking-widest shadow-inner" style={{ backgroundColor: headerColor, padding: "clamp(16px, 2vh, 32px)", fontSize: "clamp(24px, 2.5vw, 48px)" }}>
        Tim {isP1 ? "Biru" : "Merah"}
      </div>

      {/* Options List */}
      <div className="flex-1 flex flex-col justify-center" style={{ gap: "clamp(12px, 1.5vh, 24px)", padding: "clamp(16px, 2vh, 32px)" }}>
        {options.map((opt) => {
          const isSelected = feedback?.selected === opt;
          const isCorrect = isSelected && feedback.correct;
          const isWrong = isSelected && !feedback.correct;

          let btnBg = "bg-[#f3f4f6]";
          let btnBorder = "border-gray-300";
          let btnText = "text-gray-800";
          let activeClasses = "active:border-b-0 active:translate-y-1";

          if (isCorrect) {
            btnBg = "bg-[#4adeab]";
            btnBorder = "border-[#10b981]";
            btnText = "text-white";
            activeClasses = ""; // Lock movement when feedback shows
          } else if (isWrong) {
            btnBg = "bg-[#ef4444]";
            btnBorder = "border-[#b91c1c]";
            btnText = "text-white";
            activeClasses = "";
          } else if (feedback !== null) {
            btnBg = "bg-[#e5e7eb]";
            btnBorder = "border-gray-200";
            btnText = "text-gray-400";
            activeClasses = "";
          }

          return (
            <button
              key={opt}
              onPointerDown={(e) => { e.stopPropagation(); onSelect(opt); }}
              disabled={disabled || feedback !== null}
              className={`touch-btn font-bold rounded-xl shadow-sm border-b-4 transition-all flex items-center justify-center text-center leading-snug ${activeClasses} ${btnBg} ${btnBorder} ${btnText}`}
              style={{ minHeight: "clamp(60px, 8vh, 120px)", fontSize: "clamp(16px, 1.8vw, 28px)", padding: "clamp(8px, 1vh, 16px)" }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </motion.div>
  )
}

// ─── Main Game Page ───
export default function QuizTugOfWarPage() {
  const { ropePosition, currentQuestion, submitAnswer, nextQuestion, reset } = useQuizTugStore();

  const [phase, setPhase] = useState<Phase>("countdown");
  const [countdown, setCountdown] = useState(3);


  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);

  const [p1Feedback, setP1Feedback] = useState<{ selected: string; correct: boolean } | null>(null);
  const [p2Feedback, setP2Feedback] = useState<{ selected: string; correct: boolean } | null>(null);
  const [winner, setWinner] = useState<"p1" | "p2" | "draw" | null>(null);

  const questionCooldown = useRef(false);

  // Countdown phase
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



  // Check win by rope threshold
  useEffect(() => {
    if (phase !== "playing") return;
    if (ropePosition >= 50) finishGame("p1");
    else if (ropePosition <= -50) finishGame("p2");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ropePosition, phase]);

  const handleAnswer = useCallback((player: 1 | 2, value: string) => {
    if (phase !== "playing") return;
    const correct = submitAnswer(player, value);

    const setFeedback = player === 1 ? setP1Feedback : setP2Feedback;
    setFeedback({ selected: value, correct });

    if (correct) {
      (player === 1 ? setP1Score : setP2Score)((s) => s + 10);
    }

    // Auto-next question logic
    if (!questionCooldown.current) {
      questionCooldown.current = true;
      setTimeout(() => {
        nextQuestion();
        setP1Feedback(null);
        setP2Feedback(null);
        questionCooldown.current = false;
      }, 800); // Slightly longer feedback for reading text
    }
  }, [phase, submitAnswer, nextQuestion]);

  const finishGame = useCallback((forcedWinner?: "p1" | "p2") => {
    if (phase === "finished") return;
    setPhase("finished");
    if (forcedWinner) {
      setWinner(forcedWinner);
    } else {
      if (ropePosition > 0) setWinner("p1");
      else if (ropePosition < 0) setWinner("p2");
      else setWinner("draw");
    }
  }, [phase, ropePosition]);

  const handleRematch = () => {
    setPhase("countdown");
    setCountdown(3);
    setP1Score(0);
    setP2Score(0);
    setP1Feedback(null);
    setP2Feedback(null);
    setWinner(null);
    reset();
  };

  const isPlaying = phase === "playing";

  const isFullscreen = () => {
    if (typeof window !== "undefined" && document.fullscreenElement) {
      document.exitFullscreen();
    } else if (typeof window !== "undefined") {
      document.documentElement.requestFullscreen().catch(() => { });
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center bg-[#e0f2fe] relative overflow-hidden text-gray-900 font-sans">



      {/* TOP HEADER */}
      <div className="w-full flex items-center justify-between px-6 py-4 shadow-sm bg-[#e0f2fe] z-10 flex-shrink-0">
        <div className="w-32 flex justify-start"></div>
        <div className="flex-1 flex justify-center items-center">
          <div className="font-bold text-[#0ea5e9] tracking-wide" style={{ fontSize: "clamp(20px, 2vw, 32px)" }}>
            Tarik Tambang Pengetahuan
          </div>
        </div>
        <div className="w-32 flex justify-end">
          <button onPointerDown={isFullscreen} className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-bold px-4 py-2 rounded-lg shadow-sm transition-colors">
            🖥️
          </button>
        </div>
      </div>

      {/* TIMER */}
      <div className="w-full flex justify-center z-20 mt-5 mb-2">
        <GlobalTimer duration={GAME_DURATION} isRunning={phase === "playing"} onComplete={() => finishGame()} />
      </div>

      {/* Center Question Panel */}
      <div className="w-full flex justify-center px-8 z-10 mt-20" style={{ marginBottom: "clamp(20px, 3vh, 40px)" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border-4 border-gray-100 text-center flex items-center justify-center"
            style={{ padding: "clamp(16px, 2.5vh, 40px) clamp(30px, 4vw, 80px)", maxWidth: "clamp(600px, 60vw, 1200px)", minHeight: "clamp(80px, 10vh, 160px)" }}
          >
            <h2 className="font-black text-[#1e1b4b] leading-tight" style={{ fontSize: "clamp(24px, 2.5vw, 48px)" }}>
              {currentQuestion.question}
            </h2>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full flex items-center justify-between z-10" style={{ padding: "0 clamp(32px, 6vw, 120px) clamp(40px, 5vh, 80px)" }}>

        {/* Left P1 Panel */}
        <div className="flex flex-col items-start z-10 flex-shrink-0">
          <QuizPanel
            player={1}
            options={currentQuestion.options}
            disabled={!isPlaying}
            onSelect={(val) => handleAnswer(1, val)}
            feedback={p1Feedback}
          />
        </div>

        {/* Center Graphic */}
        <div className="flex flex-col items-center justify-center flex-1 mx-8 z-0">
          <RopeScene position={ropePosition} />
          <p className="font-bold text-[#1f2937] text-center" style={{ marginTop: "clamp(30px, 5vh, 60px)", fontSize: "clamp(24px, 2.5vw, 40px)" }}>Pilih jawaban untuk menarik tali!</p>
        </div>

        {/* Right P2 Panel */}
        <div className="flex flex-col items-end z-10 flex-shrink-0">
          <QuizPanel
            player={2}
            options={currentQuestion.options}
            disabled={!isPlaying}
            onSelect={(val) => handleAnswer(2, val)}
            feedback={p2Feedback}
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

      {/* VICTORY MODAL */}
      <VictoryResultModal
        isOpen={phase === "finished"}
        winner={winner}
        p1Score={p1Score}
        p2Score={p2Score}
        p1Label="Tim Biru"
        p2Label="Tim Merah"
        onRematch={handleRematch}
      />
    </div>
  );
}
