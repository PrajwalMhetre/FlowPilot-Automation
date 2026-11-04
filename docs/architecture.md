# System Architecture

## Scope

FlowPilot currently consists of a Vercel-hosted static website, two Supabase Edge Functions, and two Postgres tables. The website has a public enquiry workflow and a separate private CRM surface.

## Components

| Component | Responsibility |
|---|---|
| Vercel static site | Landing page, articles, form and CRM UI |
| `flowpilot-lead-intake` | Validate public enquiry, rate-limit, score and store |
| `flowpilot-admin` | Authenticate owner JWT, authorize owner email, list/update leads |
| `flowpilot_leads` | Enquiry and CRM lifecycle data |
| `flowpilot_rate_limits` | Hashed client network identifiers and attempt timestamps |
| Supabase Auth | Owner identity and access token issuance |
| Resend (optional) | Owner email alert |

## Request paths

### Public intake

1. Browser sends JSON to the intake function.
2. Function checks HTTP method and Origin allowlist.
3. Payload size, honeypot, required fields, email, URL and consent are validated.
4. A hashed network identifier is recorded and recent attempts counted.
5. Lead score and tier are calculated.
6. Lead row is inserted.
7. If Resend credentials exist, a notification is attempted; lead persistence is independent of email delivery outcome.

### Owner CRM

1. Owner signs in through Supabase Auth in the browser.
2. Browser sends the access token to the admin function.
3. Admin function validates the token with Supabase Auth.
4. Function verifies exact allowlisted owner email.
5. GET returns paginated lead records; PATCH permits status and internal-note updates.

## Trust boundaries

- Browser content and input are untrusted.
- Publishable Supabase key is public by design; service-role key is server-only.
- Public intake accepts unauthenticated requests and must remain defensive.
- CRM authorization is enforced in the Edge Function, not merely by hiding the UI.
- The current owner check is email-based; owner account lifecycle must be controlled in Supabase Auth.

## Operational gaps

- The owner user was absent at the last database audit.
- No complete browser E2E success path has been verified.
- Rate-limit row retention needs scheduled cleanup.
- Network-IP header trust assumptions require platform validation.
- Privacy notice/retention/lawful-basis disclosures need review before EU personal data collection.
