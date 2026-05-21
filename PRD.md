# PRD: Arcana — Interview Study Platform

> **Author:** Ayush (macayu17)
> **Version:** 1.0
> **Date:** 2025-05-21
> **Stack:** Next.js 14+ (App Router), TypeScript, TailwindCSS v4
> **Purpose:** Arcana — a personal interview preparation platform for deep-diving into all major projects

---

## 1. Problem Statement

Preparing for technical interviews requires recalling deep architectural details, design decisions, trade-offs, and implementation specifics across multiple projects. Scattered READMEs, codebases, and notes make it hard to study efficiently. This platform consolidates **everything** about each project into a single, beautifully designed, searchable, and interactive study tool.

---

## 2. Goals

| # | Goal | Success Metric |
|---|------|---------------|
| 1 | Single source of truth for all 6 projects | All project data accessible from one URL |
| 2 | Interview-ready depth | Architecture diagrams, code snippets, concept explainers, trade-off discussions |
| 3 | Active recall & self-testing | Quiz mode, flashcards, mock Q&A per project |
| 4 | Fast navigation & search | Find any concept/project in < 3 seconds |
| 5 | Premium, modern UI | Taste-skill compliant design that feels portfolio-grade |
| 6 | Study progress tracking | Track what you've reviewed, mark confidence levels |

---

## 3. Target User

**Primary:** Ayush (the developer) — studying for software engineering interviews.
**Secondary:** Anyone reviewing the portfolio (recruiters, interviewers visiting a shared link).

---

## 4. Feature Requirements

### 4.1 Core Features (P0 — Must Have)

#### 4.1.1 Landing Page / Dashboard
- Hero section with name, tagline, and project grid overview
- Quick stats: total projects, tech stacks used, total concepts covered
- Navigation to individual project pages
- Dark/Light mode toggle (persistent via localStorage)

#### 4.1.2 Project Deep-Dive Pages (× 6)
Each project page MUST contain ALL of the following sections:

| Section | Description |
|---------|-------------|
| **Overview** | What it does, the problem it solves, motivation |
| **Architecture** | System architecture diagram (Mermaid or interactive), component breakdown, data flow |
| **Tech Stack** | Full stack listing with version info, why each tech was chosen |
| **How It Works** | Step-by-step operational flow, sequence diagrams |
| **Key Concepts** | Every CS/domain concept used, with expandable explainers (e.g., "What is a Limit Order Book?") |
| **Code Highlights** | Key code snippets with syntax highlighting and annotations |
| **API Design** | Endpoints, request/response schemas (where applicable) |
| **Database Design** | Schema diagrams, relationships, indexing strategy (where applicable) |
| **Trade-offs & Decisions** | Why X over Y? Design decision rationale |
| **Challenges & Solutions** | Problems faced during development and how they were solved |
| **Requirements** | Dependencies, environment setup, how to run |
| **Target Audience** | Who the project is for |
| **Future Improvements** | What could be added/improved |

#### 4.1.3 Global Search
- Full-text search across all projects, concepts, and content
- Search results grouped by project with highlighted matches
- Keyboard shortcut (Cmd/Ctrl + K) to open search modal

#### 4.1.4 Concept Glossary
- Centralized page listing ALL concepts used across projects
- Each concept links back to the projects that use it
- Expandable definitions with examples
- Grouped by domain (ML, Finance, Web, Systems, etc.)

### 4.2 Study & Interview Features (P1 — High Priority)

#### 4.2.1 Interview Q&A Bank
- Per-project curated interview questions (behavioral + technical)
- Toggle to reveal answers
- Difficulty tags: Easy / Medium / Hard
- Categories: Architecture, Code, Concepts, Trade-offs, Behavioral

