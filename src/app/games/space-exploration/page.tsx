"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameHeader } from "@/components/game/GameHeader";
import { SOLAR_SYSTEM, ALL_MOONS } from "@/data/solar-system";
import { VictoryResultModal } from "@/components/game/VictoryResultModal";

type Phase = "intro" | "playing" | "finished";

// ─── SVG coordinate system ───
const SUN_X = 270;
const SUN_Y = 450;
const VB_W  = 1600;
const VB_H  = 900;

// Orbit ellipse params + fixed angle for each planet
const ORBIT_CFG = [
  { id: "mercury", rx: 105,  ry: 40,  angleDeg: -50 },
  { id: "venus",   rx: 185,  ry: 70,  angleDeg:  28 },
  { id: "earth",   rx: 272,  ry: 103, angleDeg: -38 },
  { id: "mars",    rx: 362,  ry: 138, angleDeg:  14 },
  { id: "jupiter", rx: 490,  ry: 186, angleDeg: -22 },
  { id: "saturn",  rx: 625,  ry: 237, angleDeg:  36 },
  { id: "uranus",  rx: 748,  ry: 284, angleDeg: -46 },
  { id: "neptune", rx: 870,  ry: 330, angleDeg:  10 },
];

// Deterministic star field
const STARS = Array.from({ length: 110 }, (_, i) => ({
  cx: ((i * 233 + 71) % (VB_W - 60)) + 30,
  cy: ((i * 157 + 43) % (VB_H - 40)) + 20,
  r:  i % 5 === 0 ? 2.5 : i % 3 === 0 ? 1.5 : 1,
  op: 0.25 + (i % 7) * 0.1,
}));

