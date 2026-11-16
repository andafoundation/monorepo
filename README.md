# Anda monorepo

The source of [andaphilosophy.com](https://andaphilosophy.com), the website of Stichting Anda, the foundation of the Anda: the philosophy of the eternal sky.

## Layout

| Path | What it is |
|---|---|
| `projects/website/` | The website: Next.js 16 on Cloudflare Workers ([README](projects/website/README.md)) |
| `.github/workflows/website-ci.yml` | Type check, tests and build on every pull request and on `main`; deploy of the Worker on a push to `main` |
| `.agents/`, `.claude/`, `AGENTS.md` | Instructions for coding agents |

The site's code was copied from the foundation's earlier private repository as one snapshot (source commit `c9b74a752f93a221d6dd71a3f3724b7caf5eb45f`), without that repository's history.

## Quick start

You need [Bun](https://bun.sh) 1.4.3.

```bash
cd projects/website
bun install
bun run dev
```

Open http://localhost:3008. The site needs no secret, database or backend to run locally.

## Deployment

The site runs as the Cloudflare Worker `anda-website` in the foundation's Cloudflare account. Every push to `main` that touches `projects/website/` or the workflow runs the `check` job and then the `deploy` job of `website-ci.yml`, which builds the Worker with OpenNext and deploys it with wrangler (`bun run cf:deploy`). Pull requests, forks included, run only `check` and never see a Cloudflare credential.

The `deploy` job runs in the GitHub environment `production` of this repository, which only `main` may use. The owner sets these values there:

| Name | Kind | Value |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | environment secret | Cloudflare API token: Workers Scripts Edit on the foundation's account; Workers Routes Edit and DNS Edit on the zone `andaphilosophy.com` |
| `CLOUDFLARE_ACCOUNT_ID` | environment variable | The id of the foundation's Cloudflare account |

The secret is set with `gh secret set CLOUDFLARE_API_TOKEN -e production -R andafoundation/monorepo`; the environment and its variable are managed by the infrastructure repository. To rotate the token, roll it in the Cloudflare dashboard and set the secret again.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md). To report a vulnerability, follow [SECURITY.md](SECURITY.md); do not open a public issue.

## Licence

The code is licensed under the Apache License 2.0 ([LICENSE](LICENSE)). The site's content (texts, translations, images, books and logo) is not: Stichting Anda reserves all rights to it ([LICENSE-CONTENT.md](LICENSE-CONTENT.md)).
