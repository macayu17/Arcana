# agents.md — Arcana: AI Agent Build Instructions

> **Purpose:** This file provides structured instructions for AI coding agents (Claude Code, Codex, Cursor, etc.) to build the Arcana/ from the PRD.
> **Read PRD.md first** for full project data, design specs, and feature requirements.

---

## Agent Identity

You are building **Arcana** — a personal interview study platform for a developer named Ayush. This is a Next.js website that deep-dives into 6 major software projects with architecture diagrams, concept explainers, interview Q&A, flashcards, and study progress tracking.

**The UI must be premium and stunning.** Follow the taste-skill design system strictly. Generic, template-looking output is unacceptable.

---

## Technology Stack (Non-Negotiable)

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | **Next.js 14+** | App Router, server components where possible |
| Language | **TypeScript** | Strict mode enabled |
| Styling | **TailwindCSS v4** | With custom design tokens |
| Animation | **Framer Motion** | Page transitions, scroll reveals, micro-interactions |
| Diagrams | **Mermaid.js** | Client-side rendered architecture diagrams |
| Code Highlighting | **Shiki** | For code snippets in project pages |
| Search | **Fuse.js** | Client-side fuzzy search |
| Font | **Geist** via `next/font/google` or **Satoshi** self-hosted |
| Icons | **Lucide React** | Only for functional UI icons, NOT for placeholder avatars |
| Deployment | **Vercel** | Optimized for edge |

---

## Taste-Skill Design Rules (MANDATORY)

### Three Dials
```
DESIGN_VARIANCE = 7    // Modern, editorial, asymmetric
MOTION_INTENSITY = 5   // Meaningful but not distracting
VISUAL_DENSITY = 6     // Dense technical content, still breathable
```

### Color System
```css
/* LIGHT MODE */
--bg-primary: #f9fafb;
--bg-card: #ffffff;
--border-card: rgba(148, 163, 184, 0.15);  /* slate-200/50 */
--text-primary: #18181b;    /* zinc-900 */
--text-secondary: #52525b;  /* zinc-600 */
--text-muted: #a1a1aa;      /* zinc-400 */

/* DARK MODE */
--bg-primary: #09090b;      /* zinc-950 */
--bg-card: #18181b;         /* zinc-900 */
--border-card: rgba(63, 63, 70, 0.5);  /* zinc-700/50 */
--text-primary: #fafafa;    /* zinc-50 */
--text-secondary: #a1a1aa;  /* zinc-400 */
--text-muted: #52525b;      /* zinc-600 */

/* ACCENT — pick ONE, desaturated */
--accent: #f59e0b;          /* warm amber — desaturated for dark mode */
--accent-muted: rgba(245, 158, 11, 0.1);
```

### Typography Rules
```
❌ BANNED FONTS: Inter, Roboto, Arial, Space Grotesk
✅ USE: Geist, Outfit, Cabinet Grotesk, or Satoshi

Headlines:  text-4xl md:text-6xl, font-semibold to font-bold, tracking-tighter
Subheads:   text-xl md:text-2xl, font-medium, tracking-tight
Body:       text-base, leading-relaxed, max-w-[65ch]
Labels:     text-xs, font-medium, uppercase, tracking-widest
Mono/Data:  font-variant-numeric: tabular-nums (or use Geist Mono)

Primary weights: 500 (Medium) and 600 (SemiBold)
```

### Layout Rules
```
❌ NO 3-column equal card grids (banned)
❌ NO everything centered — break symmetry
❌ NO h-screen — use min-h-[100dvh]

✅ Bento grids with asymmetric sizing
✅ Zig-zag layouts for feature sections
✅ rounded-[2.5rem] for major containers
✅ Diffusion shadows: shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]
✅ Vertical rhythm: py-32 md:py-48 between major sections
✅ Max-width: max-w-[1400px] mx-auto
✅ CSS Grid (grid-cols) over Flexbox for page layout
✅ grid-flow-dense for bento grids
```

