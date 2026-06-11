"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { BOARD, getRandomQuestion, type BoardQuestion } from "@/data/board-game";
import { VictoryResultModal } from "@/components/game/VictoryResultModal";
import { GameHeader } from "@/components/game/GameHeader";

type GamePhase = "intro" | "rolling" | "moving" | "quiz" | "effect" | "finished";

const TOTAL_TILES = BOARD.length - 1; // 30
const DICE_FACES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

// ─── Tile component ───
function Tile({ tile, p1Here, p2Here, highlighted }: {
  tile: typeof BOARD[0]; p1Here: boolean; p2Here: boolean; highlighted: boolean;
}) {
  const bgMap = {
    normal: "#ffffff",
    quiz: "#dbeafe", // blue-100
    bonus: "#d1fae5", // emerald-100
    penalty: "#fee2e2", // red-100
    rest: "#ffedd5", // orange-100
    finish: "#fef08a", // yellow-200
  };
  const borderMap = {
    normal: "#e5e7eb", // gray-200
    quiz: "#93c5fd", // blue-300
    bonus: "#6ee7b7", // emerald-300
    penalty: "#fca5a5", // red-300
    rest: "#fdba74", // orange-300
    finish: "#fde047", // yellow-300
  };

  return (
    <motion.div
      animate={{ scale: highlighted ? 1.12 : 1, boxShadow: highlighted ? "0 0 16px rgba(14,165,233,0.6)" : "0 1px 3px rgba(0,0,0,0.1)" }}
      className="flex flex-col items-center justify-center rounded-xl relative"
      style={{
        background: bgMap[tile.type], border: `2px solid ${borderMap[tile.type]}`,
        aspectRatio: "1", minWidth: 0,
      }}
    >
      <span style={{ fontSize: "clamp(10px,1.6vw,22px)", lineHeight: 1 }}>{tile.emoji}</span>
      {tile.id % 5 === 0 && (
        <span className="text-gray-400 font-bold absolute bottom-1 right-1" style={{ fontSize: "clamp(6px,0.7vw,9px)" }}>{tile.id}</span>
      )}
      {/* Player tokens */}
      <div className="absolute -top-2 -right-2 flex gap-1 z-10">
        {p1Here && <div className="rounded-full shadow-md" style={{ width: "clamp(12px,1.5vw,20px)", height: "clamp(12px,1.5vw,20px)", background: "#3b82f6", border: "2px solid white" }} />}
        {p2Here && <div className="rounded-full shadow-md" style={{ width: "clamp(12px,1.5vw,20px)", height: "clamp(12px,1.5vw,20px)", background: "#ef4444", border: "2px solid white" }} />}
      </div>
    </motion.div>
  );
}

