# Agent Development Guidelines

## Project Structure

This is a **bun-workspaces** monorepo with the following conventions:

### Directory Layout

```
.
├── libraries/           # Shared library packages
│   └── */               # Each package has its own directory
├── services/            # Deployable services
│   ├── */api/           # Backend APIs (Cloudflare Workers)
│   └── */web/           # Frontend apps (React + Vite)
├── docs/                # Documentation
├── .github/workflows/   # CI/CD pipelines
└── package.json         # Workspace root
```

### Package Conventions

- All packages use version `0.0.0`
- Dependencies use workspace paths: `"workspace:*"`
- Each package has its own `package.json`, `tsconfig.json`

## Technology Stack

### Backend
- **Framework**: Hono
- **Runtime**: Cloudflare Workers
- **Deployment**: Wrangler via GitHub Actions

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 8 Beta
- **Router**: Wouter
- **Data Fetching**: react-query
- **Styling**: TailwindCSS v4 + shadcn + base-ui
- **Theme**: Dark/light mode support required

### Development Tools
- **Package Manager**: bun
- **Language**: TypeScript (strict mode)
- **Linter**: oxlint
- **Formatter**: oxfmt
- **Testing**: vitest (with jsdom for DOM tests)
- **Native Deps**: Nix + Direnv

## Environment Variables

All environment variables must be:
1. Defined in `.env` at the workspace root
2. Documented in package README or code
3. Added to `.gitignore` (never committed)

Required secrets for deployment:
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

## Git Conventions

### Commit Messages
- Use conventional commit format
- Keep to one line, concise
- Examples: `feat: add hello endpoint`, `fix: handle error case`, `chore: update deps`

### Workflow
1. Make changes
2. Run `bun run lint` and `bun run format`
3. Run `bun test` to ensure tests pass
4. Commit with appropriate message
5. Push intermittently as needed

## CI/CD

### GitHub Actions
- Use dynamic matrix based on `bun-workspaces`
- Deploy on changes to service packages
- Use latest action tags
- Deploy to Cloudflare on merge to main

## Testing Requirements

- All packages must have vitest configured
- React components require DOM tests (jsdom environment)
- Tests must pass before deployment

## Code Quality

- oxlint rules are shared across the workspace
- oxfmt configuration is shared across the workspace
- No warnings should be present in CI
