# GPT/Codex Project Reference

`CLAUDE.md` remains for repository compatibility, but it now documents the
workflow for GPT/Codex and other GPT-based coding agents. `AGENTS.md` is the
authoritative operational guide; use `BUGBOT.md` for diagnosis work.

## Technology

| Area            | Choice                                   |
| --------------- | ---------------------------------------- |
| Runtime         | Node.js 22.22.1 or newer                 |
| Package manager | npm with `package-lock.json`             |
| UI              | React 19                                 |
| Build tool      | Vite 8                                   |
| Language        | TypeScript 7, strict mode                |
| Styling         | Tailwind CSS 4 with `@tailwindcss/forms` |
| Linting         | Oxlint                                   |
| Formatting      | Oxfmt                                    |
| Commit checks   | Husky, lint-staged, Commitlint           |

`yarn.lock` is a legacy file. Use npm and synchronize dependency changes with
`package-lock.json` only unless the user explicitly asks to migrate managers.

## Key files

```text
src/app/app.tsx              Main application component
src/main.tsx                 Application entry point
src/index.css                Tailwind v4 configuration and global CSS
src/components/              Atomic Design components
tsconfig.app.json            Strict TypeScript and path aliases
vite.config.ts               Vite server and alias integration
.oxlintrc.json               Oxlint rules
.oxfmtrc.json                Oxfmt settings
lint-staged.config.js        Staged-file quality commands
.husky/                      Git hooks
```

## Commands

```bash
npm install
yarn dev
npm run build
npm run lint
npm run lint:fix
npm run format
npm run format:check
npm run preview
npx tsc -b
```

`npm run build` performs `tsc -b` plus the Vite production build. Plain root
`tsc` has no project to compile because the repository uses project references.

## Architecture and imports

Components live under `src/components` and use Atomic Design:

- `atoms`: reusable single-purpose elements.
- `molecules`: small groups of atoms.
- `organisms`: complex domain-specific sections.
- `templates`: reusable page structure.
- `pages`: concrete pages when introduced.

Each component directory is kebab-case and provides a barrel export:

```text
src/components/atoms/status-badge/
  status-badge.tsx
  index.ts
```

```ts
export { default } from "./status-badge";
```

Use aliases rather than deep relative imports:

```ts
import App from "app/app";
import StatusBadge from "components/atoms/status-badge";
import { useStatus } from "hooks/useStatus";
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
npm run lint
npm run format:check
npm run build
```

Husky is installed by `npm install` through the `prepare` script:

- `pre-commit` runs `lint-staged` (Oxlint, Oxfmt, then `tsc -b`).
- `commit-msg` runs Commitlint.

Commit messages use Conventional Commits:

```text
feat(organisms): add supplier overview card
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
