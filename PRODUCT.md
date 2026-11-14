# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React (selected frontend) and Supabase (selected managed backend with PostgreSQL). Vite and TypeScript are used for the initial local application scaffold.

## Users

Households that want to keep everyday household essentials, stock changes, and spending records organized. Detailed account roles and household-sharing permissions remain open decisions.

## Product Purpose

IntiVentory Web is an online-first household inventory and expense management application. It is intended to help people see what household essentials are available, record items as they are added or used, and keep household spending records together.

## Positioning

A household-focused place for everyday stock and expense records, using the IntiVentory identity shared with its separate Android companion application.

## Operating Context

The web edition is a separate application from IntiVentory Android. The web edition starts online-first and cloud-based. The Android edition is an existing offline-first native application. Shared account access, cloud synchronization, and cross-platform data ownership are not yet defined and must not be assumed.

## Capabilities and Constraints

- Initial product areas include household essentials, available stock, add/use records, and household expense history.
- The first requested web surface is the authentication entry page.
- Supabase is the selected backend platform; PostgreSQL is its database.
- Development and verification should happen locally before public deployment.
- The project budget target is ₹0; select free tools and tiers only, and check quotas, sleep/pausing behavior, and billing conditions before relying on hosted services.
- Offline web access and synchronization are future considerations, not initial-scope commitments.
- Household membership model, roles, and shared access rules remain open decisions.

## Brand Commitments

- Product name: IntiVentory.
- Telugu name: ఇంటి వెంటరీ.
- Telugu tagline: మన ఇంటి సరుకులు, మన ఇంటి లెక్కలు.
- Reuse the approved Android app icon and logo assets in the documentation assets folder.
- Preserve the existing Deep Teal, Soft Sage, Warm Mist, Clean White, Forest Charcoal, and Muted Sage-Gray palette.
- The login page visual personality is calm and uncluttered, with a split layout on larger screens.

## Evidence on Hand

- The repository README describes the web edition's purpose and online-first starting direction.
- The documentation README records the approved login-page direction and shared identity.
- The approved app icon and full logo SVGs are stored in the documentation assets folder.
- The Android repository contains the source branding guide. No web product usage data, customer testimonials, or performance claims have been supplied.

## Product Principles

- Keep household tasks clear and low-friction.
- Preserve consistency with the approved IntiVentory identity across platforms.
- Do not claim cross-device synchronization until it is designed and implemented.
- Keep private credentials out of browser code and source control.
- Prefer local development and free tooling; do not incur paid usage without explicit approval.
