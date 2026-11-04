# Security Model and Checklist

## Controls currently observed

- Service-role key is used only in Edge Functions.
- Frontend uses a publishable key.
- RLS enabled for lead and rate-limit tables.
- Admin Edge Function requires JWT verification and independently calls `auth.getUser(token)`.
- Admin authorization compares authenticated email with the configured owner email.
- Public intake has CORS allowlisting, request-size cap, input cleaning, required consent, honeypot and basic rate limiting.
- Lead updates validate UUID, status enum and notes length.

## Required hardening

- [ ] Configure `FLOWPILOT_OWNER_EMAIL` as a required secret; avoid silently falling back to a hardcoded address.
- [ ] Verify the trusted client IP header provided by the Supabase edge platform; do not assume arbitrary `x-forwarded-for` is trustworthy.
- [ ] Ensure disallowed Origin responses do not emit a permissive fallback CORS origin.
- [ ] Handle invalid JSON as HTTP 400.
- [ ] Add cleanup/retention for `flowpilot_rate_limits`.
- [ ] Decide and document fail-open/fail-closed behaviour for rate-limit storage outages.
- [ ] Validate pagination as a finite, non-negative integer.
- [ ] Add explicit 404 behaviour for unknown lead IDs.
- [ ] Add request correlation IDs and safe structured logs; avoid logging full PII.
- [ ] Review owner-account recovery and session revocation process.
- [ ] Add dependency pinning and vulnerability scanning.

## Secrets

Never commit any of the following:
- Supabase service-role/secret key
- Resend API key
- Supabase Auth passwords or access tokens
- Vercel deployment token
- Production lead exports

## Incident response

1. Rotate compromised credentials in provider dashboards.
2. Revoke affected Supabase Auth sessions.
3. Review Edge Function logs and database audit data.
4. Assess whether personal data was accessed or disclosed.
5. Follow applicable notification obligations with qualified privacy counsel.
