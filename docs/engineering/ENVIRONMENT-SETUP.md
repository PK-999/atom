# Environment Setup Checklist

## Local

- Install the pinned Node.js and package-manager versions recorded by the application scaffold.
- Copy `.env.example` to `.env.local`; never commit the result.
- Start Supabase locally when evidence-backed routes are under development.
- Apply migrations and load only reviewed development fixtures.
- Run typecheck, lint, tests, and production build before opening a pull request.

## GitHub

- Create the `atom` repository with protected `main`.
- Require CI and review before merge.
- Store deployment credentials in environment-scoped secrets.
- Enable dependency and secret scanning.

## Vercel

- Create the `atom` project and connect the GitHub repository.
- Use pull-request previews, a protected staging environment, and production.
- Scope public and server-only environment variables separately.
- Prevent preview environments from querying production draft evidence.

## Supabase

- Create separate non-production and production projects.
- Apply migrations through CI or a reviewed release command.
- Permit anonymous reads only for published evidence views.
- Keep service-role credentials server-only.
- Enable backups before the first public evidence release.
