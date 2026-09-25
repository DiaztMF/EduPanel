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
  // ─── SAINS: EASY ───
  q("Planet terbesar di tata surya kita adalah?", "Jupiter", ["Saturnus", "Neptunus", "Uranus"], "sains", "easy"),
  q("Simbol kimia untuk emas adalah?", "Au", ["Ag", "Fe", "Go"], "sains", "easy"),
  q("Berapa jumlah kaki pada serangga?", "6", ["4", "8", "10"], "sains", "easy"),
  q("Gas apa yang paling banyak di atmosfer bumi?", "Nitrogen", ["Oksigen", "Karbon Dioksida", "Argon"], "sains", "easy"),
  q("Organ manusia yang memompa darah adalah?", "Jantung", ["Paru-paru", "Hati", "Ginjal"], "sains", "easy"),
  q("Apa nama proses tumbuhan membuat makanan sendiri?", "Fotosintesis", ["Respirasi", "Osmosis", "Fermentasi"], "sains", "easy"),
  q("Berapa suhu titik didih air pada tekanan normal?", "100°C", ["90°C", "80°C", "120°C"], "sains", "easy"),
  q("Planet manakah yang dikenal sebagai Planet Merah?", "Mars", ["Venus", "Merkurius", "Jupiter"], "sains", "easy"),
  q("Vertebrata adalah kelompok hewan yang memiliki?", "Tulang belakang", ["Sayap", "Insang", "Bulu"], "sains", "easy"),
  q("Gaya tarik yang menarik benda jatuh ke bumi disebut?", "Gravitasi", ["Magnet", "Gesek", "Pegas"], "sains", "easy"),

  // ─── SAINS: MEDIUM ───
  q("Berapa kecepatan cahaya per detik (dibulatkan)?", "300.000 km/s", ["150.000 km/s", "500.000 km/s", "1.000.000 km/s"], "sains", "medium"),
  q("DNA adalah singkatan dari?", "Deoxyribonucleic Acid", ["Dinitrogen Acid", "Dimethyl Nucleic Acid", "Digital Nucleic Atom"], "sains", "medium"),
  q("Berapa jumlah tulang pada tubuh manusia dewasa?", "206", ["180", "250", "300"], "sains", "medium"),
  q("Apa satuan dasar internasional untuk mengukur arus listrik?", "Ampere", ["Volt", "Watt", "Ohm"], "sains", "medium"),
  q("Lapisan atmosfer yang melindungi bumi dari radiasi ultraviolet adalah?", "Stratosfer", ["Troposfer", "Mesosfer", "Termosfer"], "sains", "medium"),
  q("Zat hijau daun yang menyerap sinar matahari dinamakan?", "Klorofil", ["Karoten", "Stomata", "Floem"], "sains", "medium"),
  q("Hewan mamalia yang mampu terbang dengan sayap kulit adalah?", "Kelelawar", ["Tupai terbang", "Burung hantu", "Elang"], "sains", "medium"),
  q("Satuan untuk frekuensi gelombang bunyi adalah?", "Hertz", ["Desibel", "Pascal", "Newton"], "sains", "medium"),

  // ─── SAINS: HARD ───
  q("Hewan apa yang memiliki sidik jari unik sangat mirip manusia?", "Koala", ["Simpanse", "Gorila", "Orang Utan"], "sains", "hard"),
  q("Unsur paling melimpah di alam semesta secara keseluruhan adalah?", "Hidrogen", ["Helium", "Oksigen", "Karbon"], "sains", "hard"),
  q("Bagian terkecil dari suatu zat yang mempertahankan sifat kimiawinya adalah?", "Molekul", ["Atom", "Proton", "Elektron"], "sains", "hard"),
  q("Enzim dalam air liur yang mencerna karbohidrat adalah?", "Ptialin (Amilase)", ["Pepsin", "Tripsin", "Lipase"], "sains", "hard"),
  q("Hukum gravitasi universal dirumuskan pertama kali oleh?", "Isaac Newton", ["Albert Einstein", "Galileo Galilei", "Johannes Kepler"], "sains", "hard"),

  // ─── GEOGRAFI: EASY ───
  q("Ibukota negara Indonesia adalah?", "Jakarta", ["Surabaya", "Bandung", "Medan"], "geografi", "easy"),
  q("Sungai terpanjang di dunia adalah?", "Nil", ["Amazon", "Yangtze", "Mississippi"], "geografi", "easy"),
  q("Negara dengan luas wilayah terbesar di dunia adalah?", "Rusia", ["Kanada", "Amerika Serikat", "China"], "geografi", "easy"),
  q("Benua terkecil di dunia berdasarkan luas daratan adalah?", "Australia", ["Eropa", "Antartika", "Amerika Selatan"], "geografi", "easy"),
  q("Ibukota negara Jepang adalah?", "Tokyo", ["Osaka", "Kyoto", "Hiroshima"], "geografi", "easy"),
  q("Kota di Indonesia yang memiliki julukan Kota Pahlawan adalah?", "Surabaya", ["Jakarta", "Bandung", "Semarang"], "geografi", "easy"),
  q("Pulau paling barat di kepulauan Indonesia adalah?", "Pulau Weh", ["Pulau Rote", "Pulau Miangas", "Pulau Sabang"], "geografi", "easy"),
  q("Gunung Bromo berada di wilayah provinsi?", "Jawa Timur", ["Jawa Tengah", "Jawa Barat", "Bali"], "geografi", "easy"),

  // ─── GEOGRAFI: MEDIUM ───
  q("Gunung tertinggi di Indonesia adalah?", "Puncak Jaya", ["Gunung Rinjani", "Gunung Semeru", "Gunung Kerinci"], "geografi", "medium"),
  q("Danau terdalam di dunia yang berada di Siberia adalah?", "Danau Baikal", ["Danau Superior", "Danau Titicaca", "Danau Toba"], "geografi", "medium"),
  q("Selat Malaka memisahkan pulau Sumatra dengan negara?", "Malaysia", ["Singapura", "Thailand", "India"], "geografi", "medium"),
  q("Garis khayal yang membagi bumi menjadi belahan utara dan selatan adalah?", "Khatulistiwa", ["Bujur Greenwich", "Meridian", "Tropis"], "geografi", "medium"),
  q("Pegunungan terpanjang di daratan dunia adalah?", "Andes", ["Himalaya", "Rocky", "Alpen"], "geografi", "medium"),
  q("Negara kepulauan terbesar di dunia adalah?", "Indonesia", ["Filipina", "Jepang", "Maladewa"], "geografi", "medium"),

  // ─── GEOGRAFI: HARD ───
  q("Gurun pasir terpanas dan terluas di benua Afrika adalah?", "Gurun Sahara", ["Gurun Gobi", "Gurun Kalahari", "Gurun Atacama"], "geografi", "hard"),
  q("Palung laut terdalam di permukaan bumi adalah?", "Palung Mariana", ["Palung Jawa", "Palung Puerto Riko", "Palung Tonga"], "geografi", "hard"),
  q("Kota paling selatan di dunia yang dihuni tetap adalah?", "Ushuaia", ["Punta Arenas", "Hobart", "Invercargill"], "geografi", "hard"),
  q("Negara tanpa garis pantai (landlocked) terbesar di dunia adalah?", "Kazakhstan", ["Mongolia", "Bolivia", "Swiss"], "geografi", "hard"),

  // ─── SEJARAH: EASY ───
  q("Indonesia memproklamasikan kemerdekaan pada tanggal?", "17 Agustus 1945", ["17 Agustus 1950", "10 November 1945", "1 Juni 1945"], "sejarah", "easy"),
  q("Siapa yang membacakan teks Proklamasi Kemerdekaan RI?", "Ir. Soekarno", ["Mohammad Hatta", "Soepomo", "Sutan Sjahrir"], "sejarah", "easy"),
  q("Perang Dunia II resmi berakhir pada tahun?", "1945", ["1939", "1942", "1950"], "sejarah", "easy"),
  q("Konferensi Asia Afrika tahun 1955 berlangsung di kota?", "Bandung", ["Jakarta", "Surabaya", "Yogyakarta"], "sejarah", "easy"),
  q("Presiden kedua Republik Indonesia adalah?", "Soeharto", ["B.J. Habibie", "Megawati", "Gus Dur"], "sejarah", "easy"),
  q("Hari Pahlawan di Indonesia diperingati setiap tanggal?", "10 November", ["20 Mei", "28 Oktober", "1 Juni"], "sejarah", "easy"),

  // ─── SEJARAH: MEDIUM ───
  q("Candi Borobudur dibangun pada masa dinasti kerajaan?", "Syailendra", ["Majapahit", "Sriwijaya", "Singasari"], "sejarah", "medium"),
  q("Pahlawan nasional yang memimpin perlawanan di Surabaya tahun 1945 adalah?", "Bung Tomo", ["Jenderal Sudirman", "Pangeran Diponegoro", "Imam Bonjol"], "sejarah", "medium"),
  q("Kerajaan Majapahit mencapai puncak keemasan di masa raja?", "Hayam Wuruk", ["Ken Arok", "Kertanegara", "Raden Wijaya"], "sejarah", "medium"),
  q("Organisasi pelopor Kebangkitan Nasional Indonesia tahun 1908 adalah?", "Budi Utomo", ["Sarekat Islam", "Indische Partij", "Taman Siswa"], "sejarah", "medium"),
  q("Perang Diponegoro melawan kolonial Belanda berlangsung tahun?", "1825 - 1830", ["1810 - 1815", "1840 - 1845", "1901 - 1906"], "sejarah", "medium"),
  q("Perjanjian Renville pada era revolusi ditandatangani di atas?", "Kapal Perang AS", ["Gedung Merdeka", "Istana Bogor", "Benteng Vredeburg"], "sejarah", "medium"),

  // ─── SEJARAH: HARD ───
  q("Naskah asli proklamasi kemerdekaan diketik oleh pahlawan muda?", "Sayuti Melik", ["Sukarni", "Chaeroel Saleh", "B.M. Diah"], "sejarah", "hard"),
  q("Sumpah Palapa dicetuskan oleh Mahapatih Gajah Mada pada masa raja?", "Tribhuwana Tunggadewi", ["Raden Wijaya", "Jayanegara", "Hayam Wuruk"], "sejarah", "hard"),
  q("Prasasti Ciaruteun memuat jejak telapak kaki dari raja?", "Purnawarman", ["Mulawarman", "Sanjaya", "Airlangga"], "sejarah", "hard"),

  // ─── BUDAYA: EASY ───
  q("Tari Saman yang terkenal berasal dari provinsi?", "Aceh", ["Bali", "Jawa Barat", "Sulawesi Selatan"], "budaya", "easy"),
  q("Batik telah diakui sebagai warisan budaya dunia takbenda oleh badan?", "UNESCO", ["PBB", "WHO", "UNICEF"], "budaya", "easy"),
  q("Alat musik tradisional Angklung berasal dari tanah?", "Sunda", ["Jawa", "Minang", "Bugis"], "budaya", "easy"),
  q("Lagu kebangsaan 'Indonesia Raya' diciptakan oleh komponis?", "W.R. Supratman", ["Ismail Marzuki", "Gesang", "Kusbini"], "budaya", "easy"),
  q("Kain tenun Ulos adalah kain tradisional khas suku?", "Batak", ["Dayak", "Asmat", "Toraja"], "budaya", "easy"),
  q("Rumah adat Tongkonan berasal dari suku bangsa?", "Toraja", ["Minangkabau", "Dayak", "Madura"], "budaya", "easy"),

  // ─── BUDAYA: MEDIUM ───
  q("Upacara adat pembakaran jenazah di Bali dinamakan?", "Ngaben", ["Tiwah", "Rambu Solo", "Sekaten"], "budaya", "medium"),
  q("Rumah Gadang dengan atap berbentuk tanduk kerbau khas dari daerah?", "Minangkabau", ["Batak", "Melayu", "Palembang"], "budaya", "medium"),
  q("Gamelan adalah ansambel musik tradisional yang berkembang di?", "Jawa dan Bali", ["Sumatra dan Riau", "Kalimantan", "Papua"], "budaya", "medium"),
  q("Tari Piring berasal dari kebudayaan daerah?", "Sumatra Barat", ["Sumatra Utara", "Riau", "Jambi"], "budaya", "medium"),
  q("Tradisi lompat batu yang terkenal (Hombo Batu) berasal dari pulau?", "Nias", ["Mentawai", "Madura", "Sumba"], "budaya", "medium"),

  // ─── BUDAYA: HARD ───
  q("Senjata tradisional Keris ditetapkan UNESCO sebagai warisan dunia pada tahun?", "2005", ["2003", "2009", "2012"], "budaya", "hard"),
  q("Filosofi motif batik Parang Rusak melambangkan?", "Keberanian dan pantang menyerah", ["Kesuburan tanah", "Keabadian cinta", "Kemakmuran raja"], "budaya", "hard"),
  q("Alat musik petik Sasando berasal dari pulau?", "Rote", ["Alor", "Flores", "Timor"], "budaya", "hard"),
];

let activePool: TriviaQuestion[] = [];
let poolIdx = 0;
let currentDifficultyFilter: TriviaQuestion["difficulty"] | null = null;

function initPool(difficulty?: TriviaQuestion["difficulty"]) {
  currentDifficultyFilter = difficulty ?? null;
  const filtered = difficulty
    ? TRIVIA_QUESTIONS.filter((t) => t.difficulty === difficulty)
    : TRIVIA_QUESTIONS;

  activePool = shuffle(filtered.length > 0 ? filtered : TRIVIA_QUESTIONS);
  poolIdx = 0;
}

export function getNextTrivia(difficulty?: TriviaQuestion["difficulty"]): TriviaQuestion {
  if (difficulty && difficulty !== currentDifficultyFilter) {
    initPool(difficulty);
  } else if (activePool.length === 0 || poolIdx >= activePool.length) {
    initPool(difficulty);
  }
  return activePool[poolIdx++];
}

export function resetTriviaPool(difficulty?: TriviaQuestion["difficulty"]) {
  initPool(difficulty);
}

export const CATEGORY_LABELS: Record<TriviaQuestion["category"], string> = {
  sains: "Sains",
  geografi: "Geografi",
  sejarah: "Sejarah",
  budaya: "Budaya",
};
