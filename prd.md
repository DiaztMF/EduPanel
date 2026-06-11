# PRODUCT REQUIREMENT DOCUMENT (MASTER PRD)

**Project Name:** EduPanel Interactive Games (EduPanel Hub)  
**Version:** 1.0.0  
**Target Hardware:** Interactive Flat Panel (IFP) - 4K/1080p Touch Displays  
**Development Approach:** Single-Page Application (SPA) Shell / Modular Component Architecture

---

## 1. INTRODUCTION & TARGET AUDIENCE

### 1.1 Overview

EduPanel Hub is a web-based educational platform featuring a collection of local multiplayer mini-games specifically optimized for Interactive Flat Panels (IFP) in school classrooms. The app gamifies traditional subjects, converting passive learning into an active, competitive, and collaborative physical experience directly on the classroom's big screen.

### 1.2 Target Audience

- **Students (Primary Users):** K-12 and vocational students playing simultaneously in pairs (2 players) via a shared, large touch screen.
- **Teachers (Facilitators):** Educators who launch the application, select specific learning modules/games, and manage game sessions.

---

## 2. SYSTEM ARCHITECTURE & TECH STACK

The platform operates on a **"Single Shell, Multiple Sub-Apps"** pattern. All games share a core structural wrapper that orchestrates global layouts and input isolation.

| Architecture Layer     | Technology Selection                       | Justification for IFP Deployment                                                                                                 |
| :--------------------- | :----------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend Framework** | **Next.js 16 (App Router)**                | Instant initial asset delivery via Server Components; highly structured route nesting for 12 isolated games.                     |
| **UI & Styling**       | **Tailwind CSS + Shadcn UI**               | High-velocity fluid grid layout system built for massive 4K displays and modular utility component UI.                           |
| **State Management**   | **Zustand**                                | Zero-overhead, reactive client-side store capable of handling rapid multi-player continuous state updates.                       |
| **Gesture & Input**    | **React-Use-Gesture / Pointer Events API** | Native multi-touch surface extraction; absolute input isolation preventing Player 1 from locking or canceling Player 2 gestures. |
| **Animation Engine**   | **Framer Motion**                          | Lightweight layout animations providing rich spatial and tactile visual feedback upon touch interactions.                        |
| **Audio Processing**   | **Howler.js**                              | Reliable cross-browser audio sprite engine with minimal latency execution for touch-sound mapping.                               |
| **Package Manager**    | **pnpm**                                   | Drastically reduces physical storage constraints on edge hosting and local testing nodes.                                        |

---

## 3. CORE PLATFORM FEATURES (GLOBAL SUBSYSTEMS)

### 3.1 Game Selection Dashboard

A retro, pixel-art inspired centralized launcher interface (referencing the provided main menu asset image layout) to seamlessly switch between the 12 educational modules.

### 3.2 Dual-Player Multi-Touch Splitter

An absolute viewport management utility that segments the screen space into dedicated interactable boundaries:

- **Left Sub-Viewport:** Player 1 Interactive Workspace.
- **Right Sub-Viewport:** Player 2 Interactive Workspace.

### 3.3 Shared UI Component Library

To maintain consistency, every sub-game component MUST import and mount these globally uniform widgets:

- `<GlobalTimer />`: Countdown mechanism that dispatches game termination sequences when reaching zero.
- `<VersusScoreBoard />`: High-contrast, color-coded live scoring layout (Blue accent for Player 1, Red accent for Player 2).
- `<VictoryResultModal />`: Shadcn-based post-game screen parsing results, announcing winner tallies, and mounting immediate rematch callbacks.
- `<AudioFeedback />`: Instant sound system mapping for distinct actions (button taps, correct answers, wrong answers, state completions).

---

## 4. CRITICAL CORE CONSTRAINTS FOR THE AI AGENT

