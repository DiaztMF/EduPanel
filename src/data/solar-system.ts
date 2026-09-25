export type SpaceDifficulty = "easy" | "medium" | "hard";

export interface Moon {
  id: string;
  name: string;
  planet: string; // which planet it belongs to
  fact: string;
  difficulty?: SpaceDifficulty;
}

export interface Planet {
  id: string;
  name: string;
  color: string;
  size: string; // css font-size
  orbitRadius: number; // relative, px on 4K
  moons: Moon[];
  fact: string;
}

export const SOLAR_SYSTEM: Planet[] = [
  {
    id: "mercury",
    name: "Merkurius",
    color: "#a0a0a0",
    size: "clamp(22px,3.2vw,48px)",
    orbitRadius: 80,
    moons: [],
    fact: "Planet terkecil dan terdekat dengan Matahari. Tidak memiliki satelit alami.",
  },
  {
    id: "venus",
    name: "Venus",
    color: "#e8c84a",
    size: "clamp(28px,4vw,58px)",
    orbitRadius: 140,
    moons: [],
    fact: "Planet terpanas di tata surya dengan efek rumah kaca ekstrem.",
  },
  {
    id: "earth",
    name: "Bumi",
    color: "#3b82f6",
    size: "clamp(30px,4.2vw,62px)",
    orbitRadius: 210,
    moons: [
      {
        id: "moon",
        name: "Bulan",
        planet: "earth",
        fact: "Satu-satunya satelit alami tempat tinggal kita",
        difficulty: "easy",
      },
    ],
    fact: "Satu-satunya planet yang diketahui mendukung kehidupan berlimpah air cair.",
  },
  {
    id: "mars",
    name: "Mars",
    color: "#ef4444",
    size: "clamp(24px,3.5vw,52px)",
    orbitRadius: 290,
    moons: [
      {
        id: "phobos",
        name: "Phobos",
        planet: "mars",
        fact: "Satelit terbesar Mars yang mengorbit sangat dekat",
        difficulty: "easy",
      },
      {
        id: "deimos",
        name: "Deimos",
        planet: "mars",
        fact: "Satelit terkecil Mars dengan bentuk mirip asteroid",
        difficulty: "easy",
      },
    ],
    fact: "Planet Merah • memiliki gunung tertinggi di tata surya, Olympus Mons.",
  },
  {
    id: "jupiter",
    name: "Jupiter",
    color: "#f97316",
    size: "clamp(44px,6.5vw,96px)",
    orbitRadius: 390,
    moons: [
      {
        id: "io",
        name: "Io",
        planet: "jupiter",
        fact: "Bulan paling aktif secara vulkanik di tata surya",
        difficulty: "medium",
      },
      {
        id: "europa",
        name: "Europa",
        planet: "jupiter",
        fact: "Memiliki lautan air cair di bawah lapisan es tebal",
        difficulty: "easy",
      },
      {
        id: "ganymede",
        name: "Ganymede",
        planet: "jupiter",
        fact: "Bulan terbesar di tata surya, lebih besar dari planet Merkurius",
        difficulty: "medium",
      },
    ],
    fact: "Planet gas raksasa terbesar di tata surya • terkenal dengan Bintik Merah Besar.",
  },
  {
    id: "saturn",
    name: "Saturnus",
    color: "#eab308",
    size: "clamp(40px,6vw,88px)",
    orbitRadius: 500,
    moons: [
      {
        id: "titan",
        name: "Titan",
        planet: "saturn",
        fact: "Bulan dengan atmosfer tebal dan danau hidrokarbon cair",
        difficulty: "easy",
      },
      {
        id: "enceladus",
        name: "Enceladus",
        planet: "saturn",
        fact: "Menyemburkan uap air dan kristal es ke luar angkasa",
        difficulty: "hard",
      },
    ],
    fact: "Dikenal dengan cincin spektakuler yang terbuat dari es dan debu batuan.",
  },
  {
    id: "uranus",
    name: "Uranus",
    color: "#06b6d4",
    size: "clamp(34px,5vw,74px)",
    orbitRadius: 590,
    moons: [
      {
        id: "miranda",
        name: "Miranda",
        planet: "uranus",
        fact: "Memiliki ngarai raksasa dan tebing tertinggi di tata surya",
        difficulty: "hard",
      },
    ],
    fact: "Planet es raksasa yang berputar miring • kutubnya hampir menghadap Matahari.",
  },
  {
    id: "neptune",
    name: "Neptunus",
    color: "#6366f1",
    size: "clamp(32px,4.8vw,70px)",
    orbitRadius: 670,
    moons: [
      {
        id: "triton",
        name: "Triton",
        planet: "neptune",
        fact: "Mengorbit berlawanan arah dengan rotasi planet induknya",
        difficulty: "medium",
      },
    ],
    fact: "Planet paling berangin di tata surya • kecepatan angin mencapai 2.100 km/jam.",
  },
];

export const ALL_MOONS: Moon[] = SOLAR_SYSTEM.flatMap((p) => p.moons);

export function getMoonsByDifficulty(difficulty: SpaceDifficulty): Moon[] {
  if (difficulty === "easy") {
    return ALL_MOONS.filter((m) => m.difficulty === "easy");
  }
  if (difficulty === "medium") {
    return ALL_MOONS.filter((m) => m.difficulty === "easy" || m.difficulty === "medium");
  }
  return ALL_MOONS;
}
