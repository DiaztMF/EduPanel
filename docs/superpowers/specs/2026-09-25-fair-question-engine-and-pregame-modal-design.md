# Design Specification: Fair Question Engine & Pre-Game Configuration Modal

- **Date:** 2026-09-25
- **Status:** Approved
- **Platform:** EduPanel IFP (Next.js 16 + React 19 + Tailwind CSS + Zustand + Lucide React)

---

## 1. Executive Summary

This specification addresses two core problems in EduPanel:
1. **Unfair and Static Question Distribution:** In duel games (such as Math Tug-of-War and Math Pipette Duel), Blue and Red teams pulled questions from a single flat array mixing easy and hard problems. This caused severe competitive imbalance where one player received trivial arithmetic while the opponent received multi-digit calculations. Furthermore, question banks across all games were static and easily exhausted.
2. **Missing Game Customization:** Games previously booted directly into a fixed 60-second timer with no choice of difficulty or duration for classroom differentiation.

To solve this, we introduce:
- A **Procedural Math Engine** that generates mathematically infinite problems categorized into three discrete difficulty tiers (Easy, Medium, Hard).
- A **Paired Symmetry Generator** ensuring that in any competitive round, both teams receive problems with identical mathematical archetypes and cognitive load.
- Expanded and tiered question datasets for trivia, language, and sorting games.
- A clean, touch-friendly **Pre-Game Configuration Modal** (`GameSetupModal`) allowing players to configure Difficulty and Time before entering the 3-2-1 countdown.
- Strict anti-slop guidelines: Zero em dashes, zero emojis, full Lucide React icon integration, and high-contrast IFP touch targets.

---

## 2. Core Architecture

### 2.1 Procedural Math Engine (`src/lib/math-engine.ts`)

Instead of static arrays, the engine generates math problems algorithmically with guaranteed solvability, non-negative results, integer division, and balanced distractor generation.

#### Difficulty Tier Definitions:
- **`easy` (Mudah):**
  - Addition: Sum within 20 ($a + b \le 20$, $a, b \ge 1$).
  - Subtraction: Minuend $\le 20$, positive result ($a - b \ge 1$).
  - Multiplication: Times tables 1 through 5 ($a \in [1..5], b \in [1..10]$).
  - Division: Dividends $\le 25$, single-digit divisor with no remainder ($b \in [1..5], a = b \times k$).
- **`medium` (Sedang):**
  - Addition: 2-digit numbers ($10 \le a, b \le 80$, sum $\le 100$) with carry-over.
  - Subtraction: 2-digit numbers ($20 \le a \le 99, 10 \le b < a$) with borrowing.
  - Multiplication: Times tables 6 through 12 ($a \in [6..12], b \in [2..12]$).
  - Division: 2-digit dividends divided by single-digit divisors ($a \in [12..96]$), integer quotient.
  - Mixed: Simple two-step operations: $(a + b) - c$ or $a \times b + c$ with small integers.
- **`hard` (Sulit):**
  - Addition: 3-digit additions ($100 \le a, b \le 450$).
  - Subtraction: 3-digit subtractions ($150 \le a \le 900, 50 \le b < a$).
  - Multiplication: 2-digit multiplication ($12 \le a \le 25, 3 \le b \le 15$).
  - Division: 3-digit dividends divided by 1-digit or simple 2-digit numbers ($100 \le a \le 600$), integer quotient.
  - Mixed: Multi-step expressions: $a \times b - c$, $a + b \times c$, or $(a - b) \times c$.

#### Paired Symmetry Specification:
To guarantee absolute fairness between Team Blue and Team Red:
```typescript
export interface MathQuestionPair {
  p1: MathQuestion;
  p2: MathQuestion;
}

export function generateSymmetricMathPair(difficulty: "easy" | "medium" | "hard"): MathQuestionPair
```
1. An operation archetype is selected at random for the round (e.g. `2-digit addition with carry`).
2. Two distinct instances of the same archetype are generated using the exact same constraints:
   - Example Blue: $27 + 18 = 45$
   - Example Red: $36 + 19 = 55$
3. Both problems require the same number of mental steps and digit carries.
4. Distractors are generated using identical delta distributions around the correct answer.

---

### 2.2 Pre-Game Configuration Modal (`src/components/game/GameSetupModal.tsx`)

A reusable, accessible modal presented before any game begins.

#### Visual and UX Rules:
- **No Emojis:** Replace all emoji icons with Lucide React icons.
- **No Em Dashes:** Use standard pipes `|`, badges, or separate semantic text elements.
- **Touch Ergonomics:** Buttons have a minimum height of 64px to 80px, suitable for Interactive Flat Panels (IFP) with 10-point multitouch.
- **Active State:** High-contrast blue/indigo borders and solid backgrounds to clearly indicate selections.

#### Component Interface:
```typescript
export type DifficultyLevel = "easy" | "medium" | "hard";

export interface GameSetupModalProps {
  isOpen: boolean;
  gameTitle: string;
  gameSubtitle: string;
  availableDifficulties?: DifficultyLevel[];
  availableDurations?: number[]; // e.g. [30, 60, 90]
  defaultDifficulty?: DifficultyLevel;
  defaultDuration?: number;
  onStart: (config: { difficulty: DifficultyLevel; duration: number }) => void;
}
```

#### Settings Layout:
1. **Difficulty Selection:**
   - Easy: Lucide `Sparkles` | Title: "Mudah" | Subtitle: "Konsep dasar dan santai"
   - Medium: Lucide `Zap` | Title: "Sedang" | Subtitle: "Standar kompetisi seimbang"
   - Hard: Lucide `Flame` | Title: "Sulit" | Subtitle: "Tantangan kecepatan tinggi"
2. **Duration Selection:**
   - 30s: Lucide `Timer` | Title: "30 Detik" | Subtitle: "Pertandingan Kilat"
   - 60s: Lucide `Clock` | Title: "60 Detik" | Subtitle: "Standar Kompetisi"
   - 90s: Lucide `Hourglass` | Title: "90 Detik" | Subtitle: "Sesi Penuh"
3. **Action Button:**
   - Lucide `Play` | "Mulai Permainan"
   - Clicking dispatches `onStart`, closes modal, and triggers the 3-2-1 countdown.

---

### 2.3 Tiered Dataset Expansion for Non-Procedural Games

#### A. Quiz Tug-of-War (`src/data/quiz-trivia.ts`)
- Questions expanded to 60+ entries across categories: Sains, Geografi, Sejarah, Budaya.
- Explicitly split into `easy`, `medium`, and `hard`.
- Store queries only the selected difficulty pool.
- Prevent lockout race condition: Both players have a fair window to answer before the round advances.

#### B. Word Pinisi Duel (`src/data/word-challenges.ts`)
- Word challenges expanded from 17 to 60+ entries.
- Grouped by difficulty:
  - `easy`: 3-4 letter everyday words (Air, Daun, Api, Meja, Mata).
  - `medium`: 5-7 letter words (Sungai, Harimau, Pesawat, Jembatan).
  - `hard`: 8+ letter words (Pendidikan, Perdagangan, Pelestarian, Metamorfosis).
- Replace emoji ships in ship damage indicator with clean SVG / Lucide ship icons.

#### C. English Match (`src/data/vocab-pairs.ts`)
- Expanded from 30 to 60+ vocabulary pairs categorized into `easy`, `medium`, `hard`.
- Round synchronization: In each round, both Team Blue and Team Red receive the exact same 5 pairs to ensure fairness, but with column order shuffled independently.

#### D. Sorting & Science Games (`animals.ts`, `waste-items.ts`)
- Expanded lists with difficulty tags.
- Replaced emoji indicators with Lucide icons (`Leaf`, `Trash2`, `ShieldAlert`, `Fish`, `Bird`, `Bug`, etc.).

---

## 3. State Management & Lifecycle Flow

```
Page Load
  │
  ▼
[GameSetupModal] (Open by default)
  │  Player selects Difficulty (easy/medium/hard) & Duration (30s/60s/90s)
  │  Player clicks "Mulai Permainan"
  ▼
Phase: "countdown" (3... 2... 1...)
  │  Store initialized with selected difficulty and duration
  ▼
Phase: "playing" (Timer begins from selected duration)
  │  Procedural engine or tiered dataset supplies fair questions
  │  Paired symmetry keeps Blue & Red difficulty identical
  ▼
Phase: "finished"
  │  VictoryResultModal displayed
  │  Rematch button allows re-playing with current settings or returning to setup
```

---

## 4. Testing & Verification Plan

1. **Unit Testing of Math Engine:**
   - Verify integer outputs, non-negative results for all subtraction, and non-zero divisors for all division across 1,000 generated pairs.
   - Verify that for any pair, `p1.difficulty === p2.difficulty` and both match the requested tier.
2. **Visual & Touch Accessibility Inspection:**
   - Ensure touch targets on `GameSetupModal` are >= 64px.
   - Verify zero em dashes and zero emojis across all updated pages.
3. **Build & Typecheck:**
   - Execute `pnpm build` to verify clean Turbopack compile and strict TypeScript validation.
