# API and Integration Notes

**Status: Exploratory only — no custom API contract has been approved or implemented.**

## Current implementation

- The React/Vite frontend currently uses the Supabase JavaScript client for authentication.
- No inventory API, stock-movement API, or expense API is implemented.
- Real Supabase project configuration and live authentication verification remain pending.

## Future workflow areas

The following product workflows are recorded in Notion, but their API boundaries and request/response contracts remain to be designed:

- Inventory item creation, editing, archiving and restoration.
- Stock additions, stock usage and transaction history.
- Inventory-linked spending and reporting.

These are workflow areas, not approved endpoint paths, HTTP methods or payload definitions. Do not implement the example routes from earlier drafts as settled contracts.

## Open technical decisions

- Whether each operation should use the Supabase client directly, database functions, server-side routes, or another suitable boundary.
- Database schema, transaction model and atomic stock-operation behavior.
- Row Level Security policies and household data isolation.
- Input-validation approach and whether a schema library is needed.
- Request/response shapes, error conventions and versioning, if a custom API is required.

Track proposals and accepted decisions in Notion before implementing them.

## Security constraints

- Never expose Supabase service-role credentials in browser code.
- Enforce authorization at the database/server boundary, not only in the frontend.
- Validate untrusted input at the appropriate trust boundary.
- Test cross-household data isolation if and when the chosen architecture requires it.
