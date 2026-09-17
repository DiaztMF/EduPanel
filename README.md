# EduPanel

An interactive classroom gamification platform engineered for large touch displays and Interactive Flat Panels (IFPs), transforming textbook curricula into collaborative multiplayer mini-games.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Display](https://img.shields.io/badge/Display-4K%20%7C%201080p%20IFP-teal)](#architecture--development-guides)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-teal)](https://tailwindcss.com/)

## Installation

Clone the repository and install dependencies using pnpm:

```bash
git clone https://github.com/DiaztMF/EduPanel.git
cd EduPanel
pnpm install
```

## Quick Start

1. Start the interactive local runtime:

```bash
pnpm dev
```

2. Open [http://localhost:3000](http://localhost:3000) on your interactive display or touch browser. For optimal physical classroom engagement, toggle browser Fullscreen mode (`F11`).

## What is EduPanel?

`EduPanel` is an educational web platform specifically optimized for large classroom touch monitors (Interactive Flat Panels). It delivers curated, competitive, and collaborative mini-games (rapid quiz buzzers, word unscramblers, physics drag-and-drop) designed for simultaneous multi-student touch input.

## Why EduPanel?

Standard learning management systems are designed for personal 1-to-1 laptop screens and fail when projected onto classroom hardware due to tiny touch targets and single-pointer limitations. `EduPanel` features high-contrast graphics, massive hitboxes, audio feedback, and multi-touch capabilities tailored for active physical learning.

## API / Routes

### Navigation Routes
- `/`: Central game launcher and subject category picker (Mathematics, Science, Language).
- `/games/quiz-arena`: Multi-team fast-response buzzer quiz for classroom competitions.
- `/games/word-match`: Interactive drag-and-connect vocabulary builder.
- `/settings`: Audio thresholds, timer configurations, and difficulty toggles.

## Examples

Configuring a multiplayer game round via local state:

```typescript
export interface GameSessionConfig {
  gameMode: 'TEAM_VS_TEAM' | 'FFA';
  roundDurationSeconds: number;
  questionSetId: string;
  enableSoundEffects: boolean;
}

export function createSession(config: GameSessionConfig) {
  return {
    id: crypto.randomUUID(),
    teams: ['Red Dragons', 'Blue Falcons'],
    scores: { 'Red Dragons': 0, 'Blue Falcons': 0 },
    ...config,
  };
}
```

## Architecture & Development Guides

- Frontend Shell: Next.js 15 Single Page Application (SPA) architecture with React 19.
- IFP Touch Tuning: High-contrast typography, large button hitboxes (>64px), and native touch gesture support.
- Audio Feedback: Low-latency Web Audio API sound effects for countdowns, correct answers, and victory fanfare.

## License

MIT License. See [LICENSE](LICENSE) for full details.