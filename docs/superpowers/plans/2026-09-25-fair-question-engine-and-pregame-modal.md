# Fair Question Engine and Pre-Game Setup Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a procedural math engine with paired symmetry, tiered question datasets, and a reusable pre-game setup modal for difficulty and duration configuration across EduPanel games.

**Architecture:** A TypeScript-based procedural math engine generates fair, identical-archetype problems for Blue and Red teams in real-time. A unified `GameSetupModal` component intercepts game starts to capture difficulty (`easy`, `medium`, `hard`) and duration (30s, 60s, 90s). Updated Zustand stores and game pages consume these settings to power gameplay.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Zustand 5, Framer Motion 12, Lucide React, Tailwind CSS 4.

## Global Constraints
- Zero em dashes (`—` or `–`): Use standard separators (`|`, `•`, `-`) or semantic layout containers.
- Zero emojis: All icons must be Lucide React components (`Sparkles`, `Zap`, `Flame`, `Timer`, `Clock`, `Hourglass`, `Play`, etc.).
- Anti-slop: High-contrast, clean typography, min 64px touch targets for IFP, clear focus and selection states.

---

### Task 1: Procedural Math Engine with Paired Symmetry

**Files:**
- Create: `src/lib/math-engine.ts`
- Create: `tests/math-engine.test.ts` (or standalone node verification script `scripts/verify-math-engine.ts`)

**Interfaces:**
- Produces:
  ```typescript
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
  export function generateMathQuestion(difficulty: MathDifficulty): GeneratedMathQuestion;
  export function generateSymmetricMathPair(difficulty: MathDifficulty): MathQuestionPair;
  ```

- [ ] **Step 1: Implement `src/lib/math-engine.ts`**
Write procedural generation algorithms for `easy`, `medium`, and `hard` tiers, ensuring whole integers, positive subtraction, non-zero division, and paired symmetry generation.

- [ ] **Step 2: Create and run verification script**
Write and run `scripts/verify-math-engine.ts` generating 1,000 pairs to assert:
- `p1.answer === eval(problem)`
- `p2.answer === eval(problem)`
- `p1.difficulty === p2.difficulty`
- No division remainders
- 4 unique options per question containing the correct answer.

- [ ] **Step 3: Commit**
```bash
git add src/lib/math-engine.ts scripts/verify-math-engine.ts
git commit -m "feat: implement procedural math engine with paired symmetry"
```

---

### Task 2: Reusable Pre-Game Configuration Modal

**Files:**
- Create: `src/components/game/GameSetupModal.tsx`

**Interfaces:**
- Produces:
  ```typescript
  export interface GameSetupModalProps {
    isOpen: boolean;
    gameTitle: string;
    gameSubtitle: string;
    availableDifficulties?: ("easy" | "medium" | "hard")[];
    availableDurations?: number[];
    defaultDifficulty?: "easy" | "medium" | "hard";
    defaultDuration?: number;
    onStart: (config: { difficulty: "easy" | "medium" | "hard"; duration: number }) => void;
  }
  ```

- [ ] **Step 1: Implement `src/components/game/GameSetupModal.tsx`**
Create the component with Framer Motion modal backdrop, difficulty cards (Mudah/Sparkles, Sedang/Zap, Sulit/Flame), duration cards (30s/Timer, 60s/Clock, 90s/Hourglass), and a large "Mulai Permainan" button. Zero emojis, zero em dashes.

- [ ] **Step 2: Verify component typing and styling**
Verify TypeScript compilation and export.

- [ ] **Step 3: Commit**
```bash
git add src/components/game/GameSetupModal.tsx
git commit -m "feat: create reusable pre-game setup modal component"
```

---

### Task 3: Integrate Math Engine and Modal into Math Tug-of-War

**Files:**
- Modify: `src/store/useMathTugStore.ts`
- Modify: `src/app/games/math-tug-of-war/page.tsx`

- [ ] **Step 1: Update `src/store/useMathTugStore.ts`**
Add `difficulty` state to store, update `reset(difficulty)` to initialize questions via `generateSymmetricMathPair(difficulty)`, and update `nextQuestion(player)` to pull symmetric or difficulty-matched questions.

- [ ] **Step 2: Update `src/app/games/math-tug-of-war/page.tsx`**
Add `phase === "setup"` state. Display `GameSetupModal` on entry. When user clicks "Mulai Permainan", set configured duration and difficulty, transition to `"countdown"`, and then `"playing"`.

- [ ] **Step 3: Verify and Commit**
```bash
git add src/store/useMathTugStore.ts src/app/games/math-tug-of-war/page.tsx
git commit -m "feat: integrate procedural math engine and setup modal into math-tug-of-war"
```

---

### Task 4: Integrate Math Engine and Modal into Math Pipette Duel

