export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
  category: "sains" | "geografi" | "sejarah" | "budaya";
  difficulty: "easy" | "medium" | "hard";
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function q(
  question: string,
  answer: string,
  wrongs: [string, string, string],
  category: TriviaQuestion["category"],
  difficulty: TriviaQuestion["difficulty"]
): TriviaQuestion {
  return {
    id: Math.random().toString(36).slice(2),
    question,
    options: shuffle([answer, ...wrongs]),
    answer,
    category,
    difficulty,
  };
}

export const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  // ─── SAINS ───
  q("Planet terbesar di tata surya kita adalah?", "Jupiter", ["Saturnus", "Neptunus", "Uranus"], "sains", "easy"),
  q("Simbol kimia untuk emas adalah?", "Au", ["Ag", "Fe", "Go"], "sains", "easy"),
  q("Berapa jumlah kaki pada serangga?", "6", ["4", "8", "10"], "sains", "easy"),
  q("Gas apa yang paling banyak di atmosfer bumi?", "Nitrogen", ["Oksigen", "Karbon Dioksida", "Argon"], "sains", "easy"),
  q("Organ manusia yang memompa darah adalah?", "Jantung", ["Paru-paru", "Hati", "Ginjal"], "sains", "easy"),
  q("Berapa kecepatan cahaya per detik (dibulatkan)?", "300.000 km/s", ["150.000 km/s", "500.000 km/s", "1.000.000 km/s"], "sains", "medium"),
  q("DNA adalah singkatan dari?", "Deoxyribonucleic Acid", ["Dinitrogen Acid", "Dimethyl Nucleic Acid", "Digital Nucleic Atom"], "sains", "medium"),
  q("Apa nama proses tumbuhan membuat makanan sendiri?", "Fotosintesis", ["Respirasi", "Osmosis", "Fermentasi"], "sains", "easy"),
  q("Berapa suhu titik didih air pada tekanan normal?", "100°C", ["90°C", "80°C", "120°C"], "sains", "easy"),
  q("Hewan apa yang memiliki sidik jari seperti manusia?", "Koala", ["Simpanse", "Gorila", "Orang Utan"], "sains", "hard"),
  q("Berapa jumlah tulang pada tubuh manusia dewasa?", "206", ["180", "250", "300"], "sains", "medium"),
  q("Planet manakah yang dikenal sebagai Planet Merah?", "Mars", ["Venus", "Merkurius", "Jupiter"], "sains", "easy"),
  q("Apa satuan dasar untuk mengukur listrik?", "Ampere", ["Volt", "Watt", "Ohm"], "sains", "medium"),
  q("Vertebrata adalah hewan yang memiliki?", "Tulang belakang", ["Sayap", "Insang", "Bulu"], "sains", "easy"),
  q("Apa nama lapisan ozon yang melindungi bumi?", "Stratosfer", ["Troposfer", "Mesosfer", "Termosfer"], "sains", "medium"),

  // ─── GEOGRAFI ───
  q("Ibukota Indonesia adalah?", "Jakarta", ["Surabaya", "Bandung", "Medan"], "geografi", "easy"),
  q("Gunung tertinggi di Indonesia adalah?", "Puncak Jaya", ["Gunung Rinjani", "Gunung Semeru", "Gunung Kerinci"], "geografi", "medium"),
  q("Sungai terpanjang di dunia adalah?", "Nil", ["Amazon", "Yangtze", "Mississippi"], "geografi", "easy"),
  q("Negara dengan luas wilayah terbesar di dunia adalah?", "Rusia", ["Kanada", "Amerika Serikat", "China"], "geografi", "easy"),
  q("Benua terkecil di dunia adalah?", "Australia", ["Eropa", "Antartika", "Amerika Selatan"], "geografi", "easy"),
  q("Danau terdalam di dunia adalah?", "Danau Baikal", ["Danau Superior", "Danau Titicaca", "Danau Toba"], "geografi", "medium"),
  q("Selat Malaka menghubungkan Samudra apa?", "Hindia dan Pasifik", ["Atlantik dan Hindia", "Arktik dan Pasifik", "Atlantik dan Pasifik"], "geografi", "medium"),
  q("Ibukota Jepang adalah?", "Tokyo", ["Osaka", "Kyoto", "Hiroshima"], "geografi", "easy"),
  q("Kota di Indonesia yang dikenal sebagai Kota Pahlawan adalah?", "Surabaya", ["Jakarta", "Bandung", "Semarang"], "geografi", "easy"),
  q("Pulau terluas di Indonesia adalah?", "Kalimantan", ["Sumatra", "Jawa", "Papua"], "geografi", "easy"),
  q("Negara mana yang berbatasan langsung dengan Indonesia di darat?", "Malaysia", ["Filipina", "Australia", "Singapura"], "geografi", "easy"),
  q("Gunung Bromo terletak di provinsi?", "Jawa Timur", ["Jawa Tengah", "Jawa Barat", "Nusa Tenggara"], "geografi", "easy"),

  // ─── SEJARAH ───
  q("Indonesia memproklamasikan kemerdekaan pada tanggal?", "17 Agustus 1945", ["17 Agustus 1950", "10 November 1945", "1 Juni 1945"], "sejarah", "easy"),
  q("Siapa yang membacakan teks Proklamasi Kemerdekaan RI?", "Soekarno", ["Mohammad Hatta", "Soepomo", "Sutan Sjahrir"], "sejarah", "easy"),
  q("Perang Dunia II berakhir pada tahun?", "1945", ["1939", "1942", "1950"], "sejarah", "easy"),
  q("Candi Borobudur dibangun oleh kerajaan?", "Syailendra", ["Majapahit", "Sriwijaya", "Mataram Kuno"], "sejarah", "medium"),
  q("Pahlawan yang dijuluki 'Bung Tomo' terkenal dalam peristiwa?", "10 November 1945", ["Proklamasi 1945", "Pertempuran Ambarawa", "Bandung Lautan Api"], "sejarah", "medium"),
  q("Kerajaan Majapahit mencapai puncak kejayaan di bawah pimpinan?", "Hayam Wuruk", ["Ken Arok", "Gajah Mada", "Raden Wijaya"], "sejarah", "medium"),
  q("Organisasi pergerakan nasional pertama di Indonesia adalah?", "Budi Utomo", ["Sarekat Islam", "Indische Partij", "PNI"], "sejarah", "medium"),
  q("Konferensi Asia Afrika berlangsung di kota?", "Bandung", ["Jakarta", "Surabaya", "Yogyakarta"], "sejarah", "easy"),

  // ─── BUDAYA ───
  q("Tari Saman berasal dari daerah?", "Aceh", ["Bali", "Jawa", "Sulawesi"], "budaya", "easy"),
  q("Batik diakui sebagai warisan budaya dunia oleh?", "UNESCO", ["PBB", "WHO", "ASEAN"], "budaya", "easy"),
  q("Wayang Kulit berasal dari kebudayaan?", "Jawa", ["Bali", "Sunda", "Melayu"], "budaya", "easy"),
  q("Lagu 'Indonesia Raya' diciptakan oleh?", "W.R. Supratman", ["Ismail Marzuki", "Gesang", "Cornel Simanjuntak"], "budaya", "easy"),
  q("Ulos adalah kain tradisional dari suku?", "Batak", ["Dayak", "Minangkabau", "Bugis"], "budaya", "easy"),
  q("Angklung adalah alat musik tradisional dari daerah?", "Sunda (Jawa Barat)", ["Bali", "Jawa Tengah", "Sulawesi Selatan"], "budaya", "easy"),
  q("Keris ditetapkan sebagai warisan budaya dunia oleh UNESCO pada tahun?", "2005", ["2003", "2009", "2010"], "budaya", "hard"),
  q("Tari Pendet berasal dari?", "Bali", ["NTB", "Jawa Timur", "Kalimantan"], "budaya", "easy"),
  q("Upacara adat Ngaben adalah tradisi suku?", "Bali", ["Toraja", "Dayak", "Minangkabau"], "budaya", "easy"),
  q("Motif Parang pada batik melambangkan?", "Ombak laut / keberanian", ["Bunga mekar", "Pohon kehidupan", "Burung garuda"], "budaya", "hard"),
];

let pool = shuffle(TRIVIA_QUESTIONS);
let poolIdx = 0;

export function getNextTrivia(): TriviaQuestion {
  if (poolIdx >= pool.length) {
    pool = shuffle(TRIVIA_QUESTIONS);
    poolIdx = 0;
  }
  return pool[poolIdx++];
}

export function resetTriviaPool() {
  pool = shuffle(TRIVIA_QUESTIONS);
  poolIdx = 0;
}

export const CATEGORY_EMOJI: Record<TriviaQuestion["category"], string> = {
  sains: "🔬",
  geografi: "🌏",
  sejarah: "📜",
  budaya: "🎭",
};
