"use client";

import { motion } from "framer-motion";
import { GameCard } from "@/components/game/GameCard";
import type { GameConfig } from "@/components/game/GameCard";

const GAMES: GameConfig[] = [
  // ─── Category A: Competitive ───
  {
    id: "1", slug: "math-tug-of-war", title: "Math Tug-of-War",
    subtitle: "Tarik Tambang Matematika", icon: "➗", category: "A",
    description: "Race to solve math problems and pull the rope to your side!",
    players: 2, duration: "60s", available: true,
  },
  {
    id: "2", slug: "quiz-tug-of-war", title: "Quiz Tug-of-War",
    subtitle: "Tarik Tambang Kuis", icon: "🧠", category: "A",
    description: "General knowledge trivia battle — who pulls hardest wins!",
    players: 2, duration: "60s", available: true,
  },
  {
    id: "3", slug: "math-pipette-duel", title: "Pipette Duel",
    subtitle: "Duel Pipet Matematika", icon: "🧪", category: "A",
    description: "Fill your test tube faster by solving math questions.",
    players: 2, duration: "60s", available: true,
  },
  {
    id: "6", slug: "word-pinisi-duel", title: "Word Pinisi Duel",
    subtitle: "Duel Pinisi Kata", icon: "⛵", category: "A",
    description: "Guess words from clues before your Pinisi ship sinks!",
    players: 2, duration: "60s", available: true,
  },

  // ─── Category B: Sorting & Matching ───
  {
    id: "4", slug: "animal-classification", title: "Animal Classification",
    subtitle: "Klasifikasi Hewan", icon: "🦁", category: "B",
    description: "Classify animals into the correct biological categories!",
    players: 2, duration: "60s", available: true,
  },
  {
    id: "5", slug: "waste-sorting-race", title: "Waste Sorting Race",
    subtitle: "Balapan Pilah Sampah", icon: "♻️", category: "B",
    description: "Sort falling waste items before the conveyor overflows!",
    players: 2, duration: "60s", available: true,
  },
  {
    id: "10", slug: "english-match", title: "English Match",
    subtitle: "Cocokkan Kosakata", icon: "🔤", category: "B",
    description: "Draw lines to match English words with their translations.",
    players: 2, duration: "60s", available: true,
  },

  // ─── Category C: Exploration ───
  {
    id: "7", slug: "space-exploration", title: "Space Exploration",
    subtitle: "Jelajah Antariksa", icon: "🚀", category: "C",
    description: "Map the solar system — drag moons onto their planets.",
    players: 2, duration: "∞", available: true,
  },
  {
    id: "8", slug: "king-of-jungle", title: "King of the Jungle",
    subtitle: "Sang Juara Rimba", icon: "🌿", category: "C",
    description: "Digital board game through Indonesian wilderness terrain.",
    players: 2, duration: "Open", available: true,
  },
  {
    id: "9", slug: "geometric-shapes", title: "Geometric Shapes",
    subtitle: "Bangun Ruang Interaktif", icon: "🔷", category: "C",
    description: "Rotate 3D shapes and unfold them into flat nets.",
    players: 2, duration: "∞", available: true,
  },

];


const STATS = [
  { value: "10", label: "Games" },
  { value: "2", label: "Players" },
  { value: "4K", label: "Optimized" },
  { value: "IFP", label: "Ready" },
];

export default function DashboardPage() {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden relative bg-[#e0f2fe] text-gray-900 font-sans">
      {/* ─── Subtle grid pattern ─── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(14,165,233,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.1) 1px, transparent 1px)",
          backgroundSize: "clamp(40px, 5vw, 80px) clamp(40px, 5vh, 80px)",
        }}
      />

      {/* ─── Header ─── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex items-center justify-between"
        style={{ padding: "clamp(16px, 2.5vh, 32px) clamp(20px, 4vw, 60px)" }}
      >
        {/* Logo + Branding */}
        <div className="flex items-center gap-4">
          <div
            className="flex items-center justify-center rounded-2xl shadow-md border-2 border-white"
            style={{
              width: "clamp(44px, 5.5vw, 68px)",
              height: "clamp(44px, 5.5vw, 68px)",
              background: "linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%)",
              fontSize: "clamp(22px, 2.8vw, 36px)",
            }}
          >
            🎮
          </div>
          <div>
            <h1
              className="font-black leading-none tracking-tight text-[#0ea5e9]"
              style={{ fontSize: "var(--text-xl)" }}
            >
              EduPanel{" "}
              <span className="text-[#2563eb]">
                Hub
              </span>
            </h1>
            <p
              className="text-gray-500 font-bold tracking-wide mt-1"
              style={{ fontSize: "var(--text-xs)" }}
            >
              Interactive Learning Games · IFP Edition
            </p>
          </div>
        </div>

        {/* Stats strip */}
        <div className="flex items-center gap-3">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center justify-center"
              style={{
                padding: "clamp(8px, 1.2vh, 14px) clamp(14px, 2vw, 24px)",
                minWidth: "clamp(56px, 6vw, 80px)",
              }}
            >
              <span
                className="font-black text-gray-800 leading-none"
                style={{ fontSize: "var(--text-base)" }}
              >
                {s.value}
              </span>
              <span
                className="text-gray-400 font-bold tracking-wider uppercase mt-1"
                style={{ fontSize: "clamp(0.55rem, 0.8vw, 0.7rem)" }}
              >
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.header>



      {/* ─── Game Grid ─── */}
      <main
        className="relative z-10 flex-1 overflow-hidden"
        style={{ paddingInline: "clamp(20px, 4vw, 60px)", paddingBottom: "clamp(16px, 2.5vh, 32px)" }}
      >
        <div
          className="grid h-full"
          style={{
            gridTemplateColumns: "repeat(5, 1fr)",
            gridTemplateRows: "repeat(2, 1fr)",
            gap: "clamp(10px, 1.5vw, 20px)",
          }}
        >
          {GAMES.map((game, i) => (
            <GameCard key={game.id} game={game} index={i} />
          ))}
        </div>
      </main>

      {/* ─── Footer ─── */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="relative z-10 flex items-center justify-center"
        style={{ padding: "clamp(8px, 1vh, 16px)" }}
      >
        <p className="text-gray-400 font-bold" style={{ fontSize: "var(--text-xs)" }}>
          Tap a game to begin · EduPanel Hub v1.0 · Built for Interactive Flat Panels
        </p>
      </motion.footer>
    </div>
  );
}
