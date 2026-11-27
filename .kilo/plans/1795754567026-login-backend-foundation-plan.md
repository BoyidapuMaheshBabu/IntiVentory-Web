# IntiVentory-Web: Login Backend Foundation Implementation Plan

## 1. Current Project Assessment

### What Exists Today
| Area | Status | Details |
|------|--------|---------|
| **Frontend Framework** | ✅ Implemented | React 19 + TypeScript + Vite 6, strict TS config |
| **Auth UI** | ✅ Complete | Full login/signup/password-reset/update-password flows in `src/App.tsx` (818 lines) |
| **Supabase Client** | ✅ Wired | `src/lib/supabase.ts` creates client from `VITE_SUPABASE_URL` + `VITE_SUPABASE_PUBLISHABLE_KEY` |
| **Auth Methods Used** | ✅ Called | `signInWithPassword`, `signUp`, `resetPasswordForEmail`, `updateUser`, `onAuthStateChange(PASSWORD_RECOVERY)` |
| **Local Preview Mode** | ✅ Works | Graceful fallback when env vars missing; shows setup notice |
| **Supabase Config** | ✅ Created | `supabase/config.jsonc` with full local dev settings (ports, auth, realtime, storage, studio) |
| **Environment Template** | ✅ Exists | `.env.example` with `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` |
| **Supabase CLI** | ✅ Installed | v3.4.0 in devDependencies |
| **Documentation** | ✅ Comprehensive | Architecture, API contracts (exploratory), security, operations, test strategy |

### What Is Missing
| Area | Missing |
|------|---------|
| **Local Supabase Stack** | Not started — `supabase init` run (config exists) but `supabase start` never executed |
| **Database Schema** | No migrations, no `seed.sql`, no schema files |
| **Auth Configuration** | Local Supabase Auth not running; no real `VITE_SUPABASE_URL`/key for frontend |
| **Email Testing** | Local SMTP configured (port 54324) but not verified |
| **Session Persistence** | Frontend calls auth methods but no auth state observer for routing |
| **Protected Routes** | No post-auth app shell, no route guards |
| **Environment Variables** | No `.env.local` with real local Supabase credentials |
| **Tests** | Zero tests (Vitest/Playwright not configured) |

---

## 2. Existing Architecture

### Frontend
- **Single-page React app** with all auth views in `src/App.tsx`
- **Supabase client** lazily created in `src/lib/supabase.ts` — returns `null` if env vars missing
- **Auth flows implemented**: sign-in, sign-up, password reset (email), password update (recovery link)
- **Error handling**: `sanitizeAuthError()` maps Supabase errors to user-friendly messages; `isRetryableError()` enables "Try again" for network/rate-limit errors
- **Password recovery**: Listens to `onAuthStateChange(PASSWORD_RECOVERY)` to switch to update-password view
- **No routing** — view switching via local state (`AuthView` type)
- **No global auth context** — auth state not shared across components

### Backend Environment (Supabase Local)
- **Config exists**: `supabase/config.jsonc` defines all local services
  - API: port 54321 (PostgREST)
  - Database: port 54322 (PostgreSQL 17)
  - Studio: port 54323
  - Local SMTP: port 54324 (email testing)
  - Realtime: enabled
  - Storage: enabled
  - Edge Runtime: enabled (Deno 2)
- **Auth config**:
  - `site_url: "http://127.0.0.1:3000"` — **mismatch**: Vite dev server runs on **5173**
  - `additional_redirect_urls: ["https://127.0.0.1:3000"]` — same mismatch
  - `enable_confirmations: false` — email confirmation disabled for local dev
  - `enable_signup: true`
  - `minimum_password_length: 6` (frontend enforces 8+ via password strength meter)
- **No custom schema**: `db.migrations.schema_paths: []`, `db.seed.sql_paths: ["./seed.sql"]` but file doesn't exist

