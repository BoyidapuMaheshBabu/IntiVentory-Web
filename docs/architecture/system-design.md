# System Design

## Current Implementation (2026-11-25)

- **Frontend**: React 19 + TypeScript + Vite 6 (Node.js 20+)
- **Authentication**: Supabase JavaScript client wired into auth UI
- **Implemented surfaces**: Sign-in, sign-up, password reset, password update
- **Auth features**: Email validation, password strength meter, retry handling, sanitized errors, accessibility

## Not Yet Implemented

- Supabase project configuration and live auth verification
- Inventory schema, CRUD, stock-movement ledger
- Expense data model
- Row Level Security (RLS) policies
- Server-side business rules
- Deployment configuration
- Testing framework (Vitest/Playwright)

## Architecture Note

The repository uses a React/Vite SPA with Supabase client wiring. The earlier Next.js/Tailwind/shadcn proposal was not adopted. Migration would require explicit decision and rationale.

## Source Control

- Git + GitHub (main branch)
- Package manager: npm
- Runtime: Node.js 20+

## Hosting

Not yet selected. Assess free-tier limits and billing conditions before selection.