export type BoardDifficulty = "easy" | "medium" | "hard";

export interface BoardTile {
  id: number;
  type: "normal" | "quiz" | "bonus" | "penalty" | "rest" | "finish";
  iconName: "start" | "quiz" | "bonus" | "penalty" | "rest" | "finish" | "path";
  label?: string;
  effect?: string; // description
  jump?: number; // +N tiles forward, -N backward
}

export interface BoardQuestion {
  question: string;
  options: string[];
  answer: number; // index
  category: string;
  difficulty: BoardDifficulty;
}

// 30-tile trail
export const BOARD: BoardTile[] = [
  { id: 0, type: "normal", iconName: "start", label: "Mulai" },
  { id: 1, type: "quiz", iconName: "quiz", label: "Kuis Alam" },
  { id: 2, type: "normal", iconName: "path" },
  { id: 3, type: "bonus", iconName: "bonus", label: "+2 Langkah", effect: "Maju 2 petak!", jump: 2 },
  { id: 4, type: "normal", iconName: "path" },
  { id: 5, type: "quiz", iconName: "quiz", label: "Kuis Hewan" },
  { id: 6, type: "penalty", iconName: "penalty", label: "Hujan Lebat", effect: "Mundur 2 petak!", jump: -2 },
  { id: 7, type: "normal", iconName: "path" },
  { id: 8, type: "rest", iconName: "rest", label: "Istirahat", effect: "Lewati 1 giliran" },
  { id: 9, type: "quiz", iconName: "quiz", label: "Kuis Tanaman" },
  { id: 10, type: "normal", iconName: "path" },
  { id: 11, type: "bonus", iconName: "bonus", label: "Jalur Cepat", effect: "Maju 3 petak!", jump: 3 },
  { id: 12, type: "quiz", iconName: "quiz", label: "Kuis Ekosistem" },
  { id: 13, type: "normal", iconName: "path" },
  { id: 14, type: "penalty", iconName: "penalty", label: "Terjebak Rawa", effect: "Mundur 3 petak!", jump: -3 },
  { id: 15, type: "quiz", iconName: "quiz", label: "Kuis Hutan" },
  { id: 16, type: "normal", iconName: "path" },
  { id: 17, type: "bonus", iconName: "bonus", label: "Arus Cepat", effect: "Maju 2 petak!", jump: 2 },
  { id: 18, type: "normal", iconName: "path" },
  { id: 19, type: "quiz", iconName: "quiz", label: "Kuis Konservasi" },
  { id: 20, type: "normal", iconName: "path" },
  { id: 21, type: "penalty", iconName: "penalty", label: "Badai Tropis", effect: "Mundur 2 petak!", jump: -2 },
  { id: 22, type: "quiz", iconName: "quiz", label: "Kuis Biologi" },
  { id: 23, type: "normal", iconName: "path" },
  { id: 24, type: "bonus", iconName: "bonus", label: "Dorongan Angin", effect: "Maju 4 petak!", jump: 4 },
  { id: 25, type: "quiz", iconName: "quiz", label: "Kuis Final" },
  { id: 26, type: "normal", iconName: "path" },
  { id: 27, type: "rest", iconName: "rest", label: "Istirahat", effect: "Lewati 1 giliran" },
  { id: 28, type: "quiz", iconName: "quiz", label: "Kuis Puncak" },
  { id: 29, type: "normal", iconName: "path" },
  { id: 30, type: "finish", iconName: "finish", label: "SELESAI" },
];

