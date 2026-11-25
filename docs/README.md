# IntiVentory Web Documentation

This folder contains technical documentation for the web application. Product planning and research live in Notion.

## Structure

```
docs/
├── README.md                 # This file
├── architecture/
│   ├── decisions/            # Architecture Decision Records (ADRs)
│   ├── data-models/          # Database schema documentation
│   └── system-design.md      # Current: auth frontend + Supabase client
├── design/
│   └── login-page.md         # Implemented auth surface brief
├── security/
│   ├── authentication.md     # Auth setup and secret handling
│   └── threat-model.md       # Threat modeling (when created)
├── api/
│   └── contracts.md          # API contracts (when API exists)
├── operations/
│   ├── deployment.md         # Deployment guide (when hosting selected)
│   └── environments.md       # Local/preview/production environments
├── quality/
│   ├── test-strategy.md      # Vitest/Playwright approach
│   └── test-cases/           # Test specifications
└── assets/
    ├── intiventory-app-icon.svg
    └── intiventory-logo.svg
```

## Shared Product Identity

IntiVentory Android and IntiVentory Web are two applications for the same product.

- Reuse the existing IntiVentory brand identity and app icon from the Android project.
- Do not invent a separate web logo or create a replacement icon.
- Keep the same brand identity across platforms while adapting layouts and interactions to each platform.

## Shared Brand Assets

The original IntiVentory SVG assets from the Android repository are stored in `docs/assets/`:

- `intiventory-app-icon.svg` — app icon.
- `intiventory-logo.svg` — full logo lockup.

These are reused as-is. Do not generate or substitute a different logo. Any future web-specific adaptations should preserve the approved brand identity and be reviewed separately.

## Working Principle

Record important product and engineering decisions here before implementation. Keep proposed ideas clearly distinguished from decisions that have been confirmed.