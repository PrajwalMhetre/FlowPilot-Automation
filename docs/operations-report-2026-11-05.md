# Engineering Audit — 2026-11-05

## Verified

- GitHub repository exists and authenticated account has admin/push permission.
- Supabase project `flowpilot-lead-management` is `ACTIVE_HEALTHY` in Frankfurt.
- Intake Edge Function active at version 3.
- Admin Edge Function active at version 1 with JWT verification enabled.
- Both public tables have RLS enabled.
- Owner Auth user count was 0 at time of audit.
- Lead count and rate-limit row count were both 0 at time of audit.
- Security advisor returned informational `rls_enabled_no_policy` notices on both tables. This matches the current design where browser reads are not permitted and Edge Functions use the service role.

## Not yet verified

- Successful browser form submission to database.
- Successful CRM owner sign-in.
- Negative authorization for a non-owner session.
- Lead list, status update and internal-note update through CRM.
- Resend notification delivery.
- End-to-end privacy and consent compliance.

## Risks / follow-up

1. Intake handler parses malformed JSON into a generic 500 path.
2. Intake CORS response uses a stable-origin fallback even for blocked origins.
3. Rate-limit table needs retention/cleanup.
4. Rate-limit IP source trust needs platform confirmation.
5. Rate-limit database failure currently blocks a valid lead submission.
6. Admin page query parameter can become NaN; malformed PATCH JSON path currently produces a generic 500.
7. Privacy notice is incomplete for EU-oriented data collection.

This report is evidence of point-in-time inspection, not a security certification or production readiness attestation.
