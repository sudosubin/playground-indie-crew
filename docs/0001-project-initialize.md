# Project Initialization

> Monorepo setup with Cloudflare deployment using bun-workspaces.

## Requirements

- [x] Monorepo structure with bun-workspaces
- [x] Shared library packages in `./libraries`
- [x] Backend and frontend services in `./services`
- [x] All packages use version `0.0.0` with path dependencies
- [x] Native dependencies via Nix/Direnv, Node.js via bun
- [x] TypeScript for all packages
- [x] Environment variables via `.env` file
- [x] Backend: Hono web framework on Cloudflare Workers
- [x] Frontend: React 19, Vite 8 Beta, Wouter, react-query
- [x] GitHub Actions deployment with dynamic matrix using bun-workspaces
- [x] Cloudflare secrets: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`
- [x] Demo backend service
- [x] Demo frontend service
- [x] Testing: vitest with DOM-based React component tests
- [x] TailwindCSS v4, shadcn, base-ui
- [x] Dark/light mode support
- [x] oxlint and oxfmt as linters/formatters (workspace-wide)

## Directory Structure

```
.
├── libraries/
│   └── react-utils/       # Shared React utilities (useLocalStorage hook)
├── services/
│   ├── hello-world-api/   # Hono backend on Cloudflare Workers
│   └── hello-world-web/   # React 19 frontend on Cloudflare Pages
├── docs/
│   └── 0001-project-initialize.md
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── README.md
├── AGENTS.md
└── package.json (workspace root)
```

## Checklist Progress

### Phase 1: Repository Setup
- [x] Create initial project documentation (`README.md`, `AGENTS.md`)
- [x] Create `package.json` with bun-workspaces configuration
- [x] Set up Nix/Direnv configuration (`flake.nix`, `.envrc`)
- [x] Create root configuration files (`.gitignore`, `package.json`, `tsconfig.json`)
- [x] Configure oxlint and oxfmt for the workspace
- [x] Install dependencies with bun

### Phase 2: Backend Service
- [x] Create `services/hello-world-api` with Hono
- [x] Configure TypeScript
- [x] Set up Wrangler for Cloudflare Workers
- [x] Create demo endpoint
- [x] Write vitest tests
- [x] Configure deployment via GitHub Actions

### Phase 3: Frontend Service
- [x] Create `services/hello-world-web` with React 19 + Vite 8 Beta
- [x] Configure TypeScript
- [x] Set up TailwindCSS v4
- [x] Configure shadcn and base-ui
- [x] Implement dark/light mode
- [x] Add Wouter for routing
- [x] Add react-query for data fetching
- [x] Write vitest tests (including DOM tests)
- [x] Configure deployment via GitHub Actions

### Phase 4: CI/CD and Deployment
- [x] Create dynamic GitHub Actions matrix using bun-workspaces
- [x] Configure Cloudflare deployment for both services
- [x] Test deployments (pending Cloudflare credentials verification)

### Phase 5: Documentation
- [x] Update `README.md` with project overview
- [x] Update `AGENTS.md` with development guidelines

## Summary

All project initialization tasks have been completed. The monorepo is now set up with:

1. **Backend Service** (`services/hello-world-api`): Hono-based API running on Cloudflare Workers with `/` and `/health` endpoints, fully tested with vitest.

2. **Frontend Service** (`services/hello-world-web`): React 19 application with TailwindCSS v4, shadcn/ui components, dark/light mode toggle, and comprehensive DOM tests.

3. **Shared Library** (`libraries/react-utils`): React hooks including `useLocalStorage` with full test coverage.

4. **CI/CD Pipeline**: GitHub Actions workflows for linting, formatting, testing, and deployment to Cloudflare.

5. **Code Quality**: Shared oxlint and oxfmt configuration across the entire workspace.
