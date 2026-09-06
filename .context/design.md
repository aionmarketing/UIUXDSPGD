# Visual Design Specification: Monolith Onyx

This document overrides any provisional design tokens mentioned in `CLAUDE.md`. The project uses a strict monochromatic **Onyx Basalt & Optic Platinum** palette. 

## 1. Dual-UI Philosophy
The system serves two distinct user experiences from the same Next.js app, routed via middleware:

* **Storefront (desapegado.com):** Highly immersive. Uses WebGL/Three.js for 3D product rendering, GSAP for scroll coreography, and "Liquid Specular Glass" UI components.
* **Seller PWA (addclothes.):** Utilitarian and indestructible. Zero glassmorphism, zero WebGL, zero heavy animations. Uses solid, high-contrast panels to ensure maximum performance and battery life on mobile devices.

## 2. Tailwind v4 Token Configuration
Tokens must be declared exclusively in `app/globals.css` inside the `@theme` block.

@theme {
  --color-canvas-base: #0c0d10;
  --color-canvas-well: #090a0d;
  --color-text-optic: #ffffff;
  --color-text-platinum: #94a3b8;
  --color-text-slate: #64748b;
  --color-glass-substrate: rgba(18, 20, 26, 0.75);
  --color-border-specular: rgba(255, 255, 255, 0.42);
  --color-border-subtle: rgba(255, 255, 255, 0.12);
}

## 3. Storefront UI Rules (Liquid Glass)
* **Glass Containers:** bg-glass-substrate backdrop-blur-[36px] border-t border-border-specular border-b-black/90 border-x border-border-subtle shadow-xl
* **Contrast Mandate:** Text must never bleed over the blurred background. Descriptive text must sit on a solid bg-canvas-well block to guarantee WCAG AAA contrast.

## 4. Seller PWA UI Rules
* **No Blurs:** Use solid bg-canvas-base and bg-canvas-well.
* **UX:** Massive touch targets (min 48px height). Native camera input `<input type="file" accept="image/*" capture="environment">` pinned to the top.