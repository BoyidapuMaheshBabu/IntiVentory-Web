# Authentication setup and secret handling

## Local configuration

1. Copy .env.example to .env.local.
2. Add the Supabase project URL and browser-safe publishable key.
3. Keep .env.local out of Git. The repository .gitignore excludes local environment files.
4. In Supabase Auth URL configuration, allow the local development origin (normally http://localhost:5173) and the intended production origin when deployment is approved.

## Browser key rules

- The Supabase publishable key is intended for use in a browser.
- Never put a Supabase secret key or legacy service_role key in a VITE_ variable or frontend bundle.
- A publishable key does not grant unrestricted database access. Exposed tables must have appropriate Row Level Security (RLS) policies before real user data is stored.

## Current implementation boundary

The authentication entry UI calls Supabase Auth for password sign-in, email/password registration, and password-reset email when the two local environment values are present. Without them, the page remains usable as a UI preview and clearly reports that authentication is not configured.

Email verification delivery, password recovery, and redirect behavior must be tested against the actual Supabase project's Auth settings before the feature is considered accepted.