### Docker
- **No Dockerfile/docker-compose in repo**
- Supabase CLI **manages its own Docker containers** for local stack (PostgreSQL, Kong, Studio, etc.)
- The "Docker container" referenced in the task = Supabase local development stack

### Supabase CLI Status
- Installed as devDependency (`supabase: ^3.4.0`)
- `supabase init` already run (config.jsonc exists with project_id: "IntiVentory-Web")
- `supabase start` **never executed** — no local stack running
- Not linked to any remote Supabase project

---

## 3. Recommended Backend Architecture

### Decision: Use Supabase Auth + Local Supabase Stack (No Custom Backend)

**Reasoning:**
1. **Frontend already uses Supabase client** — all auth calls go through `@supabase/supabase-js`
2. **Supabase Auth provides everything needed for Login**: email/password, password reset, session management, JWT tokens, refresh token rotation
3. **Local stack mirrors production** — same Auth API, same JWT behavior, same rate limits
4. **No custom backend required** — adding Express/NestJS/Fastify would duplicate Auth functionality and add operational complexity
5. **Future-proof** — when inventory features need database access, they'll use the same Supabase client with RLS policies

### Architecture Diagram
```
┌─────────────────────────────────────────────────────────────────┐
│                        Developer Machine                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐       ┌──────────────────────────────────┐   │
│  │  Frontend    │       │      Supabase Local Stack        │   │
│  │  (Vite:5173) │◄─────►│  (Docker containers managed by   │   │
│  │              │       │   Supabase CLI)                  │   │
│  │  @supabase/  │       │  ┌─────────┐ ┌────────┐ ┌──────┐ │   │
│  │  supabase-js │       │  │ Postgres│ │ Kong   │ │Auth  │ │   │
│  │              │       │  │  :54322 │ │ :54321 │ │ :54321│ │   │
│  │  Auth UI     │       │  └─────────┘ └────────┘ └──────┘ │   │
│  │  (App.tsx)   │       │  ┌─────────┐ ┌────────┐ ┌──────┐ │   │
│  └──────────────┘       │  │ Studio  │ │ SMTP   │ │Edge  │ │   │
│                         │  │ :54323  │ │ :54324 │ │Runtime│ │   │
│  .env.local             │  └─────────┘ └────────┘ └──────┘ │   │
│  VITE_SUPABASE_URL=     │                                    │   │
│  http://127.0.0.1:54321 │                                    │   │
│  VITE_SUPABASE_         │                                    │   │
│  PUBLISHABLE_KEY=...    │                                    │   │
└─────────────────────────────────────────────────────────────────┘
```

### Key Integration Points
| Frontend | Supabase Local | Configuration |
|----------|----------------|---------------|
| `VITE_SUPABASE_URL` | Kong API Gateway | `http://127.0.0.1:54321` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Auth `anon` key | From `supabase status` output |
| Auth redirect URLs | Auth config | Must match Vite dev origin (`http://localhost:5173`) |
| Password recovery flow | Auth + SMTP | Local SMTP at port 54324 |

---

## 4. Login Foundation Scope

### In Scope (Must Implement)
| Component | Description |
|-----------|-------------|
| **Start local Supabase stack** | `supabase start` — brings up Postgres, Kong, Auth, Studio, SMTP, Realtime, Edge Runtime |
| **Fix auth redirect URL mismatch** | Update `supabase/config.jsonc`: `site_url` and `additional_redirect_urls` to `http://localhost:5173` |
| **Create `.env.local`** | Populate with local Supabase URL and anon key from `supabase status` |
| **Verify frontend ↔ local Auth** | Test sign-up, sign-in, password reset, password update flows end-to-end |
| **Add auth state observer** | React context + `onAuthStateChange` to expose `session`, `user`, `loading` globally |
| **Implement protected route pattern** | Higher-order component or wrapper for post-auth pages (placeholder for future) |
| **Add logout functionality** | `supabase.auth.signOut()` + redirect to sign-in |
| **Create first migration** | Minimal `profiles` table linked to `auth.users` via trigger (for user metadata) |

