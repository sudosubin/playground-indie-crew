# Project Initialization

> Monorepo setup with Cloudflare deployment using bun-workspaces.

## Requirements

- [ ] Monorepo structure with bun-workspaces
- [ ] Shared library packages in `./libraries`
- [ ] Backend and frontend services in `./services`
- [ ] All packages use version `0.0.0` with path dependencies
- [ ] Native dependencies via Nix/Direnv, Node.js via bun
- [ ] TypeScript for all packages
- [ ] Environment variables via `.env` file
- [ ] Backend: Hono web framework on Cloudflare Workers
- [ ] Frontend: React 19, Vite 8 Beta, Wouter, react-query
- [ ] GitHub Actions deployment with dynamic matrix using bun-workspaces
- [ ] Cloudflare secrets: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`
- [ ] Demo backend service
- [ ] Demo frontend service
- [ ] Testing: vitest with DOM-based React component tests
- [ ] TailwindCSS v4, shadcn, base-ui
- [ ] Dark/light mode support
- [ ] oxlint and oxfmt as linters/formatters (workspace-wide)

## Directory Structure

```
.
├── libraries/
│   └── react-utils/
├── services/
│   ├── hello-world-api/
│   └── hello-world-web/
├── docs/
├── .github/
│   └── workflows/
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
- [ ] Configure deployment via GitHub Actions

### Phase 3: Frontend Service
- [x] Create `services/hello-world-web` with React 19 + Vite 8 Beta
- [x] Configure TypeScript
- [x] Set up TailwindCSS v4
- [x] Configure shadcn and base-ui
- [x] Implement dark/light mode
- [x] Add Wouter for routing
- [x] Add react-query for data fetching
- [x] Write vitest tests (including DOM tests)
- [ ] Configure deployment via GitHub Actions

### Phase 4: CI/CD and Deployment
- [x] Create dynamic GitHub Actions matrix using bun-workspaces
- [x] Configure Cloudflare deployment for both services
- [ ] Test deployments

### Phase 5: Documentation
- [ ] Update `README.md` with project overview
- [ ] Update `AGENTS.md` with development guidelines
