"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, Rocket, HelpCircle, CheckCircle2, Orbit } from "lucide-react";
import { GameHeader } from "@/components/game/GameHeader";
import { GameSetupModal } from "@/components/game/GameSetupModal";
import { SOLAR_SYSTEM, getMoonsByDifficulty, type Moon, type SpaceDifficulty } from "@/data/solar-system";
import { VictoryResultModal } from "@/components/game/VictoryResultModal";

type Phase = "setup" | "countdown" | "playing" | "finished";

// ─── SVG coordinate system ───
const SUN_X = 270;
const SUN_Y = 450;
const VB_W = 1600;
const VB_H = 900;

// Orbit ellipse params + fixed angle for each planet
const ORBIT_CFG = [
  { id: "mercury", rx: 105, ry: 40, angleDeg: -50 },
  { id: "venus", rx: 185, ry: 70, angleDeg: 28 },
  { id: "earth", rx: 272, ry: 103, angleDeg: -38 },
  { id: "mars", rx: 362, ry: 138, angleDeg: 14 },
  { id: "jupiter", rx: 490, ry: 186, angleDeg: -22 },
  { id: "saturn", rx: 625, ry: 237, angleDeg: 36 },
  { id: "uranus", rx: 748, ry: 284, angleDeg: -46 },
  { id: "neptune", rx: 870, ry: 330, angleDeg: 10 },
];

// Deterministic star field
const STARS = Array.from({ length: 110 }, (_, i) => ({
  cx: ((i * 233 + 71) % (VB_W - 60)) + 30,
  cy: ((i * 157 + 43) % (VB_H - 40)) + 20,
  r: i % 5 === 0 ? 2.5 : i % 3 === 0 ? 1.5 : 1,
  op: 0.25 + (i % 7) * 0.1,
}));

// Planet SVG Sphere component
function PlanetSphere({ id, color, sizePx }: { id: string; color: string; sizePx: number }) {
  return (
    <div
      style={{ width: `${sizePx}px`, height: `${sizePx}px` }}
      className="relative flex items-center justify-center select-none"
    >
      <svg viewBox="0 0 60 60" className="w-full h-full drop-shadow-lg">
        <defs>
          <radialGradient id={`planet-grad-${id}`} cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="40%" stopColor={color} />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>
        </defs>

        {/* Saturn Rings */}
        {id === "saturn" && (
          <ellipse
            cx="30"
            cy="30"
            rx="28"
            ry="9"
            fill="none"
            stroke="#fde047"
            strokeWidth="3.5"
            strokeOpacity="0.85"
            transform="rotate(-20 30 30)"
          />
        )}

        {/* Planet Sphere Body */}
        <circle cx="30" cy="30" r="22" fill={`url(#planet-grad-${id})`} />

        {/* Earth Continents hint */}
        {id === "earth" && (
          <path
            d="M 22 20 Q 28 16 35 22 Q 32 30 26 34 Z"
            fill="#10b981"
            fillOpacity="0.75"
          />
        )}

        {/* Jupiter Band Stripes hint */}
        {id === "jupiter" && (
          <g opacity="0.4" stroke="#ffffff" strokeWidth="1.5">
            <line x1="12" y1="26" x2="48" y2="26" />
            <line x1="10" y1="32" x2="50" y2="32" />
          </g>
        )}
      </svg>
    </div>
  );
}

