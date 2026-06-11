# EduPanel Design System & Palette

This document outlines the visual language and color palette for the competitive game modules inside EduPanel.

## 1. Global Themes

The games follow a light, clean aesthetic optimized for high-frequency touch interactions on large interactive flat panels (IFP).

- **Main Background**: Light Sky Blue (`#e0f2fe`)
- **Primary Text**: Slate Gray (`#1f2937`) or Deep Navy (`#1e1b4b`)
- **Overlay/Modal Background**: `rgba(224, 242, 254, 0.95)` with `blur(12px)`
- **Timer/HUD Background**: White (`#ffffff`) with subtle gray borders.

## 2. Player Colors

The games are designed for two players (or teams), heavily contrasting blue and red.

### Player 1 (Tim Biru)

- **Primary Color**: Deep Blue (`#1e3a8a`)
- **Panel Header**: Very Dark Blue (`#1e1b4b`)

### Player 2 (Tim Merah)

- **Primary Color**: Deep Red (`#7f1d1d`)
- **Panel Header**: Very Dark Red (`#7f1d1d`)

## 3. Interactive Elements (Buttons & Inputs)

### Numpad / Default Quiz Buttons

- **Background**: Light Gray (`#f3f4f6`)
- **Active State**: Darker Gray (`#e5e7eb`)
- **Text Color**: Dark Gray (`#1f2937` or `text-gray-800`)
- **Bottom Border (3D Effect)**: Gray-300 (`#d1d5db` or `border-gray-300`)

### Action Buttons

- **Clear ("C") Button**:
  - Background: Red (`#ef4444`)
  - Border: Dark Red (`#b91c1c`)
  - Text: White
- **Submit ("Go") Button**:
  - Background: Sky Blue (`#0ea5e9`)
  - Border: Dark Sky Blue (`#0369a1`)
  - Text: White

### Feedback States (Success / Error)

- **Correct Answer**:
  - Background: Green (`#4adeab`)
  - Border: Dark Green (`#10b981`)
  - Text: White
  - Glow (Box Shadow): `0 0 50px rgba(74, 222, 171, 0.8)`
- **Wrong Answer**:
  - Background: Red (`#ef4444`)
  - Border: Dark Red (`#b91c1c`)
  - Text: White
  - Glow (Box Shadow): `0 0 50px rgba(255, 68, 68, 0.8)`

## 4. Pixel Art Sprites

The characters are designed entirely with CSS/SVG using strict hard edges.

- **Skin Tone**: Peach (`#f5c29a`)
- **Hair/Outlines**: Very Dark Gray (`#1a1a1a`)
- **Headband**: Red (`#e11d48`) & White (`#ffffff`)
- **Legs/Pants**: Zinc (`#52525b`)
- **Shoes**: Almost Black (`#18181b`)

## 5. Rope Graphics (Tug-of-War)

- **Rope Body**: Orange-Brown (`#b45309`)
- **Rope Outlines**: Dark Brown (`#78350f`)
- **Center Marker**: Yellow (`#facc15`) with Black border.

## 6. Layout Scaling (Responsiveness)

To support 4K displays and varying IFP sizes, all primary dimensions use CSS `clamp()`.

- **Text (Headings)**: `clamp(36px, 4vw, 72px)`
- **Text (Buttons)**: `clamp(32px, 2.5vw, 56px)`
- **Panel Widths**: `clamp(320px, 26vw, 480px)`
- **Padding/Gaps**: `clamp(12px, 1.5vh, 24px)` to `clamp(16px, 2vh, 32px)`
