# Web UI & Interactive Craft Rules (Universal Reference)

> **Purpose:** Portable, project-agnostic engineering and design rules for AI coding agents building modern editorial and Awwwards-caliber web interfaces.  
> **Scope:** Universal — applies to any web project unless explicitly overridden by the user.

---

## 1. Collaboration, Analysis & Permission Protocol

1. **Ask Whenever Uncertain** — Ask as many clarifying questions as needed whenever requirements, visual direction, or tradeoffs are ambiguous. Never invent unstated user preferences.
2. **Analyze Before Acting (No Shortcuts)** — Always inspect the codebase, architecture, and constraints before writing code. Quick hacks, fragile workarounds, and skipping root-cause analysis are strictly prohibited.
3. **Major-Decision Approval Gate** — Obtain explicit user permission before making high-impact changes, including:
   - Restructuring page layouts or adding/removing major sections
   - Installing new libraries or packages
   - Generating, replacing, or adding images, videos, or audio assets
   - Altering agreed color palettes, typography pairings, or rules in this document
   - *Note:* Read-only codebase analysis and small, low-risk technical fixes (e.g., typo fixes, minor alignment or bug fixes) may proceed directly without blocking the user.
4. **Media Honesty Rule** — If a design genuinely requires bespoke photography, illustrations, or video, proactively tell the user what asset is needed and why. Never hide missing media behind mismatched animations, generic gradients, or decorative placeholders.
5. **Clean Code Standard** — Write modular, readable, strongly typed, maintainable code with clear separation between content/data, presentation, styling, and motion orchestration. Always respect `prefers-reduced-motion` and responsive viewports.

---

## 2. Hard Visual Prohibitions (AI Web Anti-Patterns)

The following patterns are **strictly forbidden** unless the user explicitly overrides them in writing:

- **No Decorative Pill Badges** — Do not place rounded status/category/promo pill tags above headings or scattered across sections.
- **No Eyebrow / Kicker Micro-Labels** — Do not add small uppercase tracked eyebrow text above section titles.
- **No Bento Grid Layouts** — Bento-style boxed card grids are strictly prohibited. Use editorial spreads, frameless typographic compositions, hairline dividers, asymmetric grids, pinned storytelling, or spatial/canvas layouts instead.
- **No Sparkles or AI-Cliché Icons** — Never use `Sparkles`, magic-wand icons, or decorative AI badge icons.
- **Restrained Iconography Only** — Use icons strictly where they add clear functional meaning (e.g., directional arrows, theme toggle, external link indicator). Never attach an icon to every heading, feature item, list row, or button.

---

## 3. Color System (60–30–10 Per Theme)

Every theme mode (Light and Dark) must follow a disciplined **maximum 3-color system**:

| Allocation | Role | Guidance |
| --- | --- | --- |
| **60%** | **Dominant Surface** | Primary background canvas (and subtle alternating surface tone if used) |
| **30%** | **Neutral Ink** | Primary typography, secondary copy, and structural hairlines |
| **10%** | **Primary Accent** | Single intentional brand/interaction accent color |

- **Permitted Derivatives:** Opacity steps, subtle tints, and shades derived directly from the 3 core colors are allowed to build hierarchy, borders, and hover states.
- **Functional Status Colors:** Semantic feedback colors (e.g., error, destructive action, validation success, redaction highlight) may be introduced **only** for critical functional states or with explicit user approval — never as decorative multi-color styling.

---

## 4. Typography System & Size Scale

### Font Family Budget
- **Maximum 2 primary font families** per project (1 Display/Heading family + 1 Body/UI family). If a project requires a different pairing or exception, ask the user before introducing it.
- **Monospace Exception:** System monospace is permitted **strictly** for code blocks and technical data readouts (e.g., coordinates, latency, terminal logs) — never as general UI copy or decorative labels.

### Font Size Best-Practice Scale

| Element | Recommended Size | Usage Notes |
| --- | --- | --- |
| **Body / Main Paragraph** | `16px–18px` (`1rem–1.125rem`) | Primary reading baseline with generous line height |
| **H1 (Hero / Page Title)** | `32px–48px+` | At least ~2× body size; Hero/Editorial Display `H1` may scale fluidly above `48px` (`clamp(...)`) for Awwwards-grade visual impact |
| **H2 (Section Heading)** | `24px–32px` | Standard section hierarchy |
| **H3 (Subsection Heading)** | `20px–24px` | Supporting structural subheadings |
| **Buttons & Navigation** | `14px–16px` | Crisp, legible interactive controls |
| **Captions & Metadata** | `12px–14px` | Use sparingly for supporting metadata only |