### Out of Scope (Defer)
| Component | Reason |
|-----------|--------|
| **Inventory tables** | Not needed for Login foundation |
| **RLS policies** | Will be designed with inventory schema |
| **Custom Edge Functions** | Supabase Auth handles all Login flows |
| **OAuth providers** | Not required for MVP email/password |
| **MFA/TOTP** | Supabase Pro feature; defer |
| **Email confirmation enforcement** | Disabled locally (`enable_confirmations: false`) |
| **Production deployment** | Separate phase |
| **Test suite** | Add after foundation verified |

---

## 5. Required Configuration

### Environment Variables (`.env.local`)
```bash
# Generated from `supabase status` after stack starts
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Supabase Config Updates (`supabase/config.jsonc`)
```jsonc
"auth": {
  "site_url": "http://localhost:5173",
  "additional_redirect_urls": ["http://localhost:5173"],
  ...
}
```
**Critical**: Must match Vite's actual dev server origin exactly (including port).

### Frontend Code Changes Required
| File | Change |
|------|--------|
| `src/lib/supabase.ts` | No change — already reads from `import.meta.env` |
| `src/App.tsx` | Add `AuthProvider` context; integrate `onAuthStateChange` for global session |
| New: `src/context/AuthContext.tsx` | React context for `session`, `user`, `signOut`, `loading` |
| New: `src/components/ProtectedRoute.tsx` | Wrapper for future protected pages |

---

## 6. Implementation Sequence

### Phase 0: Prerequisites (0 dependencies)
- [ ] **Start Supabase local stack**: `supabase start`
  - Verifies Docker is running
  - Pulls images, starts containers
  - Outputs local credentials (API URL, anon key, service_role key, DB URL, Studio URL)
- [ ] **Verify stack health**: `supabase status` — all services "healthy"

### Phase 1: Configuration (depends on Phase 0)
- [ ] **Update `supabase/config.jsonc`** — fix `site_url` and `additional_redirect_urls` to `http://localhost:5173`
- [ ] **Restart Auth**: `supabase restart auth` (or full `supabase stop && supabase start`)
- [ ] **Create `.env.local`** with values from `supabase status`
- [ ] **Verify frontend loads** without "local preview mode" notice

### Phase 2: Auth Integration (depends on Phase 1)
- [ ] **Create `AuthContext.tsx`**:
  - `useEffect` subscribes to `supabase.auth.onAuthStateChange`
  - Exposes `session`, `user`, `loading`, `signOut()`
  - Handles initial session fetch (`supabase.auth.getSession()`)
- [ ] **Wrap `App` with `AuthProvider`** in `main.tsx`
- [ ] **Refactor `App.tsx`** to consume context instead of local Supabase calls where appropriate
- [ ] **Add logout button** in auth UI (sign-in view) calling `signOut()`

### Phase 3: Protected Route Foundation (depends on Phase 2)
- [ ] **Create `ProtectedRoute.tsx`** — checks `session`/`loading`, redirects to sign-in if unauthenticated
- [ ] **Add placeholder post-auth route** (e.g., `/dashboard`) wrapped in `ProtectedRoute`
- [ ] **Add client-side routing** (React Router v7) — minimal setup for current + future routes

### Phase 4: User Profile Migration (depends on Phase 0)
- [ ] **Create migration**: `supabase migration new create_profiles_table`
- [ ] **SQL**: `profiles` table with `id` (references `auth.users`), `display_name`, `created_at`, `updated_at`
- [ ] **Trigger**: `on_auth_user_created` → insert into `profiles`
- [ ] **Apply**: `supabase db reset` (runs migrations + seed)
- [ ] **Verify** in Studio: Table exists, trigger works on sign-up