// ─── Dice ───
function DiceDisplay({ value, rolling }: { value: number; rolling: boolean }) {
  return (
    <motion.div
      animate={rolling ? { rotate: [0, 180, 360, 540, 720], scale: [1, 1.2, 1] } : { rotate: 0, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="text-gray-800"
      style={{ fontSize: "clamp(60px,8vw,100px)", lineHeight: 1, filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }}
    >
      {DICE_FACES[value - 1] ?? "⚀"}
    </motion.div>
  );
}

// ─── Main Page ───
export default function KingOfJunglePage() {
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [turn, setTurn] = useState<1 | 2>(1);
  const [p1Pos, setP1Pos] = useState(0);
  const [p2Pos, setP2Pos] = useState(0);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<BoardQuestion | null>(null);
  const [effectMsg, setEffectMsg] = useState("");
  const [skippedTurns, setSkippedTurns] = useState<{ 1: number; 2: number }>({ 1: 0, 2: 0 });
  const [winner, setWinner] = useState<"p1" | "p2" | "draw" | null>(null);
  const [questionResult, setQuestionResult] = useState<"correct" | "wrong" | null>(null);

  const currentPos = turn === 1 ? p1Pos : p2Pos;
  const setPos = turn === 1 ? setP1Pos : setP2Pos;
  const setScore = turn === 1 ? setP1Score : setP2Score;

  const nextTurn = useCallback(() => {
    setTurn((t) => t === 1 ? 2 : 1);
    setPhase("rolling");
    setCurrentQuestion(null);
    setEffectMsg("");
    setQuestionResult(null);
  }, []);

  const applyTileEffect = useCallback((pos: number) => {
    const tile = BOARD[pos];
    if (!tile) return;

    if (pos >= TOTAL_TILES) {
      setPhase("finished");
      setWinner(turn === 1 ? "p1" : "p2");
      return;
    }

    if (tile.type === "quiz") {
      setCurrentQuestion(getRandomQuestion());
      setPhase("quiz");
    } else if (tile.type === "bonus" && tile.jump) {
      setEffectMsg(`🎉 ${tile.effect ?? ""}`);
      setPhase("effect");
      setTimeout(() => {
        const newPos = Math.min(pos + tile.jump!, TOTAL_TILES);
        setPos(newPos);
        if (newPos >= TOTAL_TILES) { setPhase("finished"); setWinner(turn === 1 ? "p1" : "p2"); }
        else { setTimeout(nextTurn, 1200); }
      }, 1500);
    } else if (tile.type === "penalty" && tile.jump) {
      setEffectMsg(`😱 ${tile.effect ?? ""}`);
      setPhase("effect");
      setTimeout(() => {
        setPos((p) => Math.max(0, p + tile.jump!));
        setTimeout(nextTurn, 1200);
      }, 1500);
    } else if (tile.type === "rest") {
      setEffectMsg(`💤 ${tile.effect ?? ""}`);
      setPhase("effect");
      setSkippedTurns((s) => ({ ...s, [turn]: 1 }));
      setTimeout(nextTurn, 1800);
    } else {
      setTimeout(nextTurn, 600);
    }
  }, [turn, nextTurn, setPos]);

  const rollDice = useCallback(() => {
    if (phase !== "rolling") return;

    // Check skip
    if (skippedTurns[turn] > 0) {
      setSkippedTurns((s) => ({ ...s, [turn]: 0 }));
      setEffectMsg("💤 Giliran dilewati!");
      setPhase("effect");
      setTimeout(nextTurn, 1500);
      return;
    }

    setIsRolling(true);
    const roll = Math.floor(Math.random() * 6) + 1;

    setTimeout(() => {
      setDiceValue(roll);
      setIsRolling(false);
      const newPos = Math.min(currentPos + roll, TOTAL_TILES);
      setPos(newPos);
      setPhase("moving");
      setTimeout(() => applyTileEffect(newPos), 600);
    }, 700);
  }, [phase, turn, skippedTurns, currentPos, setPos, applyTileEffect, nextTurn]);

  const handleAnswer = (idx: number) => {
    if (!currentQuestion || phase !== "quiz") return;
    const correct = idx === currentQuestion.answer;
    setQuestionResult(correct ? "correct" : "wrong");
    if (correct) {
      setScore((s) => s + 10);
      setTimeout(() => { setPhase("effect"); setEffectMsg("✅ Jawaban Benar! +10 poin"); setTimeout(nextTurn, 1200); }, 700);
    } else {
      setTimeout(() => { setPhase("effect"); setEffectMsg("❌ Jawaban Salah! Tetap di tempat."); setTimeout(nextTurn, 1200); }, 700);
    }
  };

  const handleReset = () => {
    setPhase("intro"); setTurn(1); setP1Pos(0); setP2Pos(0);
    setP1Score(0); setP2Score(0); setDiceValue(1); setWinner(null);
    setSkippedTurns({ 1: 0, 2: 0 }); setCurrentQuestion(null); setEffectMsg("");
    setQuestionResult(null);
  };

  const isFullscreen = () => {
    if (typeof window !== "undefined" && document.fullscreenElement) {
      document.exitFullscreen();
    } else if (typeof window !== "undefined") {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  // Build board grid (5 rows × 6 cols, snake pattern)
  const tilesPerRow = 6;
  const rows: typeof BOARD[0][][] = [];
  for (let r = 0; r < 5; r++) {
    const start = r * tilesPerRow;
    const row = BOARD.slice(start, start + tilesPerRow + 1);
    rows.push(r % 2 === 0 ? row : [...row].reverse());
  }

  const p1Pct = Math.min((p1Pos / TOTAL_TILES) * 100, 100);
  const p2Pct = Math.min((p2Pos / TOTAL_TILES) * 100, 100);

  return (
    <div className="w-full h-full flex flex-col items-center bg-[#e0f2fe] relative overflow-hidden text-gray-900 font-sans">
      
      {/* TOP HEADER */}
      <GameHeader
        title="King of the Jungle"
        subtitle="Board game hutan 30 petak"
      />

      {/* SCOREBOARD (PROGRESS BARS IN A BEIGE BOARD) */}
      <div className="w-full max-w-6xl px-8 py-4 z-10 flex flex-col items-center">
         <div className="w-full bg-[#ffedd5] border border-[#fdba74] shadow-sm rounded-2xl p-4 flex flex-col gap-3 relative">
           
           {/* Removed Turn Indicator from here */}

           {/* Tim Merah (P2) */}
           <div className="flex items-center gap-4 w-full mt-2">
              <div className="w-6 h-6 rounded-full bg-[#ef4444] shadow-inner flex-shrink-0 border-2 border-white"></div>
              <div className="w-20 font-bold text-[#b91c1c] tracking-wider" style={{ fontSize: "clamp(12px, 1.5vw, 18px)" }}>MERAH</div>
              <div className="flex-1 h-6 bg-[#fef3c7] rounded-full border-2 border-[#fcd34d] overflow-hidden relative shadow-inner">
                 <motion.div className="h-full bg-gradient-to-r from-[#fcd34d] to-[#fbbf24]" animate={{ width: `${p2Pct}%` }} transition={{ type: "spring" }} />
              </div>
              <div className="w-24 bg-white font-bold text-center py-1 rounded-lg border shadow-sm text-gray-700 flex flex-col" style={{ lineHeight: 1.1 }}>
                 <span>{p2Score} pts</span>
                 <span className="text-[10px] text-gray-400">Petak {p2Pos}</span>
              </div>
           </div>

           {/* Tim Biru (P1) */}
           <div className="flex items-center gap-4 w-full">
              <div className="w-6 h-6 rounded-full bg-[#3b82f6] shadow-inner flex-shrink-0 border-2 border-white"></div>
              <div className="w-20 font-bold text-[#1d4ed8] tracking-wider" style={{ fontSize: "clamp(12px, 1.5vw, 18px)" }}>BIRU</div>
              <div className="flex-1 h-6 bg-[#fef3c7] rounded-full border-2 border-[#fcd34d] overflow-hidden relative shadow-inner">
                 <motion.div className="h-full bg-gradient-to-r from-[#fcd34d] to-[#fbbf24]" animate={{ width: `${p1Pct}%` }} transition={{ type: "spring" }} />
              </div>
              <div className="w-24 bg-white font-bold text-center py-1 rounded-lg border shadow-sm text-gray-700 flex flex-col" style={{ lineHeight: 1.1 }}>
                 <span>{p1Score} pts</span>
                 <span className="text-[10px] text-gray-400">Petak {p1Pos}</span>
              </div>
           </div>

         </div>
      </div>

      {/* MAIN: Board + Sidebar */}
      <div className="flex-1 w-full max-w-7xl flex gap-6 min-h-0 px-8 pb-8">

        {/* Board grid */}
        <div className="flex-1 min-w-0 bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-4">
          <div className="h-full grid" style={{ gridTemplateRows: "repeat(5,1fr)", gap: "clamp(6px,1vh,12px)" }}>
            {rows.map((row, ri) => (
              <div key={ri} className="grid" style={{ gridTemplateColumns: `repeat(${tilesPerRow + 1},1fr)`, gap: "clamp(6px,1vw,12px)" }}>
                {row.map((tile) => (
                  <Tile key={tile.id} tile={tile}
                    p1Here={p1Pos === tile.id} p2Here={p2Pos === tile.id}
                    highlighted={phase === "moving" && (turn === 1 ? p1Pos : p2Pos) === tile.id} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Dice + actions */}
        <div className="flex flex-col items-center justify-center gap-6 flex-shrink-0 bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6" style={{ width: "clamp(200px,20vw,280px)" }}>
          <DiceDisplay value={diceValue} rolling={isRolling} />

          <motion.button
            onPointerDown={rollDice}
            whileTap={{ scale: 0.88 }}
            disabled={phase !== "rolling"}
            className="touch-btn font-black w-full shadow-sm"
            style={{
              background: phase === "rolling" ? "#10b981" : "#f3f4f6",
              color: phase === "rolling" ? "white" : "#9ca3af",
              border: `2px solid ${phase === "rolling" ? "#059669" : "#e5e7eb"}`,
              borderRadius: "14px",
              fontSize: "clamp(16px,2vw,24px)",
              padding: "16px 0",
              boxShadow: phase === "rolling" ? "0 4px 14px rgba(16, 185, 129, 0.4)" : "none",
              touchAction: "manipulation",
            }}
          >
            {phase === "rolling" ? "🎲 Lempar Dadu" : phase === "quiz" ? "❓ Jawab Kuis" : "⏳ Tunggu..."}
          </motion.button>

          {/* Legend */}
          <div className="flex flex-col gap-2 w-full mt-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="text-center font-bold text-gray-500 mb-2 text-sm uppercase tracking-wider">Keterangan</h3>
            {[
              { emoji: "❓", color: "#3b82f6", label: "Kuis +10" },
              { emoji: "⭐", color: "#10b981", label: "Bonus Maju" },
              { emoji: "🌧️", color: "#ef4444", label: "Penalti Mundur" },
              { emoji: "💤", color: "#f59e0b", label: "Istirahat" },
              { emoji: "👑", color: "#eab308", label: "Finish!" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-3 font-bold" style={{ fontSize: "clamp(12px,1.2vw,14px)" }}>
                <span className="w-6 text-center">{l.emoji}</span>
                <span style={{ color: l.color }}>{l.label}</span>
              </div>
            ))}
            
            {/* Turn Indicator Moved Here */}
            <div className="mt-4 pt-4 border-t border-gray-200 w-full flex justify-center">
              <div className="bg-white px-4 py-2 rounded-full border border-[#fdba74] shadow-sm font-bold text-gray-700 text-center" style={{ fontSize: "clamp(12px, 1.2vw, 14px)" }}>
                {turn === 1 ? "🔵 Giliran TIM BIRU" : "🔴 Giliran TIM MERAH"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUIZ OVERLAY */}
      <AnimatePresence>
        {phase === "quiz" && currentQuestion && (
          <motion.div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-6"
            style={{ background: "rgba(224,242,254,0.95)", backdropFilter: "blur(12px)", padding: "clamp(20px,4vw,60px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="bg-white rounded-3xl shadow-xl border-4 w-full max-w-4xl text-center" style={{ borderColor: turn === 1 ? "#3b82f6" : "#ef4444", padding: "clamp(24px,4vh,48px)" }}>
              <p className="font-bold mb-4 uppercase tracking-widest" style={{ color: turn === 1 ? "#3b82f6" : "#ef4444", fontSize: "clamp(12px,1.5vw,18px)" }}>
                🌿 {currentQuestion.category} · {turn === 1 ? "TIM BIRU" : "TIM MERAH"}
              </p>
              <p className="font-black text-gray-800" style={{ fontSize: "clamp(20px,3.5vw,48px)", lineHeight: 1.2 }}>
                {currentQuestion.question}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full max-w-4xl">
              {currentQuestion.options.map((opt, i) => {
                const isCorrect = i === currentQuestion.answer;
                const flash = questionResult !== null ? (isCorrect ? "correct" : "neutral") : "idle";
                return (
                  <motion.button key={i}
                    onPointerDown={() => handleAnswer(i)}
                    animate={{ background: flash === "correct" ? "#10b981" : "white", color: flash === "correct" ? "white" : "#1f2937" }}
                    className="touch-btn font-bold shadow-md rounded-2xl"
                    style={{ minHeight: "clamp(64px, 10vh, 96px)", border: `4px solid ${flash === "correct" ? "#059669" : "#e5e7eb"}`, fontSize: "clamp(16px,2.5vw,32px)", touchAction: "manipulation" }}
                    disabled={questionResult !== null}
                  >
                    {opt}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EFFECT OVERLAY */}
      <AnimatePresence>
        {phase === "effect" && effectMsg && (
          <motion.div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              initial={{ scale: 0.5, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 1.2, opacity: 0 }}
              className="bg-white text-center rounded-3xl shadow-2xl border-4 border-[#0ea5e9]"
              style={{ padding: "clamp(20px,3vh,40px) clamp(32px,5vw,80px)", fontSize: "clamp(24px,4vw,56px)", fontWeight: 900, color: "#0ea5e9" }}>
              {effectMsg}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INTRO */}
      <AnimatePresence>
        {phase === "intro" && (
          <motion.div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-6"
            style={{ background: "rgba(224,242,254,0.95)", backdropFilter: "blur(12px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <span style={{ fontSize: "clamp(60px,10vw,120px)" }}>🌿</span>
            <div className="text-center">
              <h2 className="font-black text-[#0ea5e9]" style={{ fontSize: "clamp(32px,4vw,56px)" }}>King of the Jungle</h2>
              <p className="text-gray-600 font-bold mt-2" style={{ fontSize: "clamp(16px,1.6vw,22px)" }}>Board game hutan 30 petak — Lempar dadu & jawab kuis alam!</p>
              <p className="text-gray-400 font-bold mt-1" style={{ fontSize: "clamp(12px,1.2vw,16px)" }}>Giliran bergantian · Pertama tiba di FINISH menang!</p>
            </div>
            <motion.button onPointerDown={() => setPhase("rolling")} whileTap={{ scale: 0.92 }}
              className="touch-btn font-black border-2 border-b-4"
              style={{ background: "#10b981", borderColor: "#059669", color: "white", borderRadius: "16px", padding: "clamp(14px,2vh,24px) clamp(32px,5vw,64px)", fontSize: "clamp(16px,2.2vw,30px)", touchAction: "manipulation" }}>
              🌿 Mulai Permainan!
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>



      <VictoryResultModal isOpen={phase === "finished"} winner={winner} p1Score={p1Score} p2Score={p2Score} p1Label="Tim Biru" p2Label="Tim Merah" onRematch={handleReset} />
    </div>
  );
}
