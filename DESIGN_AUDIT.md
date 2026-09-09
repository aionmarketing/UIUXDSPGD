# DESAPEGADO // DESIGN AUDIT REPORT
**Phase 1: Deep Forensic & Technical Inspection**
*Project: DESAPEGADO E-Commerce (Monolith Onyx // Digital Archive)*
*Timestamp: 2026-09-09*

---

## 1. Executive Summary & Core Constraints

DESAPEGADO is a high-end streetwear and vintage runway circular fashion archive e-commerce platform. The existing application is fully functional, complete with product discovery, live filtering, dynamic checkout with PIX / credit card / crypto, cart management via Zustand, and a signature interactive 3D Gorilla Avatar acting as the brand's mascot and centerpiece.

### Sacred Directives
1. **Preserve Business Logic**: Product catalog, taxonomy, cart store (`useCartStore`), checkout pipeline, pricing, authentication, and APIs must remain intact.
2. **The 3D Gorilla is Sacred**: The existing 3D gorilla avatar in the hero is a key brand asset. It must **not** be redesigned, replaced, regenerated, or visually altered. It will be treated as a fixed, untouchable centerpiece.
3. **Aesthetic Direction**: "DESAPEGO // DIGITAL JUNGLE ARCHIVE" — a blend of Luxury Streetwear Archive + Forensic Digital Archive + Tropical Jungle + Gorilla Habitat + Refined Glassmorphism.
4. **Anti-Slop Guardrails**: Avoid cartoonish elements, generic AI SaaS tropes, neon cyberpunk clichés, excessive glassmorphism, or cheap gaming UI.

---

## 2. Technical Stack Audit

| Dimension | Specification | Notes |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.3.4 (App Router, Turbopack) | React 19.2.8, TypeScript 5. Strict adherence to AGENTS.md rules. |
| **Styling Engine** | Tailwind CSS v4 (`@tailwindcss/postcss: ^4.3.3`) | CSS variables declared in `@theme` in `src/app/globals.css`. |
| **Animation Systems** | GSAP 3.15.0 + ScrollTrigger<br>Framer Motion 13.2.0 | GSAP coordinates editorial entrance timelines and scrub parallax. Framer Motion manages interactive card spot glare and 3D medallions. |
| **3D / WebGL Stack** | Three.js 0.185.1 + `@react-three/fiber` 9.7.0 + `@react-three/drei` 10.7.8 | Available in `package.json`. |
| **State Management** | Zustand 5.0.15 (`useCartStore.ts`) | Persistent local storage store with coupon validation, shipping methods, and cart items. |
| **Database / Backend** | Neon Serverless (`@neondatabase/serverless`) + Drizzle ORM | Serverless PostgreSQL schema configured for catalog and seller PWA. |
| **Iconography** | `@phosphor-icons/react` + `lucide-react` | Ultra-clean architectural line icons with `weight="light"`. |

---

## 3. The 3D Gorilla Architecture Analysis

### How the Gorilla is Currently Rendered
Contrary to initial assumptions of a heavy GLTF/GLB WebGL canvas, the gorilla is driven by a custom **Procedural 3D Vector Math Engine** (`src/features/storefront/components/avatar/`):
- **Geometry Definition** (`gorillaModel.ts`): Mathematical vertex arrays (`Point3 = [x, y, z]`) defining the brow ridge, multiple concentric muzzle loops with nostril punch-throughs, the lower jaw contour, and predator eye sockets.
- **Kinematic Engine** (`avatarEngine.ts`): Converts pitch, yaw, and roll Euler degrees into 3D unit quaternions (`quaternionFromEulerDegrees`), applies quaternion matrix rotation (`rotateWithQuaternion`), and projects to screen coordinates using perspective focal length (`FOCAL_LENGTH = 1200`).
- **Rendering Loop** (`GorillaAvatar.tsx`): Runs at 60 FPS using `requestAnimationFrame`. Instead of React state churn, it performs direct DOM attribute mutations on SVG `<path>` elements (`d` attribute generated via cubic Bezier smoothing) and `<circle>` elements for pupil tracking.
- **Features**: Real-time cursor tracking across the entire window, click snarl recoil physics, ambient breathing oscillations, telemetry HUD (yaw, pitch, roll, FPS), and interactive debug sliders.

### Architectural Decision on WebGL vs. Procedural 3D
- Because the gorilla is an SVG vector mathematical engine, it requires **zero heavy Three.js context switching** and renders with razor-sharp fidelity on Retina displays.
- Attempting to convert the gorilla into a generic 3D model would violate the sacred rule: *"DO NOT redesign, replace, regenerate or visually alter the gorilla yet."*
- **Solution**: Keep the gorilla engine intact in its dedicated viewport. Build the layered jungle habitat around and behind it using hardware-accelerated, lightweight canvas/particle layers and CSS backdrop filters, ensuring zero frame drops and perfect visual harmony.

---

## 4. Current Component & Page Hierarchy

- **Layout** (`src/app/(loja)/layout.tsx`): Blueprint grid background, ambient specular gradients, sticky high-end glass header, main content slot, footer.
- **Hero** (`src/features/storefront/components/Hero.tsx`):
  - Left: Edition badge, editorial typography ("MODA CIRCULAR STREETWEAR & ARQUIVO VINTAGE"), forensic authenticity guarantee card, CTAs.
  - Right: Liquid glass container holding the 3D Gorilla Avatar + floating forensic telemetry glass card.
- **Kinetic Marquee** (`KineticMarquee.tsx`): Continuous CSS marquee of archive categories and guarantees.
- **Novidades Grid** (`NovidadesGrid.tsx`): Category filter tabs ("ALL", "Roupas", "Sneakers", "Acessórios") and responsive 5-column product grid (`ProductCard.tsx`).
- **Brands Showcase** (`BrandsGrid.tsx`): 3D spinning brand medallions with 3D CSS rotation (`preserve-3d`), hover perspective, and expandable brand drawer.
- **Navigation Header** (`Header.tsx`): Double-decker glass navbar with search, currency switcher (BRL/USD), mega-dropdowns for taxonomy, live cart badge.
- **Cart & Checkout** (`/carrinho`, `/checkout`): Multi-step forensic checkout (Identificação, Endereço, Frete, Pagamento PIX/Cartão/Crypto, Confirmação com protocolo de liquidação).

---

## 5. Responsive Behavior & Viewport Audit

- **Mobile (< 768px)**: Hero stacks vertically, gorilla canvas scales to 100% width with max 520px constraint. Header collapses into a slide-over mobile drawer.
- **Tablet (768px - 1024px)**: 3-column product grid, compact telemetry card.
- **Desktop (1024px - 1440px)**: 2-column editorial hero, 4-column product grid, full mega-dropdowns.
- **Ultra-wide (> 1440px)**: Centered 1280px/1440px container with expansive peripheral dark borders.

---

## 6. Audit Verdict & Transition Roadmap

The application has a robust, clean architectural foundation. The transition to **DESAPEGO // DIGITAL JUNGLE ARCHIVE** will respect all existing components, styling tokens, and the sacred gorilla engine while introducing:
1. Multi-layered organic jungle depth (atmospheric haze, palm silhouettes, deep foliage).
2. Occasional, mysterious ape/monkey micro-appearances.
3. Unified liquid glass surfaces with high contrast readability.
4. Physical banana reward particle system triggered on checkout completion ($10 = 1 banana, 10% coupon = 10 bananas).
