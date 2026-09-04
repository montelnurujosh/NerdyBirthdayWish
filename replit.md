# Nerdy Birthday Wish

A playful, romantic birthday wish website that turns a heartfelt message into an interactive little internet observatory.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/nerdy-birthday-wish/src/App.tsx` — single-page birthday experience and interactive state
- `artifacts/nerdy-birthday-wish/src/index.css` — visual system, responsive layout, and motion
- `artifacts/nerdy-birthday-wish/src/main.tsx` — React entry point

## Architecture decisions

- The birthday site is frontend-only so it can be shared as a self-contained static experience.
- The page uses local React state for constellation reveals, the probability terminal, and share feedback.
- The visual language combines editorial type with lab-notebook and observatory details to keep the nerdiness warm rather than childish.

## Product

- Scrollable birthday message with responsive layout for desktop and mobile.
- Interactive constellation stars and expandable “evidence” observations.
- Playful probability terminal with a celebratory reveal.
- Full birthday letter with copy/share action and signal-back interaction.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
