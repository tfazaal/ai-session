# Harborline — Fish farm operations

Harborline is an internal dashboard for reviewing fish farming sites. It is a frontend-only reference application: every figure on the screen is calculated from local site records, and people can search, filter, and open a site without leaving the page.

## Stack

- React 19 and TypeScript
- Vite
- CSS Modules, with design tokens in `src/index.css`
- Vitest and React Testing Library

There is no backend, database, authentication, or network data source.

## Project structure

```text
src/
  App.tsx                         # passes the site records into the dashboard
  index.css                       # tokens, reset, and focus styles
  types/site.ts                   # site and status types
  data/sites.ts                   # fictional site records
  lib/metrics.ts                  # summary counts
  lib/filterSites.ts              # search, status filter, and name sorting
  lib/format.ts                   # dates and cage/site counts
  lib/status.ts                   # status labels
  hooks/useMediaQuery.ts          # narrow and wide layout switches
  components/
    AppShell/                     # header and page frame
    Dashboard/                    # page state and composition
    SummaryCards/                 # totals derived from the records
    SiteToolbar/                  # search, status filter, result count
    SiteList/                     # table on larger screens, cards on small screens
    SiteDetail/                   # selected site, or an unknown-selection message
    StatusBadge/                  # text and color for a status
    EmptyState/                   # no records, or no matches
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

Site records live in `src/data/sites.ts`. Each record has an id, name, location, cage count, status (`operational`, `attention`, or `maintenance`), an `updatedOn` date (`YYYY-MM-DD`), and an optional description.

The summary cards call `calculateMetrics`. They do not keep a second copy of those counts. Search compares the site name and location only, and the status filter is applied at the same time. Results are sorted by site name.

Two records, Finnmark Coast and Trongisvágur, have no description so the detail view can show that state.

## Tests

Tests cover the metric function, search and filtering, the empty result and empty dataset states, status presentation, and site selection on both the stacked layout and the wide side-by-side layout.

```bash
npm test
```
