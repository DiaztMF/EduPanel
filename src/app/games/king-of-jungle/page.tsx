"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  HelpCircle,
  Zap,
  AlertTriangle,
  Coffee,
  Trophy,
  Flag,
  Footprints,
  CheckCircle2,
  XCircle,
  Dices,
} from "lucide-react";
import {
  BOARD,
  getRandomBoardQuestion,
  type BoardQuestion,
  type BoardDifficulty,
} from "@/data/board-game";
import { VictoryResultModal } from "@/components/game/VictoryResultModal";
import { GameHeader } from "@/components/game/GameHeader";
import { GameSetupModal } from "@/components/game/GameSetupModal";

type GamePhase = "setup" | "countdown" | "rolling" | "moving" | "quiz" | "effect" | "finished";

const TOTAL_TILES = BOARD.length - 1; // 30

// ─── Crisp SVG Dice Pips Component ───
function SvgDice({ value, rolling }: { value: number; rolling: boolean }) {
  // Dot coordinates for 1 to 6 on a 60x60 grid
  const pipMap: Record<number, [number, number][]> = {
    1: [[30, 30]],
    2: [[18, 18], [42, 42]],
    3: [[18, 18], [30, 30], [42, 42]],
    4: [[18, 18], [42, 18], [18, 42], [42, 42]],
    5: [[18, 18], [42, 18], [30, 30], [18, 42], [42, 42]],
    6: [[18, 18], [42, 18], [18, 30], [42, 30], [18, 42], [42, 42]],
  };

  const pips = pipMap[value] || pipMap[1];

  return (
    <motion.div
      animate={rolling ? { rotate: [0, 180, 360, 540, 720], scale: [1, 1.25, 1] } : { rotate: 0, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl border-4 border-slate-300 shadow-xl flex items-center justify-center p-2"
    >
      <svg viewBox="0 0 60 60" className="w-full h-full">
        {pips.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={5} fill="#1e293b" />
        ))}
      </svg>
    </motion.div>
  );
}

