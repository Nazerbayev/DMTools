# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This is a web helper intended for Dungeon Masters using Dungeon and Dragons 5.5 edition. Main features are:
- `Enemy Encounters`: Enables the Dungeon Master to create encounters for their players.
  - Encounters can be edited, saved and run. When an Encounter is run the `Combat tracker` feature is run using the encounter enemies and players as participants.
- `Combat tracker`. It will track player and monster initiatives.
  - No player data is needed beyond current AC, HP and passive perception, insight and investigation.
  - As much information of the monster as possible is recommended.
  - `Combat tracker` can fetch monster information from the `Monster Library` feature.
- `Monster Library` is a compendium of monsters that the dungeon master has saved. New monsters can be fetched from [Open 5e api](https://open5e.com/api-docs)

## Constraints

- **New React/frontend dependencies require permission first.** Prefer what's already in `package.json`, but if a new npm/Deno package is genuinely needed for the React frontend, ask the user for permission before installing it.
- **No Tailwind CSS.** Do not introduce Tailwind or any other utility-CSS framework. Styling stays on Radix UI Themes (`@radix-ui/themes`) plus plain CSS (`src/App.css` / component-local stylesheets).

## Project state

DMTools is a Vite + React 19 + TypeScript app. It currently consists of the unmodified default
Vite React-TS template (`src/App.tsx`, `src/main.tsx`) — there is no application-specific code,
routing, or state wiring yet. Treat this as a greenfield project: there is no established
architecture to preserve, so use idiomatic patterns for the libraries already installed rather
than inventing new conventions.

Dependencies are installed but **not yet used anywhere in `src/`**:

- `wouter` — routing
- `zustand` — state management
- `@radix-ui/themes` — UI component library
- `lucide-react` — icon set
- `pocketbase` — backend/DB client SDK

When adding features, prefer these already-installed libraries over introducing new ones for the
same purpose (e.g. use `wouter` for routing, `zustand` for shared state, `@radix-ui/themes` for UI
primitives) unless there's a clear reason to deviate.

`src/designs/` (untracked) holds design reference images (e.g. `screen.png`) — check there for
intended UI/layout before building screens.

## Commands

- `npm install` — install dependencies
- `npm run dev` — start the Vite dev server
- `npm run build` — type-check via `tsc -b` then production-build via `vite build`
- `npm run preview` — preview the production build locally
- `npm run lint` — run oxlint

There is no test framework configured yet (no test script, no test files/runner in
`package.json`).

Note: a `deno.lock` file is present alongside `package.json`/`node_modules`, meaning Deno's
npm-compatible package manager has been used in this environment. Prefer whichever of `deno
install` / `npm install` matches how the environment already has dependencies installed; the
project itself is plain npm/Vite (no `deno.json`, no Deno-specific runtime code).

## Type checking and linting

- TypeScript project uses composite configs: `tsconfig.json` references `tsconfig.app.json` (for
  `src/`) and `tsconfig.node.json` (for Vite config). Run `tsc -b` (via `npm run build`) rather
  than a bare `tsc` to respect this project-reference setup.
- `tsconfig.app.json` enables strict-ish settings worth respecting when writing new code:
  `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `verbatimModuleSyntax`
  (type-only imports must use `import type`).
- Lint config (`.oxlintrc.json`) enables the `react`, `typescript`, and `oxc` oxlint plugins with
  `react/rules-of-hooks` as an error.
