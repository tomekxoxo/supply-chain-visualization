# Supply Chain Explorer

Interactive dashboard for exploring deterministic production data by country,
product, and year range.

## Requirements

- Node.js 22.22.1 or later
- Yarn 1.22.22

## Getting started

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
yarn test
yarn test:e2e
yarn test:e2e:ui
yarn lint
yarn format:check
yarn build
```

`yarn test:e2e:ui` opens the Playwright interface for running and inspecting
end-to-end tests interactively.
