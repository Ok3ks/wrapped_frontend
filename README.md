# FPL Wrapped Frontend

Fantasy Premier League (FPL) analytics frontend. Displays gameweek data, player/team dashboards, reports with charts, and standings tables. Built as an SPA that connects to a backend API via GraphQL and REST.

## Tech Stack

- **Framework**: React Router v7 (SPA mode)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Data Visualization**: Chart.js
- **API**: `openapi-fetch` for REST, raw `fetch` for GraphQL
- **Deployment**: Firebase

## Getting Started

### Installation

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Production Build

```bash
npm run build
```

### Other Commands

```bash
npm run typecheck     # Type generation + tsc
npm run format        # Prettier format all files
npm run lint-ci       # Lint + prettier check + tsc --noEmit
```

## Project Structure

```
app/
  api/apiService.ts    # API client (openapi-fetch + GraphQL)
  components/          # App components (dashboards, charts, data tables)
  components/ui/       # shadcn/ui primitives
  lib/                 # Utilities (data helpers, team mappings)
  routes/              # Route components (home, report, faq, 404Page)
  types.tsx            # Shared type definitions
  root.tsx             # App root
react-router.config.ts # React Router config (SPA mode)
```

## Deployment

The app is deployed to Firebase. The backend API base URL is provided via environment variable in Firebase.
