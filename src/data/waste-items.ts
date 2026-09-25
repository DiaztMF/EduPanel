export type WasteCategory = "organik" | "anorganik" | "b3";

export interface WasteItem {
  id: string;
  name: string;
  category: WasteCategory;
  hint: string;
  difficulty: "easy" | "medium" | "hard";
}

export const WASTE_ITEMS: WasteItem[] = [
  // ─── ORGANIK ───
  { id: "w1", name: "Kulit Pisang", category: "organik", hint: "Sisa buah mudah membusuk", difficulty: "easy" },
  { id: "w2", name: "Daun Kering", category: "organik", hint: "Bahan kompos alami", difficulty: "easy" },
  { id: "w3", name: "Sisa Nasi", category: "organik", hint: "Sisa bahan pangan rumah tangga", difficulty: "easy" },
  { id: "w4", name: "Tulang Ayam", category: "organik", hint: "Sisa protein hewani hayati", difficulty: "easy" },
  { id: "w5", name: "Ampas Kopi", category: "organik", hint: "Sisa bubuk kopi organik", difficulty: "medium" },
  { id: "w6", name: "Kulit Telur", category: "organik", hint: "Kaya kalsium organik", difficulty: "medium" },
  { id: "w7", name: "Sayuran Busuk", category: "organik", hint: "Sampah sayur dapur", difficulty: "easy" },
  { id: "w8", name: "Ranting Kayu", category: "organik", hint: "Bahan kayu nabati lapuk", difficulty: "medium" },

  // ─── ANORGANIK ───
  { id: "a1", name: "Botol Plastik", category: "anorganik", hint: "Plastik PET dapat didaur ulang", difficulty: "easy" },
  { id: "a2", name: "Kaleng Minuman", category: "anorganik", hint: "Aluminium / logam daur ulang", difficulty: "easy" },
  { id: "a3", name: "Koran Bekas", category: "anorganik", hint: "Serat kertas daur ulang", difficulty: "easy" },
  { id: "a4", name: "Botol Kaca", category: "anorganik", hint: "Kaca silika dapat dilebur ulang", difficulty: "medium" },
  { id: "a5", name: "Kardus Karton", category: "anorganik", hint: "Kertas tebal daur ulang", difficulty: "easy" },
  { id: "a6", name: "Kantong Kresek", category: "anorganik", hint: "Plastik polietilena tipis", difficulty: "easy" },
  { id: "a7", name: "Gelas Styrofoam", category: "anorganik", hint: "Polistirena sulit terurai", difficulty: "medium" },
  { id: "a8", name: "Kawat Logam", category: "anorganik", hint: "Logam anorganik keras", difficulty: "medium" },

  // ─── B3 (Bahan Berbahaya dan Beracun) ───
  { id: "b1", name: "Baterai Bekas", category: "b3", hint: "Mengandung timbal dan asam kimia", difficulty: "easy" },
  { id: "b2", name: "Lampu Neon", category: "b3", hint: "Mengandung uap merkuri beracun", difficulty: "easy" },
  { id: "b3", name: "Kaleng Cat", category: "b3", hint: "Sisa zat kimia pelarut volatil", difficulty: "medium" },
  { id: "b4", name: "Obat Kedaluwarsa", category: "b3", hint: "Limbah farmasi berbahaya", difficulty: "easy" },
  { id: "b5", name: "Oli Mesin Bekas", category: "b3", hint: "Limbah pelumas beracun", difficulty: "medium" },
  { id: "b6", name: "Tabung Aerosol", category: "b3", hint: "Gas bertekanan mudah meledak", difficulty: "hard" },
  { id: "b7", name: "Termometer Merkuri", category: "b3", hint: "Logam cair raksa sangat berbahaya", difficulty: "hard" },
  { id: "b8", name: "Pestisida Bekas", category: "b3", hint: "Racun kimia hama tanaman", difficulty: "hard" },
];

export const WASTE_CONFIG: Record<
  WasteCategory,
  { label: string; iconKey: "leaf" | "recycle" | "shield"; color: string; bg: string }
> = {
  organik: { label: "Organik", iconKey: "leaf", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  anorganik: { label: "Anorganik", iconKey: "recycle", color: "#0284c7", bg: "rgba(2,132,199,0.1)" },
  b3: { label: "B3 (Berbahaya)", iconKey: "shield", color: "#e11d48", bg: "rgba(225,29,72,0.1)" },
};

export function getRandomWaste(difficulty?: "easy" | "medium" | "hard"): WasteItem {
  const filtered = difficulty
    ? WASTE_ITEMS.filter((w) => (difficulty === "hard" ? true : w.difficulty === difficulty || w.difficulty === "easy"))
    : WASTE_ITEMS;
  const pool = filtered.length > 0 ? filtered : WASTE_ITEMS;
  return pool[Math.floor(Math.random() * pool.length)];
}
