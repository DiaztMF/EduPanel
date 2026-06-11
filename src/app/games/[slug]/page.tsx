"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function GameComingSoon() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6 text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.4 }}
        style={{ fontSize: "clamp(60px, 10vw, 120px)" }}
      >
        🚧
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="font-black text-white" style={{ fontSize: "var(--text-2xl)" }}>
          Game Coming Soon
        </h1>
        <p className="text-white/40 mt-2" style={{ fontSize: "var(--text-base)" }}>
          Module ini sedang dalam pengembangan. Stay tuned!
        </p>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <Link
          href="/"
          style={{
            background: "linear-gradient(135deg, #6c8eff, #a78bff)",
            color: "white",
            padding: "clamp(12px, 2vh, 20px) clamp(24px, 4vw, 48px)",
            fontSize: "var(--text-base)",
            fontWeight: 700,
            borderRadius: "16px",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
            minHeight: "var(--touch-lg)",
          }}
        >
          ← Kembali ke Dashboard
        </Link>
      </motion.div>
    </div>
  );
}
