# Environments

## Local Development

- `npm run dev` — Vite dev server (localhost:5173)
- Requires `.env.local` with:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`
- Without credentials: local preview mode (auth UI only, no real auth)

## Preview

- `npm run build && npm run preview` — Production build locally
- Used for pre-deployment verification

## Production

*To be defined when hosting is selected*

- Environment variables injected at build time
- HTTPS enforced
- Cache headers for static assets

## Supabase Environments

*To be configured when project is created*

- Local Supabase (optional, via Supabase CLI)
- Preview/Staging project
- Production project

## Environment Variable Matrix

| Variable | Local | Preview | Production |
|----------|-------|---------|------------|
| VITE_SUPABASE_URL | ✅ | ✅ | ✅ |
| VITE_SUPABASE_PUBLISHABLE_KEY | ✅ | ✅ | ✅ |

*Never commit secrets. Use platform secret management.*