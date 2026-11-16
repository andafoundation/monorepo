# Project registry

The monorepo of Stichting Anda, public on GitHub as `andafoundation/monorepo`.

## Projects

### Website
- **Type:** the public website of the foundation, andaphilosophy.com (`www.andaphilosophy.com` and `andaism.com` redirect to it)
- **Paths:** `projects/website/` frontend
- **Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v3, next-intl (locales `nl`, `en`, `tr`, `ru`); Bun 1.4.3 with `bun.lock` as the only lockfile; Node.js 22 in CI; deployed as the Cloudflare Worker `anda-website` through OpenNext (`@opennextjs/cloudflare`, `wrangler.jsonc`)
- **Content:** page texts in `content/` and `messages/`, the ands in `ands/ands.txt` (the `ands:source` script generates `lib/ands/ands-source.ts` before `dev` and `build`), images in `images/` and `public/assets/`, books in `public/downloads/`
- **Local services:** `bun run dev` on :3008; no database, no backend
- **CI:** `.github/workflows/website-ci.yml`, job `check` on pull requests and pushes to `main` that touch `projects/website/**`

## Verification

| Project and scope | Run in | Build | Type check | Lint | Tests |
|---|---|---|---|---|---|
| Website | `projects/website` | `bun run build`; Worker bundle: `CF_WORKERS_BUILD=1 bunx opennextjs-cloudflare build` | `bunx tsc --noEmit` | none (`bun run lint` calls `next lint`, which Next.js 16 removed) | `bun run test` |

Install first with `bun install --frozen-lockfile`. At the repository root, `gitleaks dir .` must find nothing before a push.

## Working files

- **Plans and specs:** `docs/plans/website/NN_NAME.md`, a two-digit sequence and an upper-case name
- **Lessons:** `.agents/memory/lessons.md`
- **Ticket board:** none; work is tracked in GitHub issues and pull requests
- **Local secrets:** none; the site needs no secret to run, test or build. Deploy credentials live only in the GitHub environment `production`

## Skill routing

Routing rule: `.agents/rules/09-skill-routing.md`