#### 4.2.2 Flashcard Mode
- Swipeable flashcards per project or across all projects
- Spaced repetition tracking (mark as: Know / Kinda / Don't Know)
- Progress persistence via localStorage

#### 4.2.3 Study Progress Tracker
- Per-section checkboxes (mark as "Reviewed", "Confident", "Need Review")
- Overall progress bar per project and global
- Last studied timestamp
- Persistent via localStorage

#### 4.2.4 Quick Comparison Matrix
- Side-by-side comparison of all 6 projects
- Compare by: Tech Stack, Architecture Pattern, Domain, Scale, Complexity
- Filterable and sortable table

### 4.3 Enhanced Features (P2 — Nice to Have)

#### 4.3.1 Interactive Architecture Diagrams
- Click-to-zoom on architecture components
- Hover tooltips explaining each component
- Animated data flow paths

#### 4.3.2 "Explain Like I'm Interviewing" Mode
- Simplified 2-minute pitch version of each project
- Structured as: Problem → Solution → Impact → Tech Highlights
- Copy-to-clipboard for quick reference

#### 4.3.3 PDF Export
- Export any project page as a formatted PDF
- Export all projects as a single study guide

#### 4.3.4 Keyboard Navigation
- Arrow keys to navigate between projects
- Shortcuts for sections within a project page
- Vim-style bindings (j/k for scroll)

---

## 5. Project Data

### 5.1 SENTINEL — Multi-Agent Market Microstructure Simulator

**Repository:** https://github.com/macayu17/Sentinel

**Overview:**
A multi-agent market microstructure simulator that models financial market dynamics with liquidity shock prediction and hidden institutional order detection. It simulates how different market participants (institutional traders, market makers, retail investors) interact in a limit order book environment.

**Architecture:**
- **Frontend:** Next.js + TypeScript — interactive visualization dashboards
- **Backend:** Python + FastAPI — simulation engine and API layer
- Multi-agent system where autonomous agents interact with a simulated Limit Order Book (LOB)
- Modular layered architecture:
  - Data Perception Layer → Reasoning Layer → Strategy Generation Layer → Execution & Control Layer
- Each agent type has distinct behavior models (institutional: large hidden orders, market maker: spread maintenance, retail: noise trading)

**Tech Stack:**
| Technology | Role |
|-----------|------|
| Python | Simulation engine, agent logic |
| FastAPI | Backend API, WebSocket endpoints |
| Next.js | Frontend dashboard |
| TypeScript | Type-safe frontend |

**How It Works:**
1. Multiple autonomous agents (representing different trader archetypes) are instantiated
2. A simulated Limit Order Book (LOB) is initialized with configurable parameters
3. Each agent follows a perception-reasoning-execution loop:
   - **Perceive:** Read current market state (order book depth, recent trades, price history)
   - **Reason:** Apply strategy-specific logic to determine action
   - **Execute:** Submit orders (limit, market, cancel) to the LOB
4. The simulation engine matches orders using price-time priority
5. Liquidity shock detection monitors sudden drops in order book depth
6. Hidden order detection identifies patterns of institutional drip-feeding
7. Frontend dashboards visualize order book state, agent positions, and detected anomalies in real-time

**Key Concepts:**
| Concept | Explanation |
|---------|-------------|
| Multi-Agent Systems (MAS) | Autonomous agents with independent goals interacting in a shared environment |
| Market Microstructure | Study of how exchange mechanisms affect price discovery, transaction costs, and market quality |
| Limit Order Book (LOB) | A record of outstanding limit orders maintained by a security exchange; orders sorted by price-time priority |
| Liquidity Shock | A sudden, significant reduction in available liquidity (order book depth) causing price volatility |
| Hidden Institutional Orders | Large orders broken into smaller pieces (iceberg/drip) to minimize market impact |
| Price-Time Priority | Matching algorithm where orders are filled by best price first, then earliest time at same price |
| Information Asymmetry | Some agents have better/more information than others, affecting market fairness |
| Agent Archetypes | Different trader behavior models: informed traders, noise traders, market makers |

**Trade-offs & Decisions:**
- FastAPI chosen over Django for async WebSocket support and performance
- Multi-agent approach over single-model simulation for emergent behavior realism
- Next.js for SSR capabilities in dashboard visualization

**Target Audience:** Finance students, quantitative researchers, algo traders, fintech developers studying market microstructure

**Requirements:** Python 3.x, FastAPI, Node.js/npm, TypeScript

---

### 5.2 ENGRAM — Self-Hostable AI Memory Layer

**Repository:** https://github.com/macayu17/Engram

**Overview:**
Engram is a self-hostable AI memory layer. It sits between an application and an LLM provider, retrieves relevant user memories from pgvector, injects them into chat prompts, forwards the request, and extracts new durable memories after the response returns. It enables persistent, personalized context across AI conversations by automatically learning and recalling user preferences, decisions, and history.

**Architecture:**
Engram ships as a **4-service Docker Compose stack**:

- **`api`** — FastAPI proxy and REST API: The core service that intercepts LLM requests, queries for relevant memories, injects them into prompts, forwards to the LLM provider, and extracts new memories from responses
- **`postgres`** — PostgreSQL 16 with pgvector: Stores user data, memories, and vector embeddings in a `vector(384)` column for similarity search
- **`mcp`** — TypeScript MCP (Model Context Protocol) server: Enables AI coding agents (Claude Code, Cursor, etc.) to read/write memories as tools
- **`dashboard`** — Next.js developer console: Web UI for visualizing, searching, and managing stored memories with Clerk authentication

```
┌──────────────┐     ┌──────────────────────────────────┐     ┌─────────────┐
│  Application │────▶│          Engram API (FastAPI)     │────▶│ LLM Provider│
│  (Client)    │◀────│  ┌─────────────────────────────┐ │◀────│ (OpenAI etc)│
└──────────────┘     │  │ 1. Retrieve relevant memories│ │     └─────────────┘
                     │  │ 2. Inject into prompt        │ │
┌──────────────┐     │  │ 3. Forward to LLM            │ │     ┌─────────────┐
│  MCP Server  │────▶│  │ 4. Extract new memories      │ │     │  PostgreSQL  │
│ (TypeScript) │◀────│  └─────────────────────────────┘ │◀───▶│  + pgvector  │
└──────────────┘     └──────────────────────────────────┘     └─────────────┘
                                    ▲
┌──────────────┐                    │
│  Dashboard   │────────────────────┘
│  (Next.js)   │  (Clerk Auth + ENGRAM_SERVICE_KEY)
└──────────────┘
```

**Tech Stack:**
| Technology | Role |
|-----------|------|
| Python | Core API language |
| FastAPI | LLM proxy server, REST API, memory extraction pipeline |
| PostgreSQL 16 | Primary database for users, memories, metadata |
| pgvector | Vector similarity search extension for semantic memory retrieval |
| TypeScript | MCP server implementation |
| Next.js | Dashboard developer console |
| Clerk | Authentication and user management for dashboard |
| Docker / Docker Compose | Containerized deployment of all 4 services |
| Supabase (optional) | Alternative managed PostgreSQL + pgvector hosting |

**How It Works:**
1. **User Creation:** A user is registered via the API (`POST /users`), receiving a one-time API key. Engram stores only a hash of the key.
2. **Conversation Proxy:** Client sends a chat request to Engram's `/v1/chat` endpoint with headers: `X-Engram-Key`, `X-Engram-User-ID`, `X-Engram-Provider`
3. **Memory Retrieval:** Before forwarding, Engram queries pgvector for semantically relevant memories for that user, using vector similarity search on `vector(384)` embeddings
4. **Prompt Injection:** Retrieved memories are injected into the conversation context (system prompt or message history)
5. **LLM Forwarding:** The enriched request is forwarded to the specified LLM provider (e.g., OpenAI)
6. **Response Return:** The LLM response is returned to the client
7. **Memory Extraction:** Asynchronously, Engram analyzes the conversation and extracts new durable memories (preferences, facts, decisions) to store for future retrieval
8. **Dashboard Access:** Users can inspect, search, and manage memories via the Next.js dashboard at `localhost:3001` using Clerk auth
9. **MCP Integration:** AI coding agents can read/write memories via the MCP server, enabling persistent context across coding sessions

**Key Concepts:**
| Concept | Explanation |
|---------|-------------|
| Vector Embeddings | Dense numerical representations of text in high-dimensional space (`vector(384)`), enabling semantic similarity comparison |
| pgvector | PostgreSQL extension that adds vector similarity search, supporting operations like cosine distance, inner product, and L2 distance on embedding columns |
| Semantic Memory Retrieval | Finding relevant memories by meaning (not keyword match) using vector similarity search — "I like Python" matches "preferred programming language" |
| LLM Proxy Pattern | Intercepting requests between client and LLM to add middleware functionality (memory injection) without modifying the client or LLM |
| Memory Extraction | Automatically identifying and persisting durable facts/preferences from conversations using LLM analysis |
| Model Context Protocol (MCP) | Anthropic's open standard for AI agents to interact with external tools and data sources via a standardized interface |
| API Key Hashing | Storing only the hash of API keys (not plaintext) for security — key is shown once at creation and never recoverable |
| Service-to-Service Authentication | `ENGRAM_SERVICE_KEY` enables secure internal communication between dashboard and API without exposing credentials to browsers |
| Docker Compose Orchestration | Defining and running multi-container applications with service dependencies, networking, and environment management |
| Self-Hosting | Deploying on your own infrastructure for full data ownership and privacy control |

**Trade-offs & Decisions:**
- **FastAPI proxy over SDK/library approach:** Transparent interception requires zero client code changes — any app speaking OpenAI-compatible API format works
- **pgvector over dedicated vector DB (Pinecone, Weaviate):** Keeps everything in a single PostgreSQL instance, simplifying deployment and backup; sufficient for per-user memory volumes
- **`vector(384)` dimension:** Optimized for lightweight embedding models (e.g., `all-MiniLM-L6-v2`), balancing quality and performance
- **Clerk for auth over custom auth:** Production-grade auth with minimal implementation effort; handles sessions, OAuth, and account management
- **Docker Compose over Kubernetes:** Right-sized for self-hosting; simple single-command deployment without K8s complexity
- **Supabase as optional backend:** Provides managed PostgreSQL + pgvector for users who don't want to run their own database
- **Separate MCP server (TypeScript) from API (Python):** MCP SDK ecosystem is strongest in TypeScript; allows independent scaling and development

**Target Audience:** AI developers, developers building personalized AI assistants, teams wanting persistent memory across LLM interactions, MCP tool builders, anyone building AI-powered applications that need user context

**Requirements:** Docker, Docker Compose, OpenAI API key (or compatible LLM provider), Clerk account (for dashboard auth), optionally Supabase account for managed PostgreSQL

---

### 5.3 TEXT-BASED PARKINSON'S SCREENING — Clinical ML Screening Platform

**Repository:** https://github.com/macayu17 _(exact repo name TBD)_

**Overview:**
A clinical machine learning screening platform for early Parkinson's Disease (PD) detection. Uses a transformer-based model trained on approximately 42,000 patient records to analyze text-based clinical data and predict Parkinson's risk in a non-invasive manner. Designed as a decision-support tool for healthcare professionals.

**Architecture:**
- **Model Layer:** Custom transformer-based deep learning model (PyTorch) for binary classification
- **Inference API:** Flask web server serving the trained model for real-time predictions
- **Pipeline:** Data Ingestion → Preprocessing & Feature Extraction → Tokenization → Transformer Inference → Risk Score Output
- Standard ML pipeline with training/evaluation/deployment phases

**Tech Stack:**
| Technology | Role |
|-----------|------|
| Python | Core language |
| PyTorch | Deep learning framework, model training & inference |
| Transformers | Transformer architecture implementation |
| Flask | Web API for serving predictions |
| pandas | Data manipulation & preprocessing |
| NumPy | Numerical computation |
| scikit-learn | Preprocessing utilities, evaluation metrics |

**How It Works:**
1. Clinical text/patient records are ingested (structured data from ~42K patients)
2. Data preprocessing: cleaning, normalization, handling missing values
3. Feature extraction and tokenization for transformer input
4. Transformer model processes input using multi-head self-attention:
   - Input embeddings → Positional encoding → Multi-head attention → Feed-forward → Output layer
5. Model outputs a screening prediction (Parkinson's risk score / classification)
6. Flask API accepts patient data via HTTP POST, returns prediction with confidence score
7. Results presented as decision-support (NOT a diagnostic tool)

**Key Concepts:**
| Concept | Explanation |
|---------|-------------|
| Transformer Architecture | Neural network architecture using self-attention mechanisms to process sequential data without recurrence |
| Self-Attention | Mechanism that allows each position in a sequence to attend to all other positions, capturing dependencies regardless of distance |
| Multi-Head Attention | Running multiple attention operations in parallel, each learning different aspects of the input relationships |
| Transfer Learning | Leveraging pre-trained model weights and fine-tuning on domain-specific (clinical) data |
| Binary Classification | Predicting one of two outcomes (Parkinson's positive/negative screening) |
| Positional Encoding | Adding position information to input embeddings since transformers have no inherent notion of order |
| Clinical NLP | Natural Language Processing applied to medical/clinical text data |
| Model Inference | Using a trained model to make predictions on new, unseen data |
| Sensitivity/Specificity | Medical ML evaluation metrics — true positive rate vs. true negative rate |

**Trade-offs & Decisions:**
- Transformer over LSTM/RNN for better long-range dependency capture in clinical records
- Flask over FastAPI for simplicity (inference-only server, no async needed)
- Binary classification over regression for clearer clinical decision support
- 42K patient dataset provides good training volume but may have class imbalance challenges

**Target Audience:** Healthcare professionals, clinical researchers, medical AI developers, neurologists

**Requirements:** Python 3.x, PyTorch, Transformers, Flask, GPU recommended for training (CPU ok for inference), pandas, numpy, scikit-learn

---

### 5.4 OCCASIO — Event Management & Booking Platform

**Repository:** https://github.com/macayu17/Occasio

**Overview:**
A full-featured event management and booking platform handling the complete event lifecycle — from event creation and registrations to payment processing, digital ticketing, check-in, analytics, and team collaboration workflows.

**Architecture:**
- **Frontend:** React + Vite — SPA with component-based architecture, Tailwind CSS for styling
- **Backend:** Node.js — RESTful API server with Express
- Client-server architecture with clear API boundaries
- Modular feature separation:
  - Registration Module → Payment Module → Ticketing Module → Check-in Module → Analytics Module → Team Management Module

**Tech Stack:**
| Technology | Role |
|-----------|------|
| React | Component-based frontend UI |
| Vite | Build tool & dev server (fast HMR) |
| Tailwind CSS | Utility-first CSS framework |
| Node.js | Backend runtime |
| Express (likely) | HTTP server & routing |

**How It Works:**
1. **Event Creation:** Organizers create events with details (name, date, venue, capacity, pricing tiers)
2. **Registration:** Attendees browse events, select ticket types, fill registration forms
3. **Payment Processing:** Integrated payment gateway processes transactions securely
4. **Ticketing:** System generates digital tickets with QR codes for confirmed registrations
5. **Check-in:** On event day, QR code scanner validates and marks attendance
6. **Analytics:** Real-time dashboard shows ticket sales, attendance rates, revenue, engagement metrics
7. **Team Management:** Role-based access control for organizer teams (admin, manager, volunteer)

**Key Concepts:**
| Concept | Explanation |
|---------|-------------|
| Event-Driven Architecture | System components communicate through events, enabling loose coupling and real-time updates |
| Payment Gateway Integration | Secure third-party payment processing (Razorpay/Stripe) with webhook callbacks |
| QR Code Ticketing | Encoding ticket data into QR codes for fast, scannable verification |
| Role-Based Access Control (RBAC) | Restricting system access based on user roles (admin, organizer, attendee) |
| RESTful API Design | Stateless HTTP API following REST conventions for resource operations |
| Real-Time Analytics | Live data aggregation and visualization of event metrics |
| SPA Architecture | Single Page Application — client-side routing, no full page reloads |
| Webhook Patterns | Server-to-server callbacks for async event notification (e.g., payment confirmation) |

**Trade-offs & Decisions:**
- React + Vite over Next.js: SPA sufficient, no SSR needed for an event management tool
- Tailwind over custom CSS: faster prototyping for complex UI layouts
- Node.js backend for JavaScript full-stack consistency

**Target Audience:** Event organizers, conference managers, college fest committees, corporate event teams

**Requirements:** Node.js, npm, React/Vite dev environment, payment gateway API keys

---

### 5.5 EQUITYFLOW — Real-Time Paper Trading Platform

**Repository:** https://github.com/macayu17/EquityFlow

**Overview:**
A real-time paper trading platform supporting stocks, Futures & Options (F&O), and commodities. Allows users to practice trading strategies in a risk-free environment using live market data. Features a contract-aware execution engine that understands different asset class rules.

**Architecture:**
- **Frontend:** Next.js + React + TypeScript — responsive trading UI with real-time data rendering
- **Backend:** FastAPI (Python) — async API for real-time market data, order processing, portfolio management
- WebSocket/SSE connections for live price feeds
- Contract-aware execution engine with asset-class-specific validation
- Portfolio state management with real-time P&L calculation

**Tech Stack:**
| Technology | Role |
|-----------|------|
| Next.js | Frontend framework with SSR |
| React | Component-based UI |
| TypeScript | Type-safe frontend |
| FastAPI | Async Python backend |
| WebSocket/SSE | Real-time price streaming |

**How It Works:**
1. **Data Feed:** Backend connects to live market data APIs for real-time pricing across asset classes
2. **Market View:** Frontend renders live price charts, order books, and watchlists via WebSocket streams
3. **Order Placement:** Users place buy/sell orders with parameters (quantity, price, order type)
4. **Validation:** Contract-aware engine validates orders:
   - Stocks: lot size 1, no expiry
   - F&O: specific lot sizes, expiry dates, margin requirements, strike prices
   - Commodities: contract specifications, trading hours
5. **Execution:** Orders matched at live market prices in virtual portfolio
6. **Portfolio Tracking:** Real-time P&L with mark-to-market calculations, position tracking
7. **Trade History:** Complete log of all trades with analytics

**Key Concepts:**
| Concept | Explanation |
|---------|-------------|
| Real-Time Data Streaming | Continuous data flow via WebSocket/SSE for live market prices without polling |
| Paper Trading | Simulated trading with virtual money using real market data |
| Contract-Aware Execution | Engine that understands instrument-specific rules (lot sizes, expiry, margin) |
| Futures & Options (F&O) | Derivative instruments with specific contract terms (strike, expiry, lot size) |
| Mark-to-Market (MTM) | Revaluing positions at current market price to calculate unrealized P&L |
| Order Types | Market orders (immediate execution), Limit orders (at specified price), Stop-loss orders |
| WebSocket Protocol | Full-duplex communication channel for real-time bi-directional data streaming |
| Async API Design | Non-blocking request handling (FastAPI async) for concurrent data stream processing |
| Portfolio Management | Tracking positions, calculating exposure, risk metrics, and performance attribution |

**Trade-offs & Decisions:**
- FastAPI over Express for async Python data processing with financial APIs
- Next.js for SSR to improve initial load of data-heavy trading dashboard
- WebSocket over polling for sub-second price updates
- TypeScript for type safety critical in financial calculations

**Target Audience:** Aspiring traders, finance students, stock market beginners, algo trading enthusiasts

**Requirements:** Python 3.x, FastAPI, Node.js/npm, TypeScript, live market data API access

---

### 5.6 GRIDPULSE — Formula 1 Telemetry Analytics & Replay Platform

**Repository:** https://github.com/macayu17/GridPulse

**Overview:**
A Formula 1 telemetry analytics and replay platform for ingesting, visualizing, and monitoring race telemetry data. Provides interactive charts and replays of F1 race data including speed traces, throttle/brake analysis, lap comparisons, and tire strategy visualization.

**Architecture:**
- **Frontend:** React + D3.js — rich, interactive SVG-based telemetry visualizations
- **Backend:** FastAPI (Python) — data ingestion API and processing pipeline
- **Infrastructure:** Docker for containerized deployment
- Data pipeline: Raw Telemetry Ingestion → Processing/Normalization → Storage → Visualization API → Frontend Rendering
- Likely uses FastF1 Python library or OpenF1 API for F1 data sourcing

**Tech Stack:**
| Technology | Role |
|-----------|------|
| FastAPI | Backend API & data pipeline |
| Python | Data processing & ingestion |
| React | Frontend framework |
| D3.js | Custom interactive data visualizations |
| Docker | Containerized deployment |
| FastF1/OpenF1 | F1 telemetry data source |

**How It Works:**
1. **Data Ingestion:** Backend fetches F1 telemetry data from APIs (FastF1/OpenF1) or accepts uploaded datasets
2. **Processing:** Raw telemetry is cleaned, normalized, and structured:
   - Time-series alignment across channels (speed, throttle, brake, gear, RPM)
   - Lap segmentation and sector splitting
   - Driver comparison alignment
3. **Storage:** Processed data stored in structured format for efficient querying
4. **API Layer:** FastAPI serves processed telemetry via REST endpoints with filtering/aggregation
5. **Visualization:** D3.js renders interactive charts:
   - Speed trace overlays (multiple drivers)
   - Throttle/brake application maps
   - Gear usage distribution
   - Tire degradation curves
   - Lap time progression
6. **Replay Mode:** Chronological playback of race data with synchronized visualizations
7. **Monitoring:** Real-time tracking during live sessions (when available)

**Key Concepts:**
| Concept | Explanation |
|---------|-------------|
| Time-Series Data Processing | Handling sequential, timestamped data points (telemetry channels at ~300Hz) |
| D3.js Data Visualization | Data-Driven Documents — binding data to DOM elements for custom SVG visualizations |
| Telemetry Analysis | Extracting insights from sensor data (speed, throttle, brake, G-force, tire temp) |
| Data Ingestion Pipeline | Automated flow: fetch → validate → transform → store → serve |
| Containerization (Docker) | Packaging application and dependencies into isolated, portable containers |
| SVG-Based Charting | Scalable Vector Graphics for resolution-independent, interactive charts |
| Real-Time Monitoring | Live data processing and visualization during active F1 sessions |
| Race Replay | Chronological playback engine synchronizing multiple data channels |

**Trade-offs & Decisions:**
- D3.js over Chart.js/Recharts for full control over custom F1 visualization types
- FastAPI for async data processing of large telemetry datasets
- Docker for reproducible deployment across environments
- React + D3 integration requires careful DOM management (D3 vs React rendering)

**Target Audience:** F1 enthusiasts, motorsport data analysts, racing engineers, sports analytics students

**Requirements:** Python 3.x, FastAPI, Node.js/npm, Docker, D3.js, FastF1 library or OpenF1 API

---

## 6. Design Requirements (Taste-Skill Compliant)

The UI must follow the **taste-skill** design system to ensure a premium, anti-generic aesthetic.

### 6.1 Three Dials Configuration

| Dial | Value | Rationale |
|------|-------|-----------|
| **DESIGN_VARIANCE** | 7 | Modern, editorial feel — this is a personal study tool but also portfolio-worthy |
| **MOTION_INTENSITY** | 5 | Balanced — meaningful animations without distraction during study |
| **VISUAL_DENSITY** | 6 | Dense enough for technical content but not overwhelming |

### 6.2 Color System

- ❌ NO pure black (`#000000`) — use Off-Black (`#0a0a0a`), Zinc-950, or Charcoal
- ❌ NO oversaturated accents — desaturated accent palette
- ❌ NO neon/outer glows — no generic `box-shadow` glows
- ❌ NO "AI Purple/Blue" neon gradient aesthetic
- ✅ Absolute neutral base: Zinc/Slate palette
- ✅ Background: `#f9fafb` (light) / `#09090b` (dark)
- ✅ Cards: Pure white (light) / Zinc-900 (dark) with subtle `border-slate-200/50`
- ✅ Accent: Single curated accent color (warm amber or cool teal) desaturated to blend

### 6.3 Typography

- ❌ BANNED: Inter, Roboto, Arial, Space Grotesk
- ✅ Primary font: **Geist** or **Outfit** or **Cabinet Grotesk** or **Satoshi**
- Headlines: `text-4xl md:text-6xl`, `tracking-tighter`, weight 600–700
- Body: `text-base leading-relaxed`, max-width ~65 characters
- Use `font-variant-numeric: tabular-nums` for stats/data
- Medium (500) and SemiBold (600) as primary weights

### 6.4 Layout

- ❌ NO generic 3-column card grids
- ✅ Asymmetric layouts, zig-zag patterns, masonry grids
- ✅ Bento grid layout for project overview cards
- ✅ `rounded-[2.5rem]` for major containers
- ✅ Diffusion shadows: `shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]`
- ✅ Huge vertical rhythm: `py-32 md:py-48` between sections
- ✅ Max-width container: `max-w-[1400px]`
- ✅ `min-h-[100dvh]` (NOT `h-screen`)
- ✅ CSS Grid over Flexbox for layout

### 6.5 Motion

- ✅ `scale-[0.98]` for tactile press feedback
- ✅ Spring physics: stiffness 100, damping 20
- ✅ Framer Motion for page transitions and component animations
- ✅ Scroll-triggered section reveals
- ❌ NO custom mouse cursors

### 6.6 Anti-Patterns

- ❌ NO "Jane Doe" placeholder content — use real project data
- ❌ NO AI copywriting clichés: "Elevate", "Seamless", "Unleash", "Next-Gen"
- ❌ NO meta-labels: "SECTION 01", "ABOUT US"
- ❌ NO Lucide icon placeholders
- ❌ NO fake statistics

---

## 7. Technical Architecture

### 7.1 Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS v4 |
| Animation | Framer Motion |
| Diagrams | Mermaid.js (rendered client-side) |
| Code Highlighting | Shiki or Prism |
| Search | Fuse.js (client-side fuzzy search) |
| State | React Context + localStorage for persistence |
| Deployment | Vercel |
| Font | Geist (from `next/font`) or Satoshi (self-hosted) |

### 7.2 Directory Structure

```
interview-prep-portal/
├── app/
│   ├── layout.tsx                    # Root layout with font, theme provider
│   ├── page.tsx                      # Landing / Dashboard
│   ├── projects/
│   │   ├── page.tsx                  # All projects grid
│   │   └── [slug]/
│   │       ├── page.tsx              # Project deep-dive page
│   │       └── flashcards/
│   │           └── page.tsx          # Flashcard mode for project
│   ├── concepts/
│   │   └── page.tsx                  # Concept glossary
│   ├── compare/
│   │   └── page.tsx                  # Comparison matrix
│   ├── search/
│   │   └── page.tsx                  # Search results page
│   └── study/
│       └── page.tsx                  # Study progress dashboard
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── SearchModal.tsx
│   ├── projects/
│   │   ├── ProjectCard.tsx
│   │   ├── ArchitectureDiagram.tsx
│   │   ├── TechStackBadge.tsx
│   │   ├── ConceptExplainer.tsx
│   │   ├── CodeHighlight.tsx
│   │   ├── SectionNav.tsx
│   │   └── FlowDiagram.tsx
│   ├── study/
│   │   ├── Flashcard.tsx
│   │   ├── QuizQuestion.tsx
│   │   ├── ProgressTracker.tsx
│   │   └── ConfidenceRating.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Badge.tsx
│       ├── Card.tsx
│       ├── Modal.tsx
│       ├── Tabs.tsx
│       ├── Accordion.tsx
│       └── Tooltip.tsx
├── data/
│   ├── projects/
│   │   ├── sentinel.ts
│   │   ├── engram.ts
│   │   ├── parkinsons.ts
│   │   ├── occasio.ts
│   │   ├── equityflow.ts
│   │   └── gridpulse.ts
│   ├── concepts.ts                   # All concepts with definitions
│   ├── questions.ts                  # Interview Q&A bank
│   └── flashcards.ts                 # Flashcard data
├── lib/
│   ├── search.ts                     # Fuse.js search config
│   ├── storage.ts                    # localStorage helpers
│   └── utils.ts                      # Utility functions
├── hooks/
│   ├── useTheme.ts
│   ├── useSearch.ts
│   ├── useProgress.ts
│   └── useKeyboard.ts
├── styles/
│   └── globals.css                   # Tailwind config + custom properties
├── public/
│   └── fonts/                        # Self-hosted fonts if needed
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
└── package.json
```

### 7.3 Data Model

Each project follows this TypeScript interface:

```typescript
interface Project {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  repo: string;
  status: "active" | "completed" | "ongoing";
  domain: string;

  architecture: {
    overview: string;
    diagram: string;              // Mermaid diagram string
    layers: ArchitectureLayer[];
  };

  techStack: TechItem[];
  
  howItWorks: {
    steps: WorkflowStep[];
    sequenceDiagram?: string;     // Mermaid sequence diagram
  };

  concepts: Concept[];
  
  codeHighlights: CodeSnippet[];
  
  apiDesign?: ApiEndpoint[];
  databaseDesign?: DatabaseSchema;
  
  tradeoffs: TradeOff[];
  challenges: Challenge[];
  
  requirements: string[];
  targetAudience: string[];
  futureImprovements: string[];

  interviewQuestions: InterviewQuestion[];
  flashcards: Flashcard[];
}

interface Concept {
  name: string;
  category: "ml" | "finance" | "web" | "systems" | "data" | "devops";
  definition: string;
  explanation: string;
  usedIn: string[];              // Project slugs
  relatedConcepts: string[];
}

interface InterviewQuestion {
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  category: "architecture" | "code" | "concepts" | "tradeoffs" | "behavioral";
}

interface Flashcard {
  front: string;
  back: string;
  project: string;
  concept?: string;
}
```

---

## 8. Page Specifications

### 8.1 Landing Page (`/`)

**Layout:** Full-viewport hero + scrolling project showcase

**Sections:**
1. **Hero:** Name, tagline ("Deep-diving into 6 projects, one architecture at a time"), animated gradient background
2. **Project Grid:** Bento-style asymmetric grid showing all 6 projects with preview cards
   - Each card: project name, domain badge, tech stack icons, one-line description
   - Hover: subtle scale + shadow elevation
   - Click: navigate to project deep-dive
3. **Quick Stats:** Animated counters — projects, technologies, concepts
4. **Study CTA:** Link to study progress dashboard

### 8.2 Project Deep-Dive (`/projects/[slug]`)

**Layout:** Sticky side navigation + scrolling content

**Sections (in order):**
1. Project header (name, tagline, domain, repo link)
2. Overview
3. Architecture (with Mermaid diagram)
4. Tech Stack (visual badge grid)
5. How It Works (numbered steps + flow diagram)
6. Key Concepts (expandable accordions)
7. Code Highlights (syntax-highlighted snippets)
8. API Design (if applicable)
9. Database Design (if applicable)
10. Trade-offs & Decisions
11. Challenges & Solutions
12. Requirements
13. Interview Q&A (collapsible answers)
14. Start Flashcard Mode (button → navigates to flashcard view)

**Sticky sidebar:** Section links with active state indicator + progress checkboxes

### 8.3 Concept Glossary (`/concepts`)

**Layout:** Filterable, searchable list

- Filter by domain (ML, Finance, Web, Systems, etc.)
- Each concept card: name, definition, "Used in: [project badges]"
- Click to expand full explanation
- Link to relevant project sections

### 8.4 Comparison Matrix (`/compare`)

**Layout:** Full-width responsive table

- Rows: Projects
- Columns: Domain, Frontend, Backend, Key Tech, Architecture Pattern, Complexity, Status
- Sortable columns
- Clickable project names → deep-dive page

### 8.5 Study Progress (`/study`)

**Layout:** Dashboard with progress rings and recent activity

- Per-project progress rings showing % of sections reviewed
- Overall progress bar
- "Last Studied" timestamps
- Quick-access buttons to resume studying
- Confidence heat map across concepts

---

## 9. Suggested Additional Features

These are features beyond the core that would make the platform exceptionally useful for interview prep:

| Feature | Description | Value |
|---------|-------------|-------|
| **"Tell Me About" Prompter** | Click a project → get a structured 2-min pitch script with Problem-Solution-Impact format | Practice elevator pitches |
| **Concept Cross-Reference Map** | Visual graph showing which concepts connect across projects | See breadth of knowledge |
| **Difficulty Progression** | Sort interview questions by difficulty, track mastery per level | Structured study path |
| **Mock Interview Timer** | Answer questions under time pressure (2-min timer per question) | Simulate interview pressure |
| **Notes & Annotations** | Add personal notes to any section (persisted in localStorage) | Customize study material |
| **Spaced Repetition Engine** | SM-2 algorithm for flashcard scheduling based on recall quality | Optimize memorization |
| **"What Would You Change?" Section** | For each project, document what you'd architect differently with hindsight | Shows growth mindset to interviewers |
| **System Design Mode** | Blank canvas to practice drawing architectures from memory, then compare with actual | Active recall practice |

---

## 10. Non-Functional Requirements

| Requirement | Specification |
|-------------|--------------|
| Performance | Lighthouse score > 90 for all categories |
| Responsive | Mobile-first, works on 320px to 2560px |
| Accessibility | WCAG 2.1 AA compliance |
| SEO | Proper meta tags, Open Graph, structured data |
| Offline | Service worker for offline study capability (P2) |
| Data Persistence | localStorage for progress, preferences, notes |
| Load Time | < 2s First Contentful Paint |
| Bundle Size | Code-split per route, lazy load heavy components |

---

## 11. Success Criteria

1. ✅ All 6 projects fully documented with every section populated
2. ✅ Can navigate to any concept/project in under 3 seconds
3. ✅ Flashcard and Q&A modes functional for self-testing
4. ✅ Study progress persists across sessions
5. ✅ UI follows taste-skill guidelines — zero "slop"
6. ✅ Works offline after first load (P2)
7. ✅ Can explain any project's architecture within 2 minutes using the platform