// ─── Main Page ───
export default function SpaceExplorationPage() {
  const [phase, setPhase]               = useState<Phase>("intro");
  const [correct, setCorrect]           = useState<Set<string>>(new Set());
  const [score, setScore]               = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [wrongGuess, setWrongGuess]     = useState<string | null>(null);
  const [feedback, setFeedback]         = useState<{ type: "correct" | "wrong", msg: string } | null>(null);

  const totalMoons   = ALL_MOONS.length;
  const correctCount = correct.size;

  // Ref mirrors `correct` so handleDrop can check completion without stale closure
  const correctRef = useRef<Set<string>>(new Set());

  const unplacedMoons = ALL_MOONS.filter((m) => !correct.has(m.id));
  const currentMoon = unplacedMoons[0] || null; // The active flashcard question

  const handlePlanetGuess = (planetId: string) => {
    if (phase !== "playing" || !currentMoon) return;
    
    setTotalAttempts((a) => a + 1);
    
    if (currentMoon.planet === planetId) {
      // Correct guess
      const nextCorrect = new Set([...correctRef.current, currentMoon.id]);
      correctRef.current = nextCorrect;
      setCorrect(nextCorrect);
      setScore((s) => s + 15);
      setWrongGuess(null);
      setFeedback({ type: "correct", msg: "+15" });
      setTimeout(() => setFeedback(null), 600);
      
      // Complete check
      if (nextCorrect.size === totalMoons) setPhase("finished");
    } else {
      // Wrong guess
      setWrongGuess(planetId);
      setFeedback({ type: "wrong", msg: "SALAH!" });
      setTimeout(() => { setWrongGuess(null); setFeedback(null); }, 600); // clear shake & feedback
    }
  };

  const handleReset = () => {
    correctRef.current = new Set();
    setPhase("intro"); 
    setCorrect(new Set()); 
    setScore(0); 
    setTotalAttempts(0);
    setWrongGuess(null);
    setFeedback(null);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#e0f2fe] relative overflow-hidden font-sans">

      {/* ── SHARED GAME HEADER ── */}
      <GameHeader title="Space Exploration" subtitle="Jelajah Tata Surya" />

      {/* ── MAIN 3-COLUMN LAYOUT ── */}
      <div
        className="flex-1 w-full flex min-h-0"
        style={{ gap: "clamp(12px,1.6vw,22px)", padding: "clamp(8px,1.2vh,16px) clamp(20px,4vw,60px) clamp(12px,2vh,24px)" }}
      >
        {/* LEFT: Planet list */}
        <div
          className="flex flex-col bg-white rounded-2xl shadow-lg border-2 overflow-hidden h-full flex-shrink-0"
          style={{ borderColor: "#1e3a8a", width: "clamp(140px,17vw,250px)" }}
        >
          <div className="flex items-center justify-between text-white shadow-inner flex-shrink-0 bg-[#1e1b4b]"
            style={{ padding: "clamp(10px,1.5vh,18px) clamp(14px,2vw,24px)" }}>
            <h2 className="font-bold tracking-widest" style={{ fontSize: "clamp(11px,1.1vw,17px)" }}>PLANET</h2>
            <div className="font-black bg-white/20 px-3 py-1 rounded-lg" style={{ fontSize: "clamp(11px,1vw,15px)" }}>{correctCount}/{totalMoons}</div>
          </div>
          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto" style={{ padding: "clamp(8px,1.2vh,14px)", gap: "clamp(6px,0.8vh,12px)", background: "#f8fafc" }}>
            {SOLAR_SYSTEM.map((p) => {
              const placed_ = ALL_MOONS.filter((m) => m.planet === p.id && correct.has(m.id));
              const isWrong = wrongGuess === p.id;
              
              return (
                <motion.button key={p.id}
                  onPointerDown={(e) => { e.stopPropagation(); handlePlanetGuess(p.id); }}
                  animate={isWrong ? { x: [-4, 4, -4, 4, 0], background: "#fee2e2", borderColor: "#ef4444" } : { x: 0, background: "#ffffff", borderColor: "#e5e7eb" }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-2 rounded-xl text-left shadow-sm border-2 flex-shrink-0 active:translate-y-0.5 transition-all"
                  style={{ padding: "clamp(6px,0.8vh,12px) clamp(8px,1vw,16px)", touchAction: "manipulation" }}
                >
                  <span style={{ fontSize: "clamp(14px,2vw,26px)", flexShrink: 0 }}>{p.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 truncate" style={{ fontSize: "clamp(9px,0.9vw,13px)" }}>{p.name}</p>
                    <p className="font-bold" style={{ fontSize: "clamp(8px,0.75vw,10px)", color: placed_.length === p.moons.length && p.moons.length > 0 ? "#10b981" : "#9ca3af" }}>
                      {p.moons.length > 0 ? `${placed_.length}/${p.moons.length} bulan ✓` : "Tidak ada bulan"}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* CENTER: Solar system visual */}
        <div className="flex-1 relative rounded-2xl overflow-hidden shadow-xl border border-[#1e3a5e]/40 min-w-0">
          {/* SVG layer — space bg + stars + orbit rings */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
          >
            {/* Background */}
            <rect width={VB_W} height={VB_H} fill="#040d21" />

            {/* Stars */}
            {STARS.map((s, i) => (
              <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="white" opacity={s.op} />
            ))}

            {/* Sun glow */}
            <defs>
              <radialGradient id="sunGlow">
                <stop offset="0%"   stopColor="#fff7ed" />
                <stop offset="30%"  stopColor="#fbbf24" />
                <stop offset="70%"  stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx={SUN_X} cy={SUN_Y} r={130} fill="url(#sunGlow)" />

            {/* Orbit rings */}
            {ORBIT_CFG.map((cfg) => (
              <ellipse
                key={cfg.id}
                cx={SUN_X} cy={SUN_Y}
                rx={cfg.rx} ry={cfg.ry}
                fill="none"
                stroke="rgba(147,210,255,0.22)"
                strokeWidth="1.5"
              />
            ))}
          </svg>

          {/* Feedback Overlay */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: -20 }}
                className="absolute font-black z-30 pointer-events-none"
                style={{
                  top: "20%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: feedback.type === "correct" ? "#10b981" : "#ef4444",
                  fontSize: "clamp(60px, 8vw, 100px)",
                  filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.6))",
                }}
              >
                {feedback.msg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Planets */}
          {SOLAR_SYSTEM.map((planet, i) => {
            const cfg   = ORBIT_CFG[i];
            const rad   = cfg.angleDeg * Math.PI / 180;
            const pxPct = ((SUN_X + cfg.rx * Math.cos(rad)) / VB_W) * 100;
            const pyPct = ((SUN_Y + cfg.ry * Math.sin(rad)) / VB_H) * 100;
            const isWrong = wrongGuess === planet.id;
            const correctMoons = ALL_MOONS.filter((m) => m.planet === planet.id && correct.has(m.id));

            return (
              <motion.button
                key={planet.id}
                className="absolute flex flex-col items-center group"
                style={{ left: `${pxPct}%`, top: `${pyPct}%`, transform: "translate(-50%,-50%)", touchAction: "manipulation", zIndex: 10 }}
                animate={isWrong ? { x: [-8, 8, -8, 8, 0], scale: 1.1 } : { x: 0, scale: 1 }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ default: { type: "spring", stiffness: 220, damping: 18 }, x: { type: "tween", duration: 0.4 } }}
                onPointerDown={(e) => { e.stopPropagation(); handlePlanetGuess(planet.id); }}
              >
                {/* Planet Emoji */}
                <span style={{ fontSize: planet.size, filter: isWrong ? "drop-shadow(0 0 16px #ef4444)" : "drop-shadow(0 0 8px rgba(255,255,255,0.1))", display: "block" }}>
                  {planet.emoji}
                </span>
                
                {/* Planet Name */}
                <span className="font-bold" style={{ fontSize: "clamp(8px,0.8vw,12px)", color: isWrong ? "#ef4444" : "white", background: "rgba(0,0,0,0.6)", borderRadius: "6px", padding: "2px 6px", marginTop: "4px", whiteSpace: "nowrap" }}>
                  {planet.name}
                </span>

                {/* Placed Moons Icons */}
                {correctMoons.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {correctMoons.map((m) => <span key={m.id} style={{ fontSize: "clamp(8px,1vw,14px)" }}>🌕</span>)}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* RIGHT: Active Question Panel */}
        <div
          className="flex flex-col bg-white rounded-2xl shadow-lg border-2 overflow-hidden h-full flex-shrink-0"
          style={{ borderColor: "#7f1d1d", width: "clamp(160px,20vw,300px)" }}
        >
          <div className="flex items-center justify-between text-white shadow-inner flex-shrink-0 bg-[#7f1d1d]"
            style={{ padding: "clamp(10px,1.5vh,18px) clamp(14px,2vw,24px)" }}>
            <h2 className="font-bold tracking-widest" style={{ fontSize: "clamp(11px,1.1vw,17px)" }}>TEBAK BULAN</h2>
            <div className="font-black bg-white/20 px-3 py-1 rounded-lg" style={{ fontSize: "clamp(11px,1vw,15px)" }}>{score} pts</div>
          </div>
          
          <div className="flex-1 flex flex-col bg-[#f8fafc] p-4 relative justify-center items-center">
            <p className="font-bold text-gray-400 text-center uppercase absolute top-4" style={{ fontSize: "clamp(10px,1vw,14px)", letterSpacing: "0.1em" }}>
              🌕 {unplacedMoons.length} TERSISA
            </p>

            <AnimatePresence mode="wait">
              {currentMoon ? (
                <motion.div
                  key={currentMoon.id}
                  initial={{ scale: 0.8, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex flex-col items-center justify-center text-center gap-4 w-full"
                >
                  <p className="text-gray-500 font-bold" style={{ fontSize: "clamp(12px,1.2vw,16px)" }}>Bulan apakah ini?</p>
                  
                  <div className="bg-white rounded-2xl shadow-md border-2 border-red-100 p-6 w-full flex flex-col items-center">
                    <span style={{ fontSize: "clamp(50px, 6vw, 100px)", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}>
                      {currentMoon.emoji}
                    </span>
                    <h3 className="font-black text-gray-800 mt-2" style={{ fontSize: "clamp(20px, 2.2vw, 32px)" }}>
                      {currentMoon.name}
                    </h3>
                  </div>

                  <div className="bg-red-50 text-red-900 rounded-xl p-4 border border-red-100 w-full mt-2 shadow-inner">
                    <p className="font-bold text-sm uppercase tracking-widest text-red-700/60 mb-1" style={{ fontSize: "clamp(8px,0.8vw,11px)" }}>CLUE</p>
                    <p className="font-bold" style={{ fontSize: "clamp(11px,1.2vw,15px)" }}>{currentMoon.fact}</p>
                  </div>
                  
                  <p className="text-gray-400 font-bold animate-pulse mt-4" style={{ fontSize: "clamp(10px,1vw,14px)" }}>
                    👈 Sentuh planet yang benar!
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center text-center h-full gap-4"
                >
                  <span style={{ fontSize: "clamp(60px,8vw,100px)" }}>🎉</span>
                  <p className="font-black text-green-500" style={{ fontSize: "clamp(18px,2vw,28px)" }}>Semua satelit terpetakan!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Intro overlay */}
      <AnimatePresence>
        {phase === "intro" && (
          <motion.div
            className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-6"
            style={{ background: "rgba(4,13,33,0.92)", backdropFilter: "blur(16px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <span style={{ fontSize: "clamp(56px,9vw,110px)" }}>🚀</span>
            <div className="text-center">
              <h2 className="font-black text-[#38bdf8]" style={{ fontSize: "clamp(28px,3.5vw,52px)" }}>Space Exploration</h2>
              <p className="text-gray-300 font-bold mt-2 max-w-2xl px-4" style={{ fontSize: "clamp(14px,1.4vw,20px)" }}>
                Baca fakta tentang satelit alami (bulan) di kartu kuis, lalu tebak dengan menyentuh planet asalnya di tata surya!
              </p>
            </div>
            <motion.button
              onPointerDown={() => setPhase("playing")} whileTap={{ scale: 0.92 }}
              className="font-black border-2 border-b-4 active:translate-y-1 transition-all"
              style={{ background: "#3b82f6", borderColor: "#1d4ed8", color: "white", borderRadius: "16px", padding: "clamp(12px,1.8vh,22px) clamp(28px,4.5vw,58px)", fontSize: "clamp(14px,2vw,28px)", touchAction: "manipulation" }}
            >
              🚀 Mulai Penjelajahan
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <VictoryResultModal
        isOpen={phase === "finished"} winner={null}
        p1Score={score} p2Score={totalAttempts}
        p1Label={`Skor: ${score}`} p2Label={`Percobaan: ${totalAttempts}`}
        onRematch={handleReset} rematchLabel="Coba Lagi"
      />
    </div>
  );
}
