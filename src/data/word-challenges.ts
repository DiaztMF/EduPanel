export interface WordChallenge {
  id: string;
  clue: string;           // kalimat dengan blank (___)
  answer: string;         // jawaban benar
  options: string[];      // 4 pilihan kata
  category: "ipa" | "ips" | "bahasa" | "umum";
  difficulty: "easy" | "medium" | "hard";
}

function w(
  clue: string,
  answer: string,
  options: string[],
  category: WordChallenge["category"],
  difficulty: WordChallenge["difficulty"]
): WordChallenge {
  return { 
    id: Math.random().toString(36).slice(2), 
    clue, 
    answer: answer.toUpperCase(), 
    options: options.map(o => o.toUpperCase()), 
    category, 
    difficulty 
  };
}

export const WORD_CHALLENGES: WordChallenge[] = [
  // ─── IPA ───
  w("Pohon besar memiliki banyak ___.", "DAUN", ["AIR", "PASIR", "BATU", "DAUN"], "ipa", "easy"),
  w("Hewan berdarah dingin yang hidup di dua alam disebut ___.", "AMFIBI", ["AMFIBI", "MAMALIA", "UNGGAS", "REPTIL"], "ipa", "medium"),
  w("Proses perubahan wujud cair menjadi gas adalah ___.", "PENGUAPAN", ["PEMBEKUAN", "PENGUAPAN", "PENCAIRAN", "PENYALURAN"], "ipa", "easy"),
  w("Pusat tata surya kita adalah ___.", "MATAHARI", ["BULAN", "BUMI", "MATAHARI", "BINTANG"], "ipa", "easy"),
  w("Manusia bernapas menghirup ___.", "OKSIGEN", ["KARBON", "NITROGEN", "OKSIGEN", "HIDROGEN"], "ipa", "easy"),

  // ─── IPS ───
  w("Kegiatan jual beli barang dan jasa disebut ___.", "PERDAGANGAN", ["PERDAGANGAN", "PERTANIAN", "PENDIDIKAN", "PERINDUSTRIAN"], "ips", "easy"),
  w("Candi Borobudur terletak di provinsi ___.", "JAWA TENGAH", ["JAWA BARAT", "JAWA TIMUR", "JAWA TENGAH", "BALI"], "ips", "medium"),
  w("Alat pembayaran yang sah adalah ___.", "UANG", ["BARTER", "UANG", "CEK", "EMAS"], "ips", "easy"),
  w("Orang yang menjalankan kereta api disebut ___.", "MASINIS", ["PILOT", "NAHKODA", "MASINIS", "SUPIR"], "ips", "easy"),
  
  // ─── BAHASA ───
  w("Antonim dari kata 'Besar' adalah ___.", "KECIL", ["PANJANG", "KECIL", "LEBAR", "TINGGI"], "bahasa", "easy"),
  w("Karangan yang berisi pengalaman nyata disebut ___.", "NONFIKSI", ["FIKSI", "NONFIKSI", "DONGENG", "FABEL"], "bahasa", "medium"),
  w("Budi membaca ___ di perpustakaan.", "BUKU", ["BUKU", "SEPATU", "PIRING", "MEJA"], "bahasa", "easy"),
  w("Ibu memasak nasi di ___.", "DAPUR", ["KAMAR", "HALAMAN", "DAPUR", "GARASI"], "bahasa", "easy"),

  // ─── UMUM ───
  w("Alat musik gitar dimainkan dengan cara ___.", "DIPETIK", ["DIPUKUL", "DIPETIK", "DITIUP", "DIGESEK"], "umum", "easy"),
  w("Warna bendera negara Indonesia adalah Merah dan ___.", "PUTIH", ["BIRU", "KUNING", "HIJAU", "PUTIH"], "umum", "easy"),
  w("Benda yang digunakan untuk berlindung dari hujan adalah ___.", "PAYUNG", ["KERTAS", "KAYU", "PAYUNG", "KARDUS"], "umum", "easy"),
  w("Hewan yang memiliki belalai panjang adalah ___.", "GAJAH", ["JERAPAH", "GAJAH", "HARIMAU", "KUDA"], "umum", "easy"),
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let pool = shuffle(WORD_CHALLENGES);
let poolIdx = 0;

export function getNextWord(): WordChallenge {
  if (poolIdx >= pool.length) { pool = shuffle(WORD_CHALLENGES); poolIdx = 0; }
  return pool[poolIdx++];
}

export function resetWordPool() {
  pool = shuffle(WORD_CHALLENGES);
  poolIdx = 0;
}

export const CATEGORY_COLOR: Record<WordChallenge["category"], string> = {
  ipa: "#4adeab",
  ips: "#ffaa5e",
  bahasa: "#a78bff",
  umum: "#6c8eff",
};

export const CATEGORY_LABEL: Record<WordChallenge["category"], string> = {
  ipa: "🔬 IPA",
  ips: "🌏 IPS",
  bahasa: "📖 Bahasa",
  umum: "⭐ Umum",
};
