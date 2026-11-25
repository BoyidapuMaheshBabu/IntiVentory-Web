# Test Strategy

## Tools

- **Vitest** — Unit and integration tests
- **Playwright** — End-to-end browser workflows

## Current State

No tests implemented yet. Will begin when first backend code is written.

## Priority Areas

1. **Authorization & Data Isolation**
   - RLS policy enforcement
   - Cross-household access attempts
   - Session revocation on household deletion

2. **Stock Movement Integrity**
   - Atomic add/use operations
   - Negative stock rejection (concurrent)
   - Current stock consistency

3. **Authentication Flows**
   - Sign-up, email verification, sign-in
   - Password reset and update
   - Rate limiting and network failure handling

4. **Expense Calculations**
   - Inventory-linked spending totals
   - Category/monthly/custom-range reports

## Conventions

- Test files: `*.test.ts` or `*.test.tsx`
- Colocate with source or `__tests__/` folders
- AAA pattern (Arrange, Act, Assert)
- Test failure/recovery paths, not only happy paths

## CI Integration

*To be configured when tests exist*

- Run on PR
- Block merge on failure
- Coverage thresholds (TBD)