# Agent instructions

Harborline is a frontend-only app with two workspaces: fish farm operations and equipment maintenance. Keep it that way: local fictional data, no backend, authentication, external APIs, or extra infrastructure. Do not edit the original Project-B folder; equipment behavior lives in Project-A.

## Architecture

- `App.tsx` loads fixtures and switches workspaces. Operations records live in `src/data` and `src/types`. Equipment records and rules live in `src/equipment`. The UI receives records through props.
- Workspace is the pathname: `/` for operations and `/equipment` for equipment, via `useWorkspace` and `src/lib/workspace.ts`. Use `history.pushState` when switching, and listen for `popstate`. Do not add React Router. Do not put the workspace into the operations query string.
- Summary counts belong in `calculateMetrics`. Environmental overview metrics belong in `calculateEnvironmentalOverview`. Do not hardcode card values or keep parallel summary objects.
- Search, status, country, and sorting belong in `filterSites`. Name, region, country, id, and manager are searchable. Descriptions are not. Filters combine, and the result is a new array sorted per `SiteSort`.
- `Dashboard` owns operations query state synced to the URL via `useDashboardUrlState` and `src/lib/dashboardUrl.ts` (`status`, `q`, `country`, `sort`, `site`). Use `history.pushState` for status, country, and site changes; use `replaceState` for search typing and sort. Listen for `popstate`.
- Equipment status counts, filtering, and the 90-day overdue check belong in `src/equipment/maintenance.ts`. Equipment filter and expanded-row state stay in `EquipmentDashboard`. Do not mix them into operations URL params. Equipment farm-site names are labels, not operations site ids.
- The map (`SiteMap`) and site list share the same filtered site array and selected site id. Marker colors follow status tokens (operational green, attention orange, maintenance blue).
- Below 1080px, opening a site replaces the list. The wide layout keeps the list and the detail panel together. Closing the wide panel clears the selection. Going back on a narrower screen keeps the selection and the current filters.
- Switch the table to cards at `max-width: 719px` with `useMediaQuery`. Keep that query in sync with any CSS that depends on it.
- Environmental readings in mock data use `environmental.source: 'simulated'` and must be labelled as fictional in the UI. Do not present them as live sensor data.
- Map tiles use OpenStreetMap in the prototype only. Document production tile policy in `README.md`; do not assume the public tile service is suitable for unrestricted production traffic.
- Do not add loading or error states that imitate a network request.

## Styling

- Define colors, spacing, type, radius, shadow, and focus in `src/index.css`. Component modules should use those variables.
- Use CSS Modules for component styles. Keep the GitHub-inspired dark theme: canvas `#0d1117`, surfaces `#161b22`, borders `#30363d`, accent `#388bfd`, and status color paired with a text label.
- Preserve visible `:focus-visible` outlines. Do not remove keyboard access to search, filters, site rows, map markers, or the detail actions.
- Mobile layout needs a real alternative to the table (the card list) and a compact header, not only a narrower desktop grid. The map must not break layout on small screens.

## TypeScript

- Keep `strict` project settings already in `tsconfig.app.json`, including `verbatimModuleSyntax` and `erasableSyntaxOnly`.
- Import types with `import type`. Use string unions for status. Do not add enums or `any`.
- Local imports use `.ts` / `.tsx` extensions, matching the Vite template.

## Components

- One main job per component. Share `StatusBadge` and the formatters instead of copying status or date logic.
- Prefer semantic elements: one `h1`, labelled sections, a real table with a caption, buttons for selection, and definition lists for site facts.
- Status must be understandable without color alone.

## Testing

- Test behavior: calculated counts, combined filters, sorting, environmental metrics, coordinates fallbacks, activity-to-site links, empty matches versus no records, status text, and selecting a site from the list or map (map may be mocked in `Dashboard.test.tsx`).
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

For UI changes, also check the dashboard, search, filters, map, and site details at desktop and mobile widths.

## Dependencies

Use npm. Leaflet and react-leaflet are allowed for the site map. Add other dependencies only when the current stack cannot do the job cleanly. Do not add UI kits, routers, or data-fetching libraries for this app.
