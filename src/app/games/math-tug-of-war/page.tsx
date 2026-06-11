"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useMathTugStore } from "@/store/useMathTugStore";
import { VictoryResultModal } from "@/components/game/VictoryResultModal";
import { GlobalTimer } from "@/components/game/GlobalTimer";

const GAME_DURATION = 60; // seconds

type Phase = "countdown" | "playing" | "finished";

// ─── Pixel Art Character SVG ───
const PixelGuy = ({ color, reversed }: { color: string, reversed?: boolean }) => (
  <svg width="100%" height="100%" viewBox="0 0 80 90" style={{ transform: reversed ? "scaleX(-1)" : "none", display: "block" }}>
    {/* Hair */}
    <rect x="20" y="10" width="40" height="8" fill="#1a1a1a" />
    <rect x="16" y="18" width="6" height="15" fill="#1a1a1a" />
    {/* Headband */}
    <rect x="18" y="16" width="44" height="4" fill="#e11d48" />
    <rect x="18" y="20" width="44" height="4" fill="#ffffff" />
    {/* Face */}
    <rect x="22" y="24" width="36" height="24" fill="#f5c29a" />
    {/* Eyebrows & Eyes */}
    <rect x="40" y="28" width="8" height="2" fill="#1a1a1a" />
    <rect x="52" y="28" width="6" height="2" fill="#1a1a1a" />
    <rect x="42" y="34" width="4" height="4" fill="#1a1a1a" />
    <rect x="54" y="34" width="4" height="4" fill="#1a1a1a" />
    {/* Mouth */}
    <rect x="46" y="42" width="6" height="2" fill="#a36b4a" />
    {/* Body */}
    <rect x="20" y="48" width="40" height="20" fill={color} />
    {/* Belt */}
    <rect x="20" y="66" width="40" height="4" fill="#404040" />
    {/* Legs */}
    <rect x="24" y="70" width="12" height="12" fill="#52525b" />
    <rect x="44" y="70" width="12" height="12" fill="#52525b" />
    {/* Shoes */}
    <rect x="20" y="82" width="16" height="8" fill="#18181b" />
    <rect x="40" y="82" width="16" height="8" fill="#18181b" />
    {/* Arm (Front) */}
    <rect x="30" y="52" width="30" height="10" fill="#f5c29a" />
    {/* Hand gripping */}
    <rect x="55" y="50" width="10" height="14" fill="#d99b78" />
  </svg>
);

// ─── Rope Scene Graphic ───
function RopeScene({ position }: { position: number }) {
  // position: -50 (P2 wins) to 50 (P1 wins)
  const pullOffset = (position / 50) * 150; // px translation

  return (
    <div className="relative flex flex-col items-center justify-center w-full" style={{ maxWidth: "clamp(400px, 40vw, 900px)", height: "clamp(200px, 25vh, 400px)" }}>
      {/* Center Line Indicator */}
      <div className="absolute bg-gray-400 z-0" style={{ left: "50%", top: "10%", bottom: "10%", width: "clamp(2px, 0.2vw, 4px)", transform: "translateX(-50%)" }}></div>

      <motion.div
        className="relative flex items-center justify-center w-full h-full z-10"
        animate={{ x: -pullOffset }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      >
        {/* P1 */}
        <div className="absolute z-10 flex items-end justify-center" style={{ left: "0%", bottom: "10%", width: "clamp(100px, 12vw, 200px)", height: "clamp(120px, 14vw, 220px)" }}>
          <PixelGuy color="#1e3a8a" />
        </div>

        {/* Rope */}
        <div className="bg-[#b45309] border-y-2 border-[#78350f] z-0" style={{ width: "80%", height: "clamp(12px, 1.5vh, 24px)" }}></div>

        {/* Center Marker */}
        <div className="absolute bg-yellow-400 border-[3px] border-black z-20" style={{ left: "50%", transform: "translateX(-50%)", width: "clamp(24px, 2vw, 40px)", height: "clamp(48px, 4vh, 80px)" }}></div>

        {/* P2 */}
        <div className="absolute z-10 flex items-end justify-center" style={{ right: "0%", bottom: "10%", width: "clamp(100px, 12vw, 200px)", height: "clamp(120px, 14vw, 220px)" }}>
          <PixelGuy color="#7f1d1d" reversed />
        </div>
      </motion.div>
    </div>
  )
}

// ─── Numpad Panel ───
function NumpadPanel({
  player,
  question,
  disabled,
  onGo,
  feedback
}: {
  player: 1 | 2;
  question: string;
  disabled: boolean;
  onGo: (val: number) => void;
  feedback: "correct" | "wrong" | null;
}) {
  const [input, setInput] = useState("");
  const isP1 = player === 1;
  const headerColor = isP1 ? "#1e1b4b" : "#7f1d1d";

  useEffect(() => {
    setInput("");
  }, [question]);

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
      <div className="flex items-center justify-center text-white font-black tracking-widest shadow-inner" style={{ backgroundColor: headerColor, padding: "clamp(16px, 2vh, 32px)", fontSize: "clamp(32px, 3vw, 56px)" }}>
        {question}
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
            onPointerDown={(e) => { e.stopPropagation(); if (input.length < 4) setInput(p => p + num); }}
            disabled={disabled}
            className="touch-btn bg-[#f3f4f6] active:bg-[#e5e7eb] text-gray-800 font-bold rounded-xl shadow-sm border-b-4 border-gray-300 active:border-b-0 active:translate-y-1 transition-all"
            style={{ height: "clamp(70px, 8vh, 120px)", fontSize: "clamp(32px, 2.5vw, 56px)" }}
          >
            {num}
          </button>
        ))}
        <button
          onPointerDown={(e) => { e.stopPropagation(); setInput(""); }}
          disabled={disabled}
          className="touch-btn bg-[#ef4444] active:bg-[#dc2626] text-white font-bold rounded-xl shadow-sm border-b-4 border-[#b91c1c] active:border-b-0 active:translate-y-1 transition-all"
          style={{ height: "clamp(70px, 8vh, 120px)", fontSize: "clamp(32px, 2.5vw, 56px)" }}
        >
          C
        </button>
        <button
          onPointerDown={(e) => { e.stopPropagation(); if (input.length < 4) setInput(p => p + "0"); }}
          disabled={disabled}
          className="touch-btn bg-[#f3f4f6] active:bg-[#e5e7eb] text-gray-800 font-bold rounded-xl shadow-sm border-b-4 border-gray-300 active:border-b-0 active:translate-y-1 transition-all"
          style={{ height: "clamp(70px, 8vh, 120px)", fontSize: "clamp(32px, 2.5vw, 56px)" }}
        >
          0
        </button>
        <button
          onPointerDown={(e) => {
            e.stopPropagation();
            if (input) {
              onGo(parseInt(input, 10));
              setInput("");
            }
          }}
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

