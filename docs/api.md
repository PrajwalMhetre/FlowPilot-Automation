# API Reference

Base URL: `https://ahlhyzmjoiqqqmdopffb.supabase.co/functions/v1`

## Public lead intake

`POST /flowpilot-lead-intake`

Content-Type: `application/json`

Example request:

```json
{
  "name": "Alex Example",
  "email": "alex@example.test",
  "company": "Example Studio",
  "website": "https://example.test",
  "role": "Founder / Managing Director",
  "volume": "31–75",
  "budget": "€500–€1,000",
  "priority": "Improve response time",
  "challenge": "We need a consistent process to qualify incoming enquiries and assign follow-up.",
  "consent": true
}
```

The `website_confirm` field is a honeypot; populated honeypot submissions are accepted with a generic success response and are not stored.

Success returns `ok`, a generic message, a lead identifier/score/tier and notification state. Validation errors use HTTP 400; disallowed origins use HTTP 403; excessive attempts use HTTP 429. Unexpected server errors currently return HTTP 500.

## Owner CRM

Both routes require a valid Supabase access token in `Authorization: Bearer <access-token>`. The function also checks the owner email allowlist.

### List leads

`GET /flowpilot-admin?page=0`

Returns up to 50 newest leads and a total count.

### Update lead

`PATCH /flowpilot-admin`

```json
{
  "id": "00000000-0000-4000-8000-000000000000",
  "status": "Contacted",
  "internal_notes": "Synthetic test record; contacted by owner."
}
```

Allowed statuses: `New`, `Contacted`, `Qualified`, `Won`, `Lost`.

Internal notes are limited to 3000 characters.

## Rate limiting

Current implementation counts attempts by a SHA-256 hash of the observed forwarded IP over a rolling ten-minute interval and blocks after five requests. The trustworthiness of the forwarded-IP source and old-row cleanup remain hardening tasks.

## Data minimization

Use synthetic values for tests. Do not put secrets, sensitive personal data or special-category data in challenge or notes fields.
