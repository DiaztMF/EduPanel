export interface BoardTile {
  id: number;
  type: "normal" | "quiz" | "bonus" | "penalty" | "rest" | "finish";
  emoji: string;
  label?: string;
  effect?: string; // description
  jump?: number;   // +N tiles forward, -N backward
}

export interface BoardQuestion {
  question: string;
  options: string[];
  answer: number; // index
  category: string;
}

// 30-tile trail
export const BOARD: BoardTile[] = [
  { id: 0, type: "normal", emoji: "🌿", label: "Start" },
  { id: 1, type: "quiz", emoji: "❓", label: "Kuis Alam" },
  { id: 2, type: "normal", emoji: "🌳" },
  { id: 3, type: "bonus", emoji: "⭐", label: "+2 Langkah", effect: "Maju 2 petak!", jump: 2 },
  { id: 4, type: "normal", emoji: "🐝" },
  { id: 5, type: "quiz", emoji: "❓", label: "Kuis Hewan" },
  { id: 6, type: "penalty", emoji: "🌧️", label: "Hujan Lebat", effect: "Mundur 2 petak!", jump: -2 },
  { id: 7, type: "normal", emoji: "🦋" },
  { id: 8, type: "rest", emoji: "💤", label: "Istirahat", effect: "Lewati 1 giliran" },
  { id: 9, type: "quiz", emoji: "❓", label: "Kuis Tanaman" },
  { id: 10, type: "normal", emoji: "🌺" },
  { id: 11, type: "bonus", emoji: "🍀", label: "Semanggi Keberuntungan", effect: "Maju 3 petak!", jump: 3 },
  { id: 12, type: "quiz", emoji: "❓", label: "Kuis Ekosistem" },
  { id: 13, type: "normal", emoji: "🐸" },
  { id: 14, type: "penalty", emoji: "🕸️", label: "Terperangkap Jaring", effect: "Mundur 3 petak!", jump: -3 },
  { id: 15, type: "quiz", emoji: "❓", label: "Kuis Hutan" },
  { id: 16, type: "normal", emoji: "🦜" },
  { id: 17, type: "bonus", emoji: "🌞", label: "Sinar Terang", effect: "Maju 2 petak!", jump: 2 },
  { id: 18, type: "normal", emoji: "🍄" },
  { id: 19, type: "quiz", emoji: "❓", label: "Kuis Konservasi" },
  { id: 20, type: "normal", emoji: "🦁" },
  { id: 21, type: "penalty", emoji: "🌪️", label: "Badai", effect: "Mundur 2 petak!", jump: -2 },
  { id: 22, type: "quiz", emoji: "❓", label: "Kuis Alam" },
  { id: 23, type: "normal", emoji: "🌴" },
  { id: 24, type: "bonus", emoji: "🦅", label: "Elang Membawa", effect: "Maju 4 petak!", jump: 4 },
  { id: 25, type: "quiz", emoji: "❓", label: "Kuis Final" },
  { id: 26, type: "normal", emoji: "🌿" },
  { id: 27, type: "rest", emoji: "💤", label: "Istirahat", effect: "Lewati 1 giliran" },
  { id: 28, type: "quiz", emoji: "❓", label: "Kuis Akhir" },
  { id: 29, type: "normal", emoji: "🏆" },
  { id: 30, type: "finish", emoji: "👑", label: "FINISH!" },
];

export const BOARD_QUESTIONS: BoardQuestion[] = [
  // Alam & Lingkungan
  { question: "Apa yang dilakukan tumbuhan saat proses fotosintesis?", options: ["Membuat makanan", "Makan serangga", "Minum air tanah", "Tidur siang"], answer: 0, category: "Alam" },
  { question: "Hewan apa yang disebut 'Raja Hutan'?", options: ["Harimau", "Singa", "Gajah", "Beruang"], answer: 1, category: "Hewan" },
  { question: "Apa nama proses daur ulang materi di alam?", options: ["Metamorfosis", "Siklus", "Ekosistem", "Habitat"], answer: 1, category: "Ekosistem" },
  { question: "Hutan hujan tropis terbesar di dunia ada di...?", options: ["Afrika", "Asia", "Amerika Selatan", "Australia"], answer: 2, category: "Hutan" },
  { question: "Apa yang dimaksud dengan rantai makanan?", options: ["Makanan berurutan", "Hubungan makan-memakan", "Jumlah makanan", "Jenis makanan"], answer: 1, category: "Ekosistem" },
  { question: "Tumbuhan apa yang bisa menangkap serangga?", options: ["Kantong Semar", "Melati", "Mawar", "Anggrek"], answer: 0, category: "Tanaman" },
  { question: "Proses perubahan ulat menjadi kupu-kupu disebut?", options: ["Fotosintesis", "Respirasi", "Metamorfosis", "Hibernasi"], answer: 2, category: "Hewan" },
  { question: "Lapisan bumi yang paling luar disebut?", options: ["Mantel", "Inti", "Kerak", "Atmosfer"], answer: 2, category: "Alam" },
  { question: "Hewan apa yang mengeluarkan tinta sebagai pertahanan?", options: ["Gurita", "Ikan Hiu", "Lumba-lumba", "Pari"], answer: 0, category: "Hewan" },
  { question: "Kegiatan apa yang paling merusak hutan?", options: ["Berkemah", "Pembalakan Liar", "Hiking", "Mengamati Burung"], answer: 1, category: "Konservasi" },
  { question: "Gas apa yang dibutuhkan tumbuhan untuk fotosintesis?", options: ["Oksigen", "Nitrogen", "Karbon Dioksida", "Hidrogen"], answer: 2, category: "Tanaman" },
  { question: "Apa nama bunga nasional Indonesia?", options: ["Melati", "Anggrek Bulan", "Mawar", "Semua benar"], answer: 3, category: "Tanaman" },
  { question: "Hewan yang aktif di malam hari disebut?", options: ["Diurnal", "Nokturnal", "Hibernasi", "Migrasi"], answer: 1, category: "Hewan" },
  { question: "Apa yang terjadi pada hewan yang berhibernasi?", options: ["Migrasi", "Tidur panjang di musim dingin", "Bertelur", "Berganti kulit"], answer: 1, category: "Hewan" },
  { question: "Tanaman apa yang paling banyak menghasilkan oksigen?", options: ["Kaktus", "Bambu", "Pohon Trembesi", "Rumput"], answer: 2, category: "Konservasi" },
];

export function getRandomQuestion(exclude: number[] = []): BoardQuestion {
  const available = BOARD_QUESTIONS.filter((_, i) => !exclude.includes(i));
  if (available.length === 0) return BOARD_QUESTIONS[Math.floor(Math.random() * BOARD_QUESTIONS.length)];
  return available[Math.floor(Math.random() * available.length)];
}