### Motion Rules
```
✅ scale-[0.98] on press/active state
✅ Spring config: { stiffness: 100, damping: 20 }
✅ Scroll-triggered section reveals (Framer Motion useInView)
✅ Page transitions with AnimatePresence
❌ NO custom mouse cursors
❌ NO gratuitous motion — every animation must have purpose
```

### Anti-Slop Rules
```
❌ NO placeholder names (Jane Doe, John Smith)
❌ NO fake statistics (99.99%, 10x faster)
❌ NO AI clichés: "Elevate", "Seamless", "Unleash", "Next-Gen", "Cutting-Edge"
❌ NO meta-labels: "SECTION 01", "ABOUT US", "OUR FEATURES"
❌ NO Lucide icon avatars as placeholders
❌ NO truncated code output — always output complete files
❌ NO placeholder comments like "// ... rest of the code"
```

---

## Build Order (Follow This Sequence)

### Phase 1: Foundation
```
1. Initialize Next.js 14+ project with App Router + TypeScript
   → npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --no-import-alias
   → Project name: arcana
2. Install dependencies:
   → npm install framer-motion fuse.js mermaid shiki lucide-react
3. Configure Tailwind with custom design tokens (colors, spacing, shadows)
4. Set up global styles in globals.css
5. Set up font (Geist via next/font or self-hosted Satoshi)
6. Create ThemeProvider (dark/light mode with localStorage persistence)
```

### Phase 2: Data Layer
```
7. Create TypeScript interfaces in /lib/types.ts (Project, Concept, Question, Flashcard)
8. Create all 6 project data files in /data/projects/:
   - sentinel.ts
   - engram.ts
   - parkinsons.ts
   - occasio.ts
   - equityflow.ts
   - gridpulse.ts
9. Create concepts.ts — master concept glossary
10. Create questions.ts — interview Q&A bank
11. Create flashcards.ts — flashcard data
```

### Phase 3: UI Components
```
12. Build base UI components: Button, Badge, Card, Modal, Tabs, Accordion, Tooltip
13. Build layout components: Navbar, Footer, ThemeToggle, SearchModal
14. Build project components: ProjectCard, ArchitectureDiagram, TechStackBadge,
    ConceptExplainer, CodeHighlight, SectionNav
15. Build study components: Flashcard, QuizQuestion, ProgressTracker, ConfidenceRating
```

### Phase 4: Pages
```
16. Landing page (/) — Hero + Bento project grid + stats
17. Project deep-dive (/projects/[slug]) — Full project page with all sections
18. Concept glossary (/concepts) — Filterable concept list
19. Comparison matrix (/compare) — Side-by-side project comparison table
20. Study dashboard (/study) — Progress rings, recent activity
21. Flashcard mode (/projects/[slug]/flashcards) — Swipeable flashcards
```

### Phase 5: Features
```
22. Global search (Cmd/Ctrl+K) with Fuse.js
23. Study progress persistence (localStorage)
24. Keyboard navigation hooks
25. Flashcard spaced repetition logic
```

### Phase 6: Polish
```
26. Page transitions (Framer Motion AnimatePresence)
27. Scroll-triggered reveals for all sections
28. Responsive design audit (320px → 2560px)
29. Lighthouse optimization (target > 90)
30. SEO: meta tags, Open Graph, structured data
```

---

## Project Data Structure

Every project data file (`/data/projects/[name].ts`) MUST export a complete `Project` object. Here is the exact interface:

```typescript
// /lib/types.ts

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  repo: string;
  status: "active" | "completed" | "ongoing";
  domain: string;
  domainColor: string;                 // Tailwind color class for domain badge
  icon: string;                        // Emoji or icon identifier

  architecture: {
    overview: string;
    diagram: string;                   // Mermaid diagram code
    layers: {
      name: string;
      description: string;
      technologies: string[];
    }[];
  };

  techStack: {
    name: string;
    role: string;
    category: "frontend" | "backend" | "database" | "devops" | "ml" | "library";
  }[];

  howItWorks: {
    summary: string;
    steps: {
      step: number;
      title: string;
      description: string;
      details?: string;
    }[];
    sequenceDiagram?: string;          // Optional Mermaid sequence diagram
  };

  concepts: {
    name: string;
    category: "ml" | "finance" | "web" | "systems" | "data" | "devops" | "healthcare";
    definition: string;                // One-line definition
    explanation: string;               // Full paragraph explanation
    relevance: string;                 // How it's used in THIS project
  }[];

  codeHighlights: {
    title: string;
    description: string;
    language: string;
    code: string;
    annotations?: string[];
  }[];

  apiDesign?: {
    baseUrl: string;
    endpoints: {
      method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
      path: string;
      description: string;
      requestBody?: string;
      responseBody?: string;
    }[];
  };

  databaseDesign?: {
    type: string;                      // PostgreSQL, MongoDB, etc.
    diagram?: string;                  // Mermaid ER diagram
    tables: {
      name: string;
      description: string;
      fields: string[];
    }[];
  };

  tradeoffs: {
    decision: string;
    chose: string;
    over: string;
    reasoning: string;
  }[];

  challenges: {
    problem: string;
    solution: string;
    lesson: string;
  }[];

  requirements: string[];
  targetAudience: string[];
  futureImprovements: string[];

  interviewQuestions: {
    question: string;
    answer: string;
    difficulty: "easy" | "medium" | "hard";
    category: "architecture" | "code" | "concepts" | "tradeoffs" | "behavioral";
  }[];

  flashcards: {
    front: string;
    back: string;
    difficulty: "easy" | "medium" | "hard";
  }[];
}

export interface ConceptGlossaryEntry {
  name: string;
  category: "ml" | "finance" | "web" | "systems" | "data" | "devops" | "healthcare";
  definition: string;
  explanation: string;
  usedInProjects: string[];            // Project slugs
  relatedConcepts: string[];
}

export interface StudyProgress {
  projectSlug: string;
  sectionsReviewed: string[];
  confidence: Record<string, "low" | "medium" | "high">;
  lastStudied: string;                 // ISO date string
  flashcardProgress: Record<string, "know" | "kinda" | "dont_know">;
}
```

---

## Page-by-Page Specifications

### Page 1: Landing (`/`)

**Purpose:** First impression + quick navigation hub

**Layout Blueprint:**
```
┌──────────────────────────────────────────────┐
│ NAVBAR (sticky, glass blur bg)               │
│   Logo    Projects  Concepts  Compare  Study │
│                              [Search] [Theme]│
├──────────────────────────────────────────────┤
│                                              │
│  HERO SECTION (min-h-[100dvh])               │
│                                              │
│  ┌─ Left-aligned ─────────────────────────┐  │
│  │ "Deep Dive into My Projects"           │  │
│  │ Subtitle: studying 6 projects,         │  │
│  │ X concepts, Y technologies             │  │
│  │ [Explore Projects] [Start Studying]    │  │
│  └────────────────────────────────────────┘  │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│  PROJECT BENTO GRID (asymmetric)             │
│                                              │
│  ┌──────────────┐ ┌────────┐                 │
│  │              │ │        │                 │
│  │  Sentinel    │ │ Engram │                 │
│  │  (2×2 big)   │ │ (1×1)  │                 │
│  │              │ ├────────┤                 │
│  │              │ │Parkin- │                 │
│  ├──────────────┤ │son's   │                 │
│  │  Occasio     │ │ (1×1)  │                 │
│  │  (2×1 wide)  │ ├────────┤                 │
│  ├──────┬───────┤ │Grid-   │                 │
│  │Equity│       │ │Pulse   │                 │
│  │Flow  │ Stats │ │ (1×1)  │                 │
│  │(1×1) │ (1×1) │ │        │                 │
│  └──────┴───────┘ └────────┘                 │
│                                              │
├──────────────────────────────────────────────┤
│  FOOTER                                      │
└──────────────────────────────────────────────┘
```

**Implementation Notes:**
- Hero text should be left-aligned (NOT centered) — taste-skill rule
- Bento grid uses CSS Grid with `grid-template-areas` for asymmetric sizing
- Each project card shows: name, domain badge, 3 tech icons, one-line description
- Hover state: `scale-[1.02]` + elevated shadow + subtle border glow
- Active/press: `scale-[0.98]`
- Stats section: animated number counters on scroll-in