> [!IMPORTANT]
> **Strict Implementation Rules for AI Code Generation:**
>
> 1. **Massive Display Optimization (4K):** Design strictly within a 16:9 responsive container. Avoid small sizing primitives. Use massive Tailwind utility footprints (`text-3xl`, `p-8`, `w-24`) or fluid relative typography scaling (`vh/vw` and `rem`) to maintain legibility from the back of a classroom.
> 2. **Physical Touch Size Targets:** All buttons or interactive target nodes must hold a minimum padding matrix of `p-4` or absolute bounds between `48px` to `80px` to accommodate human fingers and chunky IFP active stylus pens.
> 3. **Zero Hover States:** Completely omit Tailwind `hover:` utility styles for all active gameplay panels. Screens do not capture floating pointer hover mechanics. Rely exclusively on `active:` wrappers or immediate visual color/scale shifts when a touch event is registered.
> 4. **Folder Hierarchy Blueprint:**
>    ```text
>    ├── src/
>    │   ├── app/
>    │   │   ├── page.tsx (Centralized Launcher Dashboard)
>    │   │   └── games/
>    │   │       ├── math-tug-of-war/
>    │   │       ├── waste-sorting-race/
>    │   │       └── [other-games]/
>    │   ├── components/ (Shared UI: Timer, ScoreBoard, Modal)
>    │   └── store/
>    │       └── useGameStore.ts (Global & Per-Game Zustand State Engine)
>    ```

---

## 5. INTEGRATED MINI-PRDS (THE 12 GAMES MODULE SPECIFICATION)

### KATEGORI A: COMPETITIVE REFLEX & SPEED MECHANICS (VERSUS TAPPING & TIMING)

#### 1. Math Tug-of-War (Game Tarik Tambang Matematika)

- **Core Mechanic:** The viewport splits down the middle, displaying a math problem in a center floating container. Players race to tap the correct answer option on their respective panels. A correct tap shifts the rope 10% to their side; an incorrect tap shifts the rope toward the adversary.
- **Win Condition:** Pull the rope's center flag into your designated threshold boundary, or hold the positional advantage when the `<GlobalTimer />` expires.
- **Zustand State:** `ropePosition: number` (X-coordinate variable bound between -50 and 50), `currentQuestion: Object`.

#### 2. Quiz Tug-of-War (Game Tarik Tambang Kuis Pengetahuan)

- **Core Mechanic:** Inherits the identical structural framework of Game 1, replacing numerical expressions with science and general knowledge trivia datasets. Features custom animated pixel art avatars forming a tugging crew that visibly pulls harder upon correct answers.
- **Win Condition:** Displace the central flag past the boundary line.
- **Zustand State:** Re-uses `ropePosition` store engine mapped to a different trivia payload.

#### 3. Math Pipette Duel (Game Duel Pipet Matematika)

- **Core Mechanic:** Laboratory theme. Two parallel vertical graduated cylinders occupy each player's zone. Resolving math queries allows players to rapidly tap a "Pipette Pump" to inject liquid into their designated tube.
- **Win Condition:** Fill the graduated cylinder to maximum fluid threshold (100%).
- **Zustand State:** `p1LiquidLevel: number`, `p2LiquidLevel: number` (0 to 100 scales).

#### 6. Word Pinisi Duel (Game Duel Pinisi Kata)

- **Core Mechanic:** Two classic Indonesian Pinisi ships race horizontally across an oceanic grid. Anagram scrambled letter matrices float at the bottom. Players tap and sort letters into valid vocabulary words matching given context clues to trigger a wind burst that propels their ship.
- **Win Condition:** Sail your respective Pinisi across the finish line on the far right edge.
- **Zustand State:** `p1ShipProgress: number`, `p2ShipProgress: number`, `wordTarget: string`.

#### 11. Basketball (Basket)

- **Core Mechanic:** A pure rhythmic timing game. Basketball hoops oscillate horizontally on automated paths inside the player lanes. Players must tap a large "Shoot" action button at the exact intersection vector where the ball lines up with the moving hoop net.
- **Win Condition:** Accumulate the highest total points inside a 60-second runtime limit.
- **Zustand State:** `p1BasketPosition: number`, `p2BasketPosition: number`, `p1Score: number`, `p2Score: number`.

