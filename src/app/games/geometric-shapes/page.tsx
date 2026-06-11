"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { VictoryResultModal } from "@/components/game/VictoryResultModal";
import { GameHeader } from "@/components/game/GameHeader";

type Phase = "intro" | "playing" | "finished";
type ShapeId = "cube" | "prism" | "cylinder" | "cone" | "pyramid" | "sphere";
type Player = 1 | 2;

interface Shape {
  id: ShapeId;
  name: string;
  nameId: string;
  emoji: string;
  color: string;
  volume: string;
  surfaceArea: string;
  faces: number;
  edges: number;
  vertices: number;
  fun: string;
}

const SHAPES: Shape[] = [
  { id: "cube", name: "Cube", nameId: "Kubus", emoji: "🎲", color: "#3b82f6", volume: "s³", surfaceArea: "6s²", faces: 6, edges: 12, vertices: 8, fun: "Semua rusuk sama panjang" },
  { id: "prism", name: "Triangular Prism", nameId: "Prisma Segitiga", emoji: "🔺", color: "#10b981", volume: "½ × a × t × p", surfaceArea: "2×Atriangle + 3×Arect", faces: 5, edges: 9, vertices: 6, fun: "Penampang berbentuk segitiga" },
  { id: "cylinder", name: "Cylinder", nameId: "Tabung/Silinder", emoji: "🥫", color: "#f59e0b", volume: "πr²t", surfaceArea: "2πr² + 2πrt", faces: 3, edges: 2, vertices: 0, fun: "2 lingkaran + 1 selimut melengkung" },
  { id: "cone", name: "Cone", nameId: "Kerucut", emoji: "🍦", color: "#ef4444", volume: "⅓πr²t", surfaceArea: "πr² + πrs", faces: 2, edges: 1, vertices: 1, fun: "Titik puncak disebut apex" },
  { id: "pyramid", name: "Square Pyramid", nameId: "Limas Segiempat", emoji: "🔶", color: "#8b5cf6", volume: "⅓ × s² × t", surfaceArea: "s² + 2sl", faces: 5, edges: 8, vertices: 5, fun: "Seperti piramida Mesir" },
  { id: "sphere", name: "Sphere", nameId: "Bola", emoji: "🌐", color: "#06b6d4", volume: "⁴⁄₃πr³", surfaceArea: "4πr²", faces: 1, edges: 0, vertices: 0, fun: "Setiap titik sama jauh dari pusat" },
];

const FORMULA_CARDS = SHAPES.map((s) => [
  { shapeId: s.id, type: "volume" as const, formula: `V = ${s.volume}`, label: "Volume" },
  { shapeId: s.id, type: "surface" as const, formula: `SA = ${s.surfaceArea}`, label: "Luas Permukaan" },
]).flat();

// ─── 3D Shape visual ───
function ShapeVisual({ shape, isUnfolded }: { shape: Shape; isUnfolded: boolean }) {
  // Simple CSS-based 3D representation
  const size = "clamp(60px,10vw,140px)";

  return (
    <motion.div
      animate={{ rotateY: isUnfolded ? 0 : [0, 360], scale: isUnfolded ? 0.85 : 1 }}
      transition={{ duration: isUnfolded ? 0.4 : 4, repeat: isUnfolded ? 0 : Infinity, ease: "linear" }}
      className="flex flex-col items-center justify-center"
      style={{ width: size, height: size, filter: `drop-shadow(0 0 20px ${shape.color}60)` }}
    >
      <span style={{ fontSize: "clamp(52px,8.5vw,120px)", lineHeight: 1 }}>{shape.emoji}</span>
    </motion.div>
  );
}

