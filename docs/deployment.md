# Deployment and Operations

## Frontend

Production website: https://flowpilot-europe-automation.vercel.app/

The Vercel project is `flowpilot-europe-automation`. Production alias is the stable `.vercel.app` hostname. Verify the deployment status and build output in the Vercel dashboard before releases.

## Supabase

Project reference: `ahlhyzmjoiqqqmdopffb`

Region: `eu-central-1` (Frankfurt).

Active functions observed on 2026-11-05:
- `flowpilot-lead-intake` v3 (JWT verification disabled; public route).
- `flowpilot-admin` v1 (JWT verification enabled).

## Edge Function secrets

Set secrets in Supabase Dashboard → Edge Functions → Secrets. Do not paste them into chat or commit them.

| Secret | Required | Purpose |
|---|---|---|
| `FLOWPILOT_OWNER_EMAIL` | Yes | Exact CRM owner allowlist |
| `RESEND_API_KEY` | Optional | Notification provider |
| `RESEND_FROM_EMAIL` | Optional | Verified sender address |

Supabase platform injects `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` into Edge Functions.

## Owner account bootstrap

1. Open Supabase Dashboard → Authentication → Users.
2. Create user with the configured owner email.
3. Set a strong password directly in Supabase; do not share it.
4. Confirm the account using the provider's supported confirmation option.
5. Sign in at the production CRM URL.
6. Verify the owner can list leads and a different account receives 403.

The project was accessible through the connected Supabase account on the last audit, even though the browser session earlier displayed a project access error. Reauthenticate into the correct Supabase account if the dashboard still denies access.

## Release verification

- Check Vercel deployment is READY.
- Run GitHub Actions CI.
- Verify intake with synthetic payload and validate a new row.
- Verify CRM positive and negative authorization cases.
- Verify status/note update and pagination.
- Inspect Supabase function logs for errors.
- Keep production personal data out of CI fixtures.
