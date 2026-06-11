"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Users, Timer } from "lucide-react";
import type { ReactNode } from "react";

export interface GameConfig {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  category?: string;
  description: string;
  players: number;
  duration: string;
  available: boolean;
}

interface GameCardProps {
  game: GameConfig;
  index: number;
  /** Category accent color passed from the section — e.g. #ffaa5e */
  accentColor?: string;
  accentBg?: string;
}

export function GameCard({ game, index, accentColor = "#0ea5e9", accentBg = "#f0f9ff" }: GameCardProps) {
  const router = useRouter();

  const handlePress = () => {
    if (!game.available) return;
    router.push(`/games/${game.slug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      whileHover={game.available ? { y: -3, boxShadow: `0 8px 24px ${accentColor}25` } : {}}
      whileTap={game.available ? { scale: 0.96 } : {}}
      onClick={handlePress}
      className="bg-white rounded-2xl border-2 relative cursor-pointer select-none overflow-hidden flex flex-col transition-colors"
      style={{
        borderColor: `${accentColor}40`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      {/* ── Category color top bar ── */}
      <div
        className="w-full flex-shrink-0"
        style={{ height: "4px", background: accentColor, opacity: 0.7 }}
      />

      {/* ── Unavailable overlay ── */}
      {!game.available && (
        <div className="absolute inset-0 rounded-2xl bg-white/90 z-10 flex items-center justify-center backdrop-blur-sm">
          <span
            className="font-bold tracking-widest uppercase text-gray-400 border border-gray-200 rounded-full px-4 py-1"
            style={{ fontSize: "clamp(10px, 1vw, 13px)" }}
          >
            Coming Soon
          </span>
        </div>
      )}

      {/* ── Card body ── */}
      <div className="flex flex-col flex-1 min-h-0" style={{ padding: "clamp(10px, 1.5vw, 18px)" }}>

        {/* Icon + title row */}
        <div className="flex items-start gap-3 mb-2">
          {/* Icon bubble */}
          <div
            className="flex-shrink-0 flex items-center justify-center rounded-xl"
            style={{
              width: "clamp(40px, 5vw, 56px)",
              height: "clamp(40px, 5vw, 56px)",
              background: accentBg,
              border: `1.5px solid ${accentColor}35`,
            }}
          >
            {game.icon}
          </div>

          {/* Title & subtitle */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h3
              className="font-black text-gray-800 leading-tight line-clamp-1"
              style={{ fontSize: "clamp(12px, 1.3vw, 17px)" }}
            >
              {game.title}
            </h3>
            <p
              className="font-semibold leading-tight mt-0.5 line-clamp-1"
              style={{ fontSize: "clamp(10px, 0.95vw, 13px)", color: accentColor }}
            >
              {game.subtitle}
            </p>
          </div>
        </div>

        {/* Description */}
        <p
          className="text-gray-500 leading-snug flex-1 min-h-0 line-clamp-2"
          style={{ fontSize: "clamp(9px, 0.85vw, 12px)" }}
        >
          {game.description}
        </p>

        {/* Footer: players + duration */}
        <div className="flex items-center justify-between mt-2 flex-shrink-0">
          <div
            className="flex items-center gap-1 rounded-full font-bold"
            style={{
              background: `${accentColor}15`,
              color: accentColor,
              padding: "clamp(2px, 0.4vh, 4px) clamp(6px, 0.8vw, 10px)",
              fontSize: "clamp(9px, 0.8vw, 11px)",
            }}
          >
            <Users size={12} /> {game.players}P
          </div>
          <span
            className="text-gray-400 font-bold"
            style={{ fontSize: "clamp(9px, 0.8vw, 11px)" }}
          >
            <Timer size={12} /> {game.duration}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