---

### Page 2: Project Deep-Dive (`/projects/[slug]`)

**Purpose:** The core study page — everything about one project

**Layout Blueprint:**
```
┌──────────────────────────────────────────────┐
│ NAVBAR                                        │
├────────┬─────────────────────────────────────┤
│        │                                      │
│ STICKY │  PROJECT HEADER                      │
│ SIDE   │  Name / Tagline / Domain / Repo      │
│ NAV    │                                      │
│        ├─────────────────────────────────────┤
│ □ Over │  OVERVIEW SECTION                    │
│ □ Arch │  What it does, problem, motivation   │
│ □ Tech ├─────────────────────────────────────┤
│ □ How  │  ARCHITECTURE                        │
│ □ Conc │  Mermaid diagram + layer breakdown   │
│ □ Code ├─────────────────────────────────────┤
│ □ API  │  TECH STACK                          │
│ □ DB   │  Visual badge grid                   │
│ □ Trad ├─────────────────────────────────────┤
│ □ Chal │  HOW IT WORKS                        │
│ □ Reqs │  Numbered steps + flow diagram       │
│ □ Q&A  ├─────────────────────────────────────┤
│        │  KEY CONCEPTS                        │
│ ──── progress bar ──── │  Expandable accordions              │
│        ├─────────────────────────────────────┤
│        │  ... more sections ...               │
│        │                                      │
│        │  [📇 Start Flashcards]               │
├────────┴─────────────────────────────────────┤
│ FOOTER                                        │
└──────────────────────────────────────────────┘
```

**Implementation Notes:**
- Sticky sidebar with IntersectionObserver for active section tracking
- Checkboxes in sidebar persist to localStorage (study progress)
- Mermaid diagrams render client-side inside a `<ClientOnly>` wrapper
- Code blocks use Shiki with dark/light theme sync
- Concept accordions: click to expand full explanation + "Used in X projects" badge
- Interview Q&A: question visible, answer hidden behind a "Reveal" toggle
- Smooth scroll navigation between sections

---

### Page 3: Concept Glossary (`/concepts`)

**Implementation Notes:**
- Pull all unique concepts from all 6 project data files
- Group by category with filter tabs (All, ML, Finance, Web, Systems, Data, DevOps)
- Search bar at top (Fuse.js instant filter)
- Each concept card: name, one-line definition, category badge, project badges
- Click to expand: full explanation + relevance in each project + related concepts

---

### Page 4: Comparison Matrix (`/compare`)

**Implementation Notes:**
- Full-width responsive table
- Columns: Project, Domain, Frontend, Backend, Database, Key Concepts, Architecture Pattern
- Sortable by clicking column headers
- Project names are clickable links to deep-dive pages
- On mobile: horizontal scroll with sticky first column

---

### Page 5: Study Dashboard (`/study`)

**Implementation Notes:**
- Progress rings (SVG circle with `stroke-dasharray`) per project
- Overall progress bar aggregating all projects
- "Last Studied" with relative timestamps ("2 hours ago")
- Quick resume buttons per project
- Confidence heat map: grid of concepts colored by confidence level

---

### Page 6: Flashcard Mode (`/projects/[slug]/flashcards`)

**Implementation Notes:**
- Full-screen card with flip animation (Framer Motion `rotateY`)
- Swipe gestures (or arrow keys) for next/previous
- Three buttons after reveal: ✅ Know / 🤔 Kinda / ❌ Don't Know
- Progress bar showing position in deck
- Results summary at end of deck
- Shuffle option

---

## Search Implementation