export default function SpaceExplorationPage() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [countdown, setCountdown] = useState(3);
  const [difficulty, setDifficulty] = useState<SpaceDifficulty>("medium");
  const [duration, setDuration] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);

  const [activeMoons, setActiveMoons] = useState<Moon[]>(() => getMoonsByDifficulty("medium"));
  const [correct, setCorrect] = useState<Set<string>>(new Set());
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [wrongGuess, setWrongGuess] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "correct" | "wrong"; msg: string } | null>(null);

  const correctRef = useRef<Set<string>>(new Set());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const totalMoons = activeMoons.length;
  const correctCount = correct.size;
  const unplacedMoons = activeMoons.filter((m) => !correct.has(m.id));
  const currentMoon = unplacedMoons[0] || null;

  // Handle Game Start from Setup Modal
  const handleStartGame = (config: { difficulty: SpaceDifficulty; duration: number }) => {
    setDifficulty(config.difficulty);
    setDuration(config.duration);
    setTimeLeft(config.duration);

    const moons = getMoonsByDifficulty(config.difficulty);
    setActiveMoons(moons);
    setCorrect(new Set());
    correctRef.current = new Set();
    setTotalAttempts(0);
    setWrongGuess(null);
    setFeedback(null);

    setCountdown(3);
    setPhase("countdown");
  };

  // Countdown timer
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

  // Main Playing Timer
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

  const handlePlanetGuess = (planetId: string) => {
    if (phase !== "playing" || !currentMoon) return;

    setTotalAttempts((a) => a + 1);

    if (currentMoon.planet === planetId) {
      const nextCorrect = new Set([...correctRef.current, currentMoon.id]);
      correctRef.current = nextCorrect;
      setCorrect(nextCorrect);
      setWrongGuess(null);
      setFeedback({ type: "correct", msg: "BENAR!" });
      setTimeout(() => setFeedback(null), 600);

      if (nextCorrect.size === totalMoons) {
        setTimeout(() => setPhase("finished"), 700);
      }
    } else {
      setWrongGuess(planetId);
      setFeedback({ type: "wrong", msg: "SALAH!" });
      setTimeout(() => {
        setWrongGuess(null);
        setFeedback(null);
      }, 600);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#e0f2fe] relative overflow-hidden font-sans select-none">
      {/* ── SHARED GAME HEADER ── */}
      <GameHeader
        title="Space Exploration"
        subtitle="Jelajah & Petakan Satelit Tata Surya"
        timerDuration={duration}
        isTimerRunning={phase === "playing"}
        onTimerComplete={() => setPhase("finished")}
        rightSlot={
          <button
            onPointerDown={() => setPhase("setup")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-300 bg-white/80 hover:bg-sky-50 text-sky-800 text-xs font-bold shadow-sm transition-all"
          >
            <SlidersHorizontal size={14} />
            <span>Atur Game</span>
          </button>
        }
      />

      {/* ── MAIN 3-COLUMN LAYOUT ── */}
      <div
        className="flex-1 w-full flex min-h-0"
        style={{
          gap: "clamp(10px,1.4vw,20px)",
          padding: "clamp(6px,1vh,14px) clamp(16px,3.5vw,48px) clamp(10px,1.8vh,20px)",
        }}
      >
        {/* LEFT: Planet list */}
        <div
          className="flex flex-col bg-white rounded-2xl shadow-lg border-2 border-blue-900 overflow-hidden h-full flex-shrink-0"
          style={{ width: "clamp(150px,18vw,260px)" }}
        >
          <div className="flex items-center justify-between text-white shadow-inner flex-shrink-0 bg-blue-950 px-4 py-2.5">
            <h2 className="font-black text-xs md:text-sm tracking-wider">DAFTAR PLANET</h2>
            <div className="font-bold bg-white/20 px-2.5 py-0.5 rounded-lg text-xs">
              {correctCount}/{totalMoons}
            </div>
          </div>
          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto p-2.5 gap-2 bg-slate-50">
            {SOLAR_SYSTEM.map((p) => {
              const planetActiveMoons = activeMoons.filter((m) => m.planet === p.id);
              const placed = planetActiveMoons.filter((m) => correct.has(m.id));
              const isWrong = wrongGuess === p.id;

              return (
                <motion.button
                  key={p.id}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    handlePlanetGuess(p.id);
                  }}
                  animate={
                    isWrong
                      ? { x: [-4, 4, -4, 4, 0], backgroundColor: "#fee2e2", borderColor: "#ef4444" }
                      : { x: 0, backgroundColor: "#ffffff", borderColor: "#e2e8f0" }
                  }
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-2.5 rounded-xl text-left shadow-sm border-2 flex-shrink-0 p-2 active:translate-y-0.5 transition-all hover:border-sky-300"
                  style={{ touchAction: "manipulation" }}
                >
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: p.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 text-xs md:text-sm truncate">{p.name}</p>
                    <p
                      className="font-medium text-[11px]"
                      style={{
                        color:
                          planetActiveMoons.length > 0 && placed.length === planetActiveMoons.length
                            ? "#059669"
                            : "#64748b",
                      }}
                    >
                      {planetActiveMoons.length > 0
                        ? `${placed.length}/${planetActiveMoons.length} bulan`
                        : "Tanpa bulan"}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* CENTER: Solar system visual */}
        <div className="flex-1 relative rounded-2xl overflow-hidden shadow-xl border border-sky-950/40 min-w-0">
          {/* SVG layer: space bg + stars + orbit rings */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
          >
            <rect width={VB_W} height={VB_H} fill="#030712" />

            {STARS.map((s, i) => (
              <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="white" opacity={s.op} />
            ))}

            <defs>
              <radialGradient id="sunGlow">
                <stop offset="0%" stopColor="#fff7ed" />
                <stop offset="30%" stopColor="#fbbf24" />
                <stop offset="70%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx={SUN_X} cy={SUN_Y} r={130} fill="url(#sunGlow)" />

            {ORBIT_CFG.map((cfg) => (
              <ellipse
                key={cfg.id}
                cx={SUN_X}
                cy={SUN_Y}
                rx={cfg.rx}
                ry={cfg.ry}
                fill="none"
                stroke="rgba(147,210,255,0.2)"
                strokeWidth="1.5"
              />
            ))}
          </svg>

          {/* Feedback Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: -20 }}
                  className={`font-black text-6xl md:text-8xl drop-shadow-2xl ${
                    feedback.type === "correct" ? "text-emerald-400" : "text-rose-500"
                  }`}
                >
                  {feedback.msg}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Planets on Orbit */}
          {SOLAR_SYSTEM.map((planet, i) => {
            const cfg = ORBIT_CFG[i];
            const rad = (cfg.angleDeg * Math.PI) / 180;
            const pxPct = ((SUN_X + cfg.rx * Math.cos(rad)) / VB_W) * 100;
            const pyPct = ((SUN_Y + cfg.ry * Math.sin(rad)) / VB_H) * 100;
            const isWrong = wrongGuess === planet.id;
            const planetActiveMoons = activeMoons.filter((m) => m.planet === planet.id);
            const placed = planetActiveMoons.filter((m) => correct.has(m.id));

            return (
              <motion.button
                key={planet.id}
                className="absolute flex flex-col items-center group"
                style={{
                  left: `${pxPct}%`,
                  top: `${pyPct}%`,
                  transform: "translate(-50%,-50%)",
                  touchAction: "manipulation",
                  zIndex: 10,
                }}
                animate={isWrong ? { x: [-8, 8, -8, 8, 0], scale: 1.1 } : { x: 0, scale: 1 }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.92 }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  handlePlanetGuess(planet.id);
                }}
              >
                <PlanetSphere id={planet.id} color={planet.color} sizePx={48} />

                <span
                  className={`font-bold text-[10px] md:text-xs rounded-md px-1.5 py-0.5 mt-1 whitespace-nowrap border ${
                    isWrong
                      ? "bg-rose-950/80 text-rose-300 border-rose-500"
                      : "bg-slate-900/80 text-white border-slate-700"
                  }`}
                >
                  {planet.name}
                </span>

                {placed.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {placed.map((m) => (
                      <span
                        key={m.id}
                        className="w-2.5 h-2.5 rounded-full bg-amber-300 border border-amber-500"
                        title={m.name}
                      />
                    ))}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* RIGHT: Active Question Panel */}
        <div
          className="flex flex-col bg-white rounded-2xl shadow-lg border-2 border-rose-900 overflow-hidden h-full flex-shrink-0"
          style={{ width: "clamp(180px,22vw,300px)" }}
        >
          <div className="flex items-center justify-between text-white shadow-inner flex-shrink-0 bg-rose-950 px-4 py-2.5">
            <h2 className="font-black text-xs md:text-sm tracking-wider">TEBAK BULAN</h2>
            <div className="font-bold bg-white/20 px-2.5 py-0.5 rounded-lg text-xs">
              {totalAttempts} Percobaan
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-slate-50 p-4 relative justify-center items-center">
            <div className="flex items-center gap-1 text-slate-500 text-xs font-bold uppercase tracking-wider absolute top-4">
              <Orbit size={14} />
              <span>{unplacedMoons.length} Bulan Tersisa</span>
            </div>

            <AnimatePresence mode="wait">
              {currentMoon ? (
                <motion.div
                  key={currentMoon.id}
                  initial={{ scale: 0.85, opacity: 0, y: 15 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.85, opacity: 0, y: -15 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="flex flex-col items-center justify-center text-center gap-3 w-full"
                >
                  <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                    Satelit Alami Siapakah Ini?
                  </p>

                  <div className="bg-white rounded-2xl shadow-md border-2 border-rose-100 p-5 w-full flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-slate-400 via-amber-100 to-white border-2 border-slate-300 shadow-inner flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-slate-400/40" />
                    </div>
                    <h3 className="font-black text-slate-800 text-lg md:text-xl mt-3">
                      {currentMoon.name}
                    </h3>
                  </div>

                  <div className="bg-rose-50 text-rose-950 rounded-xl p-3 border border-rose-200 w-full shadow-inner text-left">
                    <p className="font-bold text-[10px] uppercase tracking-wider text-rose-700/80 mb-1">
                      Karakteristik & Fakta
                    </p>
                    <p className="font-semibold text-xs leading-relaxed">{currentMoon.fact}</p>
                  </div>

                  <p className="text-slate-500 text-xs font-bold mt-2">
                    Sentuh planet induk yang benar di orbit!
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center text-center h-full gap-3 p-4"
                >
                  <CheckCircle2 size={48} className="text-emerald-500" />
                  <p className="font-black text-emerald-700 text-base md:text-lg">
                    Semua satelit berhasil dipetakan!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── PRE-GAME SETUP MODAL ── */}
      <GameSetupModal
        isOpen={phase === "setup"}
        gameTitle="Space Exploration"
        gameSubtitle="Pilih cakupan satelit tata surya dan durasi misi"
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
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-8xl md:text-9xl font-black text-white drop-shadow-2xl font-mono"
            >
              {countdown > 0 ? countdown : "LUNCUR!"}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── VICTORY RESULT MODAL ── */}
      <VictoryResultModal
        isOpen={phase === "finished"}
        winner={null}
        p1Score={correctCount}
        p2Score={totalAttempts}
        p1Label="Satelit Terpetakan"
        p2Label="Total Percobaan"
        onRematch={() => handleStartGame({ difficulty, duration })}
        rematchLabel="Misi Baru"
      />
    </div>
  );
}
