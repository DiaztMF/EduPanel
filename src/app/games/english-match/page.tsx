"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameHeader } from "@/components/game/GameHeader";
import { VictoryResultModal } from "@/components/game/VictoryResultModal";
import { GameSetupModal } from "@/components/game/GameSetupModal";
import { type VocabPair, getRoundPairs } from "@/data/vocab-pairs";
import { Check, CheckCircle2, SlidersHorizontal } from "lucide-react";

const PAIRS_PER_ROUND = 5;
type Phase = "setup" | "countdown" | "playing" | "finished";
type Difficulty = "easy" | "medium" | "hard";

interface MatchState {
  pairs: VocabPair[];
  selected: string | null;   // selected English word id
  matched: Set<string>;      // matched pair ids
  score: number;
  wrongFlash: string | null; // id of wrong attempt
  lastCorrect: string | null;
}

function initPlayerState(pairs: VocabPair[], initialScore = 0): MatchState {
  return {
    pairs,
    selected: null,
    matched: new Set(),
    score: initialScore,
    wrongFlash: null,
    lastCorrect: null,
  };
}

// ─── Player Match Panel ───
function MatchPanel({
  player,
  state,
  onSelectEnglish,
  onSelectIndonesian,
  disabled,
}: {
  player: 1 | 2;
  state: MatchState;
  onSelectEnglish: (id: string) => void;
  onSelectIndonesian: (id: string) => void;
  disabled: boolean;
}) {
  const isP1 = player === 1;
  const headerColor = isP1 ? "#1e1b4b" : "#7f1d1d";
  const borderColor = isP1 ? "#1e3a8a" : "#7f1d1d";
  const teamName = isP1 ? "TIM BIRU" : "TIM MERAH";
  const { pairs, selected, matched, wrongFlash, lastCorrect } = state;

  // Shuffle Indonesian side independently so players cannot copy physical button positions
  const shuffledIds = useMemo(() => {
    return [...pairs.map((p) => p.id)].sort(() => Math.random() - 0.5);
  }, [pairs]);

  const allMatched = matched.size === pairs.length && pairs.length > 0;

  return (
    <div
      className="flex flex-col bg-white rounded-2xl shadow-lg border-2 overflow-hidden w-full h-full"
      style={{ borderColor: borderColor }}
    >
      <div
        className="flex items-center justify-center text-white shadow-inner flex-shrink-0"
        style={{ backgroundColor: headerColor, paddingBlock: "clamp(10px, 1.5vh, 20px)" }}
      >
        <h2 className="font-bold tracking-widest" style={{ fontSize: "clamp(14px, 1.4vw, 22px)" }}>
          {teamName}
        </h2>
      </div>

      <div
        className="flex-1 flex flex-col min-h-0"
        style={{ padding: "clamp(12px, 1.8vh, 22px)", background: "#f8fafc" }}
      >
        {allMatched ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center gap-3"
          >
            <CheckCircle2 size={54} className="text-emerald-500" />
            <p
              className="font-black text-center text-emerald-600"
              style={{ fontSize: "clamp(16px, 2.5vw, 36px)" }}
            >
              Semua Cocok!
            </p>
            <p className="text-slate-400 font-bold" style={{ fontSize: "clamp(10px, 1.2vw, 16px)" }}>
              Ronde baru segera dimulai...
            </p>
          </motion.div>
        ) : (
          <div className="w-full flex-1 grid grid-cols-2 min-h-0" style={{ gap: "clamp(10px, 1.4vw, 18px)" }}>
            {/* Left: English words */}
            <div className="flex flex-col min-h-0" style={{ gap: "clamp(6px, 1vh, 12px)" }}>
              <p
                className="text-center font-black text-slate-500 uppercase tracking-wider flex-shrink-0"
                style={{ fontSize: "clamp(10px, 1.1vw, 14px)" }}
              >
                English (EN)
              </p>
              {pairs.map((pair) => {
                const isMatched = matched.has(pair.id);
                const isSelected = selected === pair.id;
                const isWrong = wrongFlash === pair.id;
                const isCorrect = lastCorrect === pair.id;

                return (
                  <motion.button
                    key={pair.id}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      if (!disabled && !isMatched) onSelectEnglish(pair.id);
                    }}
                    animate={{
                      scale: isWrong ? [1, 0.92, 1] : isCorrect ? [1, 1.06, 1] : 1,
                      background: isMatched ? "#d1fae5" : isSelected ? borderColor : "#f3f4f6",
                    }}
                    transition={{ duration: 0.25 }}
                    className="flex-1 font-bold text-left flex items-center justify-between shadow-sm rounded-xl border-2 active:translate-y-0.5 transition-all"
                    style={{
                      minHeight: "clamp(46px, 7vh, 82px)",
                      borderColor: isMatched
                        ? "#10b981"
                        : isSelected
                        ? headerColor
                        : isWrong
                        ? "#ef4444"
                        : "#e5e7eb",
                      color: isMatched ? "#059669" : isSelected ? "white" : "#374151",
                      fontSize: "clamp(11px, 1.4vw, 20px)",
                      padding: "clamp(4px, 0.7vh, 10px) clamp(8px, 1vw, 16px)",
                      opacity: isMatched ? 0.5 : disabled ? 0.5 : 1,
                      touchAction: "manipulation",
                      textDecoration: isMatched ? "line-through" : "none",
                    }}
                  >
                    <span className="font-extrabold">{pair.english}</span>
                    {isMatched && <Check size={18} className="text-emerald-600 font-black ml-2" />}
                  </motion.button>
                );
              })}
            </div>

            {/* Right: Indonesian translations */}
            <div className="flex flex-col min-h-0" style={{ gap: "clamp(6px, 1vh, 12px)" }}>
              <p
                className="text-center font-black text-slate-500 uppercase tracking-wider flex-shrink-0"
                style={{ fontSize: "clamp(10px, 1.1vw, 14px)" }}
              >
                Indonesia (ID)
              </p>
              {shuffledIds.map((pid) => {
                const pair = pairs.find((p) => p.id === pid)!;
                if (!pair) return null;
                const isMatched = matched.has(pair.id);
                const isWrong = wrongFlash === pair.id;

                return (
                  <motion.button
                    key={pair.id + "-id"}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      if (!disabled && !isMatched && selected) onSelectIndonesian(pair.id);
                    }}
                    animate={{
                      scale: isWrong ? [1, 0.92, 1] : 1,
                      background: isMatched ? "#d1fae5" : "#ffffff",
                    }}
                    transition={{ duration: 0.25 }}
                    className="flex-1 font-bold text-center flex items-center justify-center shadow-sm rounded-xl border-2 active:translate-y-0.5 transition-all"
                    style={{
                      minHeight: "clamp(46px, 7vh, 82px)",
                      borderColor: isMatched ? "#10b981" : isWrong ? "#ef4444" : "#e5e7eb",
                      color: isMatched ? "#059669" : "#374151",
                      fontSize: "clamp(11px, 1.4vw, 20px)",
                      padding: "clamp(4px, 0.7vh, 10px) clamp(8px, 1vw, 16px)",
                      opacity: isMatched ? 0.5 : disabled ? 0.5 : 1,
                      touchAction: "manipulation",
                      textDecoration: isMatched ? "line-through" : "none",
                    }}
                  >
                    <span>{pair.indonesian}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ───
export default function EnglishMatchPage() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [countdown, setCountdown] = useState(3);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [gameDuration, setGameDuration] = useState(60);

  const [winner, setWinner] = useState<"p1" | "p2" | "draw" | null>(null);
  
  // Synchronized initial pairs
  const initialPairs = useMemo(() => getRoundPairs(PAIRS_PER_ROUND, "medium"), []);
  const [p1, setP1] = useState<MatchState>(() => initPlayerState(initialPairs));
  const [p2, setP2] = useState<MatchState>(() => initPlayerState(initialPairs));

  // Countdown
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown <= 0) {
      setPhase("playing");
      return;
    }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, countdown]);

  // Auto-refresh round when all matched (preserving scores)
  const checkRoundComplete = (state: MatchState): boolean =>
    state.matched.size === state.pairs.length && state.pairs.length > 0;

  useEffect(() => {
    if (phase !== "playing") return;
    if (checkRoundComplete(p1)) {
      const t = setTimeout(() => {
        const fresh = getRoundPairs(PAIRS_PER_ROUND, difficulty);
        setP1((prev) => initPlayerState(fresh, prev.score));
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [p1.matched.size, phase, difficulty]);

  useEffect(() => {
    if (phase !== "playing") return;
    if (checkRoundComplete(p2)) {
      const t = setTimeout(() => {
        const fresh = getRoundPairs(PAIRS_PER_ROUND, difficulty);
        setP2((prev) => initPlayerState(fresh, prev.score));
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [p2.matched.size, phase, difficulty]);

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
          return {
            ...s,
            matched: newMatched,
            selected: null,
            score: s.score + 10,
            lastCorrect: id,
            wrongFlash: null,
          };
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
  }, [phase, p1.score, p2.score]);

  const handleRematch = () => {
    const fresh = getRoundPairs(PAIRS_PER_ROUND, difficulty);
    setP1(initPlayerState(fresh, 0));
    setP2(initPlayerState(fresh, 0));
    setWinner(null);
    setPhase("countdown");
    setCountdown(3);
  };

  const handleStartGame = ({
    difficulty: diff,
    duration,
  }: {
    difficulty: Difficulty;
    duration: number;
  }) => {
    setDifficulty(diff);
    setGameDuration(duration);
    const fresh = getRoundPairs(PAIRS_PER_ROUND, diff);
    setP1(initPlayerState(fresh, 0));
    setP2(initPlayerState(fresh, 0));
    setWinner(null);
    setPhase("countdown");
    setCountdown(3);
  };

  const p1Handlers = makeHandlers(setP1);
  const p2Handlers = makeHandlers(setP2);

  const maxScore = 200;
  const p1Pct = Math.min(Math.max(p1.score, 0) / maxScore, 1) * 100;
  const p2Pct = Math.min(Math.max(p2.score, 0) / maxScore, 1) * 100;

  return (
    <div className="w-full h-full flex flex-col bg-[#e0f2fe] relative overflow-hidden text-gray-900 font-sans">

      {/* ── SHARED GAME HEADER ── */}
      <GameHeader
        title="English Match"
        subtitle="Cocokkan Kosakata Bahasa Inggris"
        timerDuration={gameDuration}
        isTimerRunning={phase === "playing"}
        onTimerComplete={finishGame}
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

      {/* SCOREBOARD */}
      <div className="w-full z-10 flex-shrink-0" style={{ padding: "clamp(12px, 2vh, 24px) clamp(20px, 4vw, 60px) 0" }}>
         <div className="w-full bg-white border-2 border-gray-200 shadow-lg rounded-2xl flex flex-col" style={{ padding: "clamp(12px, 1.5vh, 20px)", gap: "clamp(8px, 1vh, 14px)" }}>
            <div className="flex items-center gap-4 w-full">
               <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ background: "#1e3a8a" }}></div>
               <div className="w-28 font-bold tracking-wider flex-shrink-0" style={{ fontSize: "clamp(13px, 1.3vw, 18px)", color: "#1e3a8a" }}>TIM BIRU</div>
               <div className="flex-1 h-6 bg-[#e0f2fe] rounded-full border overflow-hidden relative shadow-inner" style={{ borderColor: "#b9ddf5" }}>
                  <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #1e3a8a, #3b82f6)" }} animate={{ width: `${p1Pct}%` }} transition={{ type: "spring" }} />
               </div>
               <div className="font-bold text-center rounded-xl border-2 shadow-sm" style={{ padding: "clamp(4px, 0.6vh, 8px) clamp(10px, 1.2vw, 20px)", fontSize: "clamp(13px, 1.3vw, 18px)", color: "#1e3a8a", borderColor: "#1e3a8a", background: "#eff6ff" }}>{p1.score}</div>
            </div>
            <div className="flex items-center gap-4 w-full">
               <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ background: "#7f1d1d" }}></div>
               <div className="w-28 font-bold tracking-wider flex-shrink-0" style={{ fontSize: "clamp(13px, 1.3vw, 18px)", color: "#7f1d1d" }}>TIM MERAH</div>
               <div className="flex-1 h-6 bg-[#fef2f2] rounded-full border overflow-hidden relative shadow-inner" style={{ borderColor: "#f5c6c6" }}>
                  <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #7f1d1d, #ef4444)" }} animate={{ width: `${p2Pct}%` }} transition={{ type: "spring" }} />
               </div>
               <div className="font-bold text-center rounded-xl border-2 shadow-sm" style={{ padding: "clamp(4px, 0.6vh, 8px) clamp(10px, 1.2vw, 20px)", fontSize: "clamp(13px, 1.3vw, 18px)", color: "#7f1d1d", borderColor: "#7f1d1d", background: "#fef2f2" }}>{p2.score}</div>
            </div>
         </div>
      </div>

      {/* ── TEAM PANELS ── */}
      <div className="flex-1 w-full z-10 flex gap-8 min-h-0" style={{ padding: "clamp(8px, 1.2vh, 14px) clamp(20px, 4vw, 60px) clamp(12px, 2vh, 24px)" }}>
        <div className="flex-1 min-w-0">
          <MatchPanel player={2} state={p2} onSelectEnglish={p2Handlers.onSelectEnglish} onSelectIndonesian={p2Handlers.onSelectIndonesian} disabled={phase !== "playing"} />
        </div>
        <div className="flex-1 min-w-0">
          <MatchPanel player={1} state={p1} onSelectEnglish={p1Handlers.onSelectEnglish} onSelectIndonesian={p1Handlers.onSelectIndonesian} disabled={phase !== "playing"} />
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

      <VictoryResultModal isOpen={phase === "finished"} winner={winner} p1Score={p1.score} p2Score={p2.score} p1Label="Tim Biru" p2Label="Tim Merah" onRematch={handleRematch} />

      {/* PRE-GAME SETUP MODAL */}
      <GameSetupModal
        isOpen={phase === "setup"}
        gameTitle="English Match"
        gameSubtitle="Cocokkan Kosakata"
        defaultDifficulty="medium"
        defaultDuration={60}
        onStart={handleStartGame}
      />
    </div>
  );
}
