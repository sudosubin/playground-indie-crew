# Playground Indie Crew

A monorepo playground with Cloudflare Workers backend (Hono) and React frontend, managed with bun-workspaces.

## Packages

### Libraries

- **libraries/**: Shared library packages

### Services

- **services/hello-world-api**: Demo backend API built with Hono and deployed to Cloudflare Workers
- **services/hello-world-web**: Demo frontend app built with React 19, Vite, and TailwindCSS v4, deployed to Cloudflare Pages

## Technology Stack

- **Package Manager**: bun
- **Runtime**: Cloudflare Workers (backend), Node.js (build)
- **Language**: TypeScript
- **Backend**: Hono web framework
- **Frontend**: React 19, Vite 8, Wouter, react-query
- **Styling**: TailwindCSS v4, shadcn, base-ui
- **Testing**: vitest (with jsdom for DOM tests)
- **Linting**: oxlint
- **Formatting**: oxfmt
- **Deployment**: GitHub Actions + Cloudflare

## Development

```bash
# Install dependencies
bun install

# Run linter
bun run lint

# Run formatter
bun run format

# Run tests
bun run test

# Typecheck
bun run typecheck
```

### Service-specific development

```bash
# Backend API
cd services/hello-world-api
bun run dev      # Start dev server
bun run test     # Run tests
bun run deploy   # Deploy to Cloudflare

# Frontend Web
cd services/hello-world-web
bun run dev      # Start dev server
bun run test     # Run tests
bun run build    # Build for production
```

## Environment Variables

All environment variables must be defined in `.env` at the workspace root:

- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare account ID
- `CLOUDFLARE_API_TOKEN`: Cloudflare API token for deployment