---

### KATEGORI B: SORTING & MATCHING MECHANICS (DRAG-AND-DROP GRIDS)

#### 4. Animal Classification (Game Klasifikasi Hewan)

- **Core Mechanic:** Central canvas displays high-contrast animal vectors dynamically cycling. Players work in parallel grids or a shared arena to grab, drag, and drop the animal vectors into designated ecosystem boxes (Mammals, Reptiles, Birds, Amphibians).
- **Win Condition:** Capture the highest accurate categorization points before the timer runs out.
- **Zustand State:** `activeAnimal: Object`, `scoreP1: number`, `scoreP2: number`.

#### 5. Waste Sorting Race (Game Balapan Pilah Sampah)

- **Core Mechanic:** True vertical split-screen execution. Debris icons float down dual conveyor belts. Players must tap, slide, and throw the waste items into their matching disposal containers: Organic, Inorganic, and Hazardous (B3).
- **Win Condition:** Maintain a clear conveyor belt line and acquire the maximum sorting velocity score.
- **Zustand State:** `p1ConveyorItems: Array`, `p2ConveyorItems: Array`.

#### 10. English Match

- **Core Mechanic:** Text boxes representing English vocabulary items stack on the outer bounds, while descriptive icons or Indonesian translations populate the inner center space. Players execute coordinate-based line drags (`Pointer Events`) to map and pair the word to its definition.
- **Win Condition:** Resolve all word-pairing links correctly ahead of the opponent.
- **Zustand State:** `connectionsP1: Array`, `connectionsP2: Array`.

---

### KATEGORI C: EXPLORATION, SIMULATION & CULTURE (INTERACTIVE DISPLAY ENGINE)

#### 7. Space Exploration (Antariksa)

- **Core Mechanic:** A multi-touch astronomical simulator. Two students can interact simultaneously with separate planets in a planetary system map. Pinch-to-zoom gestures expand individual orbital logs, while a secondary panel requires dragging correct moons/satellites onto the planet's gravitational rings.
- **Win Condition:** Purely educational/exploratory; completion screen triggers when 100% of moons are correctly mapped.
- **Zustand State:** `selectedPlanet: string`, `satelliteAnchoredCount: number`.

#### 8. King of the Jungle (Sang Juara Rimba)

- **Core Mechanic:** A stylized digital board game set across an Indonesian wilderness preserve canvas. Players alternate turns to tap a giant central electronic die. Moving across the spaces prompts pop-up challenges tracking nature preservation, wildlife facts, and eco-systems.
- **Win Condition:** Successfully navigate your token to the final tile of the trail.
- **Zustand State:** `turn: 'p1' | 'p2'`, `positionP1: number`, `positionP2: number`.

#### 9. Geometric Shapes Workspace (Media Pembelajaran Interaktif Bangun Ruang)

- **Core Mechanic:** A structural math utility visualizing 3D geometry (Cubes, Prisms, Cylinders). Supports multi-point touch rotation and dragging vertex nodes to unwrap the shapes into flat 2D nets. Player 2 matches formula cards (Volume, Surface Area) to Player 1's unwrapped meshes.
- **Win Condition:** Accurately assemble and link formulas to all 3D geometric archetypes.
- **Zustand State:** `activeShape: string`, `isUnfolded: boolean`, `formulaMatched: boolean`.

#### 12. Traditional Game Hub - Congklak / Gobak Sodor Digital

- **Core Mechanic:** Digital adaptation of traditional board games (e.g., Congklak). Layout renders a horizontal board across the IFP. Players stand on alternating sides, executing continuous tapping loops to shift virtual seeds sequentially down circular pit arrays following authentic play rules.
- **Win Condition:** Harvest the majority seed count within your primary scoring pit when the outer nodes clear out.
- **Zustand State:** `boardHoles: Array<number>`, `activePlayer: number`.P
