export type GeometryDifficulty = "easy" | "medium" | "hard";

export interface ShapeDefinition {
  id: string;
  name: string;
  nameEn: string;
  color: string;
  faces: number;
  edges: number;
  vertices: number;
  volumeFormula: string;
  surfaceAreaFormula: string;
  fact: string;
  netDescription: string;
  difficulty: GeometryDifficulty;
}

export const SHAPES_DATA: ShapeDefinition[] = [
  {
    id: "cube",
    name: "Kubus",
    nameEn: "Cube",
    color: "#2563eb",
    faces: 6,
    edges: 12,
    vertices: 8,
    volumeFormula: "V = s³",
    surfaceAreaFormula: "L = 6 × s²",
    fact: "Semua sisi berbentuk persegi kongruen dengan 12 rusuk sama panjang.",
    netDescription: "6 persegi yang saling terhubung dalam pola salib atau T",
    difficulty: "easy",
  },
  {
    id: "cuboid",
    name: "Balok",
    nameEn: "Rectangular Prism",
    color: "#059669",
    faces: 6,
    edges: 12,
    vertices: 8,
    volumeFormula: "V = p × l × t",
    surfaceAreaFormula: "L = 2(pl + pt + lt)",
    fact: "Memiliki 3 pasang sisi persegi panjang yang saling berhadapan dan kongruen.",
    netDescription: "3 pasang persegi panjang dengan ukuran berbeda yang terhubung",
    difficulty: "easy",
  },
  {
    id: "cylinder",
    name: "Tabung",
    nameEn: "Cylinder",
    color: "#d97706",
    faces: 3,
    edges: 2,
    vertices: 0,
    volumeFormula: "V = π × r² × t",
    surfaceAreaFormula: "L = 2πr(r + t)",
    fact: "Bangun ruang sisi lengkung dengan 2 bidang alas dan tutup lingkaran identik.",
    netDescription: "2 lingkaran identik dan 1 persegi panjang sebagai selimut",
    difficulty: "easy",
  },
  {
    id: "sphere",
    name: "Bola",
    nameEn: "Sphere",
    color: "#0284c7",
    faces: 1,
    edges: 0,
    vertices: 0,
    volumeFormula: "V = ⁴⁄₃ × π × r³",
    surfaceAreaFormula: "L = 4 × π × r²",
    fact: "Semua titik pada permukaan memiliki jarak yang sama terhadap pusat bola.",
    netDescription: "Tidak dapat dibuka menjadi jaring-jaring datar tanpa distorsi",
    difficulty: "easy",
  },
  {
    id: "cone",
    name: "Kerucut",
    nameEn: "Cone",
    color: "#dc2626",
    faces: 2,
    edges: 1,
    vertices: 1,
    volumeFormula: "V = ⅓ × π × r² × t",
    surfaceAreaFormula: "L = πr(r + s)",
    fact: "Memiliki 1 titik puncak (apex), 1 sisi lengkung, dan 1 alas berbentuk lingkaran.",
    netDescription: "1 lingkaran dan 1 sektor lingkaran (juring) sebagai selimut",
    difficulty: "medium",
  },
  {
    id: "triangular_prism",
    name: "Prisma Segitiga",
    nameEn: "Triangular Prism",
    color: "#7c3aed",
    faces: 5,
    edges: 9,
    vertices: 6,
    volumeFormula: "V = ½ × a × t_alas × t_prisma",
    surfaceAreaFormula: "L = (2 × Luas Alas) + Keliling Alas × t",
    fact: "Memiliki 2 sisi alas-tutup berbentuk segitiga dan 3 sisi tegak persegi panjang.",
    netDescription: "2 segitiga kongruen dan 3 persegi panjang",
    difficulty: "medium",
  },
  {
    id: "square_pyramid",
    name: "Limas Segiempat",
    nameEn: "Square Pyramid",
    color: "#4f46e5",
    faces: 5,
    edges: 8,
    vertices: 5,
    volumeFormula: "V = ⅓ × Luas Alas × t",
    surfaceAreaFormula: "L = Luas Alas + 4 × Luas Sisi Tegak",
    fact: "Memiliki 1 alas persegi dan 4 sisi tegak berbentuk segitiga yang bertemu di puncak.",
    netDescription: "1 persegi di tengah dan 4 segitiga menempel di tiap sisi",
    difficulty: "medium",
  },
];