---

## 5. Awwwards Interactive Web Reference

Use the following catalog to choose deliberate, purposeful techniques aligned with the product's identity — never pile effects together without editorial intent.

### 5.1 Core Technologies

| Technology / Concept | Purpose |
| --- | --- |
| **Cubic Bézier Curves** | Creates organic curved paths (flowing lines, conduits, threads) via SVG paths, HTML5 Canvas paths, or Three.js curves. |
| **Framer Motion** | Component animations, micro-interactions, and layout transitions in React. |
| **GLSL (Custom Shaders)** | Custom vertex/fragment shaders for materials, distortions, and procedural visual effects. |
| **GSAP** | High-precision animation engine and timeline choreography. |
| **Lenis (Smooth Scroll)** | Smooth, inertial scroll feel across desktop and touch devices. |
| **Next.js (React)** | React application architecture and web UI foundation. |
| **Scroll-Driven Animation** | Ties animation progress directly to scroll position or scroll velocity. |
| **WebGL (Three.js / React Three Fiber)** | Real-time interactive 3D scenes, particle fields, and GPU visuals in the browser. |

> **Note:** CSS `cubic-bezier()` controls animation timing/easing only. To draw physical curved or winding lines, use geometric Bézier paths in SVG, Canvas, or Three.js.

### 5.2 Scroll Animation + Canvas Image Sequence

**Stack:** `GSAP + ScrollTrigger + Lenis + Canvas Image Sequence`

Used for cinematic scroll-driven storytelling or 3D-like motion rendered from pre-baked video frames or 3D renders.

| Component | Role |
| --- | --- |
| **Canvas** | Renders the active image frame smoothly onto the visual stage. |
| **GSAP** | Orchestrates timelines and synchronizes visual frames with page elements. |
| **Image Sequence** | Supplies pre-rendered frames from video or 3D animation scrubbed by scroll progress. |
| **Lenis** | Smooths scroll input for fluid frame interpolation. |
| **ScrollTrigger** | Connects scroll progress to animation scrub and section pinning. |

> **Note:** Canvas image sequences play pre-rendered frames. Use Three.js when real-time interactive 3D geometry and camera control are required in the browser.

### 5.3 Additional Libraries & Technologies

| Library / Technology | Purpose |
| --- | --- |
| **Barba.js / Swup** | Page transitions on multi-page architectures (not required for Next.js App Router). |
| **CSS Scroll-Driven Animations** | Native CSS animations bound directly to scroll progress. |
| **Drei** | Helper utilities for React Three Fiber (camera controls, environments, 3D text, etc.). |
| **Embla Carousel / Swiper** | Customizable foundations for carousels, sliders, and galleries. |
| **GSAP Draggable / Inertia** | Momentum-based drag interactions (e.g., draggable galleries or dials). |
| **GSAP DrawSVG** | Progressive stroke-drawing animations for SVG paths and illustrations. |
| **GSAP Flip** | Seamless layout state transitions (expanding cards, grid reflows, moving elements). |
| **GSAP MorphSVG** | Smooth morphing between distinct SVG vector shapes. |
| **GSAP MotionPath** | Moves elements along curved SVG or Bézier paths. |
| **GSAP SplitText** | Splits typography into characters, words, or lines for staggered reveals. |
| **Howler.js / Web Audio API** | Interactive sound design, subtle ambience, and audio feedback. |
| **Lottie / dotLottie** | Lightweight vector animations exported from motion design tools. |
| **OGL** | Minimalist WebGL library for bespoke shaders and lightweight GPU visuals. |
| **p5.js** | Creative coding, generative patterns, and visual experiments. |
| **PixiJS** | GPU-accelerated 2D rendering for high-density sprites, particles, and interactive canvases. |
| **Rapier / Matter.js** | Physics simulation engines (Rapier for 2D/3D; Matter.js for 2D). |
| **React Three Postprocessing** | Post-processing passes such as bloom, depth of field, and film grain for 3D scenes. |
| **Rive** | Stateful interactive vector animations responsive to user input. |
| **Spline** | Visual authoring and embedding of interactive 3D web scenes. |
| **View Transition API** | Native browser visual transitions between UI states or routes. |
| **Web Animations API** | Programmatic JavaScript control over native browser animations. |

