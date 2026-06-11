export interface Moon {
  id: string;
  name: string;
  emoji: string;
  planet: string; // which planet it belongs to
  fact: string;
}

export interface Planet {
  id: string;
  name: string;
  emoji: string;
  color: string;
  size: string; // css font-size
  orbitRadius: number; // relative, px on 4K
  moons: Moon[];
  fact: string;
}

export const SOLAR_SYSTEM: Planet[] = [
  {
    id: "mercury", name: "Merkurius", emoji: "⬜", color: "#a0a0a0",
    size: "clamp(22px,3.2vw,48px)", orbitRadius: 80,
    moons: [],
    fact: "Planet terkecil & terdekat dengan Matahari. Tidak memiliki bulan.",
  },
  {
    id: "venus", name: "Venus", emoji: "🟡", color: "#e8c84a",
    size: "clamp(28px,4vw,58px)", orbitRadius: 140,
    moons: [],
    fact: "Planet terpanas di tata surya meski bukan yang terdekat dengan Matahari.",
  },
  {
    id: "earth", name: "Bumi", emoji: "🌍", color: "#4a90e8",
    size: "clamp(30px,4.2vw,62px)", orbitRadius: 210,
    moons: [
      { id: "moon", name: "Bulan", emoji: "🌕", planet: "earth", fact: "Satu-satunya satelit alami tempat tinggal kita" },
    ],
    fact: "Satu-satunya planet yang diketahui memiliki kehidupan.",
  },
  {
    id: "mars", name: "Mars", emoji: "🔴", color: "#c0392b",
    size: "clamp(24px,3.5vw,52px)", orbitRadius: 290,
    moons: [
      { id: "phobos", name: "Phobos", emoji: "🪨", planet: "mars", fact: "Satelit terbesar dari planet merah ini" },
      { id: "deimos", name: "Deimos", emoji: "🪨", planet: "mars", fact: "Satelit terkecil dari planet merah ini" },
    ],
    fact: "Planet Merah — memiliki gunung tertinggi di tata surya, Olympus Mons.",
  },
  {
    id: "jupiter", name: "Jupiter", emoji: "🟠", color: "#e8944a",
    size: "clamp(44px,6.5vw,96px)", orbitRadius: 390,
    moons: [
      { id: "io", name: "Io", emoji: "🌑", planet: "jupiter", fact: "Bulan paling vulkanik di tata surya" },
      { id: "europa", name: "Europa", emoji: "🌕", planet: "jupiter", fact: "Memiliki lautan air cair di bawah es" },
      { id: "ganymede", name: "Ganymede", emoji: "🌖", planet: "jupiter", fact: "Bulan terbesar di tata surya" },
    ],
    fact: "Planet terbesar di tata surya — dikenal dengan Bintik Merah Besar.",
  },
  {
    id: "saturn", name: "Saturnus", emoji: "🪐", color: "#d4a843",
    size: "clamp(40px,6vw,88px)", orbitRadius: 500,
    moons: [
      { id: "titan", name: "Titan", emoji: "🌕", planet: "saturn", fact: "Bulan dengan atmosfer tebal" },
      { id: "enceladus", name: "Enceladus", emoji: "⚪", planet: "saturn", fact: "Menyemburkan air ke luar angkasa" },
    ],
    fact: "Dikenal dengan cincin indahnya yang terbuat dari es dan debu.",
  },
  {
    id: "uranus", name: "Uranus", emoji: "🔵", color: "#7de8e8",
    size: "clamp(34px,5vw,74px)", orbitRadius: 590,
    moons: [
      { id: "miranda", name: "Miranda", emoji: "🌑", planet: "uranus", fact: "Memiliki tebing tertinggi di tata surya" },
    ],
    fact: "Planet yang berputar miring — kutubnya menghadap Matahari.",
  },
  {
    id: "neptune", name: "Neptunus", emoji: "💙", color: "#4a60e8",
    size: "clamp(32px,4.8vw,70px)", orbitRadius: 670,
    moons: [
      { id: "triton", name: "Triton", emoji: "🌑", planet: "neptune", fact: "Bergerak berlawanan arah orbit planet induknya" },
    ],
    fact: "Planet paling berangin di tata surya — angin mencapai 2.100 km/jam.",
  },
];

export const ALL_MOONS = SOLAR_SYSTEM.flatMap((p) => p.moons);
