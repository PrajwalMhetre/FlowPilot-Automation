# Contributing

Thanks for considering a contribution.

## Workflow

1. Open an issue describing the problem or proposal.
2. Create a focused branch from `main`.
3. Keep changes small and include tests where practical.
4. Run available checks locally.
5. Open a pull request with context, verification evidence and any migration notes.

## Engineering standards

- Never commit secrets or real lead data.
- Keep owner-only authorization server-side.
- Preserve RLS on exposed tables.
- Validate all external input.
- Pin third-party dependencies.
- Document configuration changes and operational trade-offs.
- Do not claim a feature is verified unless a test was run.

## Commit style

Use Conventional Commit prefixes such as `feat:`, `fix:`, `docs:`, `test:`, `chore:`, and `security:`.
