export interface VocabPair {
  id: string;
  english: string;
  indonesian: string;
  difficulty: "easy" | "medium" | "hard";
  category?: string;
}

export const VOCAB_PAIRS: VocabPair[] = [
  // ─── EASY: KATA DASAR & SEHARI-HARI ───
  // Benda & Rumah
  { id: "e1", english: "Book", indonesian: "Buku", difficulty: "easy", category: "Benda" },
  { id: "e2", english: "Door", indonesian: "Pintu", difficulty: "easy", category: "Benda" },
  { id: "e3", english: "Table", indonesian: "Meja", difficulty: "easy", category: "Benda" },
  { id: "e4", english: "Chair", indonesian: "Kursi", difficulty: "easy", category: "Benda" },
  { id: "e5", english: "Water", indonesian: "Air", difficulty: "easy", category: "Benda" },
  { id: "e6", english: "House", indonesian: "Rumah", difficulty: "easy", category: "Benda" },
  { id: "e7", english: "Clock", indonesian: "Jam", difficulty: "easy", category: "Benda" },

  // Hewan Dasar
  { id: "e8", english: "Cat", indonesian: "Kucing", difficulty: "easy", category: "Hewan" },
  { id: "e9", english: "Dog", indonesian: "Anjing", difficulty: "easy", category: "Hewan" },
  { id: "e10", english: "Fish", indonesian: "Ikan", difficulty: "easy", category: "Hewan" },
  { id: "e11", english: "Bird", indonesian: "Burung", difficulty: "easy", category: "Hewan" },
  { id: "e12", english: "Horse", indonesian: "Kuda", difficulty: "easy", category: "Hewan" },

  // Alam Dasar
  { id: "e13", english: "Sun", indonesian: "Matahari", difficulty: "easy", category: "Alam" },
  { id: "e14", english: "Moon", indonesian: "Bulan", difficulty: "easy", category: "Alam" },
  { id: "e15", english: "Star", indonesian: "Bintang", difficulty: "easy", category: "Alam" },
  { id: "e16", english: "Tree", indonesian: "Pohon", difficulty: "easy", category: "Alam" },
  { id: "e17", english: "Fire", indonesian: "Api", difficulty: "easy", category: "Alam" },

  // Sifat Dasar
  { id: "e18", english: "Big", indonesian: "Besar", difficulty: "easy", category: "Sifat" },
  { id: "e19", english: "Small", indonesian: "Kecil", difficulty: "easy", category: "Sifat" },
  { id: "e20", english: "Happy", indonesian: "Senang", difficulty: "easy", category: "Sifat" },

  // ─── MEDIUM: LINGKUNGAN, PROFESI & SAINS ───
  // Alam & Geografi
  { id: "m1", english: "Mountain", indonesian: "Gunung", difficulty: "medium", category: "Alam" },
  { id: "m2", english: "River", indonesian: "Sungai", difficulty: "medium", category: "Alam" },
  { id: "m3", english: "Forest", indonesian: "Hutan", difficulty: "medium", category: "Alam" },
  { id: "m4", english: "Ocean", indonesian: "Samudra", difficulty: "medium", category: "Alam" },
  { id: "m5", english: "Island", indonesian: "Pulau", difficulty: "medium", category: "Alam" },
  { id: "m6", english: "Waterfall", indonesian: "Air Terjun", difficulty: "medium", category: "Alam" },
  { id: "m7", english: "Volcano", indonesian: "Gunung Berapi", difficulty: "medium", category: "Alam" },
  { id: "m8", english: "Desert", indonesian: "Padang Pasir", difficulty: "medium", category: "Alam" },

  // Hewan Spesifik
  { id: "m9", english: "Elephant", indonesian: "Gajah", difficulty: "medium", category: "Hewan" },
  { id: "m10", english: "Tiger", indonesian: "Harimau", difficulty: "medium", category: "Hewan" },
  { id: "m11", english: "Eagle", indonesian: "Elang", difficulty: "medium", category: "Hewan" },
  { id: "m12", english: "Dolphin", indonesian: "Lumba-lumba", difficulty: "medium", category: "Hewan" },
  { id: "m13", english: "Butterfly", indonesian: "Kupu-kupu", difficulty: "medium", category: "Hewan" },

  // Profesi
  { id: "m14", english: "Teacher", indonesian: "Guru", difficulty: "medium", category: "Profesi" },
  { id: "m15", english: "Doctor", indonesian: "Dokter", difficulty: "medium", category: "Profesi" },
  { id: "m16", english: "Farmer", indonesian: "Petani", difficulty: "medium", category: "Profesi" },
  { id: "m17", english: "Pilot", indonesian: "Pilot", difficulty: "medium", category: "Profesi" },
  { id: "m18", english: "Engineer", indonesian: "Insinyur", difficulty: "medium", category: "Profesi" },

  // Fasilitas & Benda
  { id: "m19", english: "Library", indonesian: "Perpustakaan", difficulty: "medium", category: "Tempat" },
  { id: "m20", english: "Bridge", indonesian: "Jembatan", difficulty: "medium", category: "Benda" },
  { id: "m21", english: "Compass", indonesian: "Kompas", difficulty: "medium", category: "Benda" },
  { id: "m22", english: "Telescope", indonesian: "Teleskop", difficulty: "medium", category: "Benda" },

  // ─── HARD: AKADEMIK, KONSEP & KATA TINGKAT TINGGI ───
  // Sains & Teknologi
  { id: "h1", english: "Microscope", indonesian: "Mikroskop", difficulty: "hard", category: "Sains" },
  { id: "h2", english: "Atmosphere", indonesian: "Atmosfer", difficulty: "hard", category: "Sains" },
  { id: "h3", english: "Evaporation", indonesian: "Penguapan", difficulty: "hard", category: "Sains" },
  { id: "h4", english: "Photosynthesis", indonesian: "Fotosintesis", difficulty: "hard", category: "Sains" },
  { id: "h5", english: "Ecosystem", indonesian: "Ekosistem", difficulty: "hard", category: "Sains" },
  { id: "h6", english: "Gravitation", indonesian: "Gravitasi", difficulty: "hard", category: "Sains" },

  // Konsep & Sifat Abstrak
  { id: "h7", english: "Lighthouse", indonesian: "Mercusuar", difficulty: "hard", category: "Benda" },
  { id: "h8", english: "Conservation", indonesian: "Konservasi", difficulty: "hard", category: "Sosial" },
  { id: "h9", english: "Archipelago", indonesian: "Nusantara", difficulty: "hard", category: "Geografi" },
  { id: "h10", english: "Equator", indonesian: "Khatulistiwa", difficulty: "hard", category: "Geografi" },
  { id: "h11", english: "Perseverance", indonesian: "Kegigihan", difficulty: "hard", category: "Sifat" },
  { id: "h12", english: "Knowledge", indonesian: "Pengetahuan", difficulty: "hard", category: "Akademik" },
  { id: "h13", english: "Independence", indonesian: "Kemerdekaan", difficulty: "hard", category: "Sejarah" },
  { id: "h14", english: "Civilization", indonesian: "Peradaban", difficulty: "hard", category: "Sejarah" },
  { id: "h15", english: "Heritage", indonesian: "Warisan Budaya", difficulty: "hard", category: "Budaya" },
  { id: "h16", english: "Biodiversity", indonesian: "Keanekaragaman Hayati", difficulty: "hard", category: "Sains" },
];

export function getRoundPairs(
  count = 5,
  difficulty: "easy" | "medium" | "hard" = "medium"
): VocabPair[] {
  const filtered = VOCAB_PAIRS.filter((p) => p.difficulty === difficulty);
  const pool = filtered.length >= count ? filtered : VOCAB_PAIRS;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