### Phase 5: End-to-End Verification (depends on Phases 1-4)
- [ ] **Sign-up flow**: New user → email sent (check local SMTP UI at :54324) → sign-in works
- [ ] **Sign-in flow**: Existing user → session established → `AuthContext` updates
- [ ] **Password reset**: Request reset → email received → click link → update password → sign-in with new password
- [ ] **Session persistence**: Refresh page → session restored from localStorage
- [ ] **Logout**: Click logout → redirected to sign-in → session cleared

---

## 7. Risks and Considerations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Redirect URL mismatch** | Auth redirects fail (400/404) | Fix `site_url` to `http://localhost:5173` before first `supabase start` |
| **Port conflicts** | Supabase stack fails to start | Ensure ports 54321-54324, 8083 free; `supabase stop` cleans up |
| **Docker not running** | `supabase start` fails | Verify Docker Desktop/engine running before starting |
| **Email not received** | Password reset untestable | Use local SMTP UI at `http://localhost:54324` to inspect emails |
| **Frontend env var caching** | Vite doesn't pick up `.env.local` changes | Restart `npm run dev` after creating/updating `.env.local` |
| **Auth state race condition** | UI flickers on initial load | `AuthContext` initializes with `loading: true` until `getSession()` resolves |
| **No RLS on profiles** | Future data leaks | Add RLS when inventory schema designed; profiles table is minimal risk now |

### Security Considerations
- **Never commit `.env.local`** — already in `.gitignore`
- **Publishable key is safe in browser** — `anon` role, restricted by RLS (when enabled)
- **Service role key never in frontend** — only for admin scripts/Edge Functions
- **Password requirements**: Frontend enforces 8+ chars + variety; Supabase config has `minimum_password_length: 6` — align to 8 in config
- **Rate limits**: Local stack enforces Auth rate limits (configurable in `config.jsonc`)

---

## 8. Decisions Requiring Your Input

| # | Decision | Recommendation | Your Input Needed? |
|---|----------|----------------|-------------------|
| 1 | **Confirm redirect URL** | Use `http://localhost:5173` (Vite default) | ✅ Yes — confirm port |
| 2 | **Password min length** | Align Supabase config to 8 (match frontend) | ✅ Yes — confirm |
| 3 | **Email confirmations locally** | Keep `enable_confirmations: false` for dev speed | ✅ Yes — confirm |
| 4 | **Routing library** | React Router v7 (modern, supports Vite) | ✅ Yes — confirm or suggest alternative |
| 5 | **Profile fields** | Start minimal: `id`, `display_name`, `created_at` | ✅ Yes — confirm or add fields |
| 6 | **Seed data** | No seed needed for Login foundation | ❌ No — defer |
| 7 | **Test framework setup** | Add Vitest + Playwright after Phase 5 | ❌ No — separate task |

---

## 9. Validation Checklist (Definition of Done)

| Check | Command / Action |
|-------|------------------|
| Supabase stack healthy | `supabase status` → all services "healthy" |
| Frontend connects | `npm run dev` → no "local preview mode" banner |
| Sign-up works | Create account → check SMTP UI → sign in |
| Sign-in works | Existing credentials → session in `AuthContext` |
| Password reset works | Request → email → link → new password → sign in |
| Session persists | Refresh page → `user`/`session` still present |
| Logout works | Click logout → redirected to sign-in |
| Migration applied | `supabase migration list` → `create_profiles_table` applied |
| Profile created on sign-up | Studio → `profiles` table → row exists for new user |

---

## 10. Next Steps After This Plan

1. **Review and approve** decisions in Section 8
2. **Execute Phase 0-1** (start stack, fix config, create `.env.local`)
3. **Verify frontend connectivity** before writing any React code
4. **Implement Phases 2-4** incrementally with verification at each step
5. **Run Phase 5** end-to-end tests manually
6. **Then**: Plan inventory schema + RLS + API contracts as separate phase

---

*Plan generated from actual IntiVentory-Web codebase inspection. No assumptions about uninitialized resources.*