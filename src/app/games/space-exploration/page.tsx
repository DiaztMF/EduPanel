"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { SOLAR_SYSTEM, ALL_MOONS, type Planet, type Moon } from "@/data/solar-system";
import { VictoryResultModal } from "@/components/game/VictoryResultModal";

type Phase = "intro" | "playing" | "finished";

// ─── Orbit ring + planet ───
function PlanetOrbit({ planet, index, selectedPlanet, onSelect }: {
  planet: Planet; index: number; selectedPlanet: string | null; onSelect: (id: string) => void;
}) {
  const isSelected = selectedPlanet === planet.id;
  const angleOffset = (index / SOLAR_SYSTEM.length) * 360;

  return (
    <g>
      {/* Orbit circle */}
      <circle cx="50%" cy="50%" r={planet.orbitRadius} fill="none"
        stroke="rgba(0,0,0,0.1)" strokeWidth="2" strokeDasharray="4 6" />
      {/* Planet */}
      <motion.text
        x={`calc(50% + ${planet.orbitRadius}px)`}
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontSize: planet.size,
          cursor: "pointer",
          filter: isSelected ? `drop-shadow(0 0 12px ${planet.color})` : "none",
          transformOrigin: "center",
        }}
        animate={{ rotate: angleOffset }}
        onClick={() => onSelect(planet.id)}
      >
        {planet.emoji}
      </motion.text>
    </g>
  );
}