// ─── Tile component ───
function Tile({
  tile,
  p1Here,
  p2Here,
  highlighted,
}: {
  tile: typeof BOARD[0];
  p1Here: boolean;
  p2Here: boolean;
  highlighted: boolean;
}) {
  const bgMap = {
    normal: "#ffffff",
    quiz: "#dbeafe",
    bonus: "#d1fae5",
    penalty: "#fee2e2",
    rest: "#ffedd5",
    finish: "#fef08a",
  };
  const borderMap = {
    normal: "#e2e8f0",
    quiz: "#93c5fd",
    bonus: "#6ee7b7",
    penalty: "#fca5a5",
    rest: "#fdba74",
    finish: "#fde047",
  };

  const renderIcon = () => {
    switch (tile.iconName) {
      case "start":
        return <Flag size={16} className="text-emerald-600" />;
      case "quiz":
        return <HelpCircle size={16} className="text-blue-600" />;
      case "bonus":
        return <Zap size={16} className="text-emerald-600" />;
      case "penalty":
        return <AlertTriangle size={16} className="text-rose-600" />;
      case "rest":
        return <Coffee size={16} className="text-amber-600" />;
      case "finish":
        return <Trophy size={16} className="text-yellow-600" />;
      default:
        return <Footprints size={14} className="text-slate-400" />;
    }
  };

  return (
    <motion.div
      animate={{
        scale: highlighted ? 1.12 : 1,
        boxShadow: highlighted ? "0 0 16px rgba(14,165,233,0.6)" : "0 1px 3px rgba(0,0,0,0.1)",
      }}
      className="flex flex-col items-center justify-center rounded-xl relative select-none"
      style={{
        background: bgMap[tile.type],
        border: `2px solid ${borderMap[tile.type]}`,
        aspectRatio: "1",
        minWidth: 0,
      }}
    >
      {renderIcon()}
      {tile.id % 5 === 0 && (
        <span
          className="text-slate-400 font-bold absolute bottom-0.5 right-1"
          style={{ fontSize: "clamp(6px,0.7vw,9px)" }}
        >
          {tile.id}
        </span>
      )}
      {/* Player tokens */}
      <div className="absolute -top-1.5 -right-1.5 flex gap-1 z-10">
        {p1Here && (
          <div
            className="rounded-full shadow-md bg-blue-900 border-2 border-white"
            style={{ width: "clamp(12px,1.4vw,18px)", height: "clamp(12px,1.4vw,18px)" }}
          />
        )}
        {p2Here && (
          <div
            className="rounded-full shadow-md bg-rose-900 border-2 border-white"
            style={{ width: "clamp(12px,1.4vw,18px)", height: "clamp(12px,1.4vw,18px)" }}
          />
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Page ───
export default function KingOfJunglePage() {
  const [phase, setPhase] = useState<GamePhase>("setup");
  const [countdown, setCountdown] = useState(3);
  const [difficulty, setDifficulty] = useState<BoardDifficulty>("medium");
  const [duration, setDuration] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);

  const [turn, setTurn] = useState<1 | 2>(1);
  const [p1Pos, setP1Pos] = useState(0);
  const [p2Pos, setP2Pos] = useState(0);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<BoardQuestion | null>(null);
  const [effectMsg, setEffectMsg] = useState("");
  const [effectIcon, setEffectIcon] = useState<"bonus" | "penalty" | "rest" | "correct" | "wrong" | null>(null);
  const [skippedTurns, setSkippedTurns] = useState<{ 1: number; 2: number }>({ 1: 0, 2: 0 });
  const [winner, setWinner] = useState<"p1" | "p2" | "draw" | null>(null);
  const [questionResult, setQuestionResult] = useState<"correct" | "wrong" | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentPos = turn === 1 ? p1Pos : p2Pos;
  const setPos = turn === 1 ? setP1Pos : setP2Pos;
  const setScore = turn === 1 ? setP1Score : setP2Score;

  // Handle Game Start from Setup Modal
  const handleStartGame = (config: { difficulty: BoardDifficulty; duration: number }) => {
    setDifficulty(config.difficulty);
    setDuration(config.duration);
    setTimeLeft(config.duration);
    setTurn(1);
    setP1Pos(0);
    setP2Pos(0);
    setP1Score(0);
    setP2Score(0);
    setDiceValue(1);
    setWinner(null);
    setSkippedTurns({ 1: 0, 2: 0 });
    setCurrentQuestion(null);
    setEffectMsg("");
    setEffectIcon(null);
    setQuestionResult(null);
    setAnsweredQuestions([]);

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
      setPhase("rolling");
    }

    return () => {
      if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
    };
  }, [phase, countdown]);

  // Main Playing Timer
  useEffect(() => {
    if (phase === "setup" || phase === "countdown" || phase === "finished") return;

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

  // Check finish score winner
  useEffect(() => {
    if (phase === "finished") {
      if (p1Score > p2Score) setWinner("p1");
      else if (p2Score > p1Score) setWinner("p2");
      else setWinner("draw");
    }
  }, [phase, p1Score, p2Score]);

  const nextTurn = useCallback(() => {
    setTurn((t) => (t === 1 ? 2 : 1));
    setPhase("rolling");
    setCurrentQuestion(null);
    setEffectMsg("");
    setEffectIcon(null);
    setQuestionResult(null);
  }, []);

  const applyTileEffect = useCallback(
    (pos: number) => {
      const tile = BOARD[pos];
      if (!tile) return;

      if (pos >= TOTAL_TILES) {
        setPhase("finished");
        setWinner(turn === 1 ? "p1" : "p2");
        return;
      }

      if (tile.type === "quiz") {
        setCurrentQuestion(getRandomBoardQuestion(difficulty, answeredQuestions));
        setPhase("quiz");
      } else if (tile.type === "bonus" && tile.jump) {
        setEffectMsg(tile.effect ?? "Maju langkah!");
        setEffectIcon("bonus");
        setPhase("effect");
        setTimeout(() => {
          const newPos = Math.min(pos + tile.jump!, TOTAL_TILES);
          setPos(newPos);
          if (newPos >= TOTAL_TILES) {
            setPhase("finished");
            setWinner(turn === 1 ? "p1" : "p2");
          } else {
            setTimeout(nextTurn, 1200);
          }
        }, 1500);
      } else if (tile.type === "penalty" && tile.jump) {
        setEffectMsg(tile.effect ?? "Mundur langkah!");
        setEffectIcon("penalty");
        setPhase("effect");
        setTimeout(() => {
          setPos((p) => Math.max(0, p + tile.jump!));
          setTimeout(nextTurn, 1200);
        }, 1500);
      } else if (tile.type === "rest") {
        setEffectMsg(tile.effect ?? "Istirahat!");
        setEffectIcon("rest");
        setPhase("effect");
        setSkippedTurns((s) => ({ ...s, [turn]: 1 }));
        setTimeout(nextTurn, 1800);
      } else {
        setTimeout(nextTurn, 600);
      }
    },
    [turn, nextTurn, setPos, answeredQuestions, difficulty]
  );

  const rollDice = useCallback(() => {
    if (phase !== "rolling" || isRolling) return;

    if (skippedTurns[turn] > 0) {
      setSkippedTurns((s) => ({ ...s, [turn]: 0 }));
      setEffectMsg("Giliran dilewati (Istirahat)");
      setEffectIcon("rest");
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
  }, [phase, turn, skippedTurns, currentPos, setPos, applyTileEffect, nextTurn, isRolling]);

  const handleAnswer = (idx: number) => {
    if (!currentQuestion || phase !== "quiz") return;
    const correct = idx === currentQuestion.answer;
    setQuestionResult(correct ? "correct" : "wrong");

    if (correct) {
      setScore((s) => s + 10);
      setEffectIcon("correct");
      setTimeout(() => {
        setPhase("effect");
        setEffectMsg("Jawaban Benar! +10 poin");
        setTimeout(nextTurn, 1200);
      }, 700);
    } else {
      setEffectIcon("wrong");
      setTimeout(() => {
        setPhase("effect");
        setEffectMsg("Jawaban Salah! Tetap di tempat.");
        setTimeout(nextTurn, 1200);
      }, 700);
    }
  };

  // Build 5x7 snake grid
  const cols = 7;
  const gridPositions: { tile: typeof BOARD[0]; row: number; col: number }[] = [];
  let curTile = 0;
  for (let r = 0; r < 5; r++) {
    const leftToRight = r % 2 === 0;
    for (let c = 0; c < cols; c++) {
      const colIdx = leftToRight ? c : cols - 1 - c;
      if (curTile < BOARD.length) {
        gridPositions.push({ tile: BOARD[curTile], row: r, col: colIdx });
        curTile++;
      }
    }
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#e0f2fe] relative overflow-hidden font-sans select-none">
      {/* ── HEADER ── */}
      <GameHeader
        title="King of the Jungle"
        subtitle="Jelajah Hutan Rimba Nusantara"
        timerDuration={duration}
        isTimerRunning={phase !== "setup" && phase !== "countdown" && phase !== "finished"}
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

      {/* ── SCOREBOARD DUAL BAR ── */}
      <div className="w-full z-10 flex-shrink-0 px-4 md:px-8 pt-1">
        <div className="w-full bg-white/95 backdrop-blur-sm border-2 border-sky-100 shadow-md rounded-2xl p-2.5 flex items-center justify-between gap-4">
          {/* P1 Status */}
          <div
            className={`flex items-center gap-3 px-3 py-1.5 rounded-xl border-2 transition-all ${
              turn === 1 && phase === "rolling"
                ? "bg-blue-50 border-blue-600 shadow-sm"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-blue-700" />
            <div>
              <p className="font-bold text-xs text-blue-900">TIM BIRU</p>
              <p className="text-[11px] font-semibold text-slate-500">
                Petak: {p1Pos}/{TOTAL_TILES} • Skor: {p1Score}
              </p>
            </div>
          </div>

          {/* Turn Indicator */}
          <div className="text-center px-4 py-1 bg-sky-50 border border-sky-200 rounded-xl">
            <p className="text-[10px] font-bold text-sky-700 uppercase tracking-widest">
              Giliran Saat Ini
            </p>
            <p
              className="font-black text-sm md:text-base"
              style={{ color: turn === 1 ? "#1d4ed8" : "#be123c" }}
            >
              {turn === 1 ? "Tim Biru" : "Tim Merah"}
            </p>
          </div>

          {/* P2 Status */}
          <div
            className={`flex items-center gap-3 px-3 py-1.5 rounded-xl border-2 transition-all ${
              turn === 2 && phase === "rolling"
                ? "bg-rose-50 border-rose-600 shadow-sm"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="text-right">
              <p className="font-bold text-xs text-rose-900">TIM MERAH</p>
              <p className="text-[11px] font-semibold text-slate-500">
                Petak: {p2Pos}/{TOTAL_TILES} • Skor: {p2Score}
              </p>
            </div>
            <div className="w-3.5 h-3.5 rounded-full bg-rose-700" />
          </div>
        </div>
      </div>

      {/* ── MAIN BOARD & CONTROLS ── */}
      <div
        className="flex-1 w-full z-10 flex gap-4 min-h-0 px-4 md:px-8 py-2"
      >
        {/* Left: 30-tile trail board */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg border border-sky-100 p-3 flex flex-col justify-center min-w-0">
          <div
            className="grid w-full h-full gap-2"
            style={{
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gridTemplateRows: "repeat(5, 1fr)",
            }}
          >
            {gridPositions.map(({ tile, row, col }) => {
              const p1Here = p1Pos === tile.id;
              const p2Here = p2Pos === tile.id;
              const isCurrentTurnTile = (turn === 1 ? p1Pos : p2Pos) === tile.id;

              return (
                <div
                  key={tile.id}
                  style={{ gridColumn: col + 1, gridRow: row + 1 }}
                  className="flex items-center justify-center p-0.5"
                >
                  <Tile
                    tile={tile}
                    p1Here={p1Here}
                    p2Here={p2Here}
                    highlighted={isCurrentTurnTile}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Dice Roll & Actions */}
        <div className="w-64 md:w-80 flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg border border-sky-100 p-4 gap-4 flex-shrink-0">
          <p className="font-black text-slate-700 text-sm md:text-base uppercase tracking-wider text-center">
            {phase === "rolling" ? "Silakan Lempar Dadu" : "Pergerakan Pion"}
          </p>

          <SvgDice value={diceValue} rolling={isRolling} />

          <button
            onPointerDown={rollDice}
            disabled={phase !== "rolling" || isRolling}
            className={`w-full min-h-[64px] px-4 py-2 font-black rounded-xl text-base md:text-lg border-2 shadow-md flex items-center justify-center gap-2 active:translate-y-0.5 transition-all ${
              phase === "rolling" && !isRolling
                ? turn === 1
                  ? "bg-blue-600 hover:bg-blue-700 border-blue-800 text-white"
                  : "bg-rose-600 hover:bg-rose-700 border-rose-800 text-white"
                : "bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed"
            }`}
            style={{ touchAction: "manipulation" }}
          >
            <Dices size={20} />
            <span>{isRolling ? "Mengocok Dadu..." : "Kocok Dadu"}</span>
          </button>
        </div>
      </div>

      {/* ── QUIZ MODAL ── */}
      <AnimatePresence>
        {phase === "quiz" && currentQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl border-2 border-sky-200 max-w-lg w-full p-6 flex flex-col gap-4 text-center"
            >
              <div className="flex items-center justify-center gap-1.5 text-blue-600 text-xs font-bold uppercase tracking-wider">
                <HelpCircle size={16} />
                <span>Kuis Rimba • Giliran {turn === 1 ? "Tim Biru" : "Tim Merah"}</span>
              </div>

              <h3 className="font-black text-slate-800 text-lg md:text-xl leading-snug">
                {currentQuestion.question}
              </h3>

              <div className="flex flex-col gap-2.5 mt-2">
                {currentQuestion.options.map((opt, idx) => {
                  const isChosen = questionResult !== null && idx === currentQuestion.answer;
                  return (
                    <button
                      key={idx}
                      onPointerDown={() => handleAnswer(idx)}
                      disabled={questionResult !== null}
                      className={`min-h-[56px] px-4 py-2 font-bold text-sm md:text-base rounded-xl border-2 shadow-sm text-left transition-all ${
                        isChosen
                          ? "bg-emerald-100 border-emerald-500 text-emerald-900"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                      style={{ touchAction: "manipulation" }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── EFFECT MESSAGE OVERLAY ── */}
      <AnimatePresence>
        {phase === "effect" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 1.1, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl border-4 border-sky-400 px-8 py-6 text-center flex flex-col items-center gap-3"
            >
              {effectIcon === "bonus" && <Zap size={36} className="text-emerald-500" />}
              {effectIcon === "penalty" && <AlertTriangle size={36} className="text-rose-500" />}
              {effectIcon === "rest" && <Coffee size={36} className="text-amber-500" />}
              {effectIcon === "correct" && <CheckCircle2 size={36} className="text-emerald-500" />}
              {effectIcon === "wrong" && <XCircle size={36} className="text-rose-500" />}

              <p className="font-black text-xl md:text-2xl text-slate-800">{effectMsg}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PRE-GAME SETUP MODAL ── */}
      <GameSetupModal
        isOpen={phase === "setup"}
        gameTitle="King of the Jungle"
        gameSubtitle="Pilih tingkat kesulitan kuis rimba dan durasi ekspedisi"
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
              {countdown > 0 ? countdown : "MULAI!"}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── VICTORY MODAL ── */}
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