// ─── Main Game Page ───
export default function MathTugOfWarPage() {
  const { ropePosition, p1Question, p2Question, submitAnswer, nextQuestion, reset } = useMathTugStore();

  const [phase, setPhase] = useState<Phase>("countdown");
  const [countdown, setCountdown] = useState(3);

  const [p1Feedback, setP1Feedback] = useState<"correct" | "wrong" | null>(null);
  const [p2Feedback, setP2Feedback] = useState<"correct" | "wrong" | null>(null);
  const [winner, setWinner] = useState<"p1" | "p2" | "draw" | null>(null);

  const p1Cooldown = useRef(false);
  const p2Cooldown = useRef(false);

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

  const handleAnswer = useCallback((player: 1 | 2, value: number) => {
    if (phase !== "playing") return;
    const correct = submitAnswer(player, value);

    const setFeedback = player === 1 ? setP1Feedback : setP2Feedback;
    const cooldown = player === 1 ? p1Cooldown : p2Cooldown;

    setFeedback(correct ? "correct" : "wrong");

    // Auto-next question logic
    if (!cooldown.current) {
      cooldown.current = true;
      setTimeout(() => {
        nextQuestion(player);
        setFeedback(null);
        cooldown.current = false;
      }, 600);
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
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center bg-[#e0f2fe] relative overflow-hidden text-gray-900 font-sans">



      {/* TOP HEADER */}
      <div className="w-full flex items-center justify-between px-6 py-4 shadow-sm bg-[#e0f2fe] z-10 flex-shrink-0">
        <div className="w-32 flex justify-start"></div>
        <div className="flex-1 flex justify-center items-center">
          <div className="font-bold text-[#0ea5e9] tracking-wide" style={{ fontSize: "clamp(20px, 2vw, 32px)" }}>
             Tarik Tambang Matematika
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

      {/* Main Content Area */}
      <div className="flex-1 w-full flex items-center justify-between z-10" style={{ padding: "0 clamp(32px, 6vw, 120px) clamp(40px, 5vh, 80px)" }}>

        {/* Left P1 Panel */}
        <div className="flex flex-col items-start z-10 flex-shrink-0">
          <NumpadPanel
            player={1}
            question={p1Question.problem}
            disabled={!isPlaying}
            onGo={(val) => handleAnswer(1, val)}
            feedback={p1Feedback}
          />
        </div>

        {/* Center Graphic */}
        <div className="flex flex-col items-center justify-center flex-1 mx-8 z-0">
          <RopeScene position={ropePosition} />
          <p className="font-bold text-[#1f2937] text-center" style={{ marginTop: "clamp(30px, 5vh, 60px)", fontSize: "clamp(24px, 2.5vw, 40px)" }}>Jawab soal untuk menarik tali!</p>
        </div>

        {/* Right P2 Panel */}
        <div className="flex flex-col items-end z-10 flex-shrink-0">
          <NumpadPanel
            player={2}
            question={p2Question.problem}
            disabled={!isPlaying}
            onGo={(val) => handleAnswer(2, val)}
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
        p1Score={ropePosition > 0 ? 100 : 0} // dummy scores for modal
        p2Score={ropePosition < 0 ? 100 : 0}
        p1Label="Tim Biru"
        p2Label="Tim Merah"
        onRematch={handleRematch}
      />
    </div>
  );
}
