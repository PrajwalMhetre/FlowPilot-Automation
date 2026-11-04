# Multi-language platform implementation

## Runtime boundaries
- **Frontend:** Next.js App Router, React 19 and TypeScript in `frontend/`.
- **API:** FastAPI / Python 3.12 in `backend/`.
- **Persistence:** PostgreSQL migration in `database/migrations/`; Supabase Edge Functions remain the current secured production integration boundary.
- **Operations:** Docker Compose for local API development; GitHub Actions for backend tests and frontend build.

## Current scope
This branch introduces a deployable frontend scaffold, a typed API contract, request validation, a baseline database migration, container configuration and CI workflows. The lead endpoint deliberately returns `pending_integration`; it does not claim to persist data until the Supabase adapter is implemented and verified.

## Local development
- API: `cd backend && python -m venv .venv && . .venv/bin/activate && pip install -r requirements.txt && pytest -q && uvicorn app.main:app --reload`
- Frontend: `cd frontend && npm install && npm run dev`
- Compose API: `docker compose up --build`

## Release gate
Do not connect this branch to the existing production Vercel project. First recover or reconcile the currently deployed site source, configure a separate preview project, wire the verified Supabase integration, then run CI and browser E2E tests.
