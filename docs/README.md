# IntiVentory Web Documentation

This folder contains technical documentation for the web application. Product planning, research and decision records live in Notion.

## Structure

```
docs/
├── README.md
├── architecture/
│   └── system-design.md
├── design/
│   └── login-page.md
├── security/
│   ├── authentication.md
│   └── threat-model.md
├── api/
│   └── contracts.md
├── operations/
│   ├── deployment.md
│   └── environments.md
├── quality/
│   └── test-strategy.md
└── assets/
    ├── intiventory-app-icon.svg
    └── intiventory-logo.svg
```

Only directories containing tracked documentation are shown above. Add architecture decision records, data models or individual test-case directories when the first approved artifact exists; do not create empty placeholder folders.

## Documentation boundary

- **Notion:** Product requirements, research, proposed options, accepted decisions, roadmap and acceptance criteria.
- **GitHub docs/:** Technical documentation describing the current implementation, operational guidance and clearly labelled future work.
- Keep proposals visibly distinct from implemented behavior and accepted technical decisions.

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

Keep technical documentation synchronized with the code that actually exists. Record product and architecture decisions in Notion, and do not present proposals as approved decisions.
