# GPT/Codex Project Reference

`CLAUDE.md` remains for repository compatibility, but it now documents the
workflow for GPT/Codex and other GPT-based coding agents. `AGENTS.md` is the
authoritative operational guide; use `BUGBOT.md` for diagnosis work.

## Technology

| Area            | Choice                                   |
| --------------- | ---------------------------------------- |
| Runtime         | Node.js 22.22.1 or newer                 |
| Package manager | Yarn with `yarn.lock`                    |
| UI              | React 19                                 |
| Build tool      | Vite 8                                   |
| Language        | TypeScript 7, strict mode                |
| Styling         | Tailwind CSS 4 with `@tailwindcss/forms` |
| Linting         | Oxlint                                   |
| Formatting      | Oxfmt                                    |
| Commit checks   | Husky, lint-staged, Commitlint           |

Use Yarn for dependency changes. Do not create or update `package-lock.json`.

## Key files

```text
src/app.tsx                  Main application component
src/main.tsx                 Application entry point
src/index.css                Tailwind v4 configuration and global CSS
src/ui/                      Application-local visual primitives
src/dashboard/               Main dashboard composition
src/data/                    Deterministic data
src/hooks/                   React hooks
src/model/                   Types, selectors, and reducer
tsconfig.app.json            Strict TypeScript and path aliases
vite.config.ts               Vite server and alias integration
.oxlintrc.json               Oxlint rules
.oxfmtrc.json                Oxfmt settings
lint-staged.config.js        Staged-file quality commands
.husky/                      Git hooks
```

## Commands

```bash
yarn install
yarn dev
yarn build
yarn lint
yarn lint:fix
yarn format
yarn format:check
yarn preview
yarn tsc -b
```

`yarn build` performs `tsc -b` plus the Vite production build. Plain root
`tsc` has no project to compile because the repository uses project references.

## Architecture and imports

This is a single application, so modules live directly in `src/`. Small visual
primitives live in `src/ui/`; dashboard, filters, map, chart, summary, data,
hooks, and model each own their respective concerns.

Each component directory is kebab-case and provides a barrel export:

```text
src/ui/button/
  button.tsx
  index.ts
```

```ts
export { default } from "./button";
```

Use aliases rather than deep relative imports:

```ts
import Button from "ui/button";
import { useProductionExplorer } from "hooks";
```

## TypeScript, styling, and accessibility

- Strict TypeScript rejects unused locals and parameters. Do not use `any`,
  `@ts-ignore`, or CommonJS `require()`.
- Use `ComponentProps` for native props, `forwardRef` for DOM wrappers, and
  `displayName` for `forwardRef` components.
- React 19 uses the new JSX transform; React need not be imported solely for JSX.
- Tailwind v4 is CSS-first; `src/index.css` uses `@import "tailwindcss"
source(".")`. Do not add `tailwind.config.js` for routine changes.
- Favor Tailwind utilities, semantic HTML, responsive variants, keyboard
  support, and visible focus rings. The UI uses dark grays with purple and blue
  accents.

## Quality and commits

Use these checks for non-trivial changes:

```bash
yarn lint
yarn format:check
yarn build
```

Husky is installed by `yarn install` through the `prepare` script:

- `pre-commit` runs `lint-staged` (Oxlint, Oxfmt, then `tsc -b`).
- `commit-msg` runs Commitlint.

Commit messages use Conventional Commits:

```text
feat(ui): add status badge
fix: preserve focus after filter change
docs: document local setup
```

Do not bypass hooks, modify unrelated files, or create commits unless requested.

## GPT/Codex execution standards

1. Inspect before editing and follow the nearest established pattern.
2. Keep changes narrow, reversible, and within the requested scope.
3. Treat user changes and lockfiles as valuable state; do not reset them.
4. Use `apply_patch` for edits and `rg` for searches.
5. Validate changed behavior and distinguish pre-existing failures from new ones.
6. Report the outcome, changed files, and verification concisely.
