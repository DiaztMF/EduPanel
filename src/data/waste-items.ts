export type WasteCategory = "organik" | "anorganik" | "b3";

export interface WasteItem {
  id: string;
  name: string;
  emoji: string;
  category: WasteCategory;
  hint: string;
}

export const WASTE_ITEMS: WasteItem[] = [
  // ORGANIK
  { id: "w1", name: "Kulit Pisang", emoji: "🍌", category: "organik", hint: "Sisa makanan alami" },
  { id: "w2", name: "Daun Kering", emoji: "🍂", category: "organik", hint: "Bisa dijadikan kompos" },
  { id: "w3", name: "Sisa Nasi", emoji: "🍚", category: "organik", hint: "Makanan sisa" },
  { id: "w4", name: "Tulang Ayam", emoji: "🍗", category: "organik", hint: "Sisa protein hewani" },
  { id: "w5", name: "Ampas Kopi", emoji: "☕", category: "organik", hint: "Bisa jadi pupuk" },
  { id: "w6", name: "Kulit Telur", emoji: "🥚", category: "organik", hint: "Kaya kalsium, organik" },
  { id: "w7", name: "Sayuran Busuk", emoji: "🥦", category: "organik", hint: "Sampah sayur organik" },
  { id: "w8", name: "Buah Busuk", emoji: "🍎", category: "organik", hint: "Sampah buah organik" },

  // ANORGANIK
  { id: "a1", name: "Botol Plastik", emoji: "🍾", category: "anorganik", hint: "Plastik bisa didaur ulang" },
  { id: "a2", name: "Kaleng Minuman", emoji: "🥫", category: "anorganik", hint: "Logam daur ulang" },
  { id: "a3", name: "Koran Bekas", emoji: "📰", category: "anorganik", hint: "Kertas didaur ulang" },
  { id: "a4", name: "Botol Kaca", emoji: "🫙", category: "anorganik", hint: "Kaca bisa dilebur ulang" },
  { id: "a5", name: "Kardus", emoji: "📦", category: "anorganik", hint: "Kertas tebal daur ulang" },
  { id: "a6", name: "Tas Kresek", emoji: "🛍️", category: "anorganik", hint: "Plastik tipis" },
  { id: "a7", name: "Sendok Plastik", emoji: "🥄", category: "anorganik", hint: "Plastik sekali pakai" },
  { id: "a8", name: "Gelas Styrofoam", emoji: "🥤", category: "anorganik", hint: "Styrofoam sulit terurai" },

  // B3 (Bahan Berbahaya dan Beracun)
  { id: "b1", name: "Baterai Bekas", emoji: "🔋", category: "b3", hint: "Mengandung logam berat" },
  { id: "b2", name: "Lampu Neon", emoji: "💡", category: "b3", hint: "Mengandung merkuri" },
  { id: "b3", name: "Cat Bekas", emoji: "🎨", category: "b3", hint: "Bahan kimia berbahaya" },
  { id: "b4", name: "Obat Kedaluwarsa", emoji: "💊", category: "b3", hint: "Limbah farmasi B3" },
  { id: "b5", name: "Oli Bekas", emoji: "🛢️", category: "b3", hint: "Limbah cair berbahaya" },
  { id: "b6", name: "Sprayer Aerosol", emoji: "💈", category: "b3", hint: "Gas bertekanan berbahaya" },
];

export const WASTE_CONFIG: Record<WasteCategory, { label: string; emoji: string; color: string; bg: string }> = {
  organik: { label: "Organik", emoji: "🌱", color: "#4adeab", bg: "rgba(74,222,171,0.1)" },
  anorganik: { label: "Anorganik", emoji: "♻️", color: "#6c8eff", bg: "rgba(108,142,255,0.1)" },
  b3: { label: "B3 (Berbahaya)", emoji: "☢️", color: "#ff6b6b", bg: "rgba(255,107,107,0.1)" },
};

export function getRandomWaste(): WasteItem {
  return WASTE_ITEMS[Math.floor(Math.random() * WASTE_ITEMS.length)];
}
