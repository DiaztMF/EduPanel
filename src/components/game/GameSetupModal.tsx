"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Zap,
  Flame,
  Timer,
  Clock,
  Hourglass,
  Play,
  SlidersHorizontal,
} from "lucide-react";

export type GameDifficulty = "easy" | "medium" | "hard";

export interface GameSetupModalProps {
  isOpen: boolean;
  gameTitle: string;
  gameSubtitle: string;
  availableDifficulties?: GameDifficulty[];
  availableDurations?: number[];
  defaultDifficulty?: GameDifficulty;
  defaultDuration?: number;
  onStart: (config: { difficulty: GameDifficulty; duration: number }) => void;
}

const DIFFICULTY_CONFIG: Record<
  GameDifficulty,
  {
    label: string;
    sublabel: string;
    icon: typeof Sparkles;
    activeBorder: string;
    activeBg: string;
    iconColor: string;
    badgeColor: string;
  }
> = {
  easy: {
    label: "Mudah",
    sublabel: "Konsep dasar dan santai",
    icon: Sparkles,
    activeBorder: "border-emerald-500",
    activeBg: "bg-emerald-50/90",
    iconColor: "text-emerald-600",
    badgeColor: "bg-emerald-100 text-emerald-800",
  },
  medium: {
    label: "Sedang",
    sublabel: "Standar kompetisi seimbang",
    icon: Zap,
    activeBorder: "border-sky-500",
    activeBg: "bg-sky-50/90",
    iconColor: "text-sky-600",
    badgeColor: "bg-sky-100 text-sky-800",
  },
  hard: {
    label: "Sulit",
    sublabel: "Tantangan kecepatan tinggi",
    icon: Flame,
    activeBorder: "border-rose-500",
    activeBg: "bg-rose-50/90",
    iconColor: "text-rose-600",
    badgeColor: "bg-rose-100 text-rose-800",
  },
};

const DURATION_CONFIG: Record<
  number,
  {
    label: string;
    sublabel: string;
    icon: typeof Clock;
  }
> = {
  30: {
    label: "30 Detik",
    sublabel: "Ronde Kilat",
    icon: Timer,
  },
  60: {
    label: "60 Detik",
    sublabel: "Waktu Standar",
    icon: Clock,
  },
  90: {
    label: "90 Detik",
    sublabel: "Sesi Penuh",
    icon: Hourglass,
  },
};

export function GameSetupModal({
  isOpen,
  gameTitle,
  gameSubtitle,
  availableDifficulties = ["easy", "medium", "hard"],
  availableDurations = [30, 60, 90],
  defaultDifficulty = "medium",
  defaultDuration = 60,
  onStart,
}: GameSetupModalProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<GameDifficulty>(defaultDifficulty);
  const [selectedDuration, setSelectedDuration] = useState<number>(defaultDuration);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className="relative w-full bg-white rounded-3xl shadow-2xl border-2 border-slate-200 overflow-hidden flex flex-col z-10"
          style={{
            maxWidth: "clamp(500px, 58vw, 840px)",
            maxHeight: "92vh",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 sm:px-8 py-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 shadow-sm">
                <SlidersHorizontal size={24} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                  {gameTitle}
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-slate-500">
                  {gameSubtitle} | Pengaturan Sebelum Bermain
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
              Panel IFP Siap
            </span>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 sm:space-y-8">
            {/* Section 1: Difficulty */}
            {availableDifficulties.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs sm:text-sm font-black tracking-wider uppercase text-slate-600">
                    Pilih Tingkat Kesulitan
                  </h3>
                  <span className="text-xs font-bold text-slate-400">
                    Mempengaruhi kompleksitas soal
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {availableDifficulties.map((diff) => {
                    const cfg = DIFFICULTY_CONFIG[diff];
                    const Icon = cfg.icon;
                    const isSelected = selectedDifficulty === diff;

                    return (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setSelectedDifficulty(diff)}
                        className={`touch-btn flex flex-col items-start p-4 sm:p-5 rounded-2xl border-2 transition-all text-left min-h-[72px] sm:min-h-[96px] ${
                          isSelected
                            ? `${cfg.activeBorder} ${cfg.activeBg} shadow-md ring-2 ring-offset-1 ring-sky-400/50`
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-2">
                          <div
                            className={`p-2 rounded-xl ${
                              isSelected ? "bg-white shadow-sm" : "bg-slate-100"
                            } ${cfg.iconColor}`}
                          >
                            <Icon size={20} />
                          </div>
                          {isSelected && (
                            <span
                              className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${cfg.badgeColor}`}
                            >
                              Dipilih
                            </span>
                          )}
                        </div>
                        <span className="font-black text-slate-800 text-base sm:text-lg leading-tight">
                          {cfg.label}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 mt-1 leading-snug">
                          {cfg.sublabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Section 2: Duration */}
            {availableDurations.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs sm:text-sm font-black tracking-wider uppercase text-slate-600">
                    Pilih Durasi Waktu
                  </h3>
                  <span className="text-xs font-bold text-slate-400">
                    Waktu hitung mundur per sesi
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {availableDurations.map((dur) => {
                    const cfg = DURATION_CONFIG[dur] || {
                      label: `${dur} Detik`,
                      sublabel: "Durasi Kustom",
                      icon: Clock,
                    };
                    const Icon = cfg.icon;
                    const isSelected = selectedDuration === dur;

                    return (
                      <button
                        key={dur}
                        type="button"
                        onClick={() => setSelectedDuration(dur)}
                        className={`touch-btn flex flex-col items-start p-4 sm:p-5 rounded-2xl border-2 transition-all text-left min-h-[72px] sm:min-h-[96px] ${
                          isSelected
                            ? "border-sky-500 bg-sky-50/90 shadow-md ring-2 ring-offset-1 ring-sky-400/50"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-2">
                          <div
                            className={`p-2 rounded-xl ${
                              isSelected ? "bg-white shadow-sm text-sky-600" : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            <Icon size={20} />
                          </div>
                          {isSelected && (
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
                              Dipilih
                            </span>
                          )}
                        </div>
                        <span className="font-black text-slate-800 text-base sm:text-lg leading-tight">
                          {cfg.label}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 mt-1 leading-snug">
                          {cfg.sublabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="border-t border-slate-100 bg-slate-50/80 px-6 sm:px-8 py-5 flex items-center justify-between gap-4">
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-semibold text-slate-500">Konfigurasi Aktif:</span>
              <span className="text-sm font-black text-slate-800">
                {DIFFICULTY_CONFIG[selectedDifficulty]?.label || "Standar"} | {selectedDuration} Detik
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                onStart({
                  difficulty: selectedDifficulty,
                  duration: selectedDuration,
                })
              }
              className="touch-btn w-full sm:w-auto flex-1 sm:flex-initial flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-black text-lg shadow-lg shadow-sky-500/25 active:scale-95 transition-all min-h-[64px]"
            >
              <Play size={22} className="fill-white" />
              <span>Mulai Permainan</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