### 5.4 Visual & Interaction Techniques

| Technique | Visual / Interactive Result |
| --- | --- |
| **Circular reveal dark/light mode** | Theme switch expands outward in a growing circle from the toggle point. |
| **Clip-path reveal** | Images or sections unveil through animated circular, inset, or polygonal masks. |
| **Cursor image preview** | Floating preview media tracks the pointer when hovering list items. |
| **Exploded product view** | Layers or product components separate spatially to expose inner architecture. |
| **Horizontal scroll section** | Vertical scroll progress drives horizontal or 2D lateral content movement. |
| **Image trail** | Sequential media frames trail behind pointer movement. |
| **Image-to-fullscreen transition** | Compact visual expands seamlessly to fill the full viewport. |
| **Infinite draggable gallery** | Continuous looping gallery navigable via inertial drag. |
| **Kinetic typography** | Type acts as a living visual element—shifting, stretching, or rotating dynamically. |
| **Layered parallax** | Foreground and background layers translate at distinct speeds for spatial depth. |
| **Layout transition** | Grid, list, or scale shifts animate smoothly between states. |
| **Magnetic interaction** | Primary controls subtly pull toward the pointer when nearby. |
| **Mouse-follow parallax / tilt** | Elements shift or tilt delicately in response to pointer coordinates. |
| **Pinned storytelling** | Section stays fixed in view while narrative copy and visuals evolve with scroll. |
| **Scroll velocity effects** | Scroll speed modulates skew, distortion, or motion momentum. |
| **Scroll-linked camera movement** | Scroll progress glides a 2D or 3D camera through a larger visual scene. |
| **Shared element transition** | Thumbnail visual persists and expands smoothly into a detail-page hero. |
| **Staggered text reveal** | Headings enter sequentially line-by-line, word-by-word, or character-by-character. |
| **SVG masking / morphing** | Content reveals through vector apertures or shapes transform organically. |
| **Text masking** | Typography emerges cleanly from behind invisible clip boundaries. |
| **Variable font animation** | Font weight, width, or optical axes animate dynamically on interaction or scroll. |

### 5.5 WebGL & Shader Effects

| Effect | Visual Result |
| --- | --- |
| **Displacement transition** | Image swaps distorted by liquid ripples, waves, or procedural noise. |
| **Dissolve effect** | Surfaces appear or vanish via organic erosion patterns. |
| **Flowmap distortion** | Fluid trail warps imagery in response to pointer motion. |
| **Particle morphing** | Particle clouds reorganize seamlessly into typography, marks, or 3D forms. |
| **Post-processing** | Final filmic passes including bloom, grain, vignette, or chromatic separation. |
| **Procedural noise** | Mathematically generated organic motion and surface texture. |
| **Refraction / transmission** | Glass, lens, or translucent material bending light and background visuals. |
| **Render-to-texture** | Live scene rendered onto a texture for portals, screens, or complex transitions. |
| **Vertex displacement** | Real-time undulating wave or terrain deformation across geometry or imagery. |

---

## 6. Pre-Delivery Compliance Audit Checklist

Before presenting completed frontend or UI work to the user, verify every item below:

- [ ] **No Prohibited Patterns:** Zero decorative pill badges, zero uppercase eyebrow labels, zero Bento grid layouts, and zero Sparkles/AI-cliché icons.
- [ ] **Restrained Iconography:** Every icon serves a concrete functional purpose; headings and lists are not overloaded with icons.
- [ ] **Color Discipline (60–30–10):** Each theme uses at most 3 core colors (surface, neutral ink, primary accent) plus derived opacity/tint variations; any functional status color is strictly critical or user-approved.
- [ ] **Typography & Scale:** At most 2 primary font families (+ system monospace strictly for code/technical data); body text is `16px–18px` and heading/nav/caption sizes adhere to the scale (with Hero `H1` fluid `48px+` where appropriate).
- [ ] **Major-Decision Approval:** All layout restructures, new packages, media assets, or color/font rule changes were discussed and approved beforehand.
- [ ] **Media Honesty:** Genuine image/video needs were flagged to the user rather than faked with mismatched animations.
- [ ] **Clean Code & Accessibility:** Modular, clean implementation; zero horizontal overflow on desktop and mobile; `prefers-reduced-motion` respected; production build and visual verification pass with zero console errors.
