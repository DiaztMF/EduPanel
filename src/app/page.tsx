"use client";

import { motion } from "framer-motion";
import { GameCard } from "@/components/game/GameCard";
import type { GameConfig } from "@/components/game/GameCard";
import {
  Divide,
  Brain,
  FlaskConical,
  Sailboat,
  PawPrint,
  Recycle,
  Languages,
  Rocket,
  Leaf,
  Diamond,
  Swords,
  ArrowLeftRight,
  Telescope,
} from "lucide-react";

const GAMES: GameConfig[] = [
  // ─── Category A: Competitive ───
  {
    id: "1",
    slug: "math-tug-of-war",
    title: "Math Tug-of-War",
    subtitle: "Tarik Tambang Matematika",
    icon: <Divide size={28} />,
    category: "A",
    description: "Race to solve math problems and pull the rope to your side!",
    players: 2,
    duration: "60s",
    available: true,
  },
  {
    id: "2",
    slug: "quiz-tug-of-war",
    title: "Quiz Tug-of-War",
    subtitle: "Tarik Tambang Kuis",
    icon: <Brain size={28} />,
    category: "A",
    description: "General knowledge trivia battle — who pulls hardest wins!",
    players: 2,
    duration: "60s",
    available: true,
  },
  {
    id: "3",
    slug: "math-pipette-duel",
    title: "Pipette Duel",
    subtitle: "Duel Pipet Matematika",
    icon: <FlaskConical size={28} />,
    category: "A",
    description: "Fill your test tube faster by solving math questions.",
    players: 2,
    duration: "60s",
    available: true,
  },
  {
    id: "6",
    slug: "word-pinisi-duel",
    title: "Word Pinisi Duel",
    subtitle: "Duel Pinisi Kata",
    icon: <Sailboat size={28} />,
    category: "A",
    description: "Guess words from clues before your Pinisi ship sinks!",
    players: 2,
    duration: "60s",
    available: true,
  },

  // ─── Category B: Sorting & Matching ───
  {
    id: "4",
    slug: "animal-classification",
    title: "Animal Classification",
    subtitle: "Klasifikasi Hewan",
    icon: <PawPrint size={28} />,
    category: "B",
    description: "Classify animals into the correct biological categories!",
    players: 2,
    duration: "60s",
    available: true,
  },
  {
    id: "5",
    slug: "waste-sorting-race",
    title: "Waste Sorting Race",
    subtitle: "Balapan Pilah Sampah",
    icon: <Recycle size={28} />,
    category: "B",
    description: "Sort falling waste items before the conveyor overflows!",
    players: 2,
    duration: "60s",
    available: true,
  },
  {
    id: "10",
    slug: "english-match",
    title: "English Match",
    subtitle: "Cocokkan Kosakata",
    icon: <Languages size={28} />,
    category: "B",
    description: "Draw lines to match English words with their translations.",
    players: 2,
    duration: "60s",
    available: true,
  },

  // ─── Category C: Exploration ───
  {
    id: "7",
    slug: "space-exploration",
    title: "Space Exploration",
    subtitle: "Jelajah Antariksa",
    icon: <Rocket size={28} />,
    category: "C",
    description: "Map the solar system — drag moons onto their planets.",
    players: 2,
    duration: "∞",
    available: true,
  },
  {
    id: "8",
    slug: "king-of-jungle",
    title: "King of the Jungle",
    subtitle: "Sang Juara Rimba",
    icon: <Leaf size={28} />,
    category: "C",
    description: "Digital board game through Indonesian wilderness terrain.",
    players: 2,
    duration: "Open",
    available: true,
  },
  {
    id: "9",
    slug: "geometric-shapes",
    title: "Geometric Shapes",
    subtitle: "Bangun Ruang Interaktif",
    icon: <Diamond size={28} />,
    category: "C",
    description: "Rotate 3D shapes and unfold them into flat nets.",
    players: 2,
    duration: "∞",
    available: true,
  },
];

// ─── Category definitions ───
const CATEGORIES = [
  {
    id: "A",
    label: "Kompetitif",
    labelEn: "Competitive",
    icon: <Swords size={14} />,
    color: "#d97706",      // amber-600
    bg: "#fffbeb",         // amber-50
    borderColor: "#fde68a", // amber-200
    games: GAMES.filter((g) => g.category === "A"),
  },
  {
    id: "B",
    label: "Sorting & Matching",
    labelEn: "Sort & Match",
    icon: <ArrowLeftRight size={14} />,
    color: "#059669",      // emerald-600
    bg: "#ecfdf5",         // emerald-50
    borderColor: "#a7f3d0", // emerald-200
    games: GAMES.filter((g) => g.category === "B"),
  },
  {
    id: "C",
    label: "Eksplorasi",
    labelEn: "Exploration",
    icon: <Telescope size={14} />,
    color: "#7c3aed",      // violet-600
    bg: "#f5f3ff",         // violet-50
    borderColor: "#ddd6fe", // violet-200
    games: GAMES.filter((g) => g.category === "C"),
  },
];

// Pre-compute the start card index for each category (for stagger animations)
const CATEGORY_START_INDEX = CATEGORIES.reduce<number[]>((acc, cat, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + CATEGORIES[i - 1].games.length);
  return acc;
}, []);

