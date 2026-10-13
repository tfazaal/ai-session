# Harborline — Fish farm operations

Harborline is an internal dashboard for reviewing fish farming sites. It is a frontend-only reference application: every figure on the screen is calculated from local site records, and people can search, filter, inspect sites on a map, and open details without leaving the page.

## Stack

- React 19 and TypeScript
- Vite
- CSS Modules, with design tokens in `src/index.css`
- Leaflet and react-leaflet (interactive map)
- Vitest and React Testing Library

There is no backend, database, authentication, or network data source for site or sensor data.

## Project structure

```text
src/
  App.tsx                         # passes sites and activities into the dashboard
  index.css                       # tokens, reset, and focus styles
  types/site.ts                   # site, status, sort, and environmental types
  types/activity.ts               # activity feed event types
  data/sites.ts                   # fictional site records (incl. coordinates)
  data/activities.ts              # fictional recent activity events
  lib/metrics.ts                  # operational summary counts
  lib/environmentalMetrics.ts     # simulated environmental overview
  lib/filterSites.ts              # search, filters, and sorting
  lib/coordinates.ts              # map coordinate helpers
  lib/dashboardUrl.ts             # URL query serialization
  lib/format.ts                   # dates, counts, and weights
  hooks/useDashboardUrlState.ts   # URL-synced dashboard state
  components/
    Dashboard/                    # page state and composition
    SiteMap/                      # Leaflet map of visible sites
    EnvironmentalOverview/        # compact simulated environmental metrics
    ActivityFeed/                 # fictional recent events
    SiteToolbar/                  # search, country, status, sort
    SiteList/                     # table or cards
    SiteDetail/                   # overview, operations, simulated environment
```

## Installation and startup

```bash
npm install
npm run dev
```

Vite prints a local URL, usually `http://localhost:5173`.

## npm scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Typecheck and create the production build |
| `npm run typecheck` | Typecheck only |
| `npm run preview` | Serve the production build |
| `npm run lint` | Run oxlint |
| `npm test` | Run the test suite once |
| `npm run test:watch` | Run tests in watch mode |

## Mock data

Site records live in `src/data/sites.ts`. Each record includes id, name, country, region, optional coordinates, manager, total and active cage counts, status, inspection dates, optional fish population and weight, optional **simulated** environmental readings (`source: 'simulated'` with temperature, oxygen, and `measuredAt`), and an optional description.

Port Hardy (`CA-0264`) intentionally has no coordinates so the map can show a fallback message.

Activity events live in `src/data/activities.ts`. They are fictional and labelled as such in the UI.

The summary cards call `calculateMetrics`. The environmental overview calls `calculateEnvironmentalOverview` using a fixed prototype reference time (`SIMULATION_SNAPSHOT_AT`). Search matches name, region, country, id, and manager. Status, country, and sort combine with search. Map markers always reflect the same filtered list as the table.

Filter and selection state is mirrored in the URL:

| Query param | Meaning |
| --- | --- |
| `status` | `operational`, `attention`, or `maintenance` (omitted when showing all sites) |
| `q` | Search text |
| `country` | Exact country name (omitted for all countries) |
| `sort` | `name-asc`, `name-desc`, `cages-desc`, `cages-asc`, `updated-desc`, or `updated-asc` (default `name-asc`) |
| `site` | Selected site id |

Example: `/?status=attention&q=norway&country=Norway&sort=updated-desc&site=NO-0208`

## Map tiles

The map uses [OpenStreetMap](https://www.openstreetmap.org/copyright) raster tiles (`tile.openstreetmap.org`) for local development and demos. OpenStreetMap’s [tile usage policy](https://operations.osmfoundation.org/policies/tiles/) discourages heavy or production traffic on the volunteer-run tile service. For a real deployment, use a commercial tile provider or self-hosted tiles and configure attribution accordingly.

## Tests

Tests cover metrics, environmental calculations, filtering and sorting, URL state, coordinates, activities, dashboard interactions (with the map mocked), and the enriched site fixture.

```bash
npm test
```
