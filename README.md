# Arcana

Arcana is Ayush's personal interview study platform. It turns six software projects into a searchable study workspace with architecture diagrams, implementation notes, concept explainers, Q&A, flashcards, comparison tables, and local progress tracking.

## Stack

- Next.js App Router with TypeScript
- Tailwind CSS v4 design tokens
- Framer Motion for route transitions and interaction polish
- Mermaid for client-rendered architecture diagrams
- Shiki for lazy-loaded code highlighting
- Fuse.js for client-side fuzzy search
- Geist Sans and Geist Mono through `next/font`

## Local Development

```bash
npm install
npm run dev
```

Production check:

```bash
npm run build
npm run start
```

## Study Data

Project content lives in `src/data/projects/`:

- Sentinel
- Engram
- NeuroAssess
- Occasio
- EquityFlow
- GridPulse

Shared glossary, question bank, and flashcard data are derived from those project records.

## Verification Snapshot

Latest local verification covered:

- `npx tsc --noEmit`
- `npx eslint src --cache --cache-location .eslintcache --max-warnings=0`
- `npm run build`
- Production browser checks on `/`, `/projects/sentinel`, `/concepts`, `/compare`, `/study`, and `/projects/sentinel/flashcards`
- Lighthouse production checks:
  - Home: Performance 93, Accessibility 100, Best Practices 100, SEO 100
  - Sentinel deep-dive: Performance 97, Accessibility 96, Best Practices 100, SEO 100
