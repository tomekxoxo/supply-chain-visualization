# GPT/Codex Development Guide

This is the primary instruction set for GPT-based coding agents in this
repository. Read it before making changes. Use `BUGBOT.md` for diagnosis and
`CLAUDE.md` as a compatibility-oriented project reference.

## Working agreement

- Inspect relevant code and configuration before editing.
- Make the smallest change that fully solves the request.
- Preserve unrelated user changes; never reset, discard, or reformat them.
- Use `apply_patch` for source and documentation edits and `rg` for searches.
- Use `yarn` for package operations. `yarn.lock` is the maintained lockfile;
  do not create or update `package-lock.json`.
- Ask a concise question only when its answer is required to proceed safely.
- On handoff, state the outcome, files changed, and checks run.

## Project snapshot

- React 19, Vite 8, TypeScript 7, and Tailwind CSS 4.
- Node.js 22.22.1 or later is required.
- TypeScript is strict and uses project references. Use `yarn tsc -b` or
  `yarn build`, never plain root-level `tsc`.
- The UI uses a hybrid Feature + Atomic Design architecture. Shared UI follows
  Atomic Design; domain-specific logic and UI live with their feature.
- Tailwind v4 configuration lives in `src/index.css`, not `tailwind.config.js`.

## Commands

```bash
yarn install             # Install dependencies and Husky hooks
yarn dev                 # Start Vite at http://localhost:3000
yarn build               # Type-check and create a production build
yarn lint                # Run Oxlint
yarn lint:fix            # Apply safe Oxlint fixes
yarn format              # Format with Oxfmt
yarn format:check        # Check formatting without writing
yarn preview             # Preview the production build
yarn tsc -b              # Type-check only
```

For a normal application change, run `yarn lint`, `yarn format:check`, and
`yarn build`.

## Source layout and imports

```text
src/
  app/                 # App composition and pages
  components/
    atoms/             # Shared, reusable visual primitives
    molecules/         # Shared, small compositions of atoms
    organisms/         # Shared, complex UI sections
    templates/         # Shared page layouts
  hooks/               # Custom React hooks
  features/
    <feature>/         # Domain-specific data, model, hooks, and UI
  index.css            # Tailwind v4 and global styles
```

Use aliases instead of deep relative imports:

```ts
import App from "app/app";
import Button from "components/atoms/button";
import ProductionMap from "features/production-explorer/components/production-map";
import { useExample } from "hooks/useExample";
```

Aliases are defined in `tsconfig.app.json` and read by Vite. Keep the `./`
prefix in their path values: TypeScript 7 no longer supports the old
`baseUrl` behavior.

## Architecture and components

Use the hybrid architecture consistently:

- Put reusable, domain-agnostic UI in `components/`, at the lowest suitable
  Atomic Design level.
- Put domain-specific components, state, selectors, data, and hooks in the
  owning `features/<feature>/` directory. A feature component may compose
  shared components, but shared components must not import from a feature.
- Move a feature component to `components/` only after it is genuinely
  reusable without its domain model.
- Pages in `app/` compose features and templates; they do not own feature
  business logic.

Choose the lowest suitable Atomic Design level:

- **Atom**: standalone control or visual primitive.
- **Molecule**: two or three atoms with one focused purpose.
- **Organism**: a complex domain-level section.
- **Template**: reusable page structure without page-specific content.
- **Page**: a concrete template instance with real content.

Put each component in a kebab-case directory and expose it through `index.ts`:

```text
src/components/atoms/button/
  button.tsx
  index.ts
```

```ts
export { Button } from "./button";
```

Components that wrap DOM elements must use `forwardRef`, omit `className` from
their public native props, and set `displayName`:

```tsx
import { forwardRef, type ComponentProps } from "react";

interface ButtonProps extends Omit<ComponentProps<"button">, "className"> {
  variant?: "primary" | "secondary";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", children, ...rest }, ref) => (
    <button
      ref={ref}
      className={
        variant === "primary"
          ? "rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          : "rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
      }
      {...rest}
    >
      {children}
    </button>
  ),
);

Button.displayName = "Button";
export { Button };
```

## Exports

- Do not add default exports. All new modules must use named exports only.
- Do not convert existing default exports unless the requested change requires
  touching that module's public API. New or changed imports must use named
  exports where the target module provides them.

## Code, styling, and accessibility

- Keep TypeScript strict: no `any`, unused imports, or unused variables.
- Type events, state, and props precisely; use `import type` for type-only imports.
- Use semantic HTML and Tailwind classes; avoid inline styles and arbitrary
  colors when a Tailwind token exists.
- Follow the existing dark gray / purple / blue visual language.
- Include focus styles, keyboard support, accessible names for icon-only
  controls, and useful `alt` text.
- Check small and large viewports when changing layout.

## Quality gates and Git hooks

Husky is enabled by the `prepare` script:

- `.husky/pre-commit` runs `lint-staged`.
- `.husky/commit-msg` validates Conventional Commits with Commitlint.
- `lint-staged.config.js` runs Oxlint fixes, Oxfmt, then `tsc -b` on staged
  changes.

Examples:

```text
feat(components): add shipment status badge
fix: prevent empty search submission
docs: clarify local setup
```

Do not bypass hooks or create commits unless the user explicitly asks.

## Change checklist

1. Inspect related components, configuration, and existing patterns.
2. Implement only the requested behavior.
3. Run proportionate checks and report pre-existing failures separately.
4. Summarize changed files, behavior, and verification results.
