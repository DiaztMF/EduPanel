"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, RotateCw, Layers, ShieldCheck, HelpCircle } from "lucide-react";
import { GameHeader } from "@/components/game/GameHeader";
import { GameSetupModal } from "@/components/game/GameSetupModal";
import { VictoryResultModal } from "@/components/game/VictoryResultModal";
import {
  SHAPES_DATA,
  generateGeometryQuestion,
  shuffleArray,
  type ShapeDefinition,
  type GeometryDifficulty,
  type GeometryQuestion,
} from "@/data/geometry-data";

type Phase = "setup" | "countdown" | "playing" | "finished";

// ─── Crisp SVG 3D Isometric Renderers ───
function SvgShapeVisual({ shape, isRotating }: { shape: ShapeDefinition; isRotating: boolean }) {
  const color = shape.color;

  return (
    <motion.div
      animate={{ scale: [0.98, 1.02, 0.98], rotateY: isRotating ? 360 : 0 }}
      transition={{
        scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        rotateY: { duration: 6, repeat: Infinity, ease: "linear" },
      }}
      className="w-full h-full flex items-center justify-center p-2"
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full max-w-[190px] max-h-[190px] drop-shadow-md select-none"
      >
        <defs>
          <linearGradient id={`grad-${shape.id}-top`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.95" />
            <stop offset="100%" stopColor={color} stopOpacity="0.75" />
          </linearGradient>
          <linearGradient id={`grad-${shape.id}-front`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id={`grad-${shape.id}-side`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {shape.id === "cube" && (
          <g transform="translate(100, 100)">
            {/* Top Face */}
            <polygon points="0,-60 52,-30 0,0 -52,-30" fill={`url(#grad-${shape.id}-top)`} stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
            {/* Left Face */}
            <polygon points="-52,-30 0,0 0,60 -52,30" fill={`url(#grad-${shape.id}-front)`} stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
            {/* Right Face */}
            <polygon points="0,0 52,-30 52,30 0,60" fill={`url(#grad-${shape.id}-side)`} stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
          </g>
        )}

        {shape.id === "cuboid" && (
          <g transform="translate(100, 100)">
            {/* Top Face */}
            <polygon points="0,-45 68,-25 0,5 -68,-15" fill={`url(#grad-${shape.id}-top)`} stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
            {/* Left Face */}
            <polygon points="-68,-15 0,5 0,65 -68,45" fill={`url(#grad-${shape.id}-front)`} stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
            {/* Right Face */}
            <polygon points="0,5 68,-25 68,35 0,65" fill={`url(#grad-${shape.id}-side)`} stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
          </g>
        )}

        {shape.id === "cylinder" && (
          <g transform="translate(100, 100)">
            {/* Body */}
            <path d="M -50,-30 L 50,-30 L 50,45 A 50 18 0 0 1 -50 45 Z" fill={`url(#grad-${shape.id}-front)`} stroke="#1e293b" strokeWidth="2.5" />
            {/* Top Ellipse */}
            <ellipse cx="0" cy="-30" rx="50" ry="18" fill={`url(#grad-${shape.id}-top)`} stroke="#1e293b" strokeWidth="2.5" />
            {/* Bottom Ellipse contour */}
            <path d="M -50,45 A 50 18 0 0 0 50 45" fill="none" stroke="#1e293b" strokeWidth="2.5" />
          </g>
        )}

        {shape.id === "sphere" && (
          <g transform="translate(100, 100)">
            {/* Sphere Body */}
            <circle cx="0" cy="0" r="55" fill={`url(#grad-${shape.id}-top)`} stroke="#1e293b" strokeWidth="2.5" />
            {/* Latitude Equator */}
            <ellipse cx="0" cy="0" rx="55" ry="16" fill="none" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
            {/* Longitude Meridian */}
            <ellipse cx="0" cy="0" rx="20" ry="55" fill="none" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
            {/* Shading highlight */}
            <circle cx="-16" cy="-16" r="14" fill="#ffffff" opacity="0.3" />
          </g>
        )}

        {shape.id === "cone" && (
          <g transform="translate(100, 100)">
            {/* Cone Body */}
            <path d="M -50,45 L 0,-60 L 50,45 A 50 18 0 0 1 -50 45 Z" fill={`url(#grad-${shape.id}-front)`} stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
            {/* Bottom Ellipse base */}
            <path d="M -50,45 A 50 18 0 0 0 50 45" fill="none" stroke="#1e293b" strokeWidth="2.5" />
            {/* Apex Dot */}
            <circle cx="0" cy="-60" r="3" fill="#1e293b" />
          </g>
        )}

        {shape.id === "triangular_prism" && (
          <g transform="translate(100, 100)">
            {/* Front triangle */}
            <polygon points="-50,45 0,10 35,45" fill={`url(#grad-${shape.id}-front)`} stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
            {/* Top roof face */}
            <polygon points="0,10 40,-45 75,-10 35,45" fill={`url(#grad-${shape.id}-top)`} stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
            {/* Back ridge */}
            <line x1="-50" y1="45" x2="-10" y2="-10" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="-10" y1="-10" x2="40" y2="-45" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
          </g>
        )}

        {shape.id === "square_pyramid" && (
          <g transform="translate(100, 100)">
            {/* Left triangle */}
            <polygon points="0,-60 -55,30 0,55" fill={`url(#grad-${shape.id}-front)`} stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
            {/* Right triangle */}
            <polygon points="0,-60 0,55 55,30" fill={`url(#grad-${shape.id}-side)`} stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
            {/* Base back edges */}
            <line x1="-55" y1="30" x2="0" y2="5" stroke="#1e293b" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="55" y1="30" x2="0" y2="5" stroke="#1e293b" strokeWidth="2" strokeDasharray="3 3" />
            {/* Apex */}
            <circle cx="0" cy="-60" r="3" fill="#1e293b" />
          </g>
        )}
      </svg>
    </motion.div>
  );
}

// ─── Crisp SVG Net (Jaring-Jaring) Renderer ───
function SvgNetVisual({ shape }: { shape: ShapeDefinition }) {
  const color = shape.color;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      className="w-full h-full flex flex-col items-center justify-center p-2"
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full max-w-[190px] max-h-[190px] drop-shadow-sm select-none"
      >
        {shape.id === "cube" && (
          <g transform="translate(100, 100)" fill={color} fillOpacity="0.3" stroke="#1e293b" strokeWidth="2">
            {/* Cross net */}
            <rect x="-15" y="-55" width="30" height="30" />
            <rect x="-45" y="-25" width="30" height="30" />
            <rect x="-15" y="-25" width="30" height="30" />
            <rect x="15" y="-25" width="30" height="30" />
            <rect x="-15" y="5" width="30" height="30" />
            <rect x="-15" y="35" width="30" height="30" />
          </g>
        )}

        {shape.id === "cuboid" && (
          <g transform="translate(100, 100)" fill={color} fillOpacity="0.3" stroke="#1e293b" strokeWidth="2">
            <rect x="-15" y="-50" width="30" height="20" />
            <rect x="-50" y="-30" width="35" height="40" />
            <rect x="-15" y="-30" width="30" height="40" />
            <rect x="15" y="-30" width="35" height="40" />
            <rect x="-15" y="10" width="30" height="20" />
            <rect x="-15" y="30" width="30" height="40" />
          </g>
        )}

        {shape.id === "cylinder" && (
          <g transform="translate(100, 100)" fill={color} fillOpacity="0.3" stroke="#1e293b" strokeWidth="2">
            {/* Top Circle */}
            <circle cx="0" cy="-45" r="20" />
            {/* Rectangle body */}
            <rect x="-55" y="-20" width="110" height="45" rx="3" />
            {/* Bottom Circle */}
            <circle cx="0" cy="50" r="20" />
          </g>
        )}

        {shape.id === "cone" && (
          <g transform="translate(100, 100)" fill={color} fillOpacity="0.3" stroke="#1e293b" strokeWidth="2">
            {/* Base Circle */}
            <circle cx="0" cy="40" r="22" />
            {/* Sector / Juring */}
            <path d="M 0,-40 L -45,15 A 55 55 0 0 0 45,15 Z" />
          </g>
        )}

        {shape.id === "triangular_prism" && (
          <g transform="translate(100, 100)" fill={color} fillOpacity="0.3" stroke="#1e293b" strokeWidth="2">
            {/* 3 Rectangles */}
            <rect x="-55" y="-20" width="35" height="45" />
            <rect x="-20" y="-20" width="40" height="45" />
            <rect x="20" y="-20" width="35" height="45" />
            {/* 2 Triangles */}
            <polygon points="-20,-20 0,-50 20,-20" />
            <polygon points="-20,25 0,55 20,25" />
          </g>
        )}

        {shape.id === "square_pyramid" && (
          <g transform="translate(100, 100)" fill={color} fillOpacity="0.3" stroke="#1e293b" strokeWidth="2">
            {/* Center Square */}
            <rect x="-22" y="-22" width="44" height="44" />
            {/* 4 Triangles */}
            <polygon points="-22,-22 0,-58 22,-22" />
            <polygon points="-22,22 0,58 22,22" />
            <polygon points="-22,-22 -58,0 -22,22" />
            <polygon points="22,-22 58,0 22,22" />
          </g>
        )}

        {shape.id === "sphere" && (
          <g transform="translate(100, 100)" fill="#64748b" opacity="0.7">
            <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" className="text-[11px] font-bold" fill="#334155">
              Tidak ada jaring datar
            </text>
          </g>
        )}
      </svg>
    </motion.div>
  );
}

export default function GeometricShapesPage() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [countdown, setCountdown] = useState(3);
  const [difficulty, setDifficulty] = useState<GeometryDifficulty>("medium");
  const [duration, setDuration] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);

  // Question & Round State
  const [currentQuestion, setCurrentQuestion] = useState<GeometryQuestion>(() =>
    generateGeometryQuestion("medium")
  );
  const [p1Options, setP1Options] = useState<string[]>([]);
  const [p2Options, setP2Options] = useState<string[]>([]);

  // Scores & feedback
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [p1Wrong, setP1Wrong] = useState<string | null>(null);
  const [p2Wrong, setP2Wrong] = useState<string | null>(null);
  const [p1Correct, setP1Correct] = useState<string | null>(null);
  const [p2Correct, setP2Correct] = useState<string | null>(null);
  const [isAdvancing, setIsAdvancing] = useState(false);

  // Interactive View Mode
  const [isUnfolded, setIsUnfolded] = useState(false);
  const [winner, setWinner] = useState<"p1" | "p2" | "draw" | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Prepare options for both players when question changes
  const setupQuestionOptions = useCallback((q: GeometryQuestion) => {
    setP1Options(shuffleArray(q.options));
    setP2Options(shuffleArray(q.options));
    setP1Wrong(null);
    setP2Wrong(null);
    setP1Correct(null);
    setP2Correct(null);
    setIsAdvancing(false);
  }, []);

  // Initialize first question options
  useEffect(() => {
    setupQuestionOptions(currentQuestion);
  }, [currentQuestion, setupQuestionOptions]);

  // Handle Game Start from Setup Modal
  const handleStartGame = (config: { difficulty: GeometryDifficulty; duration: number }) => {
    setDifficulty(config.difficulty);
    setDuration(config.duration);
    setTimeLeft(config.duration);
    setP1Score(0);
    setP2Score(0);
    setWinner(null);
    setIsUnfolded(false);

    const firstQ = generateGeometryQuestion(config.difficulty);
    setCurrentQuestion(firstQ);
    setupQuestionOptions(firstQ);

    setCountdown(3);
    setPhase("countdown");
  };

  // Countdown 3-2-1 timer
  useEffect(() => {
    if (phase !== "countdown") return;

    if (countdown > 0) {
      countdownTimerRef.current = setTimeout(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    } else {
      setPhase("playing");
    }

    return () => {
      if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
    };
  }, [phase, countdown]);

  // Main Game Countdown Timer
  useEffect(() => {
    if (phase !== "playing") return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setPhase("finished");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  // Determine winner when phase becomes finished
  useEffect(() => {
    if (phase === "finished") {
      if (p1Score > p2Score) setWinner("p1");
      else if (p2Score > p1Score) setWinner("p2");
      else setWinner("draw");
    }
  }, [phase, p1Score, p2Score]);

  // Advance to next question
  const advanceToNext = useCallback(() => {
    setIsAdvancing(true);
    setTimeout(() => {
      const nextQ = generateGeometryQuestion(difficulty, currentQuestion.shape.id);
      setCurrentQuestion(nextQ);
      setupQuestionOptions(nextQ);
    }, 600);
  }, [difficulty, currentQuestion.shape.id, setupQuestionOptions]);

  // Player answer submission
  const handleAnswer = (player: 1 | 2, option: string) => {
    if (phase !== "playing" || isAdvancing) return;

    const isCorrect = option === currentQuestion.correctAnswer;

    if (player === 1) {
      if (isCorrect) {
        setP1Correct(option);
        const points = p2Correct ? 5 : 10;
        setP1Score((s) => s + points);
        if (!p2Correct) {
          advanceToNext();
        }
      } else {
        setP1Wrong(option);
        setTimeout(() => setP1Wrong(null), 500);
        setP1Score((s) => Math.max(0, s - 3));
      }
    } else {
      if (isCorrect) {
        setP2Correct(option);
        const points = p1Correct ? 5 : 10;
        setP2Score((s) => s + points);
        if (!p1Correct) {
          advanceToNext();
        }
      } else {
        setP2Wrong(option);
        setTimeout(() => setP2Wrong(null), 500);
        setP2Score((s) => Math.max(0, s - 3));
      }
    }
  };

  const handleOpenSetup = () => {
    setPhase("setup");
  };

  const targetScoreMax = Math.max(100, Math.max(p1Score, p2Score) + 20);
  const p1Pct = Math.min((p1Score / targetScoreMax) * 100, 100);
  const p2Pct = Math.min((p2Score / targetScoreMax) * 100, 100);

  return (
    <div className="w-full h-full flex flex-col items-center bg-[#e0f2fe] relative overflow-hidden text-gray-900 font-sans select-none">
      {/* ── TOP HEADER ── */}
      <GameHeader
        title="Geometric Shapes"
        subtitle="Duel Analisis Bangun Ruang 3D"
        timerDuration={duration}
        isTimerRunning={phase === "playing"}
        onTimerComplete={() => setPhase("finished")}
        rightSlot={
          <button
            onPointerDown={handleOpenSetup}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-300 bg-white/80 hover:bg-sky-50 text-sky-800 text-xs font-bold shadow-sm transition-all"
          >
            <SlidersHorizontal size={14} />
            <span>Atur Game</span>
          </button>
        }
      />

      {/* ── SCOREBOARD DUAL BAR ── */}
      <div className="w-full z-10 flex-shrink-0 px-4 md:px-8 pt-2">
        <div className="w-full bg-white/95 backdrop-blur-sm border-2 border-sky-100 shadow-md rounded-2xl p-3 flex flex-col gap-2">
          {/* Blue Team Score */}
          <div className="flex items-center gap-3 w-full">
            <div className="w-3.5 h-3.5 rounded-full flex-shrink-0 bg-blue-700" />
            <div className="w-24 font-bold text-xs md:text-sm text-blue-900 tracking-wider flex-shrink-0">
              TIM BIRU
            </div>
            <div className="flex-1 h-5 bg-sky-100 rounded-full border border-sky-200 overflow-hidden relative shadow-inner">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-700 to-sky-500"
                animate={{ width: `${p1Pct}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              />
            </div>
            <div className="font-black text-center min-w-[50px] px-3 py-1 rounded-xl border-2 border-blue-700 bg-blue-50 text-blue-900 text-sm">
              {p1Score}
            </div>
          </div>

          {/* Red Team Score */}
          <div className="flex items-center gap-3 w-full">
            <div className="w-3.5 h-3.5 rounded-full flex-shrink-0 bg-rose-700" />
            <div className="w-24 font-bold text-xs md:text-sm text-rose-900 tracking-wider flex-shrink-0">
              TIM MERAH
            </div>
            <div className="flex-1 h-5 bg-rose-50 rounded-full border border-rose-200 overflow-hidden relative shadow-inner">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-rose-700 to-red-500"
                animate={{ width: `${p2Pct}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              />
            </div>
            <div className="font-black text-center min-w-[50px] px-3 py-1 rounded-xl border-2 border-rose-700 bg-rose-50 text-rose-900 text-sm">
              {p2Score}
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN 3-COLUMN BATTLE AREA ── */}
      <div className="flex-1 w-full z-10 flex gap-3 md:gap-5 min-h-0 px-4 md:px-8 py-3">
        {/* LEFT COLUMN: TIM BIRU (P1 Options) */}
        <div className="flex flex-col bg-white rounded-2xl shadow-lg border-2 border-blue-800 overflow-hidden w-64 md:w-80 flex-shrink-0">
          <div className="flex items-center justify-between px-4 py-2.5 bg-blue-900 text-white shadow-inner">
            <h2 className="font-black text-sm tracking-wider">TIM BIRU</h2>
            <span className="text-[11px] font-bold text-blue-200 uppercase tracking-widest">
              Layar Kiri
            </span>
          </div>
          <div className="flex-1 flex flex-col justify-center p-3 gap-2.5 bg-slate-50">
            {p1Options.map((opt, idx) => {
              const isWrong = p1Wrong === opt;
              const isCorrect = p1Correct === opt;
              return (
                <motion.button
                  key={`p1-opt-${idx}-${opt}`}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    handleAnswer(1, opt);
                  }}
                  animate={{
                    scale: isWrong ? [1, 0.95, 1] : isCorrect ? [1, 1.03, 1] : 1,
                  }}
                  className={`min-h-[64px] px-4 py-2 text-left font-bold text-sm md:text-base rounded-xl border-2 shadow-sm active:translate-y-0.5 transition-all flex items-center justify-between ${
                    isCorrect
                      ? "bg-emerald-100 border-emerald-500 text-emerald-800"
                      : isWrong
                      ? "bg-rose-100 border-rose-500 text-rose-800"
                      : "bg-white border-slate-200 text-slate-800 hover:border-blue-300 hover:bg-blue-50/50"
                  }`}
                  style={{ touchAction: "manipulation" }}
                >
                  <span className="leading-snug">{opt}</span>
                  {isCorrect && <ShieldCheck size={18} className="text-emerald-600 flex-shrink-0" />}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* CENTER COLUMN: ACTIVE QUESTION & 3D SHAPE INSPECTOR */}
        <div className="flex-1 flex flex-col items-center justify-between bg-white rounded-2xl shadow-lg border border-sky-100 p-4 min-w-0">
          {/* Question Banner */}
          <div className="w-full bg-sky-50 border border-sky-200 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 text-sky-700 text-xs font-bold uppercase tracking-wider mb-1">
              <HelpCircle size={14} />
              <span>Tantangan Geometri</span>
            </div>
            <h3 className="font-black text-slate-800 text-base md:text-lg leading-snug">
              {currentQuestion.prompt}
            </h3>
          </div>

          {/* 3D Model / Net Visual Container */}
          <div className="flex-1 w-full max-w-[360px] flex flex-col items-center justify-center relative min-h-[170px] my-2 bg-gradient-to-b from-sky-50/40 to-slate-50 border border-slate-200/80 rounded-2xl p-2">
            <AnimatePresence mode="wait">
              {isUnfolded ? (
                <SvgNetVisual key="net" shape={currentQuestion.shape} />
              ) : (
                <SvgShapeVisual
                  key="3d"
                  shape={currentQuestion.shape}
                  isRotating={phase === "playing"}
                />
              )}
            </AnimatePresence>

            {/* Toggle 3D / Net Button */}
            <button
              onPointerDown={(e) => {
                e.stopPropagation();
                setIsUnfolded((v) => !v);
              }}
              className="absolute bottom-2 right-2 flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-300 bg-white/90 text-slate-700 text-xs font-bold shadow-sm hover:bg-slate-100 transition-all"
            >
              {isUnfolded ? (
                <>
                  <RotateCw size={12} />
                  <span>3D View</span>
                </>
              ) : (
                <>
                  <Layers size={12} />
                  <span>Buka Jaring</span>
                </>
              )}
            </button>
          </div>

          {/* Properties Badges */}
          <div className="grid grid-cols-3 gap-2 w-full max-w-sm">
            <div className="bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-2 text-center">
              <p className="text-base font-black text-slate-800">{currentQuestion.shape.faces}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase">Sisi</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-2 text-center">
              <p className="text-base font-black text-slate-800">{currentQuestion.shape.edges}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase">Rusuk</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-2 text-center">
              <p className="text-base font-black text-slate-800">
                {currentQuestion.shape.vertices}
              </p>
              <p className="text-[10px] font-bold text-slate-500 uppercase">Titik Sudut</p>
            </div>
          </div>

          {/* Educational Fact Footer */}
          <div className="w-full mt-2 py-1.5 px-3 bg-slate-100/70 border border-slate-200 rounded-xl text-center">
            <p className="text-xs text-slate-600 font-medium truncate">
              {currentQuestion.shape.fact}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: TIM MERAH (P2 Options) */}
        <div className="flex flex-col bg-white rounded-2xl shadow-lg border-2 border-rose-800 overflow-hidden w-64 md:w-80 flex-shrink-0">
          <div className="flex items-center justify-between px-4 py-2.5 bg-rose-900 text-white shadow-inner">
            <span className="text-[11px] font-bold text-rose-200 uppercase tracking-widest">
              Layar Kanan
            </span>
            <h2 className="font-black text-sm tracking-wider">TIM MERAH</h2>
          </div>
          <div className="flex-1 flex flex-col justify-center p-3 gap-2.5 bg-slate-50">
            {p2Options.map((opt, idx) => {
              const isWrong = p2Wrong === opt;
              const isCorrect = p2Correct === opt;
              return (
                <motion.button
                  key={`p2-opt-${idx}-${opt}`}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    handleAnswer(2, opt);
                  }}
                  animate={{
                    scale: isWrong ? [1, 0.95, 1] : isCorrect ? [1, 1.03, 1] : 1,
                  }}
                  className={`min-h-[64px] px-4 py-2 text-right font-bold text-sm md:text-base rounded-xl border-2 shadow-sm active:translate-y-0.5 transition-all flex items-center justify-between ${
                    isCorrect
                      ? "bg-emerald-100 border-emerald-500 text-emerald-800"
                      : isWrong
                      ? "bg-rose-100 border-rose-500 text-rose-800"
                      : "bg-white border-slate-200 text-slate-800 hover:border-rose-300 hover:bg-rose-50/50"
                  }`}
                  style={{ touchAction: "manipulation" }}
                >
                  {isCorrect && <ShieldCheck size={18} className="text-emerald-600 flex-shrink-0" />}
                  <span className="leading-snug flex-1">{opt}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── PRE-GAME SETUP MODAL ── */}
      <GameSetupModal
        isOpen={phase === "setup"}
        gameTitle="Geometric Shapes"
        gameSubtitle="Pilih tingkat kesulitan bangun ruang dan durasi permainan"
        defaultDifficulty={difficulty}
        defaultDuration={duration}
        onStart={handleStartGame}
      />

      {/* ── COUNTDOWN 3-2-1 OVERLAY ── */}
      <AnimatePresence>
        {phase === "countdown" && (
          <motion.div
            key="countdown-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-sky-950/70 backdrop-blur-md"
          >
            <motion.div
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-8xl md:text-9xl font-black text-white drop-shadow-2xl font-mono"
            >
              {countdown > 0 ? countdown : "MULAI!"}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── VICTORY RESULT MODAL ── */}
      <VictoryResultModal
        isOpen={phase === "finished"}
        winner={winner}
        p1Score={p1Score}
        p2Score={p2Score}
        p1Label="Tim Biru"
        p2Label="Tim Merah"
        onRematch={() => handleStartGame({ difficulty, duration })}
      />
    </div>
  );
}
