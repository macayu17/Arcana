import type { Project } from "@/lib/types";

export const equityflow: Project = {
  slug: "equityflow",
  name: "EquityFlow",
  tagline: "Real-time paper trading workstation with contract-aware execution and live market streams.",
  description:
    "EquityFlow lets users practice stocks, futures, options, and commodity trading with virtual capital, live data streams, order validation, portfolio tracking, and market diagnostics.",
  repo: "https://github.com/macayu17/EquityFlow",
  status: "active",
  domain: "Trading platform",
  domainColor:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300",
  icon: "candlestick-chart",
  architecture: {
    overview:
      "The platform is split between a Next.js trading terminal and a FastAPI backend. The backend streams market data, validates instrument contracts, executes virtual orders, and recalculates positions and P&L.",
    diagram: `graph TD
      Terminal[Next.js terminal] --> API[FastAPI backend]
      API --> MarketData[Market data providers]
      API --> Stream[SSE price stream]
      Stream --> Terminal
      API --> Execution[Contract-aware execution engine]
      Execution --> Portfolio[Portfolio state]
      Execution --> Orders[Order ledger]
      Portfolio --> Terminal`,
    layers: [
      {
        name: "Trading terminal",
        description:
          "Dense market workspace with watchlists, order tickets, positions, trade history, and diagnostics.",
        technologies: ["Next.js", "React", "TypeScript"],
      },
      {
        name: "Market data layer",
        description:
          "Provider adapters fetch quotes and stream updates to the frontend through server-sent events.",
        technologies: ["FastAPI", "SSE", "Groww", "Upstox"],
      },
      {
        name: "Execution layer",
        description:
          "Validates order type, lot size, expiry, margin, and instrument-specific rules before simulating fills.",
        technologies: ["Python", "Contract metadata"],
      },
      {
        name: "Portfolio layer",
        description:
          "Maintains virtual cash, positions, mark-to-market P&L, risk, and order history.",
        technologies: ["FastAPI state", "Local persistence"],
      },
    ],
  },
  techStack: [
    {
      name: "Next.js",
      role: "Trading workstation UI with SSR-friendly routing and dense data surfaces.",
      category: "frontend",
    },
    {
      name: "TypeScript",
      role: "Typed order tickets, positions, quote payloads, and UI state.",
      category: "frontend",
    },
    {
      name: "FastAPI",
      role: "Async backend for quotes, execution, portfolios, and diagnostics.",
      category: "backend",
    },
    {
      name: "Server-Sent Events",
      role: "Live price updates without repeated polling.",
      category: "backend",
    },
    {
      name: "Groww / Upstox adapters",
      role: "Market data provider integration and fallback strategy.",
      category: "library",
    },
  ],
  howItWorks: {
    summary:
      "The user watches live instruments, places virtual orders, the backend validates contract rules, simulates fills at market prices, and streams portfolio changes back to the terminal.",
    steps: [
      {
        step: 1,
        title: "Load instruments",
        description:
          "The backend exposes stocks, F&O contracts, and commodities with metadata such as lot size, expiry, and tick size.",
      },
      {
        step: 2,
        title: "Stream market prices",
        description:
          "The terminal opens an SSE connection so active watchlist prices update as quote events arrive.",
      },
      {
        step: 3,
        title: "Validate order ticket",
        description:
          "The backend checks order side, quantity, lot size, expiry, margin, and stop-loss rules.",
      },
      {
        step: 4,
        title: "Simulate execution",
        description:
          "Orders are filled virtually according to type and current quote, then written to the order ledger.",
      },
      {
        step: 5,
        title: "Update portfolio",
        description:
          "Positions, realized P&L, unrealized P&L, exposure, and cash are recalculated after fills and quote changes.",
      },
    ],
    sequenceDiagram: `sequenceDiagram
      participant UI as Trading UI
      participant API as FastAPI
      participant Feed as Market Feed
      participant Exec as Execution Engine
      UI->>API: Subscribe watchlist
      API->>Feed: Fetch quotes
      API-->>UI: SSE quote updates
      UI->>API: Place order
      API->>Exec: Validate and simulate
      Exec-->>API: Fill and position change
      API-->>UI: Updated portfolio`,
  },
  concepts: [
    {
      name: "Paper Trading",
      category: "finance",
      definition:
        "Simulated trading with virtual money while using real or realistic market data.",
      explanation:
        "Paper trading lets users practice order placement, risk management, and strategy behavior without risking capital.",
      relevance:
        "EquityFlow executes orders against live quotes but updates a virtual portfolio instead of a brokerage account.",
    },
    {
      name: "Server-Sent Events",
      category: "web",
      definition:
        "A one-way HTTP streaming mechanism for server-to-browser events.",
      explanation:
        "SSE is simpler than WebSockets when the browser only needs to receive a continuous stream of market updates from the backend.",
      relevance:
        "EquityFlow uses SSE to stream watchlist quotes and portfolio updates with less overhead than repeated polling.",
    },
    {
      name: "Contract-Aware Execution",
      category: "finance",
      definition:
        "Order validation that understands instrument-specific trading rules.",
      explanation:
        "Stocks, futures, options, and commodities differ in lot size, expiry, margin, strike, and trading hours. Execution logic must validate those constraints before fills.",
      relevance:
        "EquityFlow rejects invalid quantities or expired F&O contracts before they affect the virtual portfolio.",
    },
    {
      name: "Mark-to-Market",
      category: "finance",
      definition:
        "Revaluing open positions at the current market price.",
      explanation:
        "MTM separates realized P&L from unrealized exposure and gives a current view of portfolio value as prices move.",
      relevance:
        "EquityFlow recalculates unrealized P&L from live quotes in the trading terminal.",
    },
    {
      name: "Async API Design",
      category: "systems",
      definition:
        "A backend design that handles concurrent I/O without blocking request processing.",
      explanation:
        "Market data fetching, streaming, and order requests can happen concurrently. Async endpoints keep the backend responsive under live update load.",
      relevance:
        "FastAPI fits EquityFlow because quote streams and portfolio APIs need non-blocking behavior.",
    },
  ],
  codeHighlights: [
    {
      title: "Contract-aware order validation",
      description:
        "The execution engine rejects orders that do not satisfy instrument metadata.",
      language: "python",
      code: `def validate_order(order, instrument):
    if instrument.expiry and instrument.expiry < today():
        raise ValueError("Instrument contract has expired")

    if order.quantity % instrument.lot_size != 0:
        raise ValueError("Quantity must be a multiple of lot size")

    if order.type == "stop_loss" and order.trigger_price is None:
        raise ValueError("Stop-loss orders require a trigger price")

    required_margin = estimate_margin(order, instrument)
    if order.account.available_margin < required_margin:
        raise ValueError("Insufficient margin")

    return True`,
      annotations: [
        "The same order ticket means different things for stocks, options, futures, and commodities.",
        "Validation happens before virtual portfolio mutation.",
      ],
    },
    {
      title: "SSE quote stream",
      description:
        "The backend sends quote updates as server-sent events for the active watchlist.",
      language: "python",
      code: `async def quote_stream(symbols):
    while True:
        quotes = await market_data.get_quotes(symbols)
        payload = json.dumps({"type": "quotes", "quotes": quotes})
        yield f"data: {payload}\\n\\n"
        await asyncio.sleep(1.5)`,
      annotations: [
        "SSE is adequate because the client receives market updates and sends orders through normal HTTP.",
        "The interval is tuned for freshness without hammering upstream providers.",
      ],
    },
  ],
  apiDesign: {
    baseUrl: "http://localhost:8000/api",
    endpoints: [
      {
        method: "GET",
        path: "/instruments",
        description:
          "Lists tradable stocks, F&O contracts, commodities, and metadata.",
      },
      {
        method: "GET",
        path: "/market/stream",
        description:
          "Streams live quote updates for selected symbols through SSE.",
      },
      {
        method: "POST",
        path: "/orders",
        description:
          "Validates and simulates an order against current market data.",
        requestBody:
          '{ "symbol": "RELIANCE", "side": "buy", "quantity": 10, "type": "market" }',
        responseBody:
          '{ "orderId": "ord_418", "status": "filled", "averagePrice": 1432.6 }',
      },
      {
        method: "GET",
        path: "/portfolio",
        description:
          "Returns cash, positions, realized P&L, unrealized P&L, and exposure.",
      },
    ],
  },
  databaseDesign: {
    type: "Backend state and local browser persistence",
    diagram: `erDiagram
      ACCOUNT ||--o{ ORDER : places
      ACCOUNT ||--o{ POSITION : holds
      INSTRUMENT ||--o{ ORDER : trades
      INSTRUMENT ||--o{ POSITION : values`,
    tables: [
      {
        name: "instruments",
        description:
          "Tradable metadata including symbol, asset class, lot size, expiry, and tick size.",
        fields: ["symbol", "asset_class", "lot_size", "expiry", "tick_size"],
      },
      {
        name: "orders",
        description:
          "Virtual order ledger with side, type, status, quantity, and fill price.",
        fields: ["order_id", "symbol", "side", "type", "quantity", "status", "average_price"],
      },
      {
        name: "positions",
        description:
          "Current holdings with cost basis, quantity, and mark-to-market value.",
        fields: ["symbol", "quantity", "average_cost", "last_price", "unrealized_pnl"],
      },
    ],
  },
  tradeoffs: [
    {
      decision: "Realtime transport",
      chose: "Server-Sent Events",
      over: "Polling",
      reasoning:
        "SSE keeps quote updates fresh without requiring every card to poll repeatedly. The order path can remain normal HTTP.",
    },
    {
      decision: "Backend language",
      chose: "FastAPI",
      over: "Express",
      reasoning:
        "The data and execution logic is Python-heavy, and FastAPI handles concurrent market data I/O cleanly.",
    },
    {
      decision: "Validation model",
      chose: "Contract-aware rules",
      over: "Generic buy/sell form",
      reasoning:
        "A trading simulator that ignores lot sizes, expiry, and margin teaches the wrong behavior for F&O and commodities.",
    },
  ],
  challenges: [
    {
      problem:
        "Live provider data can be stale, delayed, or unavailable for specific symbols.",
      solution:
        "Add provider preference, freshness checks, and fallback behavior instead of showing stale prices as current.",
      lesson:
        "Market UIs need to make data freshness visible, not hide it behind a nice chart.",
    },
    {
      problem:
        "Different asset classes make one-size-fits-all order validation unsafe.",
      solution:
        "Use instrument metadata to validate each order before execution.",
      lesson:
        "Financial correctness belongs in backend rules, not just frontend form constraints.",
    },
  ],
  requirements: [
    "Node.js and npm for the Next.js frontend.",
    "Python 3.x with FastAPI for backend APIs.",
    "Market data provider access or configured fallback quotes.",
    "Instrument metadata for stocks, F&O, and commodity contracts.",
  ],
  targetAudience: [
    "Aspiring traders practicing without capital risk.",
    "Finance students learning order types and portfolio behavior.",
    "Developers discussing real-time financial system design.",
  ],
  futureImprovements: [
    "Add strategy backtesting against stored historical data.",
    "Persist accounts, orders, and positions in a database.",
    "Add risk controls such as max drawdown, exposure caps, and scenario replay.",
  ],
  interviewQuestions: [
    {
      question: "Why did EquityFlow choose SSE for quotes?",
      answer:
        "The browser mostly needs one-way quote updates while orders can use HTTP. SSE is simpler than WebSockets, reconnects naturally, and avoids repeated polling for every symbol.",
      difficulty: "medium",
      category: "tradeoffs",
    },
    {
      question: "What does contract-aware execution protect against?",
      answer:
        "It prevents invalid virtual trades such as wrong lot sizes, expired contracts, missing stop triggers, or orders that exceed available margin.",
      difficulty: "easy",
      category: "concepts",
    },
    {
      question: "How would you make paper trading closer to real execution?",
      answer:
        "I would model bid-ask spread, slippage, partial fills, latency, market hours, order queue priority, and provider-specific data freshness.",
      difficulty: "hard",
      category: "architecture",
    },
  ],
  flashcards: [
    {
      front: "What transport streams EquityFlow's live quote updates?",
      back: "Server-Sent Events from the FastAPI backend to the Next.js terminal.",
      difficulty: "easy",
    },
    {
      front: "Why does the execution engine need instrument metadata?",
      back: "It validates lot size, expiry, tick size, margin, and asset-class rules before fills.",
      difficulty: "medium",
    },
    {
      front: "What is mark-to-market P&L?",
      back: "The current unrealized value of open positions based on latest market prices.",
      difficulty: "medium",
    },
  ],
};
