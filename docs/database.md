# Database Schema

Supabase project: `ahlhyzmjoiqqqmdopffb` (Frankfurt / `eu-central-1`).

## `public.flowpilot_leads`

| Column | Purpose |
|---|---|
| `id` | Lead UUID |
| `created_at` | Creation timestamp |
| `full_name` | Contact name |
| `email` | Contact email |
| `company` | Company name |
| `website` | Optional website |
| `role` | Contact role |
| `monthly_enquiries` | Enquiry volume band |
| `budget` | Budget band |
| `priority` | Declared priority |
| `challenge` | Enquiry description |
| `consent` | Consent boolean |
| `source` | Capture source |
| `lead_score` | Integer score |
| `lead_tier` | High / Medium / Early |
| `status` | CRM lifecycle status |
| `internal_notes` | Owner-only notes |

## `public.flowpilot_rate_limits`

| Column | Purpose |
|---|---|
| `id` | Row identifier |
| `ip_hash` | SHA-256 digest; raw IP is not stored by this function |
| `created_at` | Attempt timestamp |

## Access model

RLS is enabled on both tables. No browser-facing policies were present at last inspection; Edge Functions access through server-side service-role credentials. This is intentional for the present architecture. Never add a broad `USING (true)` policy to expose lead data.

## Verification query

```sql
select
  (select count(*) from auth.users
   where lower(email) = lower('work.mhetreprajwal@gmail.com')) as owner_users,
  (select count(*) from public.flowpilot_leads) as leads,
  (select relrowsecurity from pg_class
   where oid = 'public.flowpilot_leads'::regclass) as leads_rls,
  (select relrowsecurity from pg_class
   where oid = 'public.flowpilot_rate_limits'::regclass) as rate_limits_rls;
```

Do not export production lead PII into repository fixtures or screenshots.