export const BOARD_QUESTIONS: BoardQuestion[] = [
  // ─── TIER 1: EASY ───
  { question: "Hewan apa yang dijuluki Sang Raja Hutan?", options: ["Harimau", "Singa", "Gajah", "Beruang"], answer: 1, category: "Hewan", difficulty: "easy" },
  { question: "Apa fungsi utama akar pada tumbuhan?", options: ["Menyerap air & mineral", "Menghasilkan bunga", "Menangkap serangga", "Melindungi daun"], answer: 0, category: "Tanaman", difficulty: "easy" },
  { question: "Hewan yang aktif mencari makan di malam hari disebut hewan...?", options: ["Diurnal", "Nokturnal", "Karnivora", "Herbivora"], answer: 1, category: "Hewan", difficulty: "easy" },
  { question: "Apa warna zat klorofil pada daun tumbuhan?", options: ["Merah", "Kuning", "Hijau", "Cokelat"], answer: 2, category: "Tanaman", difficulty: "easy" },
  { question: "Hewan apa yang bertelur dan menyusui anaknya di Australia?", options: ["Platipus", "Kanguru", "Koala", "Wombat"], answer: 0, category: "Hewan", difficulty: "easy" },
  { question: "Bagian tubuh ikan yang digunakan untuk bernapas adalah...?", options: ["Paru-paru", "Insang", "Kulit", "Sirip"], answer: 1, category: "Hewan", difficulty: "easy" },
  { question: "Apa makanan utama dari hewan panda raksasa?", options: ["Ikan", "Bambu", "Daging", "Buah apel"], answer: 1, category: "Hewan", difficulty: "easy" },
  { question: "Proses perubahan ulat menjadi kepompong lalu kupu-kupu disebut...?", options: ["Fotosintesis", "Respirasi", "Metamorfosis", "Evolusi"], answer: 2, category: "Hewan", difficulty: "easy" },
  { question: "Bunga bangkai khas Bengkulu yang berukuran raksasa adalah...?", options: ["Melati", "Rafflesia arnoldii", "Mawar", "Anggrek"], answer: 1, category: "Tanaman", difficulty: "easy" },
  { question: "Hewan yang memakan tumbuhan saja disebut kelompok...?", options: ["Karnivora", "Herbivora", "Omnivora", "Insektivora"], answer: 1, category: "Hewan", difficulty: "easy" },
  { question: "Apa nama alat gerak utama pada burung untuk terbang?", options: ["Kaki", "Sayap", "Ekor", "Paruh"], answer: 1, category: "Hewan", difficulty: "easy" },
  { question: "Bumi berputar pada porosnya menyebabkan terjadinya...?", options: ["Musim hujan", "Siang dan malam", "Gerhana bulan", "Tsunami"], answer: 1, category: "Alam", difficulty: "easy" },

  // ─── TIER 2: MEDIUM ───
  { question: "Apa gas yang diserap tumbuhan saat fotosintesis?", options: ["Oksigen", "Nitrogen", "Karbon Dioksida", "Helium"], answer: 2, category: "Alam", difficulty: "medium" },
  { question: "Hutan hujan tropis terbesar di dunia berada di benua...?", options: ["Afrika", "Asia", "Amerika Selatan", "Australia"], answer: 2, category: "Hutan", difficulty: "medium" },
  { question: "Hubungan timbal balik antara makhluk hidup dan lingkungannya disebut...?", options: ["Habitat", "Ekosistem", "Komunitas", "Populasi"], answer: 1, category: "Ekosistem", difficulty: "medium" },
  { question: "Hewan yang mengeluarkan tinta gelap untuk melarikan diri dari musuh adalah...?", options: ["Gurita", "Hiu", "Pari", "Lumba-lumba"], answer: 0, category: "Hewan", difficulty: "medium" },
  { question: "Tumbuhan insektivora pemakan serangga asli Indonesia adalah...?", options: ["Kaktus", "Kantong Semar", "Melati", "Kamboja"], answer: 1, category: "Tanaman", difficulty: "medium" },
  { question: "Lapisan bumi yang paling luar tempat manusia tinggal disebut...?", options: ["Mantel", "Inti Luar", "Kerak Bumi", "Inti Dalam"], answer: 2, category: "Alam", difficulty: "medium" },
  { question: "Kegiatan penebangan hutan secara liar dan tidak terkendali disebut...?", options: ["Reforestasi", "Pembalakan Liar", "Konservasi", "Terasering"], answer: 1, category: "Konservasi", difficulty: "medium" },
  { question: "Pohon peneduh kota yang efektif menyerap polusi karbon dioksida adalah...?", options: ["Beringin", "Trembesi", "Kelapa", "Palem"], answer: 1, category: "Konservasi", difficulty: "medium" },
  { question: "Taman Nasional Ujung Kulon terkenal sebagai habitat perlindungan bagi...?", options: ["Komodo", "Badak Jawa Bercula Satu", "Orangutan", "Harimau Sumatra"], answer: 1, category: "Konservasi", difficulty: "medium" },
  { question: "Simbiosis antara lebah madu dan bunga mekar termasuk jenis...?", options: ["Parasitisme", "Mutualisme", "Komensalisme", "Predasi"], answer: 1, category: "Ekosistem", difficulty: "medium" },
  { question: "Zat kapur pembentuk terumbu karang di lautan dihasilkan oleh hewan...?", options: ["Spons laut", "Polip Karang", "Ubur-ubur", "Bintang laut"], answer: 1, category: "Ekosistem", difficulty: "medium" },
  { question: "Reptil purba endemik Nusa Tenggara Timur yang dilindungi negara adalah...?", options: ["Biawak air", "Komodo", "Iguana", "Kadal duri"], answer: 1, category: "Hewan", difficulty: "medium" },

  // ─── TIER 3: HARD ───
  { question: "Organel sel tumbuhan tempat terjadinya proses fotosintesis adalah...?", options: ["Mitokondria", "Ribosom", "Kloroplas", "Vakuola"], answer: 2, category: "Biologi", difficulty: "hard" },
  { question: "Garis biogeografis pemisah fauna tipe Asia dan tipe peralihan di Indonesia adalah...?", options: ["Garis Wallace", "Garis Weber", "Garis Khatulistiwa", "Garis Lydekker"], answer: 0, category: "Alam", difficulty: "hard" },
  { question: "Bakteri pengikat nitrogen yang bersimbiosis dengan akar tanaman polong-polongan adalah...?", options: ["Escherichia coli", "Rhizobium", "Lactobacillus", "Streptococcus"], answer: 1, category: "Biologi", difficulty: "hard" },
  { question: "Lapisan atmosfer yang berfungsi menyerap radiasi ultraviolet matahari adalah...?", options: ["Troposfer", "Stratosfer (Ozon)", "Mesosfer", "Termosfer"], answer: 1, category: "Alam", difficulty: "hard" },
  { question: "Burung endemik Papua dengan bulu indah yang dijuluki Bird of Paradise adalah...?", options: ["Jalak Bali", "Cenderawasih", "Maleo", "Kakatua Raja"], answer: 1, category: "Hewan", difficulty: "hard" },
  { question: "Proses pengikisan batuan atau tanah oleh angin, air, atau gletser disebut...?", options: ["Sedimentasi", "Erosi", "Vulkanisme", "Tektonisme"], answer: 1, category: "Alam", difficulty: "hard" },
  { question: "Organ pernapasan tambahan pada ikan lele untuk hidup di air minim oksigen adalah...?", options: ["Labirin", "Operkulum", "Kantung udara", "Spirakel"], answer: 0, category: "Biologi", difficulty: "hard" },
  { question: "Tumbuhan yang menggugurkan daunnya pada musim kemarau untuk mengurangi penguapan adalah...?", options: ["Kaktus", "Pohon Jati", "Padi", "Lili air"], answer: 1, category: "Tanaman", difficulty: "hard" },
  { question: "Status konservasi tertinggi dari IUCN yang menandakan kepunahan total di alam liar adalah...?", options: ["Vulnerable", "Extinct in the Wild", "Endangered", "Near Threatened"], answer: 1, category: "Konservasi", difficulty: "hard" },
  { question: "Hormon pada tumbuhan yang memicu pematangan buah adalah...?", options: ["Auksin", "Giberelin", "Etilen", "Sitokinin"], answer: 2, category: "Biologi", difficulty: "hard" },
];

export function getRandomBoardQuestion(
  difficulty: BoardDifficulty,
  exclude: number[] = []
): BoardQuestion {
  const eligible = BOARD_QUESTIONS.filter(
    (q, i) => q.difficulty === difficulty && !exclude.includes(i)
  );
  if (eligible.length > 0) {
    return eligible[Math.floor(Math.random() * eligible.length)];
  }
  // Fallback to any in difficulty
  const byDiff = BOARD_QUESTIONS.filter((q) => q.difficulty === difficulty);
  if (byDiff.length > 0) {
    return byDiff[Math.floor(Math.random() * byDiff.length)];
  }
  return BOARD_QUESTIONS[Math.floor(Math.random() * BOARD_QUESTIONS.length)];
}
