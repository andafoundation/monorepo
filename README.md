# Anda monorepo

The source of [andaphilosophy.com](https://andaphilosophy.com), the website of Stichting Anda, the foundation of the Anda: the philosophy of the eternal sky.

## Layout

| Path | What it is |
|---|---|
| `projects/website/` | The website: Next.js 16 on Cloudflare Workers ([README](projects/website/README.md)) |
| `.github/workflows/website-ci.yml` | Type check, tests and build on every pull request and on `main` |
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

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md). To report a vulnerability, follow [SECURITY.md](SECURITY.md); do not open a public issue.

## Licence

The code is licensed under the Apache License 2.0 ([LICENSE](LICENSE)). The site's content (texts, translations, images, books and logo) is not: Stichting Anda reserves all rights to it ([LICENSE-CONTENT.md](LICENSE-CONTENT.md)).
