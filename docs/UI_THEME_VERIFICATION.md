# Landing and application theme verification

Verified locally on 2026-11-19 at `http://localhost:3000`.

## Delivered behavior

- Editorial landing page with an illustrative Capture / Connect / Recall demo. The demo does not call AI endpoints or write workspace data.
- Shared light/dark theme, system preference on first visit, persistence under `braindrop-theme`, and synchronization across browser tabs.
- Sun/moon toggle with circular reveal, a non-animated fallback, and reduced-motion support. Toasts sit below the navigation and follow the active theme.
- Theme-aware editor, modals, inspector, dashboard, study cards, telemetry, and canvas graph. Theme changes do not remount the editor or reset graph coordinates.
- Mobile navigation and keyboard-operated demo tabs. Telemetry is hidden on the landing page.

The global unlayered margin/padding reset was removed because it overrode Tailwind spacing utilities. The graph's duplicated center offset and initial zoom label were also corrected; graph controls were moved away from telemetry.

## Browser evidence

80 automated checks passed in isolated, temporary Chrome profiles:

- Landing at 320, 390, 768, and 1440 pixels in both themes; all three demo stages also checked at 320 pixels.
- Both themes on Capture, Notes, Graph, Flashcards, and Dashboard; desktop/mobile document overflow checks.
- Demo keyboard navigation, flashcard reveal, mobile menu/Escape, primary CTA destination, and absence of AI requests from the demo.
- Theme persistence, system preference changes, unavailable storage, missing View Transition API, and reduced-motion hydration.
- Capture draft, editor instance/content/selection, graph pan/zoom/node positions/selected detail, study-card selection/flip state, and modal draft/selection preservation.
- Empty workspace states, synthesis modal colors, and light/dark success toasts.

Main text, secondary text, muted text, and cyan tokens meet AA normal-text contrast against the base surfaces. This is a token-level check, not a full accessibility certification.

Screenshots and test results are stored locally in `%TEMP%\braindrop-ui-qa`, including before/after desktop/mobile captures, full landing captures, workspace pages, dialogs, and toasts. Scripts use the locally installed Selenium and ChromeDriver; no testing dependency was added to the application.

## Build and limits

- TypeScript: `node node_modules/typescript/bin/tsc --project apps/web/tsconfig.json --noEmit --incremental false`.
- Production build: `npm.cmd run build --workspace=@braindrop/web`, using a temporary separate output directory and TypeScript configuration to protect the running development server. Original configuration files are restored afterward.
- Local Firebase App Check requests still return HTTP 400 with the existing demo configuration. UI tests do not establish live AI-service readiness.
- No backend API, stored-data schema, authentication, or deployment changes were made.