**Files:**
- Modify: `src/store/usePipetteStore.ts`
- Modify: `src/app/games/math-pipette-duel/page.tsx`

- [ ] **Step 1: Update `src/store/usePipetteStore.ts`**
Add `difficulty` state and use `generateSymmetricMathPair` for initial and subsequent questions.

- [ ] **Step 2: Update `src/app/games/math-pipette-duel/page.tsx`**
Add `phase === "setup"` with `GameSetupModal` before countdown. Connect configured duration and difficulty.

- [ ] **Step 3: Verify and Commit**
```bash
git add src/store/usePipetteStore.ts src/app/games/math-pipette-duel/page.tsx
git commit -m "feat: integrate procedural math engine and setup modal into math-pipette-duel"
```

---

### Task 5: Expand Quiz Trivia and Integrate into Quiz Tug-of-War

**Files:**
- Modify: `src/data/quiz-trivia.ts`
- Modify: `src/store/useQuizTugStore.ts`
- Modify: `src/app/games/quiz-tug-of-war/page.tsx`

- [ ] **Step 1: Expand and tier `src/data/quiz-trivia.ts`**
Add 60+ trivia questions strictly categorized into `easy`, `medium`, and `hard`. Provide `getNextTrivia(difficulty)`.

- [ ] **Step 2: Update `src/store/useQuizTugStore.ts` and `page.tsx`**
Add difficulty selection and setup modal. Ensure fair answer lockout handling.

- [ ] **Step 3: Verify and Commit**
```bash
git add src/data/quiz-trivia.ts src/store/useQuizTugStore.ts src/app/games/quiz-tug-of-war/page.tsx
git commit -m "feat: expand trivia dataset and add setup modal to quiz-tug-of-war"
```

---

### Task 6: Expand Word Challenges and Integrate into Word Pinisi Duel

**Files:**
- Modify: `src/data/word-challenges.ts`
- Modify: `src/store/usePinisiStore.ts`
- Modify: `src/app/games/word-pinisi-duel/page.tsx`

- [ ] **Step 1: Expand and tier `src/data/word-challenges.ts`**
Expand to 60+ word clues split by word length and difficulty (`easy`, `medium`, `hard`).

- [ ] **Step 2: Update `src/app/games/word-pinisi-duel/page.tsx`**
Replace emoji ship indicators (`⛵`, `💥`) with Lucide icons or clean SVG indicators. Add `GameSetupModal`.

- [ ] **Step 3: Verify and Commit**
```bash
git add src/data/word-challenges.ts src/store/usePinisiStore.ts src/app/games/word-pinisi-duel/page.tsx
git commit -m "feat: expand word challenges and add setup modal to word-pinisi-duel"
```

---

### Task 7: Synchronized Pairs and Modal in English Match

**Files:**
- Modify: `src/data/vocab-pairs.ts`
- Modify: `src/app/games/english-match/page.tsx`

- [ ] **Step 1: Expand `src/data/vocab-pairs.ts`**
Expand vocabulary dataset to 60+ pairs categorized into difficulty tiers.

- [ ] **Step 2: Update `src/app/games/english-match/page.tsx`**
Ensure both Team Blue and Team Red receive the exact same 5 vocabulary pairs in each round (synchronized round state) with separate shuffle of button columns. Add `GameSetupModal`.

- [ ] **Step 3: Verify and Commit**
```bash
git add src/data/vocab-pairs.ts src/app/games/english-match/page.tsx
git commit -m "feat: synchronize english match pairs and add setup modal"
```

---

### Task 8: Integrate Modal into Sorting & Classification Games

**Files:**
- Modify: `src/app/games/animal-classification/page.tsx`
- Modify: `src/app/games/waste-sorting-race/page.tsx`

- [ ] **Step 1: Add `GameSetupModal` to `animal-classification`**
Remove any emoji icons and connect modal duration/difficulty to game state.

- [ ] **Step 2: Add `GameSetupModal` to `waste-sorting-race`**
Connect modal duration/difficulty to game state.

- [ ] **Step 3: Verify and Commit**
```bash
git add src/app/games/animal-classification/page.tsx src/app/games/waste-sorting-race/page.tsx
git commit -m "feat: add setup modal to animal-classification and waste-sorting-race"
```

---

### Task 9: Final Quality Audit & Build Verification

**Files:**
- Verify: Entire codebase

- [ ] **Step 1: Verify zero em dashes and zero emojis**
Search for any remaining em dashes (`—`, `–`) or emoji literals in the modified files.

- [ ] **Step 2: Run production build**
Run `pnpm build` to verify zero TypeScript errors and successful static page generation.

- [ ] **Step 3: Commit and summarize**
```bash
git add .
git commit -m "chore: final polish and build verification"
```
