# Workspace UI & Engineering Rules

Whenever designing, auditing, or modifying frontend UI, layouts, styling, or animations in this workspace, read and strictly enforce `docs/DESIGN_RULES.md`.

## Non-Negotiable Summary

- **Ask & Analyze First:** Ask whenever requirements are ambiguous. Analyze the codebase thoroughly before proposing or implementing changes; never take rushed shortcuts.
- **Permission Gate:** Request explicit user approval before major decisions (restructuring layouts, adding packages, generating/adding images or video, or changing color/font rules). Small technical bug fixes may proceed directly.
- **Media Honesty:** If a section genuinely needs images or video, inform the user directly instead of substituting mismatched animations or decorative placeholders.
- **Hard Visual Prohibitions:**
  - No decorative pill badges.
  - No uppercase eyebrow / kicker micro-labels.
  - No Bento grid layouts.
  - No Sparkles or AI-cliché icons; use icons only where functionally necessary.
- **Color Budget (60–30–10):** Maximum 3 core colors per theme (60% surface, 30% neutral ink, 10% primary accent) plus opacity/tint derivatives. Functional status colors only for critical states or with user permission.
- **Typography:** Maximum 2 primary font families (Display/Heading + Body); system monospace strictly for code/technical readouts. Follow `docs/DESIGN_RULES.md` font-size best practices (`16–18px` body, `32–48px+` H1 / fluid editorial Hero `48px+`, `24–32px` H2, `20–24px` H3, `14–16px` button/nav, `12–14px` caption/metadata).
- **Interactive Craft & Clean Code:** Draw from the Awwwards reference catalog in `docs/DESIGN_RULES.md` intentionally, write clean modular code, and run the Pre-Delivery Compliance Audit Checklist before finishing.
