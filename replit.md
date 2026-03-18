# Workspace

## Overview

Lenzo Beam Central — a futuristic dark website with iOS 26 glass water effect, animated galaxy background, tool cards, and a full admin panel.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite, SF Pro font system stack

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── lenzo-beam/         # React Vite frontend (main website)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
└── ...
```

## Features

### Main Site (`/`)
- Animated blue galaxy background with moving stars
- iOS 26 "glass water" effect on all cards (backdrop blur, shimmer, ripple on hover)
- SF Pro font system stack
- Intro screen: "Lenzo beam central 👁️💬" fades in and out
- Tool cards loaded dynamically from the database with live status checking (Online/Offline)
- Discord section at the bottom with configurable link

### Admin Panel (`/admin`)
- Secured login with password (default: `admin123`, change via `ADMIN_PASSWORD` env var)
- Tools tab: Add, edit, delete, show/hide tools; refresh live status
- Settings tab: Change site title, subtitle, Discord link, button text
- All changes persist to PostgreSQL database

## Database Schema

- `tools` — tool name, description, link, orderNum, isActive
- `settings` — key/value store for site settings
- `admin_sessions` — auth tokens for admin panel

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (auto-set by Replit)
- `ADMIN_PASSWORD` — Admin panel password (default: `admin123`)
- `PORT` — Server port (auto-set)
