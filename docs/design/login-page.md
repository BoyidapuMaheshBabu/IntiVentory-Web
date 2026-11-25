# Login page — surface brief

## Mode

Operate. The visitor is completing an account task.

## Confirmed direction

- Calm, clean, welcoming, and professional.
- Split composition on larger screens: authentication form on one side, product context on the other.
- On narrow screens, prioritize the form and remove the supporting panel.
- Reuse the approved IntiVentory app icon and brand colors; do not invent a new logo.

## Structure

- Left: brand lockup, task heading, email/password form, primary action, account navigation, and concise feedback.
- Right: a quiet product-context panel with a clearly illustrative household-category preview and the approved Telugu tagline.
- Sign-in, create-account, and password-reset states share one consistent form vocabulary.

## Interaction and states

- Email field uses an email input and browser validation.
- Password field supports show/hide and appropriate autocomplete.
- Sign-up confirms the password before submitting.
- Submit action has a disabled/loading state to prevent duplicate requests.
- Success and error feedback is announced accessibly and uses clear recovery language.
- Password reset handles the recovery link, new-password entry, and completion state.
- When Supabase environment values are absent, show a local-preview notice and explain how to configure the connection; never pretend authentication succeeded.

## Brand tokens

| Role | Value |
|---|---|
| Primary / action | Deep Teal #2F6B62 |
| Accent | Soft Sage #B9D0C0 |
| Main background | Warm Mist #F4F6F0 |
| Form surface | Clean White #FFFFFF |
| Main text | Forest Charcoal #273832 |
| Secondary text | Muted Sage-Gray #52665C |

## Quality requirements

- Keyboard-accessible controls and visible focus.
- Labels remain visible; placeholders are not labels.
- Body and helper text remain legible with sufficient contrast.
- Respect reduced-motion preferences.
- Avoid decorative gradients, heavy shadows, unnecessary animation, and generated replacement branding.
- Keep the mobile form usable at 320px width and with browser zoom.
