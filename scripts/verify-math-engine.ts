import { generateSymmetricMathPair, generateMathQuestion, type MathDifficulty } from "../src/lib/math-engine";

const tiers: MathDifficulty[] = ["easy", "medium", "hard"];
let totalChecks = 0;

for (const tier of tiers) {
  for (let i = 0; i < 500; i++) {
    const pair = generateSymmetricMathPair(tier);
    totalChecks += 2;

    // Verify p1
    if (pair.p1.options.length !== 4) {
      throw new Error(`Invalid options count in p1: ${JSON.stringify(pair.p1)}`);
    }
    if (!pair.p1.options.includes(pair.p1.answer)) {
      throw new Error(`p1 options do not include answer: ${JSON.stringify(pair.p1)}`);
    }
    if (new Set(pair.p1.options).size !== 4) {
      throw new Error(`Duplicate options in p1: ${JSON.stringify(pair.p1)}`);
    }
    if (pair.p1.difficulty !== tier) {
      throw new Error(`Difficulty mismatch in p1: ${pair.p1.difficulty} vs ${tier}`);
    }

    // Verify p2
    if (pair.p2.options.length !== 4) {
      throw new Error(`Invalid options count in p2: ${JSON.stringify(pair.p2)}`);
    }
    if (!pair.p2.options.includes(pair.p2.answer)) {
      throw new Error(`p2 options do not include answer: ${JSON.stringify(pair.p2)}`);
    }
    if (new Set(pair.p2.options).size !== 4) {
      throw new Error(`Duplicate options in p2: ${JSON.stringify(pair.p2)}`);
    }
    if (pair.p2.difficulty !== tier) {
      throw new Error(`Difficulty mismatch in p2: ${pair.p2.difficulty} vs ${tier}`);
    }
  }
}

console.log(`PASS: Verified ${totalChecks} generated math problems across easy, medium, and hard tiers with zero errors.`);