export default function DashboardPage() {

  return (
    <div className="w-full h-full flex flex-col overflow-hidden relative bg-[#e0f2fe] text-gray-900 font-sans">
      {/* ─── Subtle grid pattern ─── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(14,165,233,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.08) 1px, transparent 1px)",
          backgroundSize: "clamp(40px, 5vw, 80px) clamp(40px, 5vh, 80px)",
        }}
      />

      {/* ─── Header ─── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex items-center justify-between flex-shrink-0"
        style={{
          padding: "clamp(10px, 1.6vh, 20px) clamp(20px, 4vw, 60px)",
          background: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(10px)",
          borderBottom: "1.5px solid rgba(186,230,253,0.7)",
        }}
      >
        {/* ─── LEFT: Institution Logos ─── */}
        <div className="flex items-center gap-5">
          {/* Dinas Pendidikan Kota Surakarta */}
          <div className="flex items-center gap-3">
            <img
              src="/DinasPendidikanKotaSurakarta_nobg.webp"
              alt="Logo Dinas Pendidikan Kota Surakarta"
              style={{
                height: "clamp(36px, 5vh, 56px)",
                width: "auto",
                objectFit: "contain",
              }}
            />
            <div className="flex flex-col">
              <span
                className="font-bold text-gray-700 leading-tight"
                style={{ fontSize: "clamp(0.56rem, 0.78vw, 0.74rem)" }}
              >
                Dinas Pendidikan
              </span>
              <span
                className="font-bold text-gray-700 leading-tight"
                style={{ fontSize: "clamp(0.56rem, 0.78vw, 0.74rem)" }}
              >
                Kota Surakarta
              </span>
            </div>
          </div>

          {/* Divider */}
          <div
            className="self-stretch rounded-full bg-gray-300"
            style={{ width: "1.5px", marginBlock: "4px" }}
          />

          {/* SMP Negeri 14 Surakarta */}
          <div className="flex items-center gap-3">
            <img
              src="/smpn14_nobg.webp"
              alt="Logo SMP Negeri 14 Surakarta"
              style={{
                mixBlendMode: "multiply",
                height: "clamp(36px, 5vh, 56px)",
                width: "auto",
                objectFit: "contain",
              }}
            />
            <div className="flex flex-col">
              <span
                className="font-bold text-gray-700 leading-tight"
                style={{ fontSize: "clamp(0.56rem, 0.78vw, 0.74rem)" }}
              >
                SMP Negeri 14
              </span>
              <span
                className="font-bold text-gray-700 leading-tight"
                style={{ fontSize: "clamp(0.56rem, 0.78vw, 0.74rem)" }}
              >
                Surakarta
              </span>
            </div>
          </div>
        </div>

        {/* ─── RIGHT: EduPanel Branding ─── */}
        <div className="flex flex-col items-end">
          <h1
            className="font-black leading-none tracking-tight text-[#0ea5e9]"
            style={{ fontSize: "var(--text-xl)" }}
          >
            EduPanel <span className="text-[#2563eb]">Hub</span>
          </h1>
          <p
            className="text-gray-500 font-bold tracking-wide mt-1"
            style={{ fontSize: "var(--text-xs)" }}
          >
            Interactive Learning Games · IFP Edition
          </p>
        </div>
      </motion.header>

      {/* ─── Category Sections ─── */}
      <main
        className="relative z-10 flex-1 flex flex-col min-h-0 overflow-hidden"
        style={{
          padding: "clamp(8px, 1.2vh, 16px) clamp(20px, 4vw, 60px) clamp(6px, 1vh, 12px)",
          gap: "clamp(6px, 1vh, 12px)",
        }}
      >
        {CATEGORIES.map((cat, catIdx) => {
          const startIndex = CATEGORY_START_INDEX[catIdx];

          return (
            <motion.section
              key={cat.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: catIdx * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col min-h-0"
            >
              {/* ── Category label row ── */}
              <div
                className="flex items-center gap-2 flex-shrink-0 mb-1"
              >
                {/* Color accent bar */}
                <div
                  className="rounded-full flex-shrink-0"
                  style={{ width: "3px", height: "clamp(14px, 2vh, 22px)", background: cat.color }}
                />
                <span>{cat.icon}</span>
                <span
                  className="font-black tracking-wide"
                  style={{ fontSize: "clamp(11px, 1vw, 15px)", color: cat.color }}
                >
                  {cat.label}
                </span>
                <span
                  className="font-medium text-gray-400"
                  style={{ fontSize: "clamp(10px, 0.85vw, 13px)" }}
                >
                  · {cat.games.length} game
                </span>

                {/* Hairline separator */}
                <div className="flex-1 h-px ml-1" style={{ background: `${cat.color}30` }} />
              </div>

              {/* ── Cards grid ── */}
              <div
                className="flex-1 grid min-h-0"
                style={{
                  gridTemplateColumns: `repeat(${cat.games.length}, 1fr)`,
                  gap: "clamp(8px, 1.2vw, 16px)",
                }}
              >
                {cat.games.map((game, i) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    index={startIndex + i}
                    accentColor={cat.color}
                    accentBg={cat.bg}
                  />
                ))}
              </div>
            </motion.section>
          );
        })}
      </main>

    </div>
  );
}
