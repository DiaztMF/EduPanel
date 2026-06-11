"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { GlobalTimer } from "@/components/game/GlobalTimer";
import { VictoryResultModal } from "@/components/game/VictoryResultModal";
import { type VocabPair, getRoundPairs } from "@/data/vocab-pairs";

const GAME_DURATION = 60;
const PAIRS_PER_ROUND = 5;
type Phase = "countdown" | "playing" | "finished";

interface MatchState {
  pairs: VocabPair[];
  selected: string | null;   // selected English word id
  matched: Set<string>;      // matched pair ids
  score: number;
  wrongFlash: string | null; // id of wrong attempt
  lastCorrect: string | null;
}

function initState(): MatchState {
  return { pairs: getRoundPairs(PAIRS_PER_ROUND), selected: null, matched: new Set(), score: 0, wrongFlash: null, lastCorrect: null };
}

// ─── Player Match Panel ───
function MatchPanel({ player, state, onSelectEnglish, onSelectIndonesian, disabled }: {
  player: 1 | 2;
  state: MatchState;
  onSelectEnglish: (id: string) => void;
  onSelectIndonesian: (id: string) => void;
  disabled: boolean;
}) {
  const isP1 = player === 1;
  const headerColor = isP1 ? "#1e1b4b" : "#7f1d1d";
  const borderColor = isP1 ? "#1e3a8a" : "#b91c1c";
  const teamName = isP1 ? "TIM BIRU" : "TIM MERAH";
  const { pairs, selected, matched, wrongFlash, lastCorrect } = state;

  // Shuffle Indonesian side independently
  const shuffledIds = useMemo(() => {
    return [...pairs.map((p) => p.id)].sort(() => Math.random() - 0.5);
  }, [pairs]);

  const allMatched = matched.size === pairs.length;

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-lg border-2 overflow-hidden w-full h-full" style={{ borderColor: borderColor }}>
      <div className="flex items-center justify-between text-white py-3 px-6 shadow-inner relative" style={{ backgroundColor: headerColor }}>
        <h2 className="font-bold tracking-widest text-center" style={{ fontSize: "clamp(16px, 1.5vw, 24px)" }}>{teamName}</h2>
        <div className="font-black bg-white/20 px-3 py-1 rounded-lg" style={{ fontSize: "clamp(14px, 1.5vw, 20px)" }}>{state.score} pts</div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start p-4 bg-[#f8fafc]">
        {/* All matched celebration */}
        {allMatched ? (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex-1 flex flex-col items-center justify-center gap-3">
            <span style={{ fontSize: "clamp(48px,8vw,96px)" }}>🎉</span>
            <p className="font-black text-center" style={{ color: "#10b981", fontSize: "clamp(16px,2.5vw,36px)" }}>Semua Cocok!</p>
            <p className="text-gray-400 font-bold" style={{ fontSize: "clamp(10px,1.2vw,16px)" }}>Ronde baru segera dimulai...</p>
          </motion.div>
        ) : (
          <div className="w-full flex-1 grid grid-cols-2 gap-4 min-h-0" style={{ alignContent: "start" }}>
            {/* Left: English words */}
            <div className="flex flex-col gap-3">
              <p className="text-center font-bold text-gray-400 uppercase tracking-widest" style={{ fontSize: "clamp(10px,1.2vw,14px)" }}>🇬🇧 English</p>
              {pairs.map((pair) => {
                const isMatched = matched.has(pair.id);
                const isSelected = selected === pair.id;
                const isWrong = wrongFlash === pair.id;
                const isCorrect = lastCorrect === pair.id;

                return (
                  <motion.button
                    key={pair.id}
                    onPointerDown={(e) => { e.stopPropagation(); if (!disabled && !isMatched) onSelectEnglish(pair.id); }}
                    animate={{
                      scale: isWrong ? [1, 0.92, 1] : isCorrect ? [1, 1.06, 1] : 1,
                      background: isMatched ? "#d1fae5" : isSelected ? borderColor : "#f3f4f6",
                    }}
                    transition={{ duration: 0.25 }}
                    className="touch-btn font-bold text-left flex items-center gap-2 shadow-sm rounded-xl border-2"
                    style={{
                      minHeight: "clamp(48px, 8vh, 80px)",
                      borderColor: isMatched ? "#10b981" : isSelected ? headerColor : isWrong ? "#ef4444" : "#e5e7eb",
                      color: isMatched ? "#059669" : isSelected ? "white" : "#374151",
                      fontSize: "clamp(12px,1.6vw,24px)",
                      padding: "clamp(6px,0.9vh,12px) clamp(8px,1vw,14px)",
                      opacity: isMatched ? 0.5 : disabled ? 0.5 : 1,
                      touchAction: "manipulation",
                      textDecoration: isMatched ? "line-through" : "none",
                    }}
                  >
                    <span>{pair.emoji}</span>
                    <span className="flex-1">{pair.english}</span>
                    {isMatched && <span className="ml-auto font-black text-[#10b981]">✓</span>}
                  </motion.button>
                );
              })}
            </div>

            {/* Right: Indonesian translations (shuffled) */}
            <div className="flex flex-col gap-3">
              <p className="text-center font-bold text-gray-400 uppercase tracking-widest" style={{ fontSize: "clamp(10px,1.2vw,14px)" }}>🇮🇩 Indonesia</p>
              {shuffledIds.map((pid) => {
                const pair = pairs.find((p) => p.id === pid)!;
                const isMatched = matched.has(pair.id);
                const isWrong = wrongFlash === pair.id;

                return (
                  <motion.button
                    key={pair.id + "-id"}
                    onPointerDown={(e) => { e.stopPropagation(); if (!disabled && !isMatched && selected) onSelectIndonesian(pair.id); }}
                    animate={{
                      scale: isWrong ? [1, 0.92, 1] : 1,
                      background: isMatched ? "#d1fae5" : "#ffffff",
                    }}
                    transition={{ duration: 0.25 }}
                    className="touch-btn font-bold text-center shadow-sm rounded-xl border-2"
                    style={{
                      minHeight: "clamp(48px, 8vh, 80px)",
                      borderColor: isMatched ? "#10b981" : isWrong ? "#ef4444" : "#e5e7eb",
                      color: isMatched ? "#059669" : "#374151",
                      fontSize: "clamp(12px,1.6vw,24px)",
                      padding: "clamp(6px,0.9vh,12px) clamp(8px,1vw,14px)",
                      opacity: isMatched ? 0.5 : disabled ? 0.5 : 1,
                      touchAction: "manipulation",
                      textDecoration: isMatched ? "line-through" : "none",
                    }}
                  >
                    {pair.indonesian}
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        <p className="text-center text-gray-400 font-bold mt-4" style={{ fontSize: "clamp(10px,1vw,14px)" }}>
          Pilih kata Inggris → lalu pasangkan ke terjemahannya
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ───
export default function EnglishMatchPage() {
  const [phase, setPhase] = useState<Phase>("countdown");
  const [countdown, setCountdown] = useState(3);
  const [winner, setWinner] = useState<"p1" | "p2" | "draw" | null>(null);
  const [p1, setP1] = useState<MatchState>(initState);
  const [p2, setP2] = useState<MatchState>(initState);

  // Sync both panels to same pairs but independent state
  useEffect(() => {
    if (phase === "playing") {
      const fresh = getRoundPairs(PAIRS_PER_ROUND);
      setP1((s) => ({ ...initState(), pairs: fresh }));
      setP2((s) => ({ ...initState(), pairs: fresh }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase === "playing"]);

  // Countdown
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown <= 0) { setPhase("playing"); return; }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, countdown]);

  // Auto-refresh round when all matched
  const checkRoundComplete = (state: MatchState): boolean => state.matched.size === state.pairs.length;

  useEffect(() => {
    if (phase !== "playing") return;
    if (checkRoundComplete(p1)) {
      const t = setTimeout(() => {
        const fresh = getRoundPairs(PAIRS_PER_ROUND);
        setP1({ ...initState(), pairs: fresh, score: p1.score });
      }, 1200);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p1.matched.size]);

  useEffect(() => {
    if (phase !== "playing") return;
    if (checkRoundComplete(p2)) {
      const t = setTimeout(() => {
        const fresh = getRoundPairs(PAIRS_PER_ROUND);
        setP2({ ...initState(), pairs: fresh, score: p2.score });
      }, 1200);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p2.matched.size]);

  const makeHandlers = (setState: React.Dispatch<React.SetStateAction<MatchState>>) => ({
    onSelectEnglish: (id: string) => {
      setState((s) => ({ ...s, selected: s.selected === id ? null : id }));
    },
    onSelectIndonesian: (id: string) => {
      setState((s) => {
        if (!s.selected) return s;
        const correct = s.selected === id;
        if (correct) {
          const newMatched = new Set(s.matched);
          newMatched.add(id);
          return { ...s, matched: newMatched, selected: null, score: s.score + 10, lastCorrect: id, wrongFlash: null };
        } else {
          // Wrong match flash
          setTimeout(() => setState((ss) => ({ ...ss, wrongFlash: null, lastCorrect: null })), 500);
          return { ...s, wrongFlash: id, score: Math.max(0, s.score - 3), lastCorrect: null };
        }
      });
    },
  });

  const finishGame = useCallback(() => {
    if (phase === "finished") return;
    setPhase("finished");
    if (p1.score > p2.score) setWinner("p1");
    else if (p2.score > p1.score) setWinner("p2");
    else setWinner("draw");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, p1.score, p2.score]);

  const handleRematch = () => {
    setPhase("countdown"); setCountdown(3); setWinner(null);
    setP1(initState()); setP2(initState());
  };

  const p1Handlers = makeHandlers(setP1);
  const p2Handlers = makeHandlers(setP2);

  const isFullscreen = () => {
    if (typeof window !== "undefined" && document.fullscreenElement) {
      document.exitFullscreen();
    } else if (typeof window !== "undefined") {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  // Progress logic based on a max score, e.g., 200
  const maxScore = 200;
  const p1Pct = Math.min(Math.max(p1.score, 0) / maxScore, 1) * 100;
  const p2Pct = Math.min(Math.max(p2.score, 0) / maxScore, 1) * 100;

  return (
    <div className="w-full h-full flex flex-col items-center bg-[#e0f2fe] relative overflow-hidden text-gray-900 font-sans">
      


      {/* TOP HEADER */}
      <div className="w-full flex items-center justify-between px-6 py-4 shadow-sm bg-[#e0f2fe] z-10 flex-shrink-0">
        <div className="w-32 flex justify-start"></div>
        <div className="flex-1 flex justify-center items-center">
          <div className="font-bold text-[#0ea5e9] tracking-wide" style={{ fontSize: "clamp(20px, 2vw, 32px)" }}>
             English Match
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
        <GlobalTimer duration={GAME_DURATION} isRunning={phase === "playing"} onComplete={finishGame} />
      </div>



      {/* TEAM PANELS / MATCH PANELS */}
      <div className="flex-1 w-full max-w-7xl px-8 pb-8 z-10 flex gap-8 min-h-0">
        <div className="flex-1 min-w-0">
          <MatchPanel player={2} state={p2} onSelectEnglish={p2Handlers.onSelectEnglish} onSelectIndonesian={p2Handlers.onSelectIndonesian} disabled={phase !== "playing"} />
        </div>
        <div className="flex-1 min-w-0">
          <MatchPanel player={1} state={p1} onSelectEnglish={p1Handlers.onSelectEnglish} onSelectIndonesian={p1Handlers.onSelectIndonesian} disabled={phase !== "playing"} />
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



      <VictoryResultModal isOpen={phase === "finished"} winner={winner} p1Score={p1.score} p2Score={p2.score} p1Label="Tim Biru" p2Label="Tim Merah" onRematch={handleRematch} />
    </div>
  );
}
