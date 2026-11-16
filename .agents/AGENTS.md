# Anda monorepo: agent instructions

The monorepo of Stichting Anda. It holds the website of andaphilosophy.com at `projects/website/`.

## Read first

- `.agents/rules/core.md`: the rules for all work in this repository.
- `.agents/rules/00-project-registry.md`: the project, its stack, its checks, the plans location and the lessons file.

A tool that does not load `.agents/rules/` by itself reads both files before it starts, and then `.agents/rules/09-skill-routing.md`.

## Where things live

- Conventions: `.agents/skills/<name>/SKILL.md`. Before you write code in an area, load the skill that `.agents/rules/09-skill-routing.md` names for it. A tool without a skill loader reads the file.
- Templates: `.agents/templates/` (a spec and a handoff).
- Claude Code: `.claude/rules`, `.claude/templates` and every `.claude/skills/<name>` are symlinks into `.agents/`. Add a skill under `.agents/skills/` and link it from `.claude/skills/`; never put a real file under `.claude/` except `settings.json`.

## Licences

Code is Apache-2.0 (`LICENSE`). The site's texts, translations, images, PDFs and logo are not: `LICENSE-CONTENT.md` reserves them to Stichting Anda. Do not add third-party content or images without the foundation's written consent.
