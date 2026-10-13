# GPT/Codex Debugging Guide

Use this playbook when diagnosing a defect. Establish the cause first; do not
implement a fix unless the requested work includes one.

## Fast triage

```bash
npm run lint
npm run format:check
npx tsc -b
npm run build
```

Start with the smallest command that reproduces the failure. Capture the exact
error, command, file, and line number before proposing a change.

## Investigation workflow

1. Reproduce the issue with a deterministic command or clear UI steps.
2. Read the relevant implementation and imports before editing.
3. Check the nearest configuration file: `tsconfig.app.json`, `vite.config.ts`,
   `src/index.css`, `.oxlintrc.json`, or `.oxfmtrc.json`.
4. Identify the narrowest root cause from observed evidence.
5. Make the smallest safe fix, then rerun the reproduction and relevant checks.

Do not delete `node_modules`, lockfiles, build output, or caches as a first
diagnostic step. That can hide evidence and discard local work.

## Common failures

### TypeScript path aliases do not resolve

Aliases live in `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "app/*": ["./src/app/*"],
      "components/*": ["./src/components/*"],
      "hooks/*": ["./src/hooks/*"]
    }
  }
}
```

Vite reads these through `resolve.tsconfigPaths: true` in `vite.config.ts`.
With TypeScript 7, do not add `baseUrl`; keep the `./` prefixes.

### Type errors in React components

- Use `ComponentProps<"element">` when extending native props.
- Use `forwardRef` for a DOM-wrapper component and set `displayName`.
- Let React 19 infer JSX return types; import `type JSX` from React if needed.
- Do not hide errors with `any` or `@ts-ignore`; model the actual data shape.

### Hook errors

Call hooks only at the top level of React components or custom hooks. For an
effect dependency warning, decide whether a value should be a dependency, be
memoized, or move into the effect. A disable comment needs justification and is
a last resort.

### Tailwind styles are missing

This project uses Tailwind CSS v4. Inspect `src/index.css`:

```css
@import "tailwindcss" source(".");
@plugin "@tailwindcss/forms";
```

There is no `tailwind.config.js`. Verify the rendered class and source scan path
before changing configuration.

### Lint or format failures

```bash
npm run lint
npm run lint:fix       # Review files this may change
npm run format:check
npm run format         # Formats repository files
```

Oxlint treats warnings as failures. Oxfmt checks code and Markdown, so keep
unrelated formatting changes out of a focused bug fix.

### Build, server, or dependency issues

```bash
npm run build
yarn dev
npm install
npm ls <package-name>
```

The dev server uses port 3000. Identify the owning process before stopping it.
If Vite's cache is credibly implicated, remove only `node_modules/.vite` after
confirming the path, then re-run the original command. `package-lock.json` is
the maintained lockfile; do not run blanket audit fixes or unrelated upgrades.

## Git hooks

Husky runs `lint-staged` before commits and Commitlint for commit messages. If
a hook fails, run the command reported by the hook and fix the cause. The hook
sources are `.husky/pre-commit`, `.husky/commit-msg`, and
`lint-staged.config.js`.

## Diagnostic handoff

Report these items when the defect cannot be completed in the current change:

1. Reproduction steps and observed result.
2. Expected result.
3. Root cause or evidence narrowing it.
4. Files and configuration inspected.
5. Commands run and results.
6. The smallest next action or user decision needed.
