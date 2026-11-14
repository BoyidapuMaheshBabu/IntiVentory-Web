# IntiVentory Web

An online-first household inventory and expense management web application.

## Technology foundation

- React + TypeScript
- Vite for local development and production builds
- Supabase Auth and PostgreSQL-backed services
- CSS using the approved IntiVentory visual identity

The Android and web applications share the IntiVentory brand, but remain separate applications. Cross-platform accounts and data synchronization are not assumed until explicitly designed.

## Local development

Requirements: Node.js 20 or newer.

Install dependencies with npm install, copy .env.example to .env.local, then run npm run dev.

On Windows PowerShell, copy the environment template with Copy-Item .env.example .env.local.

Add the Supabase project URL and publishable key to .env.local to enable real authentication. Without them, the sign-in experience runs in local preview mode.

Run a production build locally with npm run build, then inspect it with npm run preview before any deployment.

## Security

Never commit .env.local, Supabase secret keys, or service-role keys. See the authentication setup documentation under docs/05-security/authentication.

## Project documentation

Product truth and confirmed constraints live in PRODUCT.md. The first surface brief is docs/02-design/login-page.md. Shared brand assets and prior design decisions are documented in docs/README.md.
