export type MathDifficulty = "easy" | "medium" | "hard";

export interface GeneratedMathQuestion {
  id: string;
  problem: string;
  options: number[];
  answer: number;
  difficulty: MathDifficulty;
}

export interface MathQuestionPair {
  p1: GeneratedMathQuestion;
  p2: GeneratedMathQuestion;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateDistractors(answer: number): number[] {
  const distractors = new Set<number>();
  let attempts = 0;
  
  // Reasonable spread around the answer
  const maxDelta = Math.max(4, Math.floor(Math.abs(answer) * 0.25));

  while (distractors.size < 3 && attempts < 50) {
    attempts++;
    const delta = randInt(1, Math.max(5, maxDelta));
    const candidate = Math.random() > 0.5 ? answer + delta : answer - delta;
    if (candidate !== answer && candidate >= 0) {
      distractors.add(candidate);
    }
  }

  // Fallback if needed
  let fallbackDelta = 1;
  while (distractors.size < 3) {
    const candidate = answer + fallbackDelta;
    if (!distractors.has(candidate) && candidate !== answer) {
      distractors.add(candidate);
    }
    fallbackDelta++;
  }

  return shuffle([answer, ...Array.from(distractors)]);
}

function createQuestion(
  problem: string,
  answer: number,
  difficulty: MathDifficulty
): GeneratedMathQuestion {
  return {
    id: Math.random().toString(36).slice(2, 9),
    problem,
    options: generateDistractors(answer),
    answer,
    difficulty,
  };
}

// ─── Archetype Generators ───

type GeneratorFn = () => { problem: string; answer: number };

const EASY_ARCHETYPES: GeneratorFn[] = [
  // Addition <= 20
  () => {
    const a = randInt(2, 10);
    const b = randInt(2, 10);
    return { problem: `${a} + ${b} = ?`, answer: a + b };
  },
  // Subtraction <= 20
  () => {
    const a = randInt(5, 20);
    const b = randInt(2, a - 1);
    return { problem: `${a} - ${b} = ?`, answer: a - b };
  },
  // Multiplication tables 2 to 5
  () => {
    const a = randInt(2, 5);
    const b = randInt(2, 10);
    return { problem: `${a} × ${b} = ?`, answer: a * b };
  },
  // Division without remainder
  () => {
    const b = randInt(2, 5);
    const quotient = randInt(2, 8);
    const a = b * quotient;
    return { problem: `${a} ÷ ${b} = ?`, answer: quotient };
  },
];

const MEDIUM_ARCHETYPES: GeneratorFn[] = [
  // 2-digit addition with carry
  () => {
    let a = randInt(15, 65);
    let b = randInt(15, 45);
    if ((a % 10) + (b % 10) < 10) {
      a += 9 - (a % 10);
      b += 2;
    }
    return { problem: `${a} + ${b} = ?`, answer: a + b };
  },
  // 2-digit subtraction with borrow
  () => {
    const a = randInt(32, 95);
    const b = randInt(14, a - 11);
    return { problem: `${a} - ${b} = ?`, answer: a - b };
  },
  // Multiplication tables 6 to 12
  () => {
    const a = randInt(6, 12);
    const b = randInt(4, 12);
    return { problem: `${a} × ${b} = ?`, answer: a * b };
  },
  // Division 2-digit
  () => {
    const b = randInt(4, 9);
    const quotient = randInt(6, 12);
    const a = b * quotient;
    return { problem: `${a} ÷ ${b} = ?`, answer: quotient };
  },
  // Simple mixed 2-step
  () => {
    const a = randInt(3, 8);
    const b = randInt(3, 7);
    const c = randInt(2, 9);
    return { problem: `${a} × ${b} + ${c} = ?`, answer: a * b + c };
  },
];

const HARD_ARCHETYPES: GeneratorFn[] = [
  // 3-digit addition
  () => {
    const a = randInt(115, 450);
    const b = randInt(115, 450);
    return { problem: `${a} + ${b} = ?`, answer: a + b };
  },
  // 3-digit subtraction
  () => {
    const a = randInt(280, 890);
    const b = randInt(115, a - 40);
    return { problem: `${a} - ${b} = ?`, answer: a - b };
  },
  // Teens multiplication
  () => {
    const a = randInt(12, 22);
    const b = randInt(6, 15);
    return { problem: `${a} × ${b} = ?`, answer: a * b };
  },
  // Division 3-digit dividend
  () => {
    const b = randInt(6, 16);
    const quotient = randInt(12, 35);
    const a = b * quotient;
    return { problem: `${a} ÷ ${b} = ?`, answer: quotient };
  },
  // Multi-step mixed
  () => {
    const a = randInt(10, 20);
    const b = randInt(3, 8);
    const c = randInt(12, 35);
    return { problem: `${a} × ${b} - ${c} = ?`, answer: a * b - c };
  },
];

function getArchetypePool(difficulty: MathDifficulty): GeneratorFn[] {
  switch (difficulty) {
    case "easy":
      return EASY_ARCHETYPES;
    case "medium":
      return MEDIUM_ARCHETYPES;
    case "hard":
      return HARD_ARCHETYPES;
  }
}

/**
 * Generates a single fair question for a given difficulty tier.
 */
export function generateMathQuestion(difficulty: MathDifficulty): GeneratedMathQuestion {
  const pool = getArchetypePool(difficulty);
  const generator = pool[randInt(0, pool.length - 1)];
  const { problem, answer } = generator();
  return createQuestion(problem, answer, difficulty);
}

/**
 * Generates a symmetric question pair for competitive duels (Blue vs Red).
 * Both questions are guaranteed to share the exact same mathematical archetype and cognitive depth.
 */
export function generateSymmetricMathPair(difficulty: MathDifficulty): MathQuestionPair {
  const pool = getArchetypePool(difficulty);
  const archetypeIdx = randInt(0, pool.length - 1);
  const generator = pool[archetypeIdx];

  const q1 = generator();
  let q2 = generator();

  // Try to avoid giving both players the identical numbers if possible
  let retry = 0;
  while (q1.problem === q2.problem && retry < 5) {
    q2 = generator();
    retry++;
  }

  return {
    p1: createQuestion(q1.problem, q1.answer, difficulty),
    p2: createQuestion(q2.problem, q2.answer, difficulty),
  };
}
