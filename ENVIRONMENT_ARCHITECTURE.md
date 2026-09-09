# DESAPEGADO // ENVIRONMENT ARCHITECTURE
**Architecture Plan: Digital Jungle Archive & Habitat Integration**
*Document: ENVIRONMENT_ARCHITECTURE.md*

---

## 1. System Topology Overview

The **Digital Jungle Archive** is constructed as a 3-layer decoupled atmospheric system that lives behind and alongside the existing e-commerce DOM hierarchy. It is designed to be completely non-destructive: zero existing business logic or cart state is altered, and the 3D Gorilla Avatar remains the sacred, unperturbed centerpiece.

```
┌────────────────────────────────────────────────────────┐
│ [LAYER 3] FOREGROUND AMBIENCE (Z-INDEX: 30)            │
│ - Ultra-subtle blurred macro-leaves in peripheral corners│
│ - Depth-of-field bokeh (soft camera focus)             │
│ - Peripheral mist drifting on scroll                   │
└────────────────────────────────────────────────────────┘
                          ▲
┌────────────────────────────────────────────────────────┐
│ [LAYER 2] COMMERCIAL DOM & SACRED GORILLA (Z-INDEX: 20)│
│ - Header, Search, Navigation Mega-Menus                │
│ - Hero: Left Editorial + Right SACRED GORILLA AVATAR   │
│ - Product Grids, Live Filtering, Checkout Flow         │
│ - Liquid Glass Cards & Telemetry HUD                   │
└────────────────────────────────────────────────────────┘
                          ▲
┌────────────────────────────────────────────────────────┐
│ [LAYER 1] MIDGROUND HABITAT (Z-INDEX: 10)              │
│ - Organic Monstera, Palm & Fern silhouettes            │
│ - Ambient wind sway (GSAP / CSS transforms)            │
│ - Micro Monkey Appearances (intermittent shadows)      │
│ - Hanging botanical vines framing section borders      │
└────────────────────────────────────────────────────────┘
                          ▲
┌────────────────────────────────────────────────────────┐
│ [LAYER 0] DEEP BACKGROUND ATMOSPHERE (Z-INDEX: 0)      │
│ - Basalt darkness & nocturnal canopy gradients         │
│ - Subtle chlorophyll atmospheric bioluminescent haze   │
│ - Floating spores / micro-dust particles (canvas 2D)   │
│ - Technical blueprint grid with moss integration       │
└────────────────────────────────────────────────────────┘
```

---

## 2. Gorilla Integration Strategy (Sacred Asset)

### Core Mandate
- The existing procedural 3D SVG Gorilla Avatar (`GorillaAvatar.tsx`, `avatarEngine.ts`, `gorillaModel.ts`) is untouched.
- Its internal mathematical projection, quaternion rotation, eye glow modes, and telemetry HUD are 100% preserved.

### Environmental Integration
- The Hero right-column container will be enriched with:
  1. **Botanical Backing**: Subtle dark foliage silhouettes casting soft shadows behind the gorilla viewport.
  2. **Habitat Framing**: Specular glass casing with subtle biometric data readouts ("HABITAT: EQUATORIAL ARCHIVE", "SENSOR: ACTIVE 60FPS").
  3. **Atmospheric Lighting**: A slow, breathing radial emerald backlight pulsing behind the gorilla canvas, creating a dramatic rim-light silhouette.

---

## 3. Monkey & Ape Character Appearances (Phase 5)

### Design Parameters
- Appearances are **subtle, mysterious, and transient** ("Wait — was that a monkey?").
- They must **never** distract from product discovery or cover prices/CTAs.
- Total cycle time: Appearances occur once every 45–75 seconds, or when scrolling across specific section transitions.
- **Visual Styles**:
  - *Silhouette crossing*: A 2.5D silhouette traversing behind midground foliage in the upper viewport.
  - *Reflective eyes*: A pair of subtle optic amber eyes briefly blinking within a dark canopy cluster.
  - *Glass panel reflection*: A faint silhouette ghosting across a glass card reflection and fading out in 1.2 seconds.
- **Implementation**: Lightweight SVG path silhouettes animated via CSS keyframes or GSAP, paused when off-screen via `IntersectionObserver` to ensure zero CPU/GPU overhead when not in view.

---

## 4. Reusable Banana Reward System Architecture (Phase 9)

### Business Rules
- **Rule 1**: Every $10 USD (or equivalent R$ 50 BRL) spent = 1 banana.
- **Rule 2**: A 10% discount coupon applied grants an instant bonus of 10 bananas.
- **Data-Driven**: Accepts `bananaCount: number` dynamically.

### State & Store Integration
- Extended in Zustand store or a dedicated `useRewardStore` to persist the customer's total collected bananas across sessions.
- In `/checkout`, upon order confirmation (`handleFinishOrder`), a celebratory reward sequence is triggered:
  1. Brief interface transition into "REWARD PROTOCOL".
  2. Physics-based particle simulation: Bananas fall through the screen with gravity, rotation, aerodynamic drift, and bounce easing.
  3. Visual particle pool capped at 35 instances (if reward is 100 bananas, they fall in 3 cascading waves with a counting HUD to prevent DOM bloat).
  4. Gorilla reward banner: *"O GORILA RECOMPENSOU VOCÊ COM X BANANAS"*.
  5. User's header banana badge counter animates up (+X).
  6. Smooth transition back to clean forensic confirmation state.

---

## 5. Performance Budget & Mobile Adaptation

- **Desktop**: Full 3-layer environment, atmospheric spore particles (30 particles), micro-animations, full glass blur.
- **Mobile (< 768px)**:
  - Particle count reduced to 12.
  - Foreground blurred leaves disabled to maximize viewport touch area and readability.
  - Backdrop blur reduced from 32px to 16px.
  - Full support for `prefers-reduced-motion`: all foliage sway and particle drift immediately stop, defaulting to elegant static framing.
  - Strict cleanup on component unmount to prevent GPU memory leaks.
