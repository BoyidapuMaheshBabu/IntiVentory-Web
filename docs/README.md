# IntiVentory Web Documentation

This folder contains product, design, and engineering documentation for the web application.

## Current design decisions

### Login page

- Visual personality: calm, clean, welcoming, and professional.
- Artwork direction: split layout on larger screens, with the login form on one side and supporting artwork on the other.
- Responsive behaviour: prioritize the login form on smaller screens and reduce or omit decorative artwork where space is limited.

### Shared product identity

IntiVentory Android and IntiVentory Web are two applications for the same product.

- Reuse the existing IntiVentory brand identity and app icon from the Android project.
- Do not invent a separate web logo or create a replacement icon.
- Keep the same brand identity across platforms while adapting layouts and interactions to each platform.

## Shared brand assets

The original IntiVentory SVG assets from the Android repository are stored in `docs/assets/`:

- `intiventory-app-icon.svg` — app icon.
- `intiventory-logo.svg` — full logo lockup.

These are reused as-is. Do not generate or substitute a different logo. Any future web-specific adaptations should preserve the approved brand identity and be reviewed separately.

## Working principle

Record important product and engineering decisions here before implementation. Keep proposed ideas clearly distinguished from decisions that have been confirmed.
