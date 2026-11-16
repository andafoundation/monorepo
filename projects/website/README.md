# Anda Website - Next.js

This is the official website for Stichting Anda – De Filosofie van de Eindeloze Hemel.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Cloudflare Workers, built and deployed by GitHub Actions (OpenNext)

## Getting Started

### Development

```bash
# Install dependencies (bun.lock is the only lockfile; do not add a package-lock.json)
bun install

# Run development server
bun run dev

# Open http://localhost:3008
```

### Production

```bash
# Build for production
bun run build

# Start production server
bun run start
```

### Cloudflare Workers

GitHub Actions runs the OpenNext build and deploy on every push to `main` that touches
`projects/website`. To preview the Worker build locally:

```bash
bun run cf:preview
```

## Project Structure

```
anda/
├── app/                    # Next.js App Router pages
│   ├── boodschap/         # About page
│   ├── pilaren/           # Pillars page
│   ├── eed/               # Oath page
│   ├── statuten/          # Statutes page
│   ├── skyyurt/           # Skyyurt project page
│   ├── download/          # Downloads page
│   ├── contact/           # Contact page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   └── Footer.tsx         # Footer
├── public/                # Static assets (images)
└── wrangler.jsonc         # Cloudflare Worker configuration
```

## Features

- ✅ Fully mobile-responsive design
- ✅ Modern React Server Components
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling
- ✅ SEO optimized with Next.js metadata
- ✅ Mobile-first hamburger navigation
- ✅ Deployed on Cloudflare Workers

## Design Philosophy

The website preserves the original design with:
- **Primary Color**: Delfts Blauw (#1f3c88)
- **Light Blue**: #f2f6fb
- **Dark**: #0f1b3d
- **Font**: Arial, sans-serif
- **Max Width**: 1100px

All text sizes, colors, and fonts have been maintained from the original design while adding comprehensive mobile optimization.

## License

© Stichting Anda – De Filosofie van de Eindeloze Hemel