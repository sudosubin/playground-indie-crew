# Agent Development Guidelines

## Project Structure

This is a **bun-workspaces** monorepo with the following conventions:

### Directory Layout

```
.
├── libraries/           # Shared library packages
│   └── */               # Each package has its own directory
├── services/            # Deployable services
│   ├── hello-world-api/ # Backend APIs (Cloudflare Workers)
│   └── hello-world-web/ # Frontend apps (React + Vite)
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
- Use latest action tags:
  - `actions/checkout@v4`
  - `oven-sh/setup-bun@v2`
  - `cloudflare/pages-action@v1`
- Deploy to Cloudflare on merge to main
- Change-based deployments using `git diff` to detect modified packages

## Testing Requirements

- All packages must have vitest configured
- React components require DOM tests (jsdom environment)
- Tests must pass before deployment
- Use `@testing-library/react` for component testing
- Use `@testing-library/jest-dom` for DOM assertions

## Code Quality

- oxlint rules are shared across the workspace
- oxfmt configuration is shared across the workspace
- No warnings should be present in CI

## Frontend Styling Guidelines

### TailwindCSS v4
- Use CSS-based configuration in `src/styles.css`
- Define theme variables for both light and dark modes
- Use HSL color format for theme variables

### Component Structure
- Place shared UI components in `src/components/`
- Use `class-variance-authority` for component variants
- Use `tailwind-merge` and `clsx` for class composition
- Use the `cn()` utility from `src/lib/utils.ts`

### Theme Support
- Always implement dark/light mode support
- Use `ThemeProvider` from `src/components/theme-provider.tsx`
- Use CSS variables for theming (`--background`, `--foreground`, etc.)
- Include a `ThemeToggle` component for user control
