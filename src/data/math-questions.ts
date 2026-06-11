export interface MathQuestion {
  id: string;
  problem: string;
  options: number[];
  answer: number;
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

function makeOptions(answer: number): number[] {
  const distractors = new Set<number>();
  while (distractors.size < 3) {
    const delta = Math.floor(Math.random() * 6) + 1;
    const wrong = Math.random() > 0.5 ? answer + delta : answer - delta;
    if (wrong !== answer && wrong >= 0) distractors.add(wrong);
  }
  return shuffle([answer, ...distractors]);
}

function makeQuestion(
  problem: string,
  answer: number,
  difficulty: MathQuestion["difficulty"]
): MathQuestion {
  return {
    id: Math.random().toString(36).slice(2),
    problem,
    options: makeOptions(answer),
    answer,
    difficulty,
  };
}

// ─── Question Bank ───
const EASY_QUESTIONS: MathQuestion[] = [
  makeQuestion("3 + 4 = ?", 7, "easy"),
  makeQuestion("8 - 3 = ?", 5, "easy"),
  makeQuestion("5 × 2 = ?", 10, "easy"),
  makeQuestion("12 ÷ 4 = ?", 3, "easy"),
  makeQuestion("6 + 9 = ?", 15, "easy"),
  makeQuestion("14 - 7 = ?", 7, "easy"),
  makeQuestion("4 × 3 = ?", 12, "easy"),
  makeQuestion("20 ÷ 5 = ?", 4, "easy"),
  makeQuestion("11 + 8 = ?", 19, "easy"),
  makeQuestion("16 - 9 = ?", 7, "easy"),
  makeQuestion("7 × 2 = ?", 14, "easy"),
  makeQuestion("18 ÷ 6 = ?", 3, "easy"),
  makeQuestion("5 + 13 = ?", 18, "easy"),
  makeQuestion("20 - 8 = ?", 12, "easy"),
  makeQuestion("3 × 6 = ?", 18, "easy"),
];

const MEDIUM_QUESTIONS: MathQuestion[] = [
  makeQuestion("13 + 19 = ?", 32, "medium"),
  makeQuestion("45 - 17 = ?", 28, "medium"),
  makeQuestion("8 × 7 = ?", 56, "medium"),
  makeQuestion("48 ÷ 8 = ?", 6, "medium"),
  makeQuestion("27 + 36 = ?", 63, "medium"),
  makeQuestion("74 - 38 = ?", 36, "medium"),
  makeQuestion("9 × 6 = ?", 54, "medium"),
  makeQuestion("63 ÷ 7 = ?", 9, "medium"),
  makeQuestion("52 + 29 = ?", 81, "medium"),
  makeQuestion("85 - 47 = ?", 38, "medium"),
  makeQuestion("7 × 8 = ?", 56, "medium"),
  makeQuestion("72 ÷ 9 = ?", 8, "medium"),
  makeQuestion("34 + 58 = ?", 92, "medium"),
  makeQuestion("91 - 46 = ?", 45, "medium"),
  makeQuestion("6 × 9 = ?", 54, "medium"),
];

const HARD_QUESTIONS: MathQuestion[] = [
  makeQuestion("17 × 3 = ?", 51, "hard"),
  makeQuestion("144 ÷ 12 = ?", 12, "hard"),
  makeQuestion("89 + 76 = ?", 165, "hard"),
  makeQuestion("203 - 87 = ?", 116, "hard"),
  makeQuestion("13 × 8 = ?", 104, "hard"),
  makeQuestion("169 ÷ 13 = ?", 13, "hard"),
  makeQuestion("248 + 137 = ?", 385, "hard"),
  makeQuestion("305 - 148 = ?", 157, "hard"),
  makeQuestion("14 × 12 = ?", 168, "hard"),
  makeQuestion("196 ÷ 14 = ?", 14, "hard"),
];

const ALL_QUESTIONS = [...EASY_QUESTIONS, ...MEDIUM_QUESTIONS, ...HARD_QUESTIONS];

let questionPool = shuffle(ALL_QUESTIONS);
let poolIndex = 0;

export function getNextQuestion(): MathQuestion {
  if (poolIndex >= questionPool.length) {
    questionPool = shuffle(ALL_QUESTIONS);
    poolIndex = 0;
  }
  return questionPool[poolIndex++];
}

export function resetQuestionPool() {
  questionPool = shuffle(ALL_QUESTIONS);
  poolIndex = 0;
}
