"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export interface GameConfig {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  icon: string;
  category?: string; // Kept as optional if still defined in page.tsx
  description: string;
  players: number;
  duration: string;
  available: boolean;
}

interface GameCardProps {
  game: GameConfig;
  index: number;
}

export function GameCard({ game, index }: GameCardProps) {
  const router = useRouter();

  const handlePress = () => {
    if (!game.available) return;
    router.push(`/games/${game.slug}`);
  };

  const borderColor = "#bae6fd"; // sky-200
  const glowColor = "#f0f9ff"; // sky-50

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileTap={game.available ? { scale: 0.94 } : {}}
      onClick={handlePress}
      className="bg-white rounded-2xl shadow-sm border-2 relative cursor-pointer select-none overflow-hidden hover:shadow-md transition-shadow"
      style={{
        padding: "clamp(16px, 2.5vw, 28px)",
        minHeight: "clamp(160px, 18vh, 220px)",
        borderColor: borderColor,
      }}
    >
      {/* Glow accent on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: glowColor }}
      />

      {/* Unavailable overlay */}
      {!game.available && (
        <div className="absolute inset-0 rounded-2xl bg-white/95 z-10 flex items-center justify-center">
          <span
            className="text-gray-500 font-bold tracking-widest uppercase"
            style={{ fontSize: "var(--text-xs)" }}
          >
            Coming Soon
          </span>
        </div>
      )}

      <div className="relative z-[1] flex flex-col h-full gap-3">
        {/* Icon */}
        <div
          className="flex items-center justify-center rounded-xl shadow-sm"
          style={{
            width: "clamp(48px, 6vw, 72px)",
            height: "clamp(48px, 6vw, 72px)",
            fontSize: "clamp(28px, 3.5vw, 44px)",
            background: glowColor,
            border: `1px solid ${borderColor}`,
          }}
        >
          {game.icon}
        </div>

        {/* Title & subtitle */}
        <div className="flex flex-col gap-1 flex-1">
          <h3
            className="font-bold text-gray-800 leading-tight"
            style={{ fontSize: "var(--text-sm)" }}
          >
            {game.title}
          </h3>
          <p
            className="text-gray-500 leading-snug font-medium"
            style={{ fontSize: "var(--text-xs)" }}
          >
            {game.subtitle}
          </p>
        </div>

        {/* Footer: duration */}
        <div className="flex items-center justify-end gap-2 mt-auto">
          <span className="text-gray-400 font-bold" style={{ fontSize: "clamp(10px, 1vw, 14px)" }}>
            ⏱ {game.duration}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
