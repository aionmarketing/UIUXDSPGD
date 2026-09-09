# DESAPEGADO // DESIGN SYSTEM
**Concept: DIGITAL JUNGLE ARCHIVE // MONOLITH ONYX**
*Version: 2.0 // Architectural Specification*

---

## 1. Design Philosophy

The aesthetic identity is **DESAPEGO // DIGITAL JUNGLE ARCHIVE**:
A fusion of:
1. **Luxury Streetwear Archive**: Strict Swiss typography, monospace technical metadata, high-density editorial layouts, monochrome dominance.
2. **Forensic Digital Facility**: Specular blueprints, crosshair overlays, cryptographic authentication grades, sensor telemetry.
3. **Tropical Jungle & Gorilla Habitat**: Deep basalt darkness, ambient chlorophyll hues, distant canopy silhouettes, organic palm geometry, atmospheric mist.
4. **Refined Glassmorphism**: High-index optical glass, sharp specular top-borders (`border-border-specular`), restrained blur (`backdrop-blur-xl`), and dark high-contrast wells for guaranteed WCAG AAA readability.

---

## 2. Color Palette & Chromatic Tokens

The existing palette (monochrome onyx with subtle green signals) is preserved and enriched with botanical low-chroma habitat tones:

```css
/* Core Canvas & Architecture */
--color-canvas-base: #0c0d10;         /* Deepest Basalt Onyx */
--color-canvas-well: #090a0d;         /* High-contrast solid well for text blocks */
--color-canvas-elevated: #11141c;     /* Card surface foundation */

/* Botanical Habitat Accents (Low saturation, eerie, luxury) */
--color-jungle-deep: #050b07;         /* Nocturnal canopy shadow */
--color-jungle-moss: #0d1a12;         /* Wet basalt moss undertone */
--color-jungle-emerald: #10b981;      /* Forensic signal pulse & active state */
--color-jungle-mint: #34d399;         /* High-contrast data readout */
--color-jungle-canopy: rgba(16, 185, 129, 0.04); /* Ambient atmospheric light */

/* Typography & Optic Signals */
--color-text-optic: #ffffff;          /* Primary editorial titles & prices */
--color-text-platinum: #94a3b8;       /* Secondary metadata & descriptions */
--color-text-slate: #64748b;          /* Technical telemetry, labels, timestamps */

/* Liquid Specular Glass Tokens */
--color-glass-substrate: rgba(12, 14, 20, 0.72);
--color-glass-jungle: rgba(9, 13, 11, 0.76);
--color-border-specular: rgba(255, 255, 255, 0.28);
--color-border-subtle: rgba(255, 255, 255, 0.12);
--color-border-habitat: rgba(16, 185, 129, 0.18);
```

---

## 3. Typography & Micro-Hierarchy

- **Display & Monospace**: `font-mono` (Geist Mono / SF Mono / Consolas) used for badges, serial codes, telemetry, prices, and forensic grades.
- **Editorial Headlines**: Uppercase, tight letter tracking (`tracking-tight` to `tracking-tighter`), bold weights (800 / 900) paired with delicate italic subheads.
- **Product Text**: Clean sans-serif/system font with high line height (`leading-relaxed`) and WCAG AAA contrast ratio (> 7:1) placed on solid `--color-canvas-well` backing plates.

---

## 4. Glassmorphism Design Rules

Glass is an **interface material**, not the whole page:
1. **Never render raw text directly on transparent noisy backgrounds**: Every critical text block (product price, specs, checkout forms) sits inside an inner high-contrast well.
2. **Specular Top-Highlight**: Every glass card has a 1px top highlight streak (`shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]`) emulating physical optic glass bevels.
3. **Controlled Blur**: Blur levels are calibrated between `16px` and `32px` to prevent GPU overdraw and maintain 60 FPS scrolling on laptops and mobile devices.

---

## 5. Animation & Motion Guidelines

1. **DOM / UI**: Driven by GSAP timelines (`power3.out`, `duration: 0.8 - 1.2s`) and Framer Motion for interactive hover states.
2. **Botanical Breathing**: Ambient vegetation movement uses smooth trigonometric oscillations (`sin`/`cos`) with long periods (6s to 12s) to feel organic, heavy, and calm.
3. **Monkey Appearances**: Brief, infrequent micro-events (silhouettes slipping between foliage, eyes glinting in the dark canopy) occurring every 45–90 seconds or on specific scroll milestones.
4. **Physical Banana Particles**: Accelerated downward by simulated gravity ($g = 980 \text{px/s}^2$), random initial rotational velocity, slight horizontal aerodynamic drift, capped at a maximum of 40 simultaneous instances with memory pooling.
