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
  // ─── EASY: 3-4 HURUF & KATA DASAR ───
  // IPA
  w("Pohon besar memiliki banyak ___.", "DAUN", ["AIR", "PASIR", "BATU", "DAUN"], "ipa", "easy"),
  w("Benda yang menyala panas dan membakar adalah ___.", "API", ["ES", "API", "ANGIN", "AIR"], "ipa", "easy"),
  w("Ikan berenang menggunakan ___.", "SIRIP", ["KAKI", "SAYAP", "SIRIP", "PARUH"], "ipa", "easy"),
  w("Indra penglihatan pada manusia adalah ___.", "MATA", ["TELINGA", "MATA", "HIDUNG", "LIDAH"], "ipa", "easy"),
  w("Tanaman membutuhkan sinar ___ untuk tumbuh subur.", "SURYA", ["BULAN", "SURYA", "LAMPU", "BINTANG"], "ipa", "easy"),

  // IPS
  w("Alat pembayaran yang sah di negara kita adalah ___.", "UANG", ["BARTER", "UANG", "CEK", "EMAS"], "ips", "easy"),
  w("Tempat berlabuhnya kapal laut disebut ___.", "PELABUHAN", ["BANDARA", "STASIUN", "PELABUHAN", "TERMINAL"], "ips", "easy"),
  w("Petani menanam padi di areal persawahan atau ___.", "SAWAH", ["KANTOR", "SAWAH", "PABRIK", "TOKO"], "ips", "easy"),
  w("Peta mini yang berbentuk bola bumi tiruan disebut ___.", "GLOBE", ["ATLAS", "GLOBE", "DENAH", "KOMPAS"], "ips", "easy"),

  // BAHASA
  w("Antonim dari kata 'Besar' adalah ___.", "KECIL", ["PANJANG", "KECIL", "LEBAR", "TINGGI"], "bahasa", "easy"),
  w("Budi membaca ___ di perpustakaan sekolah.", "BUKU", ["BUKU", "SEPATU", "PIRING", "MEJA"], "bahasa", "easy"),
  w("Ibu memasak nasi dan sayur di ruang ___.", "DAPUR", ["KAMAR", "HALAMAN", "DAPUR", "GARASI"], "bahasa", "easy"),
  w("Sinonim dari kata 'Melihat' adalah ___.", "MEMANDANG", ["MENDENGAR", "MEMANDANG", "MENULIS", "MERABA"], "bahasa", "easy"),
  w("Lawan kata dari 'Cepat' adalah ___.", "LAMBAT", ["DERAS", "LAMBAT", "SINGKAT", "KENCANG"], "bahasa", "easy"),

  // UMUM
  w("Alat musik gitar dimainkan dengan cara ___.", "DIPETIK", ["DIPUKUL", "DIPETIK", "DITIUP", "DIGESEK"], "umum", "easy"),
  w("Warna bendera negara Indonesia adalah Merah dan ___.", "PUTIH", ["BIRU", "KUNING", "HIJAU", "PUTIH"], "umum", "easy"),
  w("Benda yang digunakan untuk berlindung saat hujan adalah ___.", "PAYUNG", ["KERTAS", "KAYU", "PAYUNG", "KARDUS"], "umum", "easy"),
  w("Hewan darat berukuran besar dengan belalai panjang adalah ___.", "GAJAH", ["JERAPAH", "GAJAH", "HARIMAU", "KUDA"], "umum", "easy"),
  w("Pagi hari matahari terbit dari arah ___.", "TIMUR", ["BARAT", "UTARA", "SELATAN", "TIMUR"], "umum", "easy"),

  // ─── MEDIUM: 5-7 HURUF & KONSEP TEMATIK ───
  // IPA
  w("Hewan berdarah dingin yang hidup di dua alam disebut ___.", "AMFIBI", ["AMFIBI", "MAMALIA", "UNGGAS", "REPTIL"], "ipa", "medium"),
  w("Proses perubahan wujud cair menjadi gas dinamakan ___.", "PENGUAPAN", ["PEMBEKUAN", "PENGUAPAN", "PENCAIRAN", "PENYALURAN"], "ipa", "medium"),
  w("Pusat peredaran tata surya kita adalah bintang ___.", "MATAHARI", ["BULAN", "BUMI", "MATAHARI", "BINTANG"], "ipa", "medium"),
  w("Manusia bernapas menghirup gas ___ segar.", "OKSIGEN", ["KARBON", "NITROGEN", "OKSIGEN", "HIDROGEN"], "ipa", "medium"),
  w("Hubungan saling menguntungkan antar makhluk hidup adalah simbiosis ___.", "MUTUALISME", ["PARASITISME", "MUTUALISME", "KOMENSALISME", "NETRALISME"], "ipa", "medium"),
  w("Bagian tumbuhan yang berfungsi menyerap air dari dalam tanah adalah ___.", "AKAR", ["BATANG", "DAUN", "BUNGA", "AKAR"], "ipa", "medium"),
  w("Benda langit yang memantulkan cahaya matahari ke bumi pada malam hari adalah ___.", "BULAN", ["METEOR", "BULAN", "KOMET", "ASTEROID"], "ipa", "medium"),

  // IPS
  w("Candi Borobudur terletak di wilayah provinsi ___.", "JAWA TENGAH", ["JAWA BARAT", "JAWA TIMUR", "JAWA TENGAH", "BALI"], "ips", "medium"),
  w("Orang yang menjalankan perjalanan kereta api disebut ___.", "MASINIS", ["PILOT", "NAHKODA", "MASINIS", "SUPIR"], "ips", "medium"),
  w("Kegiatan menghasilkan barang atau jasa dalam ilmu ekonomi disebut ___.", "PRODUKSI", ["KONSUMSI", "DISTRIBUSI", "PRODUKSI", "TRANSAKSI"], "ips", "medium"),
  w("Negara tetangga Indonesia yang memiliki menara kembar Petronas adalah ___.", "MALAYSIA", ["SINGAPURA", "BRUNEI", "THAILAND", "MALAYSIA"], "ips", "medium"),
  w("Wilayah daratan yang menjorok masuk ke dalam lautan luas disebut ___.", "SEMENANJUNG", ["TELUK", "SEMENANJUNG", "SELAT", "SAMUDRA"], "ips", "medium"),

  // BAHASA
  w("Karangan yang ditulis berdasarkan fakta dan data nyata disebut karangan ___.", "NONFIKSI", ["FIKSI", "NONFIKSI", "DONGENG", "FABEL"], "bahasa", "medium"),
  w("Kata penghubung antar kalimat dalam tata bahasa disebut ___.", "KONJUNGSI", ["PREPOSISI", "KONJUNGSI", "NOMINA", "VERBA"], "bahasa", "medium"),
  w("Pesan moral yang ingin disampaikan pengarang dalam sebuah cerita adalah ___.", "AMANAT", ["TEMA", "ALUR", "AMANAT", "LATAR"], "bahasa", "medium"),
  w("Gaya bahasa perumpamaan atau kiasan dalam sastra dinamakan ___.", "MAJAS", ["RIMA", "MAJAS", "BAIT", "PARAGRAF"], "bahasa", "medium"),

  // UMUM
  w("Kendaraan tradisional khas Yogyakarta yang ditarik oleh kuda adalah ___.", "ANDONG", ["BECAK", "ANDONG", "BEMO", "DELMAN"], "umum", "medium"),
  w("Alat untuk menentukan arah mata angin adalah jarum ___.", "KOMPAS", ["TERMOMETER", "BAROMETER", "KOMPAS", "SPEEDOMETER"], "umum", "medium"),
  w("Bangunan pelindung di tepi pantai penunjuk navigasi malam hari adalah ___.", "MERCUSUAR", ["BENTENG", "MERCUSUAR", "DERMAGA", "MENARA"], "umum", "medium"),

  // ─── HARD: KATA MAJEMUK & TINGKAT TINGGI ───
  // IPA
  w("Perubahan bentuk tubuh hewan dari telur hingga dewasa disebut ___.", "METAMORFOSIS", ["FOTOSINTESIS", "METAMORFOSIS", "RESPIRASI", "REGENERASI"], "ipa", "hard"),
  w("Kemampuan kelelawar mendeteksi mangsa menggunakan pantulan suara adalah ___.", "EKOLOKASI", ["NAVIGASI", "EKOLOKASI", "MIMIKRI", "KAMUFLASE"], "ipa", "hard"),
  w("Penyesuaian diri hewan dengan mengubah warna kulit mengikuti lingkungan dinamakan ___.", "MIMIKRI", ["AUTOTOMI", "HIBERNASI", "MIMIKRI", "ESTIVASI"], "ipa", "hard"),
  w("Tempat pertukaran gas oksigen dan karbon dioksida di paru-paru adalah ___.", "ALVEOLUS", ["BRONKUS", "TRAKEA", "ALVEOLUS", "FARING"], "ipa", "hard"),
  w("Zat cair yang berfungsi sebagai penghantar arus listrik disebut larutan ___.", "ELEKTROLIT", ["KOLOID", "SUSPENSI", "ELEKTROLIT", "ORGANIK"], "ipa", "hard"),

  // IPS
  w("Proses penyatuan berbagai kebudayaan menjadi satu kebudayaan baru disebut ___.", "ASIMILASI", ["AKULTURASI", "ASIMILASI", "INTEGRASI", "SEGREGASI"], "ips", "hard"),
  w("Sistem perekonomian yang berlandaskan asas kekeluargaan di Indonesia adalah ___.", "KOPERASI", ["PERSEROAN", "KOPERASI", "YAYASAN", "BUMN"], "ips", "hard"),
  w("Garis batas laut teritorial kedaulatan Indonesia berjarak ___ mil laut.", "DUA BELAS", ["SEPULUH", "DUA BELAS", "DUA PULUH", "DUA RATUS"], "ips", "hard"),
  w("Peristiwa pengasingan tokoh bangsa ke Rengasdengklok menjelang proklamasi dipimpin golongan ___.", "PEMUDA", ["TUA", "MILITER", "PEMUDA", "BANGSAWAN"], "ips", "hard"),

  // BAHASA
  w("Bagian awal teks eksplanasi yang berisi gambaran umum fenomena dinamakan identifikasi ___.", "FENOMENA", ["KESIMPULAN", "FENOMENA", "ULASAN", "ARGUMEN"], "bahasa", "hard"),
  w("Kalimat yang subjeknya dikenai pekerjaan dalam tata bahasa disebut kalimat ___.", "PASIF", ["AKTIF", "PASIF", "MAJEMUK", "TUNGGAL"], "bahasa", "hard"),
  w("Daftar sumber rujukan buku pada halaman akhir karya ilmiah disebut ___.", "BIBLIOGRAFI", ["GLOSARIUM", "INDEKS", "BIBLIOGRAFI", "LAMPIRAN"], "bahasa", "hard"),

  // UMUM
  w("Koleksi benda-benda bersejarah dan artefak purbakala disimpan rapi di gedung ___.", "MUSEUM", ["ARSIP", "MUSEUM", "PERPUSTAKAAN", "GALERI"], "umum", "hard"),
  w("Upaya menjaga dan melindungi kelestarian alam hayati dari kepunahan disebut ___.", "KONSERVASI", ["EKSPLOITASI", "REBOISASI", "KONSERVASI", "URBANISASI"], "umum", "hard"),
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let activePool: WordChallenge[] = [];
let poolIdx = 0;
let currentDifficultyFilter: WordChallenge["difficulty"] | null = null;

function initPool(difficulty?: WordChallenge["difficulty"]) {
  currentDifficultyFilter = difficulty ?? null;
  const filtered = difficulty
    ? WORD_CHALLENGES.filter((w) => w.difficulty === difficulty)
    : WORD_CHALLENGES;

  activePool = shuffle(filtered.length > 0 ? filtered : WORD_CHALLENGES);
  poolIdx = 0;
}

export function getNextWord(difficulty?: WordChallenge["difficulty"]): WordChallenge {
  if (difficulty && difficulty !== currentDifficultyFilter) {
    initPool(difficulty);
  } else if (activePool.length === 0 || poolIdx >= activePool.length) {
    initPool(difficulty);
  }
  return activePool[poolIdx++];
}

export function resetWordPool(difficulty?: WordChallenge["difficulty"]) {
  initPool(difficulty);
}

export const CATEGORY_COLOR: Record<WordChallenge["category"], string> = {
  ipa: "#4adeab",
  ips: "#ffaa5e",
  bahasa: "#a78bff",
  umum: "#6c8eff",
};

export const CATEGORY_LABEL: Record<WordChallenge["category"], string> = {
  ipa: "IPA",
  ips: "IPS",
  bahasa: "Bahasa",
  umum: "Umum",
};