// ─── Moon Card (draggable / tappable) ───
function MoonCard({ moon, isPlaced, onDrop }: {
  moon: Moon; isPlaced: boolean; onDrop: (moonId: string, planetId: string) => void;
}) {
  const [showTargets, setShowTargets] = useState(false);

  if (isPlaced) return null;

  return (
    <div className="relative">
      <motion.button
        onPointerDown={(e) => { e.stopPropagation(); setShowTargets((v) => !v); }}
        whileTap={{ scale: 0.88 }}
        className="flex flex-col items-center gap-1 touch-btn w-full bg-white shadow-sm border border-gray-200"
        style={{
          borderRadius: "12px", padding: "clamp(8px,1.2vh,16px) clamp(10px,1.5vw,20px)",
          touchAction: "manipulation",
        }}
      >
        <span style={{ fontSize: "clamp(22px,3.5vw,48px)" }}>{moon.emoji}</span>
        <span className="font-bold text-gray-700" style={{ fontSize: "clamp(8px,0.9vw,12px)" }}>{moon.name}</span>
      </motion.button>

      {/* Planet selection popup */}
      <AnimatePresence>
        {showTargets && (
          <motion.div
            initial={{ opacity: 0, x: -10, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
            className="absolute z-30 flex flex-col gap-1 p-2 rounded-xl bg-white shadow-xl border border-gray-200"
            style={{ top: 0, right: "110%", minWidth: "clamp(120px,16vw,200px)" }}
          >
            <p className="text-gray-500 text-center font-bold mb-1" style={{ fontSize: "clamp(8px,0.85vw,11px)" }}>Pilih planet:</p>
            {SOLAR_SYSTEM.filter((p) => p.moons.length > 0).map((p) => (
              <motion.button key={p.id}
                onPointerDown={(e) => { e.stopPropagation(); onDrop(moon.id, p.id); setShowTargets(false); }}
                whileTap={{ scale: 0.92 }}
                className="flex items-center gap-2 font-bold rounded-lg touch-btn shadow-sm"
                style={{ padding: "clamp(4px,0.6vh,8px) clamp(8px,1vw,14px)", background: `${p.color}15`, color: p.color, border: `1px solid ${p.color}40`, fontSize: "clamp(9px,1vw,14px)", touchAction: "manipulation" }}
              >
                <span>{p.emoji}</span><span>{p.name}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ───
export default function SpaceExplorationPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [placed, setPlaced] = useState<Record<string, string>>({}); // moonId → planetId
  const [correct, setCorrect] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<Set<string>>(new Set());
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  const totalMoons = ALL_MOONS.length;
  const correctCount = correct.size;
  const isComplete = correctCount === totalMoons;

  useEffect(() => {
    if (isComplete && phase === "playing") setPhase("finished");
  }, [isComplete, phase]);

  const handleDrop = useCallback((moonId: string, planetId: string) => {
    setTotalAttempts((a) => a + 1);
    const moon = ALL_MOONS.find((m) => m.id === moonId);
    if (!moon) return;

    const isCorrect = moon.planet === planetId;
    setPlaced((p) => ({ ...p, [moonId]: planetId }));

    if (isCorrect) {
      setCorrect((c) => new Set([...c, moonId]));
      setScore((s) => s + 15);
      // Remove from wrong if was wrong before
      setWrong((w) => { const nw = new Set(w); nw.delete(moonId); return nw; });
    } else {
      setWrong((w) => new Set([...w, moonId]));
      setScore((s) => Math.max(0, s - 5));
      // Remove the wrong placement after 1s
      setTimeout(() => setPlaced((p) => { const np = { ...p }; delete np[moonId]; return np; }), 1000);
    }
  }, []);

  const handleReset = () => {
    setPhase("intro"); setPlaced({}); setCorrect(new Set()); setWrong(new Set());
    setScore(0); setTotalAttempts(0); setSelectedPlanet(null);
  };

  const activePlanet = selectedPlanet ? SOLAR_SYSTEM.find((p) => p.id === selectedPlanet) : null;
  const unplacedMoons = ALL_MOONS.filter((m) => !correct.has(m.id));
  
  const isFullscreen = () => {
    if (typeof window !== "undefined" && document.fullscreenElement) {
      document.exitFullscreen();
    } else if (typeof window !== "undefined") {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  const progressPct = Math.min((correctCount / totalMoons) * 100, 100);

  return (
    <div className="w-full h-full flex flex-col items-center bg-[#e0f2fe] relative overflow-hidden text-gray-900 font-sans">
      
      {/* TOP HEADER */}
      <div className="w-full flex items-center justify-between px-6 py-4 shadow-sm bg-[#e0f2fe] z-10">
        <div className="w-32 flex justify-start">
        </div>
        <div className="flex-1 flex justify-center items-center gap-4">
          <div className="font-bold text-[#0ea5e9] tracking-wide" style={{ fontSize: "clamp(20px, 2vw, 32px)" }}>
             Space Exploration
          </div>
        </div>
        <div className="w-32 flex justify-end">
           <button onPointerDown={isFullscreen} className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-bold px-4 py-2 rounded-lg shadow-sm transition-colors">
             🖥️
           </button>
        </div>
      </div>



      {/* MAIN CONTENT PANELS */}
      <div className="flex-1 w-full max-w-7xl px-8 pb-24 z-10 flex gap-6 min-h-0">

        {/* LEFT: Planet panel (TIM BIRU style) */}
        <div className="flex flex-col bg-white rounded-2xl shadow-lg border-2 overflow-hidden h-full flex-shrink-0" style={{ borderColor: "#1e3a8a", width: "clamp(160px,20vw,280px)" }}>
          <div className="flex items-center justify-between text-white py-3 px-4 shadow-inner relative bg-[#1e1b4b]">
            <h2 className="font-bold tracking-widest text-left" style={{ fontSize: "clamp(12px, 1vw, 18px)" }}>PLANET TATA SURYA</h2>
            <div className="font-black bg-white/20 px-2 py-1 rounded-lg" style={{ fontSize: "clamp(10px, 1vw, 14px)" }}>{correctCount}/{totalMoons}</div>
          </div>
          <div className="flex-1 flex flex-col gap-2 p-4 bg-[#f8fafc] overflow-y-auto">
            {SOLAR_SYSTEM.map((p) => {
              const placedMoons = ALL_MOONS.filter((m) => m.planet === p.id && correct.has(m.id));
              const totalPlanetMoons = p.moons.length;
              const isSelected = selectedPlanet === p.id;

              return (
                <motion.button key={p.id}
                  onPointerDown={(e) => { e.stopPropagation(); setSelectedPlanet(isSelected ? null : p.id); }}
                  animate={{ background: isSelected ? `${p.color}25` : "#ffffff" }}
                  className="flex items-center gap-2 rounded-xl touch-btn text-left shadow-sm border-2"
                  style={{ padding: "clamp(6px,0.8vh,10px) clamp(8px,1vw,14px)", borderColor: isSelected ? p.color : "#e5e7eb", touchAction: "manipulation" }}
                >
                  <span style={{ fontSize: "clamp(16px,2.2vw,30px)" }}>{p.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 truncate" style={{ fontSize: "clamp(10px,1vw,14px)" }}>{p.name}</p>
                    {totalPlanetMoons > 0 && (
                      <p className="font-bold" style={{ fontSize: "clamp(8px,0.8vw,11px)", color: placedMoons.length === totalPlanetMoons ? "#10b981" : "#9ca3af" }}>
                        {placedMoons.length}/{totalPlanetMoons} bulan ✓
                      </p>
                    )}
                    {totalPlanetMoons === 0 && <p className="font-bold" style={{ fontSize: "clamp(8px,0.8vw,11px)", color: "#d1d5db" }}>Tidak ada bulan</p>}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* CENTER: Solar system visual */}
        <div className="flex-1 relative flex items-center justify-center min-h-0 bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="relative w-full h-full">
            {/* Sun */}
            <motion.div className="absolute" style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
              animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 3 }}>
              <span style={{ fontSize: "clamp(40px,6vw,80px)", filter: "drop-shadow(0 0 30px #f59e0b)" }}>☀️</span>
            </motion.div>

            {/* Planets around sun */}
            {SOLAR_SYSTEM.map((p, i) => {
              const angle = (i / SOLAR_SYSTEM.length) * Math.PI * 2 - Math.PI / 2;
              const r = Math.min(p.orbitRadius * 0.4, 280); // scale down for viewport
              const cx = 50; // percentage
              const cy = 50;
              const px = cx + (r / 3) * Math.cos(angle);
              const py = cy + (r / 3) * Math.sin(angle) * 0.55;

              const placedMoonsHere = ALL_MOONS.filter((m) => m.planet === p.id && correct.has(m.id));
              const isSelected = selectedPlanet === p.id;

              return (
                <motion.button key={p.id}
                  onPointerDown={(e) => { e.stopPropagation(); setSelectedPlanet(isSelected ? null : p.id); }}
                  className="absolute flex flex-col items-center touch-btn"
                  style={{ left: `${px}%`, top: `${py}%`, transform: "translate(-50%,-50%)", touchAction: "manipulation" }}
                  animate={{ scale: isSelected ? 1.2 : 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <span style={{ fontSize: p.size, filter: isSelected ? `drop-shadow(0 0 16px ${p.color})` : "none" }}>{p.emoji}</span>
                  <span className="font-bold bg-white/80 px-1 rounded" style={{ fontSize: "clamp(8px,0.8vw,12px)", color: p.color, marginTop: 2 }}>{p.name}</span>
                  {placedMoonsHere.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5">
                      {placedMoonsHere.map((m) => <span key={m.id} style={{ fontSize: "clamp(8px,1vw,14px)" }}>🌕</span>)}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Moon panel (TIM MERAH style) */}
        <div className="flex flex-col bg-white rounded-2xl shadow-lg border-2 overflow-hidden h-full flex-shrink-0" style={{ borderColor: "#b91c1c", width: "clamp(160px,20vw,280px)" }}>
          <div className="flex items-center justify-between text-white py-3 px-4 shadow-inner relative bg-[#7f1d1d]">
            <h2 className="font-bold tracking-widest text-left" style={{ fontSize: "clamp(12px, 1vw, 18px)" }}>SATELIT ALAMI</h2>
            <div className="font-black bg-white/20 px-2 py-1 rounded-lg" style={{ fontSize: "clamp(10px, 1vw, 14px)" }}>{score} pts</div>
          </div>
          <div className="flex-1 flex flex-col gap-2 p-4 bg-[#f8fafc] overflow-y-auto">
            {/* Selected planet info */}
            {activePlanet && (
              <motion.div key={activePlanet.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-sm border p-3 mb-2" style={{ borderColor: activePlanet.color }}>
                <p className="font-black text-gray-800" style={{ fontSize: "clamp(12px,1.6vw,20px)" }}>{activePlanet.emoji} {activePlanet.name}</p>
                <p className="text-gray-500 mt-1 font-bold" style={{ fontSize: "clamp(8px,0.9vw,12px)" }}>{activePlanet.fact}</p>
                {activePlanet.moons.length > 0 && (
                  <p className="mt-2 font-bold" style={{ fontSize: "clamp(8px,0.85vw,11px)", color: activePlanet.color }}>
                    {activePlanet.moons.length} bulan: {activePlanet.moons.map((m) => m.name).join(", ")}
                  </p>
                )}
              </motion.div>
            )}

            <p className="font-bold text-gray-400 text-center uppercase mb-2" style={{ fontSize: "clamp(10px,1vw,14px)", letterSpacing: "0.1em" }}>🌕 {unplacedMoons.length} Tersisa</p>

            <div className="flex flex-col gap-3">
              {unplacedMoons.map((moon) => (
                <MoonCard key={moon.id} moon={moon} isPlaced={correct.has(moon.id)} onDrop={handleDrop} />
              ))}
              {unplacedMoons.length === 0 && (
                <p className="text-center text-green-500 font-bold p-4" style={{ fontSize: "clamp(12px,1.2vw,16px)" }}>Semua bulan telah dipetakan! 🎉</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Intro overlay */}
      <AnimatePresence>
        {phase === "intro" && (
          <motion.div
            className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-6"
            style={{ background: "rgba(224,242,254,0.95)", backdropFilter: "blur(12px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <span style={{ fontSize: "clamp(60px,10vw,120px)" }}>🚀</span>
            <div className="text-center">
              <h2 className="font-black text-[#0ea5e9]" style={{ fontSize: "clamp(32px,4vw,56px)" }}>Space Exploration</h2>
              <p className="text-gray-600 font-bold mt-2" style={{ fontSize: "clamp(16px,1.6vw,22px)" }}>Petakan semua satelit alami (bulan) ke planet asalnya!</p>
            </div>
            <motion.button onPointerDown={() => setPhase("playing")} whileTap={{ scale: 0.92 }}
              className="touch-btn font-black border-2 border-b-4"
              style={{ background: "#3b82f6", borderColor: "#1d4ed8", color: "white", borderRadius: "16px", padding: "clamp(14px,2vh,24px) clamp(32px,5vw,64px)", fontSize: "clamp(16px,2.2vw,30px)", touchAction: "manipulation" }}>
              🚀 Mulai Penjelajahan
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTTOM MENU BUTTON */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
        <Link href="/" className="bg-white hover:bg-gray-50 border-2 border-[#bae6fd] text-gray-700 font-bold px-8 py-3 rounded-full shadow-lg transition-all flex items-center gap-2" style={{ textDecoration: "none", fontSize: "clamp(14px, 1.5vw, 20px)" }}>
          ← Menu Utama
        </Link>
      </div>

      <VictoryResultModal isOpen={phase === "finished"} winner={null} p1Score={score} p2Score={totalAttempts} p1Label={`Skor: ${score}`} p2Label={`Percobaan: ${totalAttempts}`} onRematch={handleReset} rematchLabel="Coba Lagi" />
    </div>
  );
}
