# Contributing

Thank you for helping. This repository holds the website of Stichting Anda.

## What you can change

- Code, styling, accessibility, performance and tooling: open a pull request.
- Content (the texts, translations, images and books listed in `LICENSE-CONTENT.md`): only the foundation changes it. Report a typo or a wrong translation in an issue, and the foundation decides on the change.

## Set up

Install [Bun](https://bun.sh) 1.4.3. `bun.lock` is the only lockfile: do not add a `package-lock.json` or `yarn.lock`.

```bash
cd projects/website
bun install --frozen-lockfile
bun run dev
```

## Before you open a pull request

Run these in `projects/website`. All must pass, and CI runs the first four again:

```bash
bun install --frozen-lockfile
bunx tsc --noEmit
bun run test
bun run build
CF_WORKERS_BUILD=1 bunx opennextjs-cloudflare build   # the Worker bundle
```

`bun run lint` does not work: it calls `next lint`, which Next.js 16 removed.

Never commit a secret, an access token or an account id. If you have [gitleaks](https://github.com/gitleaks/gitleaks), run `gitleaks dir .` at the repository root.

## Pull requests

- Branch from `main` and open the pull request against `main`. `main` takes changes only through pull requests.
- Keep one change per pull request, and say in its description what it changes and how you checked it.
- By opening a pull request you agree that your code contribution is licensed under the Apache License 2.0.