// ─── Net (jaring-jaring) unfolded view ───
function NetView({ shape }: { shape: Shape }) {
  const nets: Record<ShapeId, string> = {
    cube: "🟦🟦\n🟦🟦🟦🟦\n🟦🟦",
    prism: "🔺\n🟩🟩🟩\n🔺",
    cylinder: "⭕\n▬▬▬\n⭕",
    cone: "⭕\n△",
    pyramid: "🟧\n△△△△",
    sphere: "🌐 (tidak bisa dibuka)",
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
      className="text-center font-mono font-bold" style={{ fontSize: "clamp(18px,2.8vw,38px)", lineHeight: 1.8, color: shape.color }}>
      {nets[shape.id].split("\n").map((row, i) => <div key={i}>{row}</div>)}
    </motion.div>
  );
}

// ─── Main Page ───
export default function GeometricShapesPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [selectedShape, setSelectedShape] = useState<Shape>(SHAPES[0]);
  const [isUnfolded, setIsUnfolded] = useState(false);
  const [p1Matched, setP1Matched] = useState<Set<string>>(new Set());
  const [p2Matched, setP2Matched] = useState<Set<string>>(new Set());
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [p1Wrong, setP1Wrong] = useState<string | null>(null);
  const [p2Wrong, setP2Wrong] = useState<string | null>(null);
  const [winner, setWinner] = useState<"p1" | "p2" | "draw" | null>(null);

  const totalFormulas = FORMULA_CARDS.length;
  const allMatched = p1Matched.size + p2Matched.size >= totalFormulas;

  const handleMatchFormula = (player: Player, card: typeof FORMULA_CARDS[0]) => {
    if (phase !== "playing") return;
    const isCorrect = card.shapeId === selectedShape.id;
    const matched = player === 1 ? p1Matched : p2Matched;
    const key = `${card.shapeId}-${card.type}`;

    if (matched.has(key)) return; // already matched

    if (isCorrect) {
      if (player === 1) {
        const nm = new Set(p1Matched); nm.add(key);
        setP1Matched(nm); setP1Score((s) => s + 10);
      } else {
        const nm = new Set(p2Matched); nm.add(key);
        setP2Matched(nm); setP2Score((s) => s + 10);
      }
      if (p1Matched.size + p2Matched.size + 1 >= totalFormulas) {
        setPhase("finished");
        const s1 = player === 1 ? p1Score + 10 : p1Score;
        const s2 = player === 2 ? p2Score + 10 : p2Score;
        setWinner(s1 > s2 ? "p1" : s2 > s1 ? "p2" : "draw");
      }
    } else {
      if (player === 1) { setP1Wrong(key); setTimeout(() => setP1Wrong(null), 600); setP1Score((s) => Math.max(0, s - 3)); }
      else { setP2Wrong(key); setTimeout(() => setP2Wrong(null), 600); setP2Score((s) => Math.max(0, s - 3)); }
    }
  };

  const handleReset = () => {
    setPhase("intro"); setSelectedShape(SHAPES[0]); setIsUnfolded(false);
    setP1Matched(new Set()); setP2Matched(new Set());
    setP1Score(0); setP2Score(0); setWinner(null); setP1Wrong(null); setP2Wrong(null);
  };

  const matchedFor = (card: typeof FORMULA_CARDS[0]) => {
    const key = `${card.shapeId}-${card.type}`;
    return p1Matched.has(key) || p2Matched.has(key);
  };



  // Progress logic based on a max score, e.g., total formulas * 10
  const maxScore = totalFormulas * 10;
  const p1Pct = Math.min(Math.max(p1Score, 0) / maxScore, 1) * 100;
  const p2Pct = Math.min(Math.max(p2Score, 0) / maxScore, 1) * 100;

  return (
    <div className="w-full h-full flex flex-col items-center bg-[#e0f2fe] relative overflow-hidden text-gray-900 font-sans">
      
      {/* TOP HEADER */}
      <GameHeader
        title="Geometric Shapes"
        subtitle="Jelajahi bangun ruang 3D & cocokkan rumusnya!"
      />

      {/* SCOREBOARD */}
      <div className="w-full z-10 flex-shrink-0" style={{ padding: "clamp(12px, 2vh, 24px) clamp(20px, 4vw, 60px) 0" }}>
         <div className="w-full bg-white border-2 border-gray-200 shadow-lg rounded-2xl flex flex-col" style={{ padding: "clamp(12px, 1.5vh, 20px)", gap: "clamp(8px, 1vh, 14px)" }}>

            {/* Tim Biru (P1) */}
            <div className="flex items-center gap-4 w-full">
               <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ background: "#1e3a8a" }}></div>
               <div className="w-24 font-bold tracking-wider flex-shrink-0" style={{ fontSize: "clamp(13px, 1.3vw, 18px)", color: "#1e3a8a" }}>TIM BIRU</div>
               <div className="flex-1 h-6 bg-[#e0f2fe] rounded-full border overflow-hidden relative shadow-inner" style={{ borderColor: "#b9ddf5" }}>
                  <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #1e3a8a, #3b82f6)" }} animate={{ width: `${p1Pct}%` }} transition={{ type: "spring" }} />
               </div>
               <div className="font-bold text-center rounded-xl border-2 shadow-sm" style={{ padding: "clamp(4px, 0.6vh, 8px) clamp(10px, 1.2vw, 20px)", fontSize: "clamp(13px, 1.3vw, 18px)", color: "#1e3a8a", borderColor: "#1e3a8a", background: "#eff6ff" }}>{p1Score}</div>
            </div>

            {/* Tim Merah (P2) */}
            <div className="flex items-center gap-4 w-full">
               <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ background: "#7f1d1d" }}></div>
               <div className="w-24 font-bold tracking-wider flex-shrink-0" style={{ fontSize: "clamp(13px, 1.3vw, 18px)", color: "#7f1d1d" }}>TIM MERAH</div>
               <div className="flex-1 h-6 bg-[#fef2f2] rounded-full border overflow-hidden relative shadow-inner" style={{ borderColor: "#f5c6c6" }}>
                  <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #7f1d1d, #ef4444)" }} animate={{ width: `${p2Pct}%` }} transition={{ type: "spring" }} />
               </div>
               <div className="font-bold text-center rounded-xl border-2 shadow-sm" style={{ padding: "clamp(4px, 0.6vh, 8px) clamp(10px, 1.2vw, 20px)", fontSize: "clamp(13px, 1.3vw, 18px)", color: "#7f1d1d", borderColor: "#7f1d1d", background: "#fef2f2" }}>{p2Score}</div>
            </div>

         </div>
      </div>

      {/* MAIN CONTENT PANELS */}
      <div className="flex-1 w-full z-10 flex gap-6 min-h-0" style={{ padding: "clamp(4px,0.8vh,10px) clamp(20px,4vw,60px) clamp(12px,2vh,24px)" }}>

        {/* LEFT: P1 formula cards (TIM BIRU) */}
        <div className="flex flex-col bg-white rounded-2xl shadow-lg border-2 overflow-hidden w-full h-full" style={{ borderColor: "#1e3a8a", width: "clamp(200px,25vw,300px)" }}>
          <div className="flex items-center justify-center text-white shadow-inner relative bg-[#1e1b4b]" style={{ padding: "clamp(12px,1.8vh,22px) clamp(16px,2.5vw,32px)" }}>
            <h2 className="font-bold tracking-widest text-center" style={{ fontSize: "clamp(16px, 1.5vw, 24px)" }}>TIM BIRU</h2>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto bg-[#f8fafc]" style={{ padding: "clamp(10px,1.5vh,18px)", gap: "clamp(6px,0.8vh,12px)" }}>
            {FORMULA_CARDS.filter((_, i) => i % 2 === 0).map((card) => {
              const key = `${card.shapeId}-${card.type}`;
              const isMatched = matchedFor(card);
              const isWrong = p1Wrong === key;
              const shape = SHAPES.find((s) => s.id === card.shapeId)!;
              return (
                <motion.button key={key}
                  onPointerDown={(e) => { e.stopPropagation(); if (!isMatched) handleMatchFormula(1, card); }}
                  animate={{ scale: isWrong ? [1, 0.9, 1] : 1, background: isMatched ? "#d1fae5" : isWrong ? "#fee2e2" : "white" }}
                  className="text-left font-bold rounded-xl shadow-sm border-2 active:translate-y-0.5 transition-all"
                  style={{ borderColor: isMatched ? "#10b981" : isWrong ? "#ef4444" : "#e5e7eb", color: isMatched ? "#059669" : "#374151", padding: "clamp(6px,0.9vh,12px) clamp(8px,1vw,14px)", fontSize: "clamp(12px,1.5vw,16px)", opacity: isMatched ? 0.6 : 1, textDecoration: isMatched ? "line-through" : "none", touchAction: "manipulation" }}
                >
                  <span className="text-gray-500">{card.label}: {card.formula}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* CENTER: Shape viewer */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4 min-w-0 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          {/* Shape selector */}
          <div className="flex gap-2 flex-wrap justify-center">
            {SHAPES.map((s) => (
              <motion.button key={s.id}
                onPointerDown={(e) => { e.stopPropagation(); setSelectedShape(s); setIsUnfolded(false); }}
                animate={{ background: selectedShape.id === s.id ? `${s.color}25` : "#f3f4f6" }}
                className="flex flex-col items-center gap-1 font-bold shadow-sm active:translate-y-0.5 transition-all"
                style={{ border: `2px solid ${selectedShape.id === s.id ? s.color : "#e5e7eb"}`, borderRadius: "12px", padding: "clamp(6px,0.9vh,12px) clamp(10px,1.4vw,18px)", color: selectedShape.id === s.id ? s.color : "#4b5563", fontSize: "clamp(9px,1vw,13px)", touchAction: "manipulation" }}
              >
                <span style={{ fontSize: "clamp(18px,2.8vw,38px)" }}>{s.emoji}</span>
                <span>{s.nameId}</span>
              </motion.button>
            ))}
          </div>

          {/* Main visual + info */}
          <div className="flex flex-col items-center gap-4 w-full border-2 border-gray-100 rounded-2xl p-6 bg-[#f8fafc]" style={{ maxWidth: "clamp(300px,50vw,600px)" }}>
            <AnimatePresence mode="wait">
              {isUnfolded
                ? <NetView key="net" shape={selectedShape} />
                : <ShapeVisual key="3d" shape={selectedShape} isUnfolded={false} />
              }
            </AnimatePresence>

            <motion.button
              onPointerDown={(e) => { e.stopPropagation(); setIsUnfolded((v) => !v); }}
              whileTap={{ scale: 0.92 }}
              className="font-bold shadow-sm active:translate-y-0.5 transition-all"
              style={{ background: `white`, color: selectedShape.color, border: `2px solid ${selectedShape.color}`, borderRadius: "12px", padding: "clamp(8px,1.2vh,16px) clamp(20px,3vw,40px)", fontSize: "clamp(11px,1.4vw,20px)", touchAction: "manipulation" }}
            >
              {isUnfolded ? "🔁 3D View" : "📐 Buka Jaring-Jaring"}
            </motion.button>

            {/* Properties */}
            <div className="grid grid-cols-3 gap-3 w-full text-center mt-2">
              {[
                { label: "Sisi/Bidang", value: selectedShape.faces },
                { label: "Rusuk", value: selectedShape.edges },
                { label: "Titik Sudut", value: selectedShape.vertices },
              ].map((p) => (
                <div key={p.label} className="rounded-xl py-2 bg-white shadow-sm border border-gray-200">
                  <p className="font-black text-gray-800" style={{ fontSize: "clamp(14px,2vw,28px)" }}>{p.value}</p>
                  <p className="font-bold text-gray-500" style={{ fontSize: "clamp(7px,0.8vw,11px)" }}>{p.label}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-center font-bold" style={{ fontSize: "clamp(10px,1.2vw,14px)" }}>💡 {selectedShape.fun}</p>
          </div>

          <p className="text-gray-400 text-center font-bold" style={{ fontSize: "clamp(10px,1.2vw,14px)" }}>
            Pilih bentuk geometri di atas, lalu cocokkan rumus volume & luasnya di panel tim kamu!
          </p>
        </div>

        {/* RIGHT: P2 formula cards (TIM MERAH) */}
        <div className="flex flex-col bg-white rounded-2xl shadow-lg border-2 overflow-hidden w-full h-full" style={{ borderColor: "#7f1d1d", width: "clamp(200px,25vw,300px)" }}>
          <div className="flex items-center justify-center text-white shadow-inner relative bg-[#7f1d1d]" style={{ padding: "clamp(12px,1.8vh,22px) clamp(16px,2.5vw,32px)" }}>
            <h2 className="font-bold tracking-widest text-center" style={{ fontSize: "clamp(16px, 1.5vw, 24px)" }}>TIM MERAH</h2>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto bg-[#f8fafc]" style={{ padding: "clamp(10px,1.5vh,18px)", gap: "clamp(6px,0.8vh,12px)" }}>
            {FORMULA_CARDS.filter((_, i) => i % 2 === 1).map((card) => {
              const key = `${card.shapeId}-${card.type}`;
              const isMatched = matchedFor(card);
              const isWrong = p2Wrong === key;
              const shape = SHAPES.find((s) => s.id === card.shapeId)!;
              return (
                <motion.button key={key}
                  onPointerDown={(e) => { e.stopPropagation(); if (!isMatched) handleMatchFormula(2, card); }}
                  animate={{ scale: isWrong ? [1, 0.9, 1] : 1, background: isMatched ? "#d1fae5" : isWrong ? "#fee2e2" : "white" }}
                  className="text-right font-bold rounded-xl shadow-sm border-2 active:translate-y-0.5 transition-all"
                  style={{ borderColor: isMatched ? "#10b981" : isWrong ? "#ef4444" : "#e5e7eb", color: isMatched ? "#059669" : "#374151", padding: "clamp(6px,0.9vh,12px) clamp(8px,1vw,14px)", fontSize: "clamp(12px,1.5vw,16px)", opacity: isMatched ? 0.6 : 1, textDecoration: isMatched ? "line-through" : "none", touchAction: "manipulation" }}
                >
                  <span className="text-gray-500">{card.label}: {card.formula}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* INTRO OVERLAY */}
      <AnimatePresence>
        {phase === "intro" && (
          <motion.div
            className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-6"
            style={{ background: "rgba(224,242,254,0.95)", backdropFilter: "blur(12px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <span style={{ fontSize: "clamp(60px,10vw,120px)" }}>🔷</span>
            <div className="text-center">
              <h2 className="font-black text-[#0ea5e9]" style={{ fontSize: "clamp(32px,4vw,56px)" }}>Geometric Shapes</h2>
              <p className="text-gray-600 font-bold mt-2" style={{ fontSize: "clamp(16px,1.6vw,22px)" }}>Jelajahi bangun ruang 3D & cocokkan rumusnya!</p>
            </div>
            <motion.button onPointerDown={() => setPhase("playing")} whileTap={{ scale: 0.92 }}
              className="font-black border-2 border-b-4 active:translate-y-1 transition-all"
              style={{ background: "#3b82f6", borderColor: "#1d4ed8", color: "white", borderRadius: "16px", padding: "clamp(14px,2vh,24px) clamp(32px,5vw,64px)", fontSize: "clamp(16px,2.2vw,30px)", touchAction: "manipulation" }}>
              🔷 Mulai Eksplorasi
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>



      <VictoryResultModal isOpen={phase === "finished"} winner={winner} p1Score={p1Score} p2Score={p2Score} p1Label="Tim Biru" p2Label="Tim Merah" onRematch={handleReset} />
    </div>
  );
}