```typescript
// /lib/search.ts
import Fuse from 'fuse.js';
import { projects } from '@/data/projects';
import { concepts } from '@/data/concepts';

const searchIndex = new Fuse(
  [
    ...projects.map(p => ({
      type: 'project',
      title: p.name,
      content: p.description,
      slug: `/projects/${p.slug}`,
    })),
    ...concepts.map(c => ({
      type: 'concept',
      title: c.name,
      content: c.explanation,
      slug: `/concepts#${c.name.toLowerCase().replace(/\s+/g, '-')}`,
    })),
    // ... questions, flashcards etc.
  ],
  {
    keys: ['title', 'content'],
    threshold: 0.3,
    includeMatches: true,
  }
);
```

**Search Modal:**
- Open with `Cmd/Ctrl + K` (global keyboard listener)
- Animated modal with Framer Motion
- Instant results as you type
- Results grouped: Projects | Concepts | Questions
- Arrow key navigation through results
- Enter to navigate to selected result

---

## localStorage Schema

```typescript
// Keys used in localStorage
const STORAGE_KEYS = {
  THEME: 'arcana-theme',                          // 'light' | 'dark'
  STUDY_PROGRESS: 'arcana-study-progress',         // StudyProgress[]
  FLASHCARD_PROGRESS: 'arcana-flashcard-progress',  // Record<slug, Record<index, status>>
  SEARCH_HISTORY: 'arcana-search-history',          // string[]
  NOTES: 'arcana-notes',                            // Record<slug-section, string>
} as const;
```

---

## Content Writing Guidelines

When writing project content for the data files:

1. **Be specific, not generic.** Don't say "uses modern technologies" — say "FastAPI chosen for async WebSocket support in real-time price streaming"
2. **Explain the WHY.** Every tech choice should have a rationale
3. **Use concrete numbers.** "Trained on 42,000 patient records" not "trained on a large dataset"
4. **Interview-ready depth.** Each explanation should be deep enough to survive a follow-up question
5. **Connect concepts to implementation.** Don't just define "WebSocket" — explain how it's used in EquityFlow for sub-second price updates
6. **Include code snippets.** Show actual implementation patterns, not pseudo-code
7. **Document trade-offs honestly.** Show what was considered and rejected, with reasoning

---

## Quality Checklist (Before Submission)

- [ ] All 6 projects have complete data files with every field populated
- [ ] Mermaid diagrams render correctly for all architectures
- [ ] Dark/light theme works flawlessly with no flash on load
- [ ] Search returns relevant results for any project or concept query
- [ ] Flashcard flip animation is smooth (60fps)
- [ ] Study progress persists across page reloads and browser restarts
- [ ] All pages are responsive from 320px to 2560px
- [ ] Lighthouse scores > 90 in all categories
- [ ] No taste-skill violations (check against anti-slop rules)
- [ ] All links and navigation work correctly
- [ ] Keyboard shortcuts functional (Cmd+K, arrow keys, Escape)
- [ ] Code syntax highlighting works in both themes
- [ ] No console errors or warnings
- [ ] SEO meta tags on every page
- [ ] Concept glossary correctly cross-references all projects

---

## Common Pitfalls to Avoid

| ❌ Don't | ✅ Do Instead |
|----------|--------------|
| Use a generic template hero with centered text | Left-aligned hero with asymmetric layout |
| Equal 3-column project cards | Bento grid with varied card sizes |
| Plain white cards with box-shadow | Cards with subtle borders, diffusion shadows, rounded-[2.5rem] |
| Inter or Roboto font | Geist or Satoshi font |
| Generic color scheme | Curated Zinc/Slate neutral base + single desaturated accent |
| Static page with no motion | Scroll reveals, hover effects, spring animations |
| Placeholder content | Real project data from the repos |
| Skip sections with "..." | Complete every section fully |
| Use h-screen | Use min-h-[100dvh] |
| Center everything | Break symmetry with offset margins and mixed alignments |

---

## Deployment

```bash
# Build
npm run build

# Preview locally
npm run start

# Deploy to Vercel
vercel --prod
```

Ensure the following environment variables are set (if needed):
```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

---

## Final Note

**Arcana** is a personal study tool that should look like a premium portfolio. The developer will use this to prepare for interviews — every piece of content must be accurate, deep, and immediately useful for answering technical interview questions. The design must be so good that sharing the URL with an interviewer would be impressive on its own.
