import type { Project } from "@/lib/types";

export const sentinel: Project = {
  slug: "sentinel",
  name: "Sentinel",
  tagline: "Multi-agent market microstructure simulator for liquidity shocks and hidden order behavior.",
  description:
    "Sentinel models market participants inside a simulated limit order book so Ayush can study how institutional traders, market makers, and retail flow create emergent price behavior.",
  repo: "https://github.com/macayu17/Sentinel",
  status: "active",
  domain: "Financial simulation",
  domainColor:
    "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300",
  icon: "shield",
  architecture: {
    overview:
      "The system is layered around agent perception, strategy reasoning, order execution, and anomaly detection. A FastAPI backend owns the simulation loop while the Next.js dashboard renders book depth, agent positions, and liquidity alerts.",
    diagram: `graph TD
      UI[Next.js dashboard] --> API[FastAPI simulation API]
      API --> Engine[Simulation engine]
      Engine --> Book[Limit order book]
      Engine --> Agents[Agent population]
      Agents --> Perception[Data perception]
      Perception --> Reasoning[Strategy reasoning]
      Reasoning --> Execution[Order execution]
      Execution --> Book
      Book --> Detection[Shock and hidden order detection]
      Detection --> UI`,
    layers: [
      {
        name: "Visualization layer",
        description:
          "Interactive Next.js screens show live book depth, price movement, agent inventory, and anomaly flags.",
        technologies: ["Next.js", "TypeScript", "React"],
      },
      {
        name: "Simulation API layer",
        description:
          "FastAPI exposes simulation controls, scenario presets, and streaming endpoints for dashboard updates.",
        technologies: ["FastAPI", "Python", "WebSocket"],
      },
      {
        name: "Market engine layer",
        description:
          "The matching engine maintains bids, asks, cancellations, trade history, and price-time priority.",
        technologies: ["Python", "Order book structures"],
      },
      {
        name: "Agent intelligence layer",
        description:
          "Institutional, market maker, and retail archetypes run independent perceive-reason-execute loops.",
        technologies: ["Multi-agent simulation", "Strategy rules"],
      },
    ],
  },
  techStack: [
    {
      name: "Python",
      role: "Simulation engine, agent models, matching logic, and anomaly detectors.",
      category: "backend",
    },
    {
      name: "FastAPI",
      role: "Async API surface for starting simulations and streaming market state.",
      category: "backend",
    },
    {
      name: "Next.js",
      role: "Dashboard shell for scenario exploration and real-time visualization.",
      category: "frontend",
    },
    {
      name: "TypeScript",
      role: "Type-safe rendering of order book rows, event payloads, and metrics.",
      category: "frontend",
    },
  ],
  howItWorks: {
    summary:
      "A scenario starts with a configured order book and a population of agents. Each tick lets agents perceive state, choose actions, submit orders, and feed the resulting market events into detection logic.",
    steps: [
      {
        step: 1,
        title: "Initialize market state",
        description:
          "The engine creates a limit order book with starting liquidity, spread settings, tick size, and participant inventory.",
        details:
          "This gives every run a reproducible baseline before institutional or retail behavior changes the book.",
      },
      {
        step: 2,
        title: "Run agent loops",
        description:
          "Agents read depth, recent trades, volatility, and their own inventory before choosing limit, market, or cancel actions.",
      },
      {
        step: 3,
        title: "Match orders",
        description:
          "The matching engine applies price-time priority, updates queues, emits trades, and recalculates top-of-book state.",
      },
      {
        step: 4,
        title: "Detect market anomalies",
        description:
          "Liquidity shock logic watches depth collapse, while hidden-order logic watches repeated small prints that behave like a larger parent order.",
      },
      {
        step: 5,
        title: "Stream state to the dashboard",
        description:
          "The frontend receives book snapshots, trade events, and detection markers for interview-ready visual explanations.",
      },
    ],
    sequenceDiagram: `sequenceDiagram
      participant UI as Dashboard
      participant API as FastAPI
      participant Engine as Simulation Engine
      participant Agent as Agent
      participant LOB as Limit Order Book
      UI->>API: Start scenario
      API->>Engine: Configure run
      loop Each simulation tick
        Engine->>Agent: Market snapshot
        Agent->>Engine: Order intent
        Engine->>LOB: Submit order
        LOB-->>Engine: Trades and book state
      end
      Engine-->>UI: Stream metrics and alerts`,
  },
  concepts: [
    {
      name: "Limit Order Book",
      category: "finance",
      definition:
        "A live record of resting buy and sell limit orders sorted by price and time priority.",
      explanation:
        "A limit order book is the core exchange data structure. Bids are ranked from highest to lowest price, asks from lowest to highest, and orders at the same price are filled by arrival time.",
      relevance:
        "Sentinel uses the book as the shared environment where every autonomous trader competes for queue position and liquidity.",
    },
    {
      name: "Price-Time Priority",
      category: "finance",
      definition:
        "A matching rule that fills the best price first, then the oldest order at that price.",
      explanation:
        "This rule makes queue position valuable. Two orders at the same price do not have equal priority; the earlier order receives execution first.",
      relevance:
        "Sentinel's matching engine uses this rule to make agent behavior realistic enough for market microstructure interviews.",
    },
    {
      name: "Multi-Agent Systems",
      category: "systems",
      definition:
        "A system where independent actors with their own goals interact inside a shared environment.",
      explanation:
        "Multi-agent design is useful when global behavior emerges from local decisions. It is a better fit for markets than a single centralized model because each trader type can react differently.",
      relevance:
        "Sentinel separates institutional, market maker, and retail archetypes so liquidity shocks emerge from interaction, not from a hard-coded chart.",
    },
    {
      name: "Liquidity Shock",
      category: "finance",
      definition:
        "A sudden reduction in available order book depth that can amplify price movement.",
      explanation:
        "Liquidity shocks matter because a market can appear stable until resting depth disappears. The next market order then walks the book and moves price sharply.",
      relevance:
        "Sentinel monitors depth changes and flags moments where available liquidity collapses faster than normal trading noise.",
    },
    {
      name: "Hidden Institutional Order",
      category: "finance",
      definition:
        "A large parent order split into smaller child orders to reduce visible market impact.",
      explanation:
        "Institutions often avoid showing the full order size. Repeated small executions near similar prices can reveal a larger hidden intent.",
      relevance:
        "Sentinel studies drip-fed child-order patterns as a detection problem over trade prints and book replenishment.",
    },
  ],
  codeHighlights: [
    {
      title: "Price-time matching loop",
      description:
        "A compact version of the engine logic that fills marketable orders by best price and queue age.",
      language: "python",
      code: `def match_order(book, incoming):
    trades = []
    opposite_side = book.asks if incoming.side == "buy" else book.bids

    while incoming.quantity > 0 and opposite_side.is_marketable(incoming):
        resting = opposite_side.peek_best()
        filled = min(incoming.quantity, resting.quantity)
        trades.append(create_trade(incoming, resting, filled))

        incoming.quantity -= filled
        resting.quantity -= filled
        if resting.quantity == 0:
            opposite_side.pop_best()

    if incoming.quantity > 0 and incoming.type == "limit":
        book.add_resting_order(incoming)

    return trades`,
      annotations: [
        "The queue always checks the opposite side because buys match asks and sells match bids.",
        "Remaining limit quantity rests on the book; remaining market quantity does not.",
      ],
    },
    {
      title: "Liquidity shock signal",
      description:
        "Depth collapse is treated as a change-rate problem rather than a raw depth threshold.",
      language: "python",
      code: `def detect_liquidity_shock(previous_depth, current_depth, threshold=0.38):
    if previous_depth <= 0:
        return False

    drop_ratio = (previous_depth - current_depth) / previous_depth
    return drop_ratio >= threshold`,
      annotations: [
        "The ratio makes the detector work across different scenario sizes.",
        "A threshold near 0.38 catches abrupt depletion without flagging normal queue churn.",
      ],
    },
  ],
  apiDesign: {
    baseUrl: "http://localhost:8000",
    endpoints: [
      {
        method: "POST",
        path: "/simulation/start",
        description:
          "Creates a scenario run with agent mix, seed, tick count, and starting liquidity.",
        requestBody:
          '{ "seed": 42, "ticks": 1200, "institutionalAgents": 3, "retailAgents": 40 }',
        responseBody: '{ "runId": "sentinel-42", "status": "running" }',
      },
      {
        method: "GET",
        path: "/simulation/{runId}/snapshot",
        description:
          "Returns current best bid/ask, depth by level, agent inventory, and alert state.",
        responseBody:
          '{ "midPrice": 101.25, "spread": 0.05, "alerts": ["liquidity_shock"] }',
      },
      {
        method: "GET",
        path: "/simulation/{runId}/stream",
        description:
          "Streams book snapshots and trade events for the dashboard replay.",
      },
    ],
  },
  databaseDesign: {
    type: "In-memory simulation state",
    diagram: `erDiagram
      RUN ||--o{ ORDER : contains
      RUN ||--o{ TRADE : emits
      AGENT ||--o{ ORDER : submits
      ORDER ||--o{ TRADE : fills`,
    tables: [
      {
        name: "run_state",
        description:
          "Ephemeral simulation state keyed by run id, seed, tick count, and scenario configuration.",
        fields: ["run_id", "seed", "current_tick", "scenario_config"],
      },
      {
        name: "order_book",
        description:
          "Bid and ask queues grouped by price level and ordered by arrival sequence.",
        fields: ["order_id", "side", "price", "quantity", "timestamp", "agent_id"],
      },
      {
        name: "trade_log",
        description:
          "Execution events used by replay, metrics, and hidden-order detection.",
        fields: ["trade_id", "price", "quantity", "aggressor_side", "tick"],
      },
    ],
  },
  tradeoffs: [
    {
      decision: "Backend framework",
      chose: "FastAPI",
      over: "Django",
      reasoning:
        "FastAPI is lighter for a simulation API and gives async WebSocket support without pulling in Django's full ORM/admin stack.",
    },
    {
      decision: "Market realism model",
      chose: "Multiple agent archetypes",
      over: "Single aggregate price model",
      reasoning:
        "The purpose is to explain emergent microstructure behavior, so independent actors are more useful than one averaged process.",
    },
    {
      decision: "State persistence",
      chose: "In-memory run state",
      over: "Relational persistence for every tick",
      reasoning:
        "Simulations generate dense event streams. Keeping hot state in memory makes experimentation faster; durable storage can be added for saved runs.",
    },
  ],
  challenges: [
    {
      problem:
        "A naive order book can become slow when every tick scans all orders.",
      solution:
        "Separate queues by price level so the engine only inspects the best executable levels.",
      lesson:
        "Market simulators need data structures that match exchange rules, not generic arrays of orders.",
    },
    {
      problem:
        "Hidden orders are not directly visible because only child executions reach the tape.",
      solution:
        "Detect repeated small fills and replenishment patterns instead of searching for a single large order.",
      lesson:
        "A detector should measure observable behavior and clearly state what remains inferred.",
    },
  ],
  requirements: [
    "Python 3.x with FastAPI for the simulation API.",
    "Node.js and npm for the Next.js dashboard.",
    "Scenario presets that define agent mix, seed, and liquidity settings.",
    "Browser support for live dashboard rendering and streaming updates.",
  ],
  targetAudience: [
    "Finance students studying exchange mechanics.",
    "Quantitative researchers testing microstructure hypotheses.",
    "Fintech developers explaining order matching and liquidity risk.",
  ],
  futureImprovements: [
    "Persist selected simulation runs for replay and comparison.",
    "Add ABIDES-style event scheduling for more realistic time handling.",
    "Support custom agent strategy plug-ins from the dashboard.",
  ],
  interviewQuestions: [
    {
      question:
        "Why is a multi-agent simulator a better fit than a single price model for Sentinel?",
      answer:
        "A single price model can reproduce a path, but it hides the cause. Sentinel needs to explain how market makers, retail noise, and institutional slicing interact inside a limit order book. Multi-agent design lets liquidity shocks and hidden-order footprints emerge from local behavior.",
      difficulty: "medium",
      category: "architecture",
    },
    {
      question: "How does price-time priority affect agent strategy?",
      answer:
        "Agents care about both price and queue position. Posting at the best price is not enough if many older orders sit ahead of them. That creates realistic trade-offs between aggressive orders that pay spread and passive orders that wait for execution.",
      difficulty: "easy",
      category: "concepts",
    },
    {
      question:
        "What would you change if simulations needed to run for millions of ticks?",
      answer:
        "I would persist compressed event logs, move long-running jobs to a worker queue, keep only hot book state in memory, and stream downsampled metrics to the UI. I would also add deterministic seeds and checkpoints for reproducible debugging.",
      difficulty: "hard",
      category: "tradeoffs",
    },
  ],
  flashcards: [
    {
      front: "What is the shared environment in Sentinel?",
      back: "A simulated limit order book where autonomous trader agents submit, cancel, and match orders.",
      difficulty: "easy",
    },
    {
      front: "Why does Sentinel track depth changes instead of only price changes?",
      back: "Depth collapse can reveal liquidity risk before the next trade moves price sharply.",
      difficulty: "medium",
    },
    {
      front: "What makes hidden institutional orders hard to detect?",
      back: "Only child orders are visible, so the parent intent must be inferred from repeated execution and replenishment patterns.",
      difficulty: "hard",
    },
  ],
};
