# Agent instructions

Harborline is a frontend-only fish farm operations dashboard. Keep it that way: local fictional data, no backend, authentication, external APIs, or extra infrastructure.

## Architecture

- Site records and their types live in `src/data` and `src/types`. The UI receives records through props. `App.tsx` is the only place that loads the fixture.
- Summary counts belong in `calculateMetrics`. Do not hardcode card values or keep a parallel summary object.
- Search and status filtering belong in `filterSites`. Name and location are searchable. Descriptions are not. Filters combine, and the result is a new array sorted by site name.
- `Dashboard` owns search text, status, and the selected site id. Pass data and callbacks down. Do not add a state library or a router for this single page.
- Below 1080px, opening a site replaces the list. The wide layout keeps the list and the detail panel together. Closing the wide panel clears the selection. Going back on a narrower screen keeps the selection and the current filters.
- Switch the table to cards at `max-width: 719px` with `useMediaQuery`. Keep that query in sync with any CSS that depends on it.
- Do not add loading or error states that imitate a network request.

## Styling

- Define colors, spacing, type, radius, shadow, and focus in `src/index.css`. Component modules should use those variables.
- Use CSS Modules for component styles. Keep the GitHub-inspired dark theme: canvas `#0d1117`, surfaces `#161b22`, borders `#30363d`, accent `#388bfd`, and status color paired with a text label.
- Preserve visible `:focus-visible` outlines. Do not remove keyboard access to search, status options, site rows, or the detail actions.
- Mobile layout needs a real alternative to the table (the card list) and a compact header, not only a narrower desktop grid.

## TypeScript

- Keep `strict` project settings already in `tsconfig.app.json`, including `verbatimModuleSyntax` and `erasableSyntaxOnly`.
- Import types with `import type`. Use string unions for status. Do not add enums or `any`.
- Local imports use `.ts` / `.tsx` extensions, matching the Vite template.

## Components

- One main job per component. Share `StatusBadge` and the formatters instead of copying status or date logic.
- Prefer semantic elements: one `h1`, labelled sections, a real table with a caption, buttons for selection, and a definition list for site facts.
- Status must be understandable without color alone.

## Testing

- Test behavior: calculated counts, combined search and status filters, empty matches versus no records, status text, and selecting a site and returning to the list.
- Put pure logic tests next to the function. Keep page interactions in `Dashboard.test.tsx`.
- Run `npm test`. Do not weaken a test to hide a behavior change.

## Validation

Before finishing a change, run:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

For UI changes, also check the dashboard, search, filters, and site details at desktop and mobile widths.

## Dependencies

Use npm. Add a dependency only when the current stack cannot do the job cleanly. Do not add UI kits, routers, or data-fetching libraries for this app.