export interface GeometryQuestion {
  id: string;
  shape: ShapeDefinition;
  prompt: string;
  questionType: "volume" | "surfaceArea" | "faces" | "edges" | "vertices" | "concept";
  correctAnswer: string;
  options: string[];
}

export function generateGeometryQuestion(
  difficulty: GeometryDifficulty,
  previousId?: string
): GeometryQuestion {
  let pool = SHAPES_DATA;
  if (difficulty === "easy") {
    pool = SHAPES_DATA.filter((s) => s.difficulty === "easy");
  }

  // Filter out previous shape if possible
  const eligible = pool.filter((s) => s.id !== previousId);
  const candidates = eligible.length > 0 ? eligible : pool;
  const shape = candidates[Math.floor(Math.random() * candidates.length)];

  // Determine question type based on difficulty
  type QType = "volume" | "surfaceArea" | "faces" | "edges" | "vertices" | "concept";
  let allowedTypes: QType[] = [];

  if (difficulty === "easy") {
    allowedTypes = ["faces", "edges", "vertices", "volume"];
  } else if (difficulty === "medium") {
    allowedTypes = ["volume", "surfaceArea", "faces", "edges", "concept"];
  } else {
    allowedTypes = ["volume", "surfaceArea", "concept"];
  }

  const qType = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];

  let prompt = "";
  let correctAnswer = "";
  const distractors: string[] = [];

  if (qType === "volume") {
    prompt = `Manakah rumus Volume yang tepat untuk ${shape.name}?`;
    correctAnswer = shape.volumeFormula;
    // Distractors from other shapes
    const otherFormulas = SHAPES_DATA.filter((s) => s.id !== shape.id).map(
      (s) => s.volumeFormula
    );
    distractors.push(...otherFormulas);
  } else if (qType === "surfaceArea") {
    prompt = `Manakah rumus Luas Permukaan untuk ${shape.name}?`;
    correctAnswer = shape.surfaceAreaFormula;
    const otherFormulas = SHAPES_DATA.filter((s) => s.id !== shape.id).map(
      (s) => s.surfaceAreaFormula
    );
    distractors.push(...otherFormulas);
  } else if (qType === "faces") {
    prompt = `Berapa jumlah sisi (bidang) yang dimiliki oleh ${shape.name}?`;
    correctAnswer = `${shape.faces} Sisi`;
    const counts = [1, 2, 3, 4, 5, 6, 8].filter((c) => c !== shape.faces);
    for (const c of counts) distractors.push(`${c} Sisi`);
  } else if (qType === "edges") {
    prompt = `Berapa jumlah rusuk yang dimiliki oleh ${shape.name}?`;
    correctAnswer = `${shape.edges} Rusuk`;
    const counts = [0, 1, 2, 8, 9, 12, 16].filter((c) => c !== shape.edges);
    for (const c of counts) distractors.push(`${c} Rusuk`);
  } else if (qType === "vertices") {
    prompt = `Berapa jumlah titik sudut pada bangun ${shape.name}?`;
    correctAnswer = `${shape.vertices} Titik Sudut`;
    const counts = [0, 1, 4, 5, 6, 8, 10].filter((c) => c !== shape.vertices);
    for (const c of counts) distractors.push(`${c} Titik Sudut`);
  } else {
    // concept
    prompt = `Jaring-jaring dengan "${shape.netDescription}" membentuk bangun ruang apa?`;
    correctAnswer = shape.name;
    const otherNames = SHAPES_DATA.filter((s) => s.id !== shape.id).map(
      (s) => s.name
    );
    distractors.push(...otherNames);
  }

  // Shuffle distractors and pick 3 unique
  const uniqueDistractors = Array.from(new Set(distractors)).filter(
    (d) => d !== correctAnswer
  );
  uniqueDistractors.sort(() => Math.random() - 0.5);
  const pickedDistractors = uniqueDistractors.slice(0, 3);

  const rawOptions = [correctAnswer, ...pickedDistractors];
  // Note: we return raw options, and each player gets their own shuffled copy.
  return {
    id: `${shape.id}-${qType}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    shape,
    prompt,
    questionType: qType,
    correctAnswer,
    options: rawOptions,
  };
}

/**
 * Utility to shuffle an array immutably
 */
export function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
