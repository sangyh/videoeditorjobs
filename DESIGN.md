# Design System

## 1. North Star

The homepage follows the selected “Plum and Bone” mock: a compact plum hero, a single-line desktop headline, a three-frame production reel, a functional workflow control strip, and three live opportunity rows. The page ends after that focused discovery experience and the footer. Supporting guides, role examples, FAQs, and route grids belong on their dedicated pages, not the homepage.

## 2. Colors

- Plum ink: `oklch(22% 0.055 320)` for the hero and footer.
- Bone paper: `oklch(97% 0.012 78)` for the primary surface.
- Warm surface: `oklch(99% 0.007 78)` for job rows and menus.
- Terracotta: `oklch(56% 0.17 37)` for actions and directional emphasis.
- Apricot: `oklch(79% 0.105 72)` for small live-count signals.
- Sky: `oklch(70% 0.075 238)` for focus states.

## 3. Typography

Use Archivo throughout. Headlines rely on scale, tight tracking, and weight rather than a second display family. On desktop, “Video Editor Jobs” stays on one line. Body copy stays below 65 characters where practical.

## 4. Layout and Rhythm

- Header: compact, approximately 70px tall.
- Desktop hero: approximately 340–380px tall, never an oversized empty viewport.
- Hero composition: copy occupies roughly 42%, reel roughly 58%, with decisive whitespace between them.
- Workflow strip: title plus four filter controls and one search field in a single desktop row.
- Opportunity rows: thumbnail, role details, and posted date separated by quiet 1px rules.
- Homepage structure: exactly three main sections, hero, workflow, opportunities.

## 5. Components

- Primary action: bone fill on plum.
- Secondary action: transparent with a 1px bone border.
- Workflow filter: native disclosure with real destination links in the open menu.
- Search: submits to `/search/` using the `q` parameter.
- Job row: title is the primary application link; avoid redundant arrow actions.

## 6. Responsive and Accessibility

Below 900px, stack hero copy above the reel. Below 680px, allow the headline to wrap, stack actions, collapse workflow filters to two columns, and reduce job metadata. Preserve visible focus states, semantic headings, keyboard-operable disclosures, descriptive hero-image alternatives, reduced-motion behavior, and WCAG 2.2 AA contrast.
