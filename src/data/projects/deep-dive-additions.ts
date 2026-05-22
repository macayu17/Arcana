import type { Project } from "@/lib/types";

type ArchitectureLayer = Project["architecture"]["layers"][number];
type TechStackItem = Project["techStack"][number];
type HowItWorksStep = Project["howItWorks"]["steps"][number];
type Concept = Project["concepts"][number];
type CodeHighlight = Project["codeHighlights"][number];
type ApiEndpoint = NonNullable<Project["apiDesign"]>["endpoints"][number];
type DatabaseTable = NonNullable<Project["databaseDesign"]>["tables"][number];
type Tradeoff = Project["tradeoffs"][number];
type Challenge = Project["challenges"][number];
type InterviewQuestion = Project["interviewQuestions"][number];
type Flashcard = Project["flashcards"][number];

interface ProjectDeepDiveAddition {
  descriptionAppend?: string;
  architectureOverviewAppend?: string;
  layers?: ArchitectureLayer[];
  techStack?: TechStackItem[];
  howItWorksSteps?: HowItWorksStep[];
  concepts?: Concept[];
  codeHighlights?: CodeHighlight[];
  apiEndpoints?: ApiEndpoint[];
  databaseTables?: DatabaseTable[];
  tradeoffs?: Tradeoff[];
  challenges?: Challenge[];
  requirements?: string[];
  futureImprovements?: string[];
  interviewQuestions?: InterviewQuestion[];
  flashcards?: Flashcard[];
}

const additions: Record<string, ProjectDeepDiveAddition> = {
  sentinel: {
    descriptionAppend:
      " Interview focus: be ready to explain the event-driven simulation loop, price-time matching, WebSocket update model, agent latency, market maker inventory, optional PPO or genetic-programming policies, live-shadow data replay, and why simulator state is kept in a single long-running backend process.",
    architectureOverviewAppend:
      " The source repo also documents an event kernel that schedules agent wakeups and order arrivals, specialized agents beyond the basic three archetypes, predictor endpoints for liquidity and large-order signals, a Zustand-powered dashboard store, and deployment limits caused by in-memory simulator state and WebSocket streaming.",
    layers: [
      {
        name: "Realtime transport layer",
        description:
          "A WebSocket endpoint broadcasts market updates so the dashboard can render price, depth, liquidity, large-order, and agent panels without polling every metric separately.",
        technologies: ["FastAPI WebSockets", "Zustand", "Recharts"],
      },
      {
        name: "Policy experimentation layer",
        description:
          "Optional PPO and genetic-programming market-maker policies can be loaded locally to compare rule-based agents against trained policies without making production startup heavy.",
        technologies: ["Gymnasium", "PPO", "Genetic programming"],
      },
    ],
    techStack: [
      {
        name: "Zustand",
        role: "Frontend store for live market state, connection status, dashboard panels, and buffered WebSocket updates.",
        category: "library",
      },
      {
        name: "Recharts",
        role: "Charting layer for price curves, liquidity gauges, and dashboard time-series panels.",
        category: "library",
      },
      {
        name: "Gymnasium",
        role: "Training environment interface for optional reinforcement-learning market-maker policies.",
        category: "ml",
      },
      {
        name: "Groww / Upstox live shadow",
        role: "Provider-backed replay path for comparing synthetic simulator behavior with market-data shaped scenarios.",
        category: "library",
      },
    ],
    howItWorksSteps: [
      {
        step: 6,
        title: "Schedule wakeups and latency",
        description:
          "The event kernel schedules agent wakeups, order arrivals, and simulated latencies so not every participant reacts at the same instant.",
        details:
          "This matters in interviews because latency and sequencing change queue position, spread capture, and the realism of HFT or market-maker behavior.",
      },
      {
        step: 7,
        title: "Publish WebSocket packets",
        description:
          "After each meaningful state update, the backend broadcasts market state, prediction scores, and agent metrics to the dashboard over a live socket.",
        details:
          "The REST endpoints are useful for snapshots and controls, but the socket is the right path for high-frequency dashboard updates.",
      },
      {
        step: 8,
        title: "Optionally compare trained policies",
        description:
          "Local runs can load PPO or GP market-maker policies through environment flags, then compare their behavior against deterministic rule agents.",
        details:
          "PPO is disabled by default for deployment speed, which is an important tradeoff between demo reliability and ML sophistication.",
      },
    ],
    concepts: [
      {
        name: "Event-Driven Simulation Kernel",
        category: "systems",
        definition:
          "A simulator core that advances by scheduled events rather than by one synchronous loop for every component.",
        explanation:
          "An event kernel lets each agent wake up, observe, and act at different simulated times. This is closer to real markets than forcing every trader to submit exactly once per tick.",
        relevance:
          "Sentinel uses event scheduling to model order arrivals, agent latency, and asynchronous market updates.",
      },
      {
        name: "Reinforcement Learning Policy Controller",
        category: "ml",
        definition:
          "A controller that loads a trained policy and uses it to choose simulation actions from observed state.",
        explanation:
          "A PPO policy can learn a mapping from inventory, spread, depth, and price movement to market-making actions. It must still be constrained by risk controls and simulator rules.",
        relevance:
          "Sentinel can optionally load PPO market-maker artifacts for local experiments while keeping deployment defaults lightweight.",
      },
      {
        name: "Genetic Programming Baseline",
        category: "ml",
        definition:
          "An evolutionary search method that evolves decision rules over generations.",
        explanation:
          "Genetic programming is useful as an interpretable baseline because the resulting policy can be inspected as a rule instead of only as neural weights.",
        relevance:
          "Sentinel supports a GP market-maker policy artifact so trained behavior can be compared with PPO and hand-written strategies.",
      },
      {
        name: "WebSocket Backpressure",
        category: "systems",
        definition:
          "The risk that a producer sends realtime events faster than clients or the network can consume them.",
        explanation:
          "Realtime dashboards need buffering, throttling, or packet coalescing because raw simulator ticks can exceed the rate a browser should render.",
        relevance:
          "Sentinel's frontend buffers live updates and flushes state on a timer to avoid over-rendering the dashboard.",
      },
      {
        name: "Market Maker Inventory Risk",
        category: "finance",
        definition:
          "The risk that a liquidity provider accumulates an unwanted long or short position while quoting both sides.",
        explanation:
          "A market maker earns spread but can be hurt when order flow is one-sided. Inventory limits and quote skewing reduce that exposure.",
        relevance:
          "Sentinel agents track positions and P&L so market makers can react to inventory instead of blindly posting symmetric quotes.",
      },
    ],
    codeHighlights: [
      {
        title: "WebSocket update coalescing",
        description:
          "Dashboard updates should be buffered so the UI renders the newest state at a controlled cadence instead of re-rendering for every simulator packet.",
        language: "typescript",
        code: `const latestPacketRef = useRef<MarketUpdate | null>(null);

socket.onmessage = (event) => {
  latestPacketRef.current = JSON.parse(event.data) as MarketUpdate;
};

window.setInterval(() => {
  const packet = latestPacketRef.current;
  if (!packet) return;
  marketStore.setState({
    snapshot: packet.snapshot,
    liquiditySignal: packet.liquiditySignal,
    agentMetrics: packet.agentMetrics,
    connectionState: "live",
  });
}, 250);`,
        annotations: [
          "Only the latest packet is rendered, which protects the browser during dense simulation bursts.",
          "This is a UI performance decision, not a backend correctness shortcut.",
        ],
      },
      {
        title: "Policy loading guard",
        description:
          "The runtime can keep ML policy support optional so production startup does not depend on large training dependencies.",
        language: "python",
        code: `def load_policy(settings):
    if not settings.RL_POLICY_ENABLED:
        return RuleBasedMarketMaker()

    if settings.RL_POLICY_KIND == "ppo":
        return PpoPolicy.load(settings.RL_MODEL_PATH)

    if settings.RL_POLICY_KIND == "gp":
        return GeneticProgramPolicy.load(settings.RL_MODEL_PATH)

    raise ValueError("Unsupported RL_POLICY_KIND")`,
        annotations: [
          "Feature flags keep local research paths separate from the default deployment path.",
          "The simulator can fall back to deterministic behavior when model artifacts are unavailable.",
        ],
      },
    ],
    apiEndpoints: [
      {
        method: "POST",
        path: "/api/simulation/mode",
        description:
          "Switches between synthetic simulation and live-shadow replay behavior without changing the dashboard contract.",
        requestBody: '{ "mode": "LIVE_SHADOW", "provider": "upstox" }',
        responseBody: '{ "mode": "LIVE_SHADOW", "status": "ready" }',
      },
      {
        method: "GET",
        path: "/api/prediction/large-order",
        description:
          "Returns the large-order or iceberg-style detection signal computed from recent order-flow statistics.",
        responseBody: '{ "warningLevel": "medium", "score": 0.64, "patterns": ["twap_like_child_orders"] }',
      },
      {
        method: "GET",
        path: "/api/agents/metrics",
        description:
          "Returns per-agent inventory, P&L, order counts, and strategy health metrics for the dashboard.",
      },
      {
        method: "POST",
        path: "/api/live-shadow/upstox/ltp",
        description:
          "Fetches live last-traded-price data for selected Upstox instruments used by live-shadow scenarios.",
      },
    ],
    databaseTables: [
      {
        name: "agent_metrics",
        description:
          "Per-agent metrics derived during a run: position, cash, P&L, active orders, fills, and risk counters.",
        fields: ["run_id", "agent_id", "agent_type", "position", "cash", "realized_pnl", "active_orders"],
      },
      {
        name: "prediction_snapshot",
        description:
          "Computed liquidity and large-order signals attached to a simulator tick for replay and debugging.",
        fields: ["run_id", "tick", "liquidity_score", "warning_level", "large_order_score", "features"],
      },
      {
        name: "live_shadow_candle",
        description:
          "Provider-derived market data normalized into simulator replay inputs when live-shadow mode is used.",
        fields: ["provider", "instrument_key", "timestamp", "open", "high", "low", "close", "volume"],
      },
    ],
    tradeoffs: [
      {
        decision: "Realtime channel",
        chose: "WebSocket feed",
        over: "REST polling",
        reasoning:
          "The dashboard needs fast-changing market state, prediction flags, and agent metrics. A socket avoids repeated HTTP overhead and keeps the UI connected to a long-running simulation.",
      },
      {
        decision: "Training dependency loading",
        chose: "Feature-flagged PPO/GP policies",
        over: "Always loading ML artifacts",
        reasoning:
          "Policy experiments are valuable locally, but production demos should start quickly and still work when heavy RL dependencies or model files are missing.",
      },
      {
        decision: "Simulator hosting",
        chose: "Long-running backend process",
        over: "Serverless API functions",
        reasoning:
          "The simulation loop and WebSocket stream require process memory and durable connection state, which fit App Service or containers better than short-lived serverless handlers.",
      },
    ],
    challenges: [
      {
        problem:
          "A browser cannot render every simulation tick when the backend emits high-frequency packets.",
        solution:
          "Buffer the latest WebSocket update in the frontend store and flush on a controlled interval.",
        lesson:
          "Realtime visualization is a sampling problem as much as a transport problem.",
      },
      {
        problem:
          "RL policy support can make deployment fragile if the runtime assumes model files are always present.",
        solution:
          "Guard policy loading with RL_POLICY_ENABLED and provide deterministic strategy fallbacks.",
        lesson:
          "Research features should degrade cleanly when they are not essential to the product path.",
      },
      {
        problem:
          "Live-shadow provider data has different identifiers, authentication, and freshness behavior.",
        solution:
          "Normalize provider inputs behind dedicated Groww and Upstox fetch/replay endpoints before they reach the simulator view.",
        lesson:
          "Provider integration should be isolated from the market engine contract.",
      },
    ],
    requirements: [
      "Backend environment supports WebSockets; a serverless-only backend is not enough for the live simulator.",
      "RL_POLICY_ENABLED defaults to false unless local PPO or GP artifacts and dependencies are installed.",
      "NEXT_PUBLIC_WS_URL must point at the backend WebSocket endpoint for dashboard streaming.",
      "Groww or Upstox credentials are optional and only required for live-shadow replay paths.",
    ],
    futureImprovements: [
      "Externalize simulator state so multiple backend replicas can coordinate saved runs and active sessions.",
      "Add replay compression so long simulations can be stored without persisting every raw packet.",
      "Expose an agent plug-in interface with validation around inventory limits, latency, and allowed order types.",
      "Add a side-by-side policy lab comparing rule-based, PPO, and GP market-maker behavior on the same seed.",
    ],
    interviewQuestions: [
      {
        question: "How does the event kernel make Sentinel more realistic than a fixed tick loop?",
        answer:
          "A fixed tick loop implies every participant observes and acts at the same instant. The event kernel schedules wakeups, latencies, and order arrivals separately, so queue position and reaction time become part of the market behavior.",
        difficulty: "hard",
        category: "architecture",
      },
      {
        question: "Why is WebSocket the right transport for the dashboard?",
        answer:
          "The backend owns a long-running simulation and emits frequent state changes. A WebSocket keeps one persistent connection for snapshots, prediction signals, and agent metrics instead of forcing the browser to poll many endpoints.",
        difficulty: "medium",
        category: "tradeoffs",
      },
      {
        question: "What should be included in a market update packet?",
        answer:
          "A useful packet includes top-of-book prices, depth by level, recent trades, liquidity score, large-order score, timestamp or tick, connection mode, and agent metrics such as inventory and P&L.",
        difficulty: "medium",
        category: "code",
      },
      {
        question: "How would you validate a hidden-order detector?",
        answer:
          "I would run seeded scenarios where institutional parent orders are known, compare detector alerts against that ground truth, measure false positives during normal high volume, and inspect feature importance around replenishment and child-order cadence.",
        difficulty: "hard",
        category: "concepts",
      },
      {
        question: "Why keep simulator state in memory for the first version?",
        answer:
          "The hot path needs fast mutation of book queues, agent state, and prediction features. Persisting every tick would slow experimentation. The tradeoff is that production scaling needs sticky sessions or externalized state later.",
        difficulty: "medium",
        category: "tradeoffs",
      },
      {
        question: "How do PPO and genetic-programming policies differ in this project?",
        answer:
          "PPO learns a neural policy from environment rewards and may produce stronger behavior but is less transparent. Genetic programming evolves rule-like expressions that are easier to inspect and explain as a baseline.",
        difficulty: "hard",
        category: "concepts",
      },
      {
        question: "What dashboard signals would you use to explain a liquidity shock?",
        answer:
          "I would show depth collapsing at best levels, spread widening, market orders walking the book, liquidity warning level rising, and agent inventory changes around the same timestamp.",
        difficulty: "medium",
        category: "behavioral",
      },
      {
        question: "What would fail if Sentinel were deployed only as serverless functions?",
        answer:
          "The simulation loop and WebSocket connection require long-lived process state. Serverless functions can serve stateless snapshots but are a poor fit for active run state and continuous streaming.",
        difficulty: "medium",
        category: "architecture",
      },
    ],
    flashcards: [
      {
        front: "What does Sentinel's event kernel schedule?",
        back: "Agent wakeups, order arrivals, simulated latency, and market-state transitions.",
        difficulty: "medium",
      },
      {
        front: "Why is PPO disabled by default in Sentinel deployment?",
        back: "To keep startup fast and avoid requiring heavy RL dependencies or model artifacts for the standard demo path.",
        difficulty: "medium",
      },
      {
        front: "What is live-shadow mode for?",
        back: "It replays provider-shaped market data from sources such as Groww or Upstox through the dashboard/simulator contract.",
        difficulty: "hard",
      },
      {
        front: "Why buffer WebSocket updates on the frontend?",
        back: "To prevent high-frequency simulator packets from forcing excessive React renders.",
        difficulty: "medium",
      },
      {
        front: "Name two trained policy formats Sentinel can load locally.",
        back: "PPO market-maker artifacts and genetic-programming market-maker rules.",
        difficulty: "easy",
      },
      {
        front: "What makes a serverless backend a poor fit for Sentinel?",
        back: "The active simulation loop, in-memory state, and persistent WebSocket stream need a long-running process.",
        difficulty: "hard",
      },
    ],
  },

  engram: {
    descriptionAppend:
      " Interview focus: explain the OpenAI-compatible proxy contract, per-user memory isolation, vector(384) embeddings, retrieval and dedup thresholds, retrieval logs, background extraction, cached-auth fallback, MCP tools, provider abstraction, and why the dashboard talks to the API through server-side service credentials.",
    architectureOverviewAppend:
      " The source schema includes users with max_memories_injected, retrieval_threshold, and dedup_threshold settings; memories with confidence, access_count, and source conversation IDs; retrieval_logs for auditability; conversations with extraction_status; and user_api_keys for named key management.",
    layers: [
      {
        name: "Provider adapter layer",
        description:
          "Provider services translate Engram's proxy request into OpenAI, Ollama, or Gemini style calls while preserving a consistent proxy response shape.",
        technologies: ["OpenAI adapter", "Ollama adapter", "Gemini adapter"],
      },
      {
        name: "Audit and observability layer",
        description:
          "Retrieval logs and conversation records make it possible to inspect which memories were injected, what scores were used, and whether extraction completed.",
        technologies: ["retrieval_logs", "conversations", "JSONB"],
      },
    ],
    techStack: [
      {
        name: "asyncpg",
        role: "Async PostgreSQL access for proxy-time retrieval, user lookup, and memory writes.",
        category: "database",
      },
      {
        name: "Zod",
        role: "Runtime validation for MCP tool inputs such as search query, limit, and threshold.",
        category: "library",
      },
      {
        name: "IVFFlat index",
        role: "Approximate vector index over pgvector embeddings for faster memory retrieval.",
        category: "database",
      },
      {
        name: "Provider adapters",
        role: "Isolate OpenAI, Ollama, and Gemini request differences behind one proxy pipeline.",
        category: "backend",
      },
    ],
    howItWorksSteps: [
      {
        step: 6,
        title: "Log retrieval evidence",
        description:
          "The API records query text, query embedding, retrieved memory IDs, retrieved scores, and conversation ID for later audit.",
        details:
          "This lets an interview answer move beyond 'we used RAG' into exactly how retrieval behavior can be debugged.",
      },
      {
        step: 7,
        title: "Deduplicate extracted memory",
        description:
          "New candidate memories are compared against existing memories using a high dedup threshold before they are inserted.",
        details:
          "Deduplication prevents a memory store from filling with repeated versions of the same preference.",
      },
      {
        step: 8,
        title: "Fall back during database outages",
        description:
          "If the database pool is unavailable, the proxy can use cached API-key auth for passthrough behavior instead of failing every request.",
        details:
          "That fallback preserves provider access but intentionally cannot retrieve or persist fresh durable memory.",
      },
    ],
    concepts: [
      {
        name: "Retrieval Threshold",
        category: "ml",
        definition:
          "A minimum similarity score or maximum distance cutoff used to decide whether a memory is relevant enough to inject.",
        explanation:
          "A low threshold injects more memories but risks noise. A high threshold improves precision but can miss useful context. Per-user thresholds allow different recall behavior.",
        relevance:
          "Engram stores retrieval_threshold on the user record and passes it into the proxy retrieval pipeline.",
      },
      {
        name: "Memory Deduplication",
        category: "data",
        definition:
          "The process of preventing semantically duplicate memories from being stored repeatedly.",
        explanation:
          "Memory systems degrade when repeated facts crowd out diverse context. Deduplication compares candidate embeddings or content against existing rows before insert.",
        relevance:
          "Engram uses a dedup_threshold so post-response extraction does not keep adding the same stable preference.",
      },
      {
        name: "Cached Authentication Fallback",
        category: "systems",
        definition:
          "A resilience path that can authenticate recent keys from process memory when the database is temporarily unavailable.",
        explanation:
          "A fallback should be narrowly scoped: it can preserve passthrough provider calls, but it should not pretend durable retrieval and persistence are working.",
        relevance:
          "Engram's proxy can fall back to cached user auth and provider passthrough if PostgreSQL is unreachable.",
      },
      {
        name: "Retrieval Observability",
        category: "devops",
        definition:
          "Recording which context was retrieved, with scores and query metadata, so model behavior can be audited.",
        explanation:
          "Without retrieval logs, it is difficult to know whether a bad answer came from missing memory, irrelevant injected memory, provider behavior, or prompt formatting.",
        relevance:
          "Engram records retrieval_logs with retrieved IDs, scores, query embeddings, and conversation IDs.",
      },
      {
        name: "Service-to-Service Key",
        category: "devops",
        definition:
          "A backend-only credential used by one trusted service to call another service.",
        explanation:
          "Service keys must stay outside browser JavaScript. They are useful when a dashboard server needs elevated API access on behalf of authenticated users.",
        relevance:
          "Engram uses ENGRAM_SERVICE_KEY for dashboard-to-API boundaries without exposing raw internal credentials to the browser.",
      },
    ],
    codeHighlights: [
      {
        title: "Proxy auth fallback path",
        description:
          "The proxy distinguishes database-backed memory mode from cached-auth passthrough mode when PostgreSQL is temporarily unavailable.",
        language: "python",
        code: `async def build_proxy_response(api_key, external_id, body, provider, headers):
    try:
        pool = get_pool()
        async with pool.acquire() as db:
            user = await get_user_by_api_key(api_key, db)
            if user is None:
                raise HTTPException(status_code=401, detail="Invalid API key")
            return await build_proxy_result(
                user["id"],
                user["external_id"],
                external_id,
                body,
                provider,
                db,
                user["max_memories_injected"],
                user["retrieval_threshold"],
            )
    except DatabaseUnavailable:
        cached_user = get_cached_user_by_api_key(api_key)
        if cached_user is None:
            raise HTTPException(status_code=503, detail="Database unavailable")
        return await build_proxy_passthrough_result(
            cached_user["external_id"],
            external_id,
            body,
            provider,
            headers,
        )`,
        annotations: [
          "The fallback keeps provider passthrough alive but cannot perform durable retrieval or extraction.",
          "The external user ID is still checked so one key cannot impersonate another user.",
        ],
      },
      {
        title: "MCP search input validation",
        description:
          "Agent-facing memory tools validate arguments before calling the Engram API.",
        language: "typescript",
        code: `const InputSchema = z.object({
  query: z.string(),
  limit: z.number().int().min(1).max(20).default(5),
  threshold: z.number().min(0).max(1).default(0.5),
});

export async function searchMemories(args: unknown) {
  const input = InputSchema.parse(args ?? {});
  return engramClient.searchMemories(input);
}`,
        annotations: [
          "Tool input validation protects the API from malformed agent calls.",
          "The tool exposes threshold control while keeping safe numeric bounds.",
        ],
      },
    ],
    apiEndpoints: [
      {
        method: "POST",
        path: "/v1/chat",
        description:
          "Accepts X-Engram-Key, X-Engram-User-ID, provider selection, and disable-injection or disable-extraction headers for proxy-time control.",
        requestBody: '{ "model": "gpt-4.1-mini", "messages": [{ "role": "user", "content": "Remember my preference" }] }',
        responseBody: '{ "choices": [{ "message": { "content": "..." } }], "headers": { "X-Engram-Memories-Injected": "3" } }',
      },
      {
        method: "GET",
        path: "/retrieval-logs",
        description:
          "Returns recent retrieval evidence for a user, including retrieved memory IDs and similarity scores.",
      },
      {
        method: "POST",
        path: "/memories/capture",
        description:
          "Captures a conversation or manual memory through dashboard or MCP flows and schedules extraction or direct insert.",
      },
      {
        method: "PATCH",
        path: "/users/{userId}/config",
        description:
          "Updates per-user memory settings such as max injected memories, retrieval threshold, and deduplication threshold.",
      },
    ],
    databaseTables: [
      {
        name: "retrieval_logs",
        description:
          "Audit table storing the natural-language query, query embedding, retrieved memory IDs, retrieved scores, and linked conversation.",
        fields: ["id", "user_id", "query", "query_embedding vector(384)", "retrieved_memory_ids", "retrieved_scores", "conversation_id"],
      },
      {
        name: "conversations",
        description:
          "Raw exchange and extraction status for post-response memory processing.",
        fields: ["id", "user_id", "extraction_status", "memories_extracted", "raw_exchange", "created_at"],
      },
      {
        name: "user_api_keys",
        description:
          "Named API key hashes with last-used metadata, separate from the primary user row.",
        fields: ["id", "user_id", "api_key_hash", "name", "created_at", "last_used_at"],
      },
    ],
    tradeoffs: [
      {
        decision: "Extraction timing",
        chose: "Background extraction task",
        over: "Blocking extraction before response",
        reasoning:
          "Users care about chat latency. Background extraction keeps the response path fast while still recording the conversation for durable memory processing.",
      },
      {
        decision: "Database outage behavior",
        chose: "Cached-auth passthrough",
        over: "Failing all proxy requests",
        reasoning:
          "Provider access can continue for known keys even when retrieval is unavailable, but the degraded mode is explicit and does not claim to inject memory.",
      },
      {
        decision: "User-configurable memory controls",
        chose: "Per-user thresholds",
        over: "One global retrieval setting",
        reasoning:
          "Some users want aggressive recall and others want precision. Storing max_memories_injected, retrieval_threshold, and dedup_threshold on the user model makes that behavior tunable.",
      },
    ],
    challenges: [
      {
        problem:
          "Injected memories can make a model worse if irrelevant context crosses the retrieval threshold.",
        solution:
          "Limit the number of injected memories, expose per-user thresholds, log retrieval scores, and keep dashboard review possible.",
        lesson:
          "RAG quality needs observability and controls, not just embeddings.",
      },
      {
        problem:
          "Self-hosted users may lose database connectivity but still expect model calls to work.",
        solution:
          "Add a cached-auth passthrough path that skips retrieval and extraction while preserving provider calls for known users.",
        lesson:
          "Graceful degradation should clearly reduce features instead of hiding failure.",
      },
      {
        problem:
          "MCP tools are called by agents and can receive malformed or overly broad inputs.",
        solution:
          "Validate tool arguments with Zod, bound limits and thresholds, and route errors through structured tool results.",
        lesson:
          "Agent-facing tools need the same input discipline as public APIs.",
      },
    ],
    requirements: [
      "Database schema must enable the vector extension and uuid-ossp before tables are created.",
      "Users need configured max_memories_injected, retrieval_threshold, and dedup_threshold defaults.",
      "MCP server requires ENGRAM_API_URL, ENGRAM_USER_ID, and an Engram API key to call memory tools.",
      "Dashboard service routes must keep ENGRAM_SERVICE_KEY server-side and never expose it to browser bundles.",
    ],
    futureImprovements: [
      "Add a memory review queue where extracted candidates require approval before becoming durable memories.",
      "Display retrieval logs next to chat traces so users can see exactly which memories influenced an answer.",
      "Add embedding-provider migration tools for re-embedding all memories when vector dimensions or providers change.",
      "Add per-memory TTL and scope controls for temporary project facts versus long-term preferences.",
    ],
    interviewQuestions: [
      {
        question: "What happens in Engram when PostgreSQL is unavailable?",
        answer:
          "The proxy attempts a cached-auth passthrough for known API keys. It can still forward to the model provider, but it cannot reliably retrieve memories, log retrieval, or persist new extractions until the database returns.",
        difficulty: "hard",
        category: "architecture",
      },
      {
        question: "Why store retrieval logs?",
        answer:
          "Retrieval logs explain which memories were injected and with what scores. They help debug irrelevant context, missed context, threshold settings, and user complaints about model behavior.",
        difficulty: "medium",
        category: "concepts",
      },
      {
        question: "How do retrieval_threshold and dedup_threshold differ?",
        answer:
          "retrieval_threshold controls whether an existing memory is similar enough to inject into a prompt. dedup_threshold controls whether a new candidate memory is too similar to an existing memory to store again.",
        difficulty: "medium",
        category: "concepts",
      },
      {
        question: "Why should memory extraction be asynchronous?",
        answer:
          "Extraction requires another processing pass and can be slower than returning the model response. Running it after the response keeps chat latency low and makes extraction failures recoverable.",
        difficulty: "medium",
        category: "tradeoffs",
      },
      {
        question: "What security boundary exists between the dashboard and API?",
        answer:
          "The browser authenticates to the dashboard, while dashboard server routes call the API with a service key. That key stays server-side, so users do not receive internal credentials in client JavaScript.",
        difficulty: "hard",
        category: "architecture",
      },
      {
        question: "What is the risk of storing memories automatically?",
        answer:
          "The system can store transient facts, private data, or incorrect inferences. Mitigations include extraction rules, confidence, source conversation IDs, dashboard review, deletion tools, and deduplication.",
        difficulty: "hard",
        category: "behavioral",
      },
      {
        question: "Why keep vector search inside PostgreSQL?",
        answer:
          "For a self-hosted memory layer, one operational database is simpler to back up, migrate, and secure. User-scoped memory volumes are small enough that pgvector is a practical first choice.",
        difficulty: "medium",
        category: "tradeoffs",
      },
      {
        question: "How does the MCP server fit into the architecture?",
        answer:
          "The MCP server is an agent-facing adapter. It exposes memory add, search, update, list, delete, capture, and logs tools, validates tool input, then calls the Engram API.",
        difficulty: "medium",
        category: "architecture",
      },
    ],
    flashcards: [
      {
        front: "What does retrieval_threshold control in Engram?",
        back: "Whether a stored memory is relevant enough to inject into a new prompt.",
        difficulty: "medium",
      },
      {
        front: "What does dedup_threshold control?",
        back: "Whether a newly extracted memory is too similar to an existing memory to store again.",
        difficulty: "medium",
      },
      {
        front: "What table records which memories were injected?",
        back: "retrieval_logs, with retrieved memory IDs, scores, query text, and conversation ID.",
        difficulty: "hard",
      },
      {
        front: "Why does Engram keep source_conversation_id on memories?",
        back: "It links a durable memory back to the conversation that produced it for audit and debugging.",
        difficulty: "hard",
      },
      {
        front: "What is cached-auth passthrough?",
        back: "A degraded mode where known keys can still proxy provider calls when the database is unavailable, without retrieval or persistence.",
        difficulty: "hard",
      },
      {
        front: "Why use Zod in the MCP server?",
        back: "To validate agent tool inputs such as query, limit, and threshold before calling the API.",
        difficulty: "easy",
      },
    ],
  },

  parkinsons: {
    descriptionAppend:
      " Interview focus: cover the PPMI cohort target classes, leak-free patient-level splits, traditional and transformer model suite, multimodal stacking, focal loss, model artifact loading, RAG report generation, medical document indexing, dual reports, digital-twin forecasting, and why outputs remain clinical decision support.",
    architectureOverviewAppend:
      " The source repo includes a Flask web app, PPMI feature mapping, LightGBM/XGBoost/SVM training, PubMedBERT/BioGPT/Clinical-T5 training, a multimodal ensemble, TF-IDF document indexing, dual report generation, optional digital-twin progression support, and runtime flags that defer heavy model/PDF work for faster startup.",
    layers: [
      {
        name: "Training orchestration layer",
        description:
          "Scripts coordinate traditional model trials, transformer trials, focal-loss training, checkpoint selection, resume support, and RTX A4000 preflight checks.",
        technologies: ["train_model_suite.py", "CUDA PyTorch", "focal loss"],
      },
      {
        name: "Knowledge retrieval layer",
        description:
          "Medical PDFs and text references are indexed so generated reports can include guideline-aware context instead of only raw class predictions.",
        technologies: ["TF-IDF", "medical_docs", "DocumentManager"],
      },
      {
        name: "Digital twin layer",
        description:
          "A forecasting view can estimate progression and treatment scenarios with a fast heuristic path and an optional PPMI-backed bridge.",
        technologies: ["DigitalTwinEngine", "PD_TWIN_BRIDGE_ENABLED"],
      },
    ],
    techStack: [
      {
        name: "LightGBM / XGBoost / SVM",
        role: "Traditional ML baselines for structured PPMI clinical features and comparison against transformer models.",
        category: "ml",
      },
      {
        name: "PubMedBERT / BioGPT / Clinical-T5",
        role: "Medical language model family used for clinical text-oriented transformer experiments.",
        category: "ml",
      },
      {
        name: "joblib",
        role: "Serialization and loading of traditional model, preprocessor, and ensemble artifacts.",
        category: "library",
      },
      {
        name: "TF-IDF document index",
        role: "Lightweight retrieval over medical reference documents for report generation.",
        category: "ml",
      },
    ],
    howItWorksSteps: [
      {
        step: 6,
        title: "Map questionnaire fields to PPMI features",
        description:
          "The web layer normalizes user inputs such as age, sex, BMI, tremor, rigidity, bradykinesia, postural instability, sleep, mood, and cognitive scores into model feature names.",
        details:
          "This is an interview-critical boundary because invalid or missing clinical fields can silently distort model predictions.",
      },
      {
        step: 7,
        title: "Load model artifacts lazily",
        description:
          "Startup can skip heavy initialization, then load models and document indexes on first prediction request when needed.",
        details:
          "Lazy loading makes smoke tests and static frontend hosting faster while preserving the full local ML workflow.",
      },
      {
        step: 8,
        title: "Retrieve medical context for reports",
        description:
          "The report workflow retrieves relevant disease information, guideline text, and feature interpretations before writing clinician-readable output.",
        details:
          "The prediction is only one part of the system; the report must explain why a class matters and what follow-up language is safe.",
      },
      {
        step: 9,
        title: "Generate optional digital twin scenarios",
        description:
          "The twin dashboard can produce progression or treatment scenario views using fast heuristics by default and a PPMI-backed bridge when enabled.",
        details:
          "This separates demo responsiveness from heavier research workflows.",
      },
    ],
    concepts: [
      {
        name: "Patient-Level Data Leakage",
        category: "healthcare",
        definition:
          "A validation error where records from the same patient appear in both training and test sets.",
        explanation:
          "Clinical datasets often contain repeated visits per patient. If visits leak across splits, the model can memorize patient-specific patterns and report inflated performance.",
        relevance:
          "NeuroAssess uses patient-level splitting so PPMI records from one patient do not cross train and test boundaries.",
      },
      {
        name: "PPMI Cohort Classification",
        category: "healthcare",
        definition:
          "A classification task over PPMI cohort labels such as HC, PD, SWEDD, and PRODROMAL.",
        explanation:
          "The target is not just positive versus negative. SWEDD and prodromal cohorts require nuanced explanation because their clinical meaning differs from confirmed Parkinson's disease.",
        relevance:
          "NeuroAssess frames outputs around PPMI cohort classes and explains each class in report generation.",
      },
      {
        name: "Multimodal Stacking Ensemble",
        category: "ml",
        definition:
          "An ensemble that combines predictions from multiple model families through a second-level learner.",
        explanation:
          "Structured clinical models and medical transformers can capture different signals. Stacking lets the system learn how to weight those outputs.",
        relevance:
          "NeuroAssess includes a multimodal ensemble over traditional ML and transformer model predictions.",
      },
      {
        name: "Focal Loss",
        category: "ml",
        definition:
          "A loss function that down-weights easy examples and focuses training on harder or minority-class examples.",
        explanation:
          "In imbalanced clinical datasets, standard cross-entropy can overfit common classes. Focal loss helps the model spend more gradient on difficult cases.",
        relevance:
          "The A4000 training recipe uses class-weighted focal loss and selects checkpoints by validation F1.",
      },
      {
        name: "RAG Clinical Report Generation",
        category: "healthcare",
        definition:
          "Generating reports with retrieved medical reference context in addition to model outputs.",
        explanation:
          "Clinical reports need domain grounding, limitations, and safe language. Retrieval helps bring guideline-like context into the explanation step.",
        relevance:
          "NeuroAssess uses medical_docs and a DocumentManager-backed workflow to enrich reports beyond raw prediction scores.",
      },
      {
        name: "Model Calibration",
        category: "ml",
        definition:
          "The alignment between predicted probabilities and real-world outcome frequencies.",
        explanation:
          "A model that outputs 0.80 should be correct about 80 percent of the time for similar cases. Without calibration, confidence values can mislead clinicians.",
        relevance:
          "NeuroAssess future hardening includes calibrated confidence intervals and threshold controls before clinical deployment.",
      },
    ],
    codeHighlights: [
      {
        title: "Patient-level split guard",
        description:
          "The training pipeline should split by patient identifier before expanding records into model rows.",
        language: "python",
        code: `def patient_level_split(frame, patient_col, test_size, seed):
    patients = frame[patient_col].dropna().unique()
    train_ids, test_ids = train_test_split(
        patients,
        test_size=test_size,
        random_state=seed,
        stratify=None,
    )
    train = frame[frame[patient_col].isin(train_ids)]
    test = frame[frame[patient_col].isin(test_ids)]
    assert set(train[patient_col]).isdisjoint(set(test[patient_col]))
    return train, test`,
        annotations: [
          "The split happens at patient level, not row level.",
          "The assertion makes leakage visible during development.",
        ],
      },
      {
        title: "Safe clinical field normalization",
        description:
          "Clinical form input is coerced into the feature schema while preserving missing-value behavior.",
        language: "python",
        code: `MODEL_REQUIRED_FIELDS = [
    "age",
    "SEX",
    "EDUCYRS",
    "BMI",
    "sym_tremor",
    "sym_rigid",
    "sym_brady",
    "sym_posins",
]

def validate_patient_payload(payload):
    normalized = normalize_patient_data(payload)
    missing = [field for field in MODEL_REQUIRED_FIELDS if field not in normalized]
    if missing:
        return {"ok": False, "missing": missing}
    return {"ok": True, "features": normalized}`,
        annotations: [
          "Missing clinical fields are surfaced instead of silently converted to zeros.",
          "The model boundary is the normalized PPMI feature schema.",
        ],
      },
    ],
    apiEndpoints: [
      {
        method: "POST",
        path: "/api/predict",
        description:
          "Normalizes patient data, loads model artifacts if needed, and returns cohort probabilities plus decision-support text.",
        requestBody: '{ "age": 63, "SEX": "male", "sym_tremor": 2, "sym_rigid": 1, "moca": 24 }',
        responseBody: '{ "predictedClass": "PRODROMAL", "confidence": 0.67, "disclaimer": "Decision support only." }',
      },
      {
        method: "POST",
        path: "/api/reports/dual",
        description:
          "Generates patient-facing and clinician-facing report variants from the same prediction and retrieved references.",
      },
      {
        method: "POST",
        path: "/api/documents/upload",
        description:
          "Accepts PDF or text medical references and indexes them for report retrieval experiments.",
      },
      {
        method: "POST",
        path: "/api/twin/project",
        description:
          "Returns digital-twin progression or treatment scenario output for a normalized patient profile.",
      },
    ],
    databaseTables: [
      {
        name: "ppmi_patient_features",
        description:
          "Curated patient-level clinical features mapped from PPMI records before training and inference.",
        fields: ["patient_id", "cohort", "age", "sex", "bmi", "motor_scores", "non_motor_scores", "cognitive_scores"],
      },
      {
        name: "model_registry",
        description:
          "Saved model artifacts, preprocessing artifacts, checkpoint metadata, and validation metrics.",
        fields: ["model_name", "artifact_path", "preprocessor_path", "validation_f1", "trained_at"],
      },
      {
        name: "document_index",
        description:
          "Medical reference documents indexed for TF-IDF retrieval and report context.",
        fields: ["doc_id", "filename", "document_type", "extracted_text", "indexed_at"],
      },
      {
        name: "twin_scenario",
        description:
          "Optional progression or treatment scenario outputs generated for digital-twin views.",
        fields: ["scenario_id", "patient_profile_hash", "horizon_months", "risk_curve", "created_at"],
      },
    ],
    tradeoffs: [
      {
        decision: "Validation split",
        chose: "Patient-level split",
        over: "Random row split",
        reasoning:
          "Repeated PPMI visits can leak patient identity across train and test. Patient-level splitting gives a more honest estimate of generalization.",
      },
      {
        decision: "Training objective",
        chose: "Class-weighted focal loss",
        over: "Plain cross-entropy",
        reasoning:
          "The cohort labels are imbalanced and clinically important minority classes should not be ignored by a model that optimizes only easy examples.",
      },
      {
        decision: "Report generation",
        chose: "RAG-enhanced explanatory reports",
        over: "Returning only class probabilities",
        reasoning:
          "A clinical-support tool must explain risk factors, caveats, and follow-up considerations in language a clinician can review.",
      },
      {
        decision: "Frontend deployment",
        chose: "Static Vite frontend on Vercel with external Flask API",
        over: "Bundling local ML inference into Vercel",
        reasoning:
          "Model loading and PDF indexing are too heavy for a static frontend deployment, so the hosted UI should call a separate backend.",
      },
    ],
    challenges: [
      {
        problem:
          "Clinical models can look strong if patient visits leak across train and test splits.",
        solution:
          "Split by patient ID, assert disjoint patients, and report validation metrics from held-out patients only.",
        lesson:
          "For medical ML, evaluation design is part of the product's credibility.",
      },
      {
        problem:
          "Transformer training can be interrupted on long GPU runs.",
        solution:
          "Add A4000 preflight checks, resumable training scripts, checkpoint selection by validation F1, and resume commands.",
        lesson:
          "ML systems need operational training workflows, not just model code.",
      },
      {
        problem:
          "PDF extraction and model initialization slow down basic web smoke tests.",
        solution:
          "Defer PDF full-text extraction and allow skip-init startup while keeping full local initialization available through flags.",
        lesson:
          "Heavy ML systems benefit from runtime modes that separate UI checks from full inference readiness.",
      },
    ],
    requirements: [
      "PPMI curated CSV files must be present before training or evaluation.",
      "sacremoses is required for BioGPT tokenization.",
      "CUDA-enabled PyTorch is recommended for transformer training, with A4000 preflight scripts available.",
      "PD_EXTRACT_PDF_TEXT enables full PDF extraction when RAG experiments need it.",
      "PD_TWIN_BRIDGE_ENABLED enables the optional PPMI-backed digital-twin bridge.",
    ],
    futureImprovements: [
      "Add an explicit model card page describing dataset version, cohort distribution, leakage controls, and known limitations.",
      "Add probability calibration and threshold sliders for sensitivity/specificity tradeoff exploration.",
      "Persist anonymized prediction audit records with consent-aware retention controls.",
      "Add external validation on a dataset outside PPMI before making stronger clinical claims.",
    ],
    interviewQuestions: [
      {
        question: "Why is patient-level splitting mandatory for PPMI data?",
        answer:
          "PPMI can include multiple records or visits for the same patient. If records from one patient appear in both train and test sets, the model can learn patient-specific patterns and produce overly optimistic results.",
        difficulty: "hard",
        category: "concepts",
      },
      {
        question: "What are HC, PD, SWEDD, and PRODROMAL in this project?",
        answer:
          "They are cohort labels: Healthy Control, Parkinson's Disease, Scans Without Evidence of Dopaminergic Deficit, and prodromal Parkinson's. Each needs different interpretation in the report.",
        difficulty: "medium",
        category: "concepts",
      },
      {
        question: "Why include traditional ML if transformer models exist?",
        answer:
          "LightGBM, XGBoost, and SVM are strong baselines for structured clinical data, easier to debug, and useful for comparing whether transformer complexity is actually improving held-out patient performance.",
        difficulty: "medium",
        category: "tradeoffs",
      },
      {
        question: "What is the role of RAG in NeuroAssess?",
        answer:
          "RAG retrieves medical reference context so reports can include disease characteristics, recommendations, and limitations rather than presenting only a class label and probability.",
        difficulty: "medium",
        category: "architecture",
      },
      {
        question: "How would you explain focal loss in this clinical setting?",
        answer:
          "Focal loss reduces the weight of easy examples and focuses learning on hard or underrepresented cases. That helps when cohort classes are imbalanced and missing a minority clinical class matters.",
        difficulty: "hard",
        category: "concepts",
      },
      {
        question: "What should be checked before deploying this as a clinical tool?",
        answer:
          "External validation, calibration, patient privacy, access control, audit logs, clinician review workflow, model-card documentation, monitoring, and clear disclaimers that predictions are decision support only.",
        difficulty: "hard",
        category: "behavioral",
      },
      {
        question: "Why does the frontend deploy separately from the Flask ML backend?",
        answer:
          "The Vite frontend can be static, but model loading, local artifacts, PDF indexing, and inference require a Python backend with more runtime control than Vercel static hosting provides.",
        difficulty: "medium",
        category: "architecture",
      },
      {
        question: "What does model calibration add beyond accuracy?",
        answer:
          "Calibration checks whether predicted probabilities match real outcome frequencies. In a clinical UI, an overconfident probability can be more dangerous than a simple wrong class.",
        difficulty: "hard",
        category: "concepts",
      },
    ],
    flashcards: [
      {
        front: "What leakage risk does patient-level splitting prevent?",
        back: "The same patient's records appearing in both train and test sets.",
        difficulty: "hard",
      },
      {
        front: "Name the four PPMI target cohorts used by NeuroAssess.",
        back: "HC, PD, SWEDD, and PRODROMAL.",
        difficulty: "medium",
      },
      {
        front: "Why use focal loss for the A4000 training recipe?",
        back: "It focuses learning on hard and minority-class examples in an imbalanced clinical dataset.",
        difficulty: "hard",
      },
      {
        front: "What does the RAG layer add to reports?",
        back: "Retrieved medical reference context, disease explanations, caveats, and follow-up language.",
        difficulty: "medium",
      },
      {
        front: "What runtime flag enables full PDF text extraction?",
        back: "PD_EXTRACT_PDF_TEXT=1.",
        difficulty: "easy",
      },
      {
        front: "Why is raw accuracy insufficient for NeuroAssess?",
        back: "It can hide false negatives, false positives, class imbalance, and poor probability calibration.",
        difficulty: "hard",
      },
    ],
  },

  occasio: {
    descriptionAppend:
      " Interview focus: explain the organizer/attendee split, Prisma relational model, registration-to-order-to-ticket lifecycle, Razorpay and PhonePe verification, QR payload safety, waitlists, discount codes, ticket tiers, polls, team members, certificate generation, uploads, queues, and why payment webhooks are the authority.",
    architectureOverviewAppend:
      " The source schema models users, events, forms, registrations, orders, tickets, waitlists, discounts, reviews, polls, team members, ticket tiers, speakers, and reminders. The backend also includes payment services, ticket services, queue/reminder services, QR utilities, upload middleware, Cloudinary/R2/S3 helpers, and scanner routes.",
    layers: [
      {
        name: "Registration lifecycle layer",
        description:
          "A registration starts as pending form data, creates an order, moves through payment status, then receives a ticket and check-in state.",
        technologies: ["Prisma", "Registration", "Order", "Ticket"],
      },
      {
        name: "Organizer operations layer",
        description:
          "Admins manage event teams, polls, reviews, ticket tiers, reminders, speakers, discounts, and certificate templates from operational screens.",
        technologies: ["TeamMember", "Poll", "CertificateDesigner"],
      },
      {
        name: "Asset and document layer",
        description:
          "Poster, ticket PDF, and certificate assets are separated from event metadata and routed through upload/storage utilities.",
        technologies: ["Cloudinary", "R2", "S3", "upload middleware"],
      },
    ],
    techStack: [
      {
        name: "Prisma",
        role: "Typed ORM for PostgreSQL models including events, registrations, orders, tickets, discounts, waitlists, and polls.",
        category: "database",
      },
      {
        name: "PostgreSQL / Neon",
        role: "Relational source of truth for users, events, orders, tickets, and organizer operations.",
        category: "database",
      },
      {
        name: "Redis queue",
        role: "Background reminder, notification, and asynchronous job path for operational workflows.",
        category: "devops",
      },
      {
        name: "Cloudinary / R2 / S3",
        role: "Media and document storage options for posters, tickets, certificates, and downloadable assets.",
        category: "devops",
      },
    ],
    howItWorksSteps: [
      {
        step: 6,
        title: "Apply discount and ticket-tier rules",
        description:
          "Before order creation, the backend computes pricing from ticket tiers, discount code constraints, max uses, and registration quantity.",
        details:
          "This keeps pricing authority on the server instead of trusting the browser's displayed total.",
      },
      {
        step: 7,
        title: "Generate provider metadata",
        description:
          "Payment requests include order, registration, and event identifiers in provider notes or metadata so callbacks can be reconciled safely.",
        details:
          "Razorpay notes and PhonePe merchant transaction IDs are essential when users leave and return from hosted payment pages.",
      },
      {
        step: 8,
        title: "Update attendance state",
        description:
          "Scanner routes mark checkedInAt, checkedOutAt, checkedInBy, and legacy scannedAt fields while rejecting revoked or already-used tickets.",
        details:
          "The QR code is not the source of truth; it is a lookup payload for server-side validation.",
      },
      {
        step: 9,
        title: "Run post-event operations",
        description:
          "Organizers can manage reviews, polls, certificates, reminders, and team access after the core ticket purchase flow.",
      },
    ],
    concepts: [
      {
        name: "Idempotent Payment Handling",
        category: "systems",
        definition:
          "Designing payment callbacks so repeated provider events do not create duplicate tickets or double-update orders.",
        explanation:
          "Payment gateways may retry callbacks. A safe handler checks existing order status, verifies signatures, and performs state transitions exactly once.",
        relevance:
          "Occasio must treat Razorpay and PhonePe callbacks as repeatable events and only issue one ticket per paid order.",
      },
      {
        name: "Registration Lifecycle",
        category: "web",
        definition:
          "The state flow from form submission to order creation, payment, ticket issuance, and check-in.",
        explanation:
          "Event platforms are more than listings. They need durable state transitions so support teams can answer where a user is in the purchase path.",
        relevance:
          "Occasio models Registration, Order, PaymentProvider, OrderStatus, and Ticket as separate concepts.",
      },
      {
        name: "Ticket Revocation",
        category: "systems",
        definition:
          "A control that invalidates a ticket after issuance without deleting its audit history.",
        explanation:
          "Revocation is important for refunds, fraud, duplicate registrations, or organizer intervention. The scanner must check revoked state before allowing entry.",
        relevance:
          "Occasio's ticket model includes revoked, validUntil, check-in, and check-out fields.",
      },
      {
        name: "Relational Event Modeling",
        category: "data",
        definition:
          "Representing event operations through explicit relational entities and foreign keys.",
        explanation:
          "Events connect to forms, registrations, waitlists, discounts, polls, team members, ticket tiers, reminders, speakers, and reviews. A relational model makes ownership and cascade behavior explicit.",
        relevance:
          "Occasio's Prisma schema uses relations and indexes to keep organizer workflows consistent.",
      },
      {
        name: "Object Storage Boundary",
        category: "devops",
        definition:
          "Keeping uploaded files in storage services while the database stores metadata and URLs.",
        explanation:
          "Large assets such as posters, certificates, and ticket PDFs should not live inside relational rows. The backend validates and stores references instead.",
        relevance:
          "Occasio uses upload middleware and storage helpers for media/document assets.",
      },
    ],
    codeHighlights: [
      {
        title: "Idempotent ticket issuance",
        description:
          "A payment completion handler should detect already-paid orders before generating a ticket.",
        language: "javascript",
        code: `async function markOrderPaid(orderId, providerPayload) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { ticket: true, registration: true },
  });

  if (!order) throw new Error("Order not found");
  if (order.status === "PAID" && order.ticket) {
    return { order, ticket: order.ticket, alreadyProcessed: true };
  }

  return prisma.$transaction(async (tx) => {
    const paidOrder = await tx.order.update({
      where: { id: order.id },
      data: { status: "PAID", paymentData: providerPayload },
    });
    const ticket = await tx.ticket.create({
      data: {
        orderId: paidOrder.id,
        qrPayload: createSignedTicketPayload(paidOrder.id),
        validUntil: computeTicketExpiry(order.registration.eventId),
      },
    });
    return { order: paidOrder, ticket, alreadyProcessed: false };
  });
}`,
        annotations: [
          "The existing paid order is returned instead of issuing another ticket.",
          "The order update and ticket creation happen in one transaction.",
        ],
      },
      {
        title: "Server-side pricing authority",
        description:
          "The backend computes the amount from ticket tiers and discount codes before creating a provider order.",
        language: "javascript",
        code: `function computeRegistrationAmount({ tier, quantity, discount }) {
  const subtotal = tier.priceCents * quantity;
  if (!discount || !discount.isActive) return subtotal;

  if (discount.maxUses && discount.usedCount >= discount.maxUses) {
    return subtotal;
  }

  const discountValue = discount.type === "PERCENTAGE"
    ? Math.floor(subtotal * (discount.amount / 100))
    : discount.amount;

  return Math.max(0, subtotal - discountValue);
}`,
        annotations: [
          "Client totals are display-only; the server recomputes final amount.",
          "Discount use limits must be checked before provider order creation.",
        ],
      },
    ],
    apiEndpoints: [
      {
        method: "POST",
        path: "/registrations",
        description:
          "Stores form response, selected ticket tier, attendee identity, and pending registration state before payment.",
        requestBody: '{ "eventId": "evt_42", "tierId": "tier_student", "formResponse": { "college": "ABC" } }',
        responseBody: '{ "registrationId": "reg_81", "status": "PENDING" }',
      },
      {
        method: "POST",
        path: "/orders/{orderId}/phonepe/status",
        description:
          "Checks PhonePe transaction status using merchant transaction ID and X-VERIFY checksum.",
      },
      {
        method: "POST",
        path: "/waitlist",
        description:
          "Adds an attendee to an event waitlist when capacity or ticket availability is exhausted.",
      },
      {
        method: "POST",
        path: "/certificates/generate",
        description:
          "Generates participation or prize certificates from event certificate templates and registration data.",
      },
      {
        method: "POST",
        path: "/polls/{pollId}/vote",
        description:
          "Records attendee poll responses while respecting single or multiple choice poll configuration.",
      },
    ],
    databaseTables: [
      {
        name: "registrations",
        description:
          "Attendee form response and lifecycle state before and after payment.",
        fields: ["id", "event_id", "user_email", "form_response", "status", "created_at"],
      },
      {
        name: "orders",
        description:
          "Payment order linked to a registration, provider, amount, status, and raw provider metadata.",
        fields: ["id", "registration_id", "amount_cents", "provider", "provider_order_id", "status", "payment_data"],
      },
      {
        name: "discount_codes",
        description:
          "Event-scoped discount rules with type, amount, max uses, active window, and used count.",
        fields: ["id", "event_id", "code", "type", "amount", "max_uses", "used_count", "valid_until"],
      },
      {
        name: "waitlists",
        description:
          "Attendees waiting for capacity, keyed by event and email.",
        fields: ["id", "event_id", "email", "name", "phone", "created_at"],
      },
      {
        name: "polls",
        description:
          "Event poll questions, options, response settings, and end time.",
        fields: ["id", "event_id", "question", "allow_multiple", "ends_at", "is_active"],
      },
    ],
    tradeoffs: [
      {
        decision: "Data model",
        chose: "Explicit Registration, Order, and Ticket tables",
        over: "One booking table with many nullable fields",
        reasoning:
          "The lifecycle has distinct responsibilities: user form data, payment reconciliation, and entry validation. Separate tables make state transitions and debugging clearer.",
      },
      {
        decision: "Payment providers",
        chose: "Razorpay and PhonePe support",
        over: "Single gateway dependency",
        reasoning:
          "Indian event flows often need multiple payment options. Supporting both creates integration complexity but improves operational flexibility.",
      },
      {
        decision: "Asset storage",
        chose: "External object storage helpers",
        over: "Storing files in the database",
        reasoning:
          "Posters, ticket PDFs, and certificates are large binary assets; databases should keep metadata and URLs while object storage handles file delivery.",
      },
      {
        decision: "Scanner validation",
        chose: "Server-verified QR payload",
        over: "QR code as standalone proof",
        reasoning:
          "A QR payload can be copied. The scanner must check payment status, event, revocation, validity window, and scan history on the backend.",
      },
    ],
    challenges: [
      {
        problem:
          "Payment providers can retry callbacks or return the user through different redirect paths.",
        solution:
          "Use provider metadata to map callbacks to orders and make order-paid transitions idempotent.",
        lesson:
          "Payment code must be designed around retries, not just the happy path.",
      },
      {
        problem:
          "Capacity can be oversold if two attendees reserve the last ticket at the same time.",
        solution:
          "Compute availability server-side and update registration/order state in a transaction or through a locking strategy.",
        lesson:
          "Inventory correctness is a backend concurrency problem.",
      },
      {
        problem:
          "Certificate and ticket templates can become tightly coupled to one event design.",
        solution:
          "Store certificate mappings and ticket styling as JSON configuration attached to the event.",
        lesson:
          "Template systems should keep presentation configuration out of business logic.",
      },
    ],
    requirements: [
      "DATABASE_URL must point to the PostgreSQL/Neon database used by Prisma.",
      "Razorpay and PhonePe credentials are required for live payment flows; sandbox credentials are only for testing.",
      "Ticket scanning requires backend access so QR payloads can be validated against order and ticket state.",
      "Object storage credentials are needed for production posters, certificates, and downloadable ticket assets.",
      "Queue or reminder configuration is needed before relying on automated reminders or background notifications.",
    ],
    futureImprovements: [
      "Add transaction-level capacity locking or reservation expiry for high-demand events.",
      "Add offline scanner mode with signed short-lived manifests and later reconciliation.",
      "Add organizer audit logs for event edits, check-ins, refund actions, and certificate generation.",
      "Add webhook replay tooling so failed payment callbacks can be inspected and retried safely.",
    ],
    interviewQuestions: [
      {
        question: "Why separate Registration, Order, and Ticket instead of using one booking table?",
        answer:
          "They represent different lifecycle responsibilities. Registration stores attendee form data, Order tracks payment provider state, and Ticket handles QR payload, validity, revocation, and scan history.",
        difficulty: "medium",
        category: "architecture",
      },
      {
        question: "How do you make payment callbacks idempotent?",
        answer:
          "Verify the provider signature, map metadata to a single order, check whether the order is already paid, and perform order update plus ticket issuance in a transaction so duplicate callbacks return the existing ticket.",
        difficulty: "hard",
        category: "code",
      },
      {
        question: "What should the scanner validate before allowing entry?",
        answer:
          "It should validate the signed payload, ticket existence, paid order state, matching event, revoked flag, validUntil, checkedInAt, and optionally checkedOutAt depending on the event policy.",
        difficulty: "medium",
        category: "concepts",
      },
      {
        question: "What is risky about trusting the frontend price?",
        answer:
          "The browser can be manipulated. The backend must recompute the amount from ticket tiers, quantity, discounts, validity windows, and max-use constraints before creating a payment order.",
        difficulty: "medium",
        category: "tradeoffs",
      },
      {
        question: "How would you prevent overselling capacity?",
        answer:
          "Use server-side availability checks inside a transaction, reserve inventory with expiry, count only active pending/paid registrations, and move overflow users to a waitlist.",
        difficulty: "hard",
        category: "architecture",
      },
      {
        question: "Why store ticketStyle and certificate configs as JSON?",
        answer:
          "Event templates vary by organizer. JSON keeps style and mapping flexible without creating many schema columns for design-specific options.",
        difficulty: "medium",
        category: "tradeoffs",
      },
      {
        question: "What does PhonePe checksum verification protect against?",
        answer:
          "It proves that the payload or status request matches the expected merchant secret and endpoint, reducing the risk of forged payment confirmations.",
        difficulty: "hard",
        category: "concepts",
      },
      {
        question: "What background jobs belong in an event platform?",
        answer:
          "Reminder emails, push notifications, certificate generation, ticket PDF generation, webhook retries, waitlist promotion, and post-event feedback requests are good queue-backed jobs.",
        difficulty: "medium",
        category: "architecture",
      },
    ],
    flashcards: [
      {
        front: "What are the three core state entities in Occasio's purchase lifecycle?",
        back: "Registration, Order, and Ticket.",
        difficulty: "easy",
      },
      {
        front: "Why must payment callbacks be idempotent?",
        back: "Gateways can retry callbacks, and repeated events must not create duplicate tickets or double-update orders.",
        difficulty: "hard",
      },
      {
        front: "What does the ticket revoked flag allow?",
        back: "Invalidating an issued ticket without deleting its audit history.",
        difficulty: "medium",
      },
      {
        front: "Why keep uploaded posters outside PostgreSQL rows?",
        back: "Large binary assets belong in object storage; the database should store metadata and URLs.",
        difficulty: "medium",
      },
      {
        front: "What should decide final payment amount?",
        back: "Server-side pricing from ticket tier, quantity, discount rules, and event constraints.",
        difficulty: "medium",
      },
      {
        front: "What is the waitlist for?",
        back: "Capturing interested attendees when event capacity or ticket availability is exhausted.",
        difficulty: "easy",
      },
    ],
  },

  equityflow: {
    descriptionAppend:
      " Interview focus: explain provider preference and fallback, Groww/Upstox auth, Indian market-hours logic, request caching, SSE quote streams, risk scoring, margin estimation, trading charges, command parsing, alert rules, replay lab behavior, and why paper execution must still respect real instrument contracts.",
    architectureOverviewAppend:
      " The source code includes a FastAPI backend with Groww-primary and Upstox fallback market data, CORS/env validation, NSE and MCX holiday calendars, provider preference, SSE streaming, Next.js terminal layouts, command parsing, risk engine, strategy payoff calculations, alerts, request caching, and replay tests.",
    layers: [
      {
        name: "Provider resilience layer",
        description:
          "Groww and Upstox adapters normalize tokens, provider preference, quote freshness, and fallback behavior before the UI sees market data.",
        technologies: ["Groww API", "Upstox API", "provider preference"],
      },
      {
        name: "Risk and strategy layer",
        description:
          "Margin estimates, charges, leverage, concentration, warnings, and option strategy payoff tables make paper trading more realistic.",
        technologies: ["risk-engine.ts", "trading-charges.ts", "strategy builder"],
      },
      {
        name: "Terminal command layer",
        description:
          "A command parser turns typed workstation commands into order, alert, layout, watchlist, chart, and navigation actions.",
        technologies: ["command-parser.ts", "command palette"],
      },
    ],
    techStack: [
      {
        name: "Python zoneinfo",
        role: "IST-aware NSE and MCX market-hours calculations with holiday overrides.",
        category: "library",
      },
      {
        name: "Request cache",
        role: "Client-side request deduplication and freshness control for quote and market pages.",
        category: "library",
      },
      {
        name: "Vitest",
        role: "Unit coverage for risk engine, replay math, alerts, request cache, command parser, and trading logic.",
        category: "devops",
      },
      {
        name: "Trading charges module",
        role: "Estimates brokerage-style fees so paper P&L is not unrealistically clean.",
        category: "library",
      },
    ],
    howItWorksSteps: [
      {
        step: 6,
        title: "Check market session state",
        description:
          "The backend computes NSE and MCX open, preopen, and closed states using IST, weekends, holiday sets, and segment-specific hours.",
        details:
          "Session state controls whether a quote or execution path should be labeled live, delayed, closed, or fallback.",
      },
      {
        step: 7,
        title: "Estimate margin and risk",
        description:
          "Before and after orders, the risk engine estimates notional value, charges, required margin, leverage, concentration, and warnings.",
        details:
          "This is why the paper account teaches exposure discipline instead of just calculating raw profit and loss.",
      },
      {
        step: 8,
        title: "Parse workstation commands",
        description:
          "Terminal commands such as buy, sell, alert, layout, watch, chart, and goto are parsed into typed actions with sanitized tickers.",
        details:
          "The command layer is a productivity feature but also a type-safety boundary for dense trading workflows.",
      },
      {
        step: 9,
        title: "Replay and diagnose decisions",
        description:
          "Replay and diagnostics screens let users inspect market movement, provider status, and portfolio behavior after simulated trades.",
      },
    ],
    concepts: [
      {
        name: "Provider Freshness",
        category: "systems",
        definition:
          "The age and reliability of market data returned by a provider at the time the UI displays it.",
        explanation:
          "Trading interfaces should not hide stale quotes. Freshness metadata helps users understand whether a price is live, delayed, cached, or fallback.",
        relevance:
          "EquityFlow exposes provider preference and fallback behavior so stale market data is not silently treated as current.",
      },
      {
        name: "Margin Estimation",
        category: "finance",
        definition:
          "Estimating the capital required to hold or enter a position based on instrument segment and product rules.",
        explanation:
          "Equities, intraday trades, F&O, and commodities have different leverage and margin assumptions. A simulator should approximate these before allowing exposure.",
        relevance:
          "EquityFlow estimates required margin from segment, notional value, lot size, product type, and charges.",
      },
      {
        name: "Portfolio Concentration Risk",
        category: "finance",
        definition:
          "The risk that too much portfolio exposure is concentrated in a small number of positions.",
        explanation:
          "A portfolio can have acceptable total leverage but still be fragile if one ticker dominates exposure.",
        relevance:
          "EquityFlow calculates top concentration rows and warnings when one symbol becomes too large.",
      },
      {
        name: "Terminal Command Parsing",
        category: "web",
        definition:
          "Converting compact text commands into structured application actions.",
        explanation:
          "Command parsing improves speed for power users but must sanitize tickers, validate quantities, and classify ambiguous input safely.",
        relevance:
          "EquityFlow parses buy/sell, alert, layout, watch, chart, and goto commands into typed workstation actions.",
      },
      {
        name: "Market Hours Gate",
        category: "finance",
        definition:
          "A rule layer that decides whether a market segment is open based on time zone, weekday, holiday, and segment schedule.",
        explanation:
          "NSE equities and MCX commodities do not share identical hours. Incorrect session logic can make quotes or simulated fills misleading.",
        relevance:
          "EquityFlow computes NSE and MCX session state using Asia/Kolkata time and configurable holiday overrides.",
      },
    ],
    codeHighlights: [
      {
        title: "Portfolio risk scoring",
        description:
          "The risk engine combines leverage, margin usage, and concentration warnings instead of showing only P&L.",
        language: "typescript",
        code: `export function getPortfolioRisk(input: { balance: number; positions: Position[] }) {
  const grossExposure = input.positions.reduce(
    (sum, position) => sum + Math.abs(position.current_value),
    0,
  );
  const marginUsed = input.positions.reduce(
    (sum, position) => sum + estimatePositionMargin(position),
    0,
  );
  const equity = input.balance + input.positions.reduce(
    (sum, position) => sum + position.current_value,
    0,
  );
  const leverage = equity > 0 ? grossExposure / equity : 0;
  const riskScore = Math.min(
    100,
    Math.max(0, Math.round(leverage * 22 + (marginUsed / equity) * 45)),
  );
  return { grossExposure, marginUsed, leverage, riskScore };
}`,
        annotations: [
          "Risk is derived from exposure and margin, not only account balance.",
          "The scoring formula is explainable enough for a portfolio interview answer.",
        ],
      },
      {
        title: "Typed terminal command parser",
        description:
          "The workstation command bar converts concise text into safe structured actions.",
        language: "typescript",
        code: `export function parseTerminalCommand(raw: string): ParsedTerminalCommand {
  const parts = raw.trim().split(/\\s+/).filter(Boolean);
  const command = parts[0]?.toLowerCase();
  if (command === "buy" || command === "sell") {
    return parseOrder(parts, command === "buy" ? "BUY" : "SELL");
  }
  if (command === "alert") {
    return parseAlert(parts);
  }
  if (command === "watch") {
    return { kind: "watch", ticker: cleanTicker(parts[1]) };
  }
  return { kind: "unknown" };
}`,
        annotations: [
          "The parser returns a discriminated union, so each command kind can be handled safely.",
          "Ticker cleaning prevents invalid characters from entering trading actions.",
        ],
      },
    ],
    apiEndpoints: [
      {
        method: "GET",
        path: "/api/provider/preference",
        description:
          "Returns the active market-data provider preference and fallback status for diagnostics.",
      },
      {
        method: "POST",
        path: "/api/provider/preference",
        description:
          "Updates the runtime market-data provider preference between Groww and Upstox when both are configured.",
        requestBody: '{ "provider": "upstox" }',
      },
      {
        method: "GET",
        path: "/api/market/status",
        description:
          "Returns NSE or MCX market state computed from IST, weekends, holidays, and segment trading hours.",
      },
      {
        method: "POST",
        path: "/api/alerts",
        description:
          "Creates price, percent move, volume, PCR, IV, or open-interest alerts from parsed workstation commands.",
      },
      {
        method: "GET",
        path: "/api/diagnostics",
        description:
          "Returns provider health, token availability, CORS config, market session state, and data freshness diagnostics.",
      },
    ],
    databaseTables: [
      {
        name: "provider_status",
        description:
          "Runtime state for the selected provider, token source, freshness, and last successful quote fetch.",
        fields: ["provider", "token_source", "last_success_at", "freshness_ms", "fallback_reason"],
      },
      {
        name: "risk_snapshot",
        description:
          "Derived portfolio risk summary used by the terminal and strategy dashboard.",
        fields: ["account_id", "gross_exposure", "margin_used", "margin_available", "leverage", "risk_score"],
      },
      {
        name: "alerts",
        description:
          "User-defined alert rules for price, percent move, volume, PCR, IV, and open-interest changes.",
        fields: ["id", "ticker", "metric", "operator", "value", "enabled", "triggered_at"],
      },
      {
        name: "command_history",
        description:
          "Optional audit trail of parsed terminal commands and their resulting action kind.",
        fields: ["id", "raw_command", "parsed_kind", "created_at", "status"],
      },
    ],
    tradeoffs: [
      {
        decision: "Data provider strategy",
        chose: "Groww-primary with Upstox fallback",
        over: "One hard-coded market-data provider",
        reasoning:
          "Provider APIs can be unavailable or incomplete for some instruments. A preference and fallback model improves reliability and makes diagnostics explicit.",
      },
      {
        decision: "Power-user workflow",
        chose: "Terminal command parser",
        over: "Only form-based interactions",
        reasoning:
          "Dense trading workstations benefit from keyboard-first actions, but the parser still returns typed actions so validation remains explicit.",
      },
      {
        decision: "Risk model",
        chose: "Approximate margin and concentration warnings",
        over: "Only virtual cash balance",
        reasoning:
          "A simulator that ignores leverage and margin teaches poor trading habits. Approximate rules are better than pretending every product is cash equity.",
      },
      {
        decision: "Market session logic",
        chose: "Backend IST market-hours gates",
        over: "Frontend-only time labels",
        reasoning:
          "The backend owns quote and execution semantics, so it should compute whether a market is open, preopen, or closed.",
      },
    ],
    challenges: [
      {
        problem:
          "Provider tokens can be configured in different formats, including raw tokens and Bearer-prefixed strings.",
        solution:
          "Normalize access tokens on startup and log provider readiness clearly without exposing secrets.",
        lesson:
          "Integration code should be forgiving about input format while strict about secret handling.",
      },
      {
        problem:
          "Market hours differ between NSE equity and MCX commodity sessions.",
        solution:
          "Use segment-specific session helpers, Asia/Kolkata time, and holiday override environment variables.",
        lesson:
          "Financial UX correctness depends on calendars and clocks, not only quote APIs.",
      },
      {
        problem:
          "Command palette actions can become unsafe if they bypass normal form validation.",
        solution:
          "Parse commands into typed objects, sanitize tickers, then route them through the same order and alert validation paths.",
        lesson:
          "Keyboard speed should not bypass domain rules.",
      },
    ],
    requirements: [
      "GROWW_API_KEY/GROWW_API_SECRET or GROWW_ACCESS_TOKEN is required for Groww-backed live endpoints.",
      "UPSTOX_ACCESS_TOKEN or OAuth credentials are required for Upstox-backed endpoints.",
      "CORS_ALLOW_ORIGINS or local dev regex must allow the Next.js frontend origin.",
      "NSE_HOLIDAYS and MCX_HOLIDAYS can override default holiday sets for session accuracy.",
      "Vitest coverage should be kept for risk, replay, alerts, command parser, and request cache behavior.",
    ],
    futureImprovements: [
      "Persist paper accounts, orders, alerts, and command history across devices.",
      "Add broker-style order states such as pending, rejected, partially filled, modified, and cancelled.",
      "Add slippage and spread-aware fills using bid/ask depth rather than last-traded price only.",
      "Add provider data-quality dashboards with latency, freshness, error rate, and fallback counts.",
    ],
    interviewQuestions: [
      {
        question: "Why does EquityFlow need provider freshness metadata?",
        answer:
          "A trading UI can be dangerous if stale quotes look live. Freshness metadata tells the user and execution path whether data is live, delayed, cached, or fallback.",
        difficulty: "medium",
        category: "architecture",
      },
      {
        question: "How does the risk engine calculate useful portfolio warnings?",
        answer:
          "It derives gross exposure, required margin, margin availability, leverage, concentration, and a risk score. It then emits warnings for high leverage, low margin buffer, or top-position concentration.",
        difficulty: "hard",
        category: "code",
      },
      {
        question: "Why parse terminal commands into discriminated union objects?",
        answer:
          "A typed union lets the UI handle order, alert, layout, watch, chart, goto, and unknown commands safely while reusing validation rules for each action kind.",
        difficulty: "medium",
        category: "code",
      },
      {
        question: "What is different between NSE equity and MCX commodity market-hour logic?",
        answer:
          "They use different trading sessions, and commodities can have longer non-agri hours. The backend must use IST, weekdays, holiday sets, and segment-specific open windows.",
        difficulty: "medium",
        category: "concepts",
      },
      {
        question: "Why should paper trading include charges and margin?",
        answer:
          "Without charges and margin, simulated P&L and exposure are unrealistically clean. Including them teaches more accurate position sizing and risk behavior.",
        difficulty: "medium",
        category: "tradeoffs",
      },
      {
        question: "How would you make order fills more realistic?",
        answer:
          "Use bid/ask prices, spread, depth, volume, slippage, market hours, partial fills, latency, and order queue logic instead of filling every order at last-traded price.",
        difficulty: "hard",
        category: "architecture",
      },
      {
        question: "What diagnostics would you expose for provider problems?",
        answer:
          "Active provider, token source, last successful quote time, error message, CORS origin, market status, fallback reason, and freshness age for the symbols shown.",
        difficulty: "medium",
        category: "behavioral",
      },
      {
        question: "How do request caches help and hurt a trading interface?",
        answer:
          "They reduce duplicate requests and improve responsiveness, but stale cache can mislead users. The cache needs TTLs, invalidation, and freshness labels for market data.",
        difficulty: "hard",
        category: "tradeoffs",
      },
    ],
    flashcards: [
      {
        front: "What are EquityFlow's two market-data providers?",
        back: "Groww as the primary provider and Upstox as a fallback/provider option.",
        difficulty: "easy",
      },
      {
        front: "Why does EquityFlow use Asia/Kolkata time?",
        back: "Indian NSE and MCX market session rules are based on IST.",
        difficulty: "easy",
      },
      {
        front: "What does the risk engine compute besides P&L?",
        back: "Margin used, margin available, leverage, concentration, warnings, and risk score.",
        difficulty: "medium",
      },
      {
        front: "What command kinds can the terminal parser return?",
        back: "Order, alert, layout, watch, chart, goto, and unknown.",
        difficulty: "medium",
      },
      {
        front: "Why should market data caches expose freshness?",
        back: "So cached or stale quotes are not mistaken for live tradable prices.",
        difficulty: "hard",
      },
      {
        front: "What is concentration risk?",
        back: "Too much portfolio exposure sitting in one or a few positions.",
        difficulty: "medium",
      },
    ],
  },

  gridpulse: {
    descriptionAppend:
      " Interview focus: explain FastF1 ingestion, cache behavior, full-session telemetry versus lap fallback, merge_asof alignment, one-second resampling, interpolation, lap/compound mapping, time-base shifting, race-control and team-radio normalization, replay request caching, and why one shared race clock prevents UI drift.",
    architectureOverviewAppend:
      " The source backend loads FastF1 race sessions, enables a cache directory, merges position and car telemetry, resamples to one-second intervals, interpolates continuous channels, forward-fills discrete channels, computes global time bases, and returns replay-ready payloads consumed by React hooks and replay math utilities.",
    layers: [
      {
        name: "FastF1 session layer",
        description:
          "Loads seasons, race schedules, sessions, laps, weather, race-control messages, car data, and position data through FastF1.",
        technologies: ["FastF1", "f1_cache", "pandas"],
      },
      {
        name: "Replay normalization layer",
        description:
          "Merges car and position streams, maps lap metadata onto telemetry, resamples to one-second rows, and shifts timestamps onto a frontend timeline.",
        technologies: ["merge_asof", "resample", "interpolate"],
      },
      {
        name: "Client replay cache layer",
        description:
          "The React hook deduplicates telemetry and team-radio fetches by cache key so retries and re-renders do not hammer the backend.",
        technologies: ["useRaceReplayData", "axios", "D3"],
      },
    ],
    techStack: [
      {
        name: "pandas merge_asof",
        role: "Aligns telemetry rows with nearest car/position samples and latest lap metadata.",
        category: "library",
      },
      {
        name: "FastF1 cache",
        role: "Stores downloaded race/session data locally or in /tmp for hosted environments.",
        category: "library",
      },
      {
        name: "Axios",
        role: "Frontend data fetching for telemetry replay and team radio endpoints.",
        category: "library",
      },
      {
        name: "Replay math utilities",
        role: "Binary search, time-window slicing, lap completion, pit-stop visibility, sector visibility, and race-clock formatting.",
        category: "library",
      },
    ],
    howItWorksSteps: [
      {
        step: 6,
        title: "Merge car and position telemetry",
        description:
          "The backend merges car channels such as speed, throttle, brake, RPM, and gear with position channels such as X and Y using nearest-time alignment.",
        details:
          "This prevents separate traces from drifting when the replay needs both motion and car-state channels.",
      },
      {
        step: 7,
        title: "Resample and fill channels",
        description:
          "Telemetry is resampled to one-second rows, continuous channels are interpolated, and categorical channels such as lap, tire compound, gear, and DRS are forward-filled.",
        details:
          "This creates smoother playback while keeping discrete racing state stable between raw samples.",
      },
      {
        step: 8,
        title: "Normalize race-control and radio messages",
        description:
          "Frontend parsing converts mixed time formats into seconds and sorts messages so they appear at the right replay moment.",
      },
      {
        step: 9,
        title: "Compute replay visibility",
        description:
          "Replay utilities decide whether laps, sectors, pit stops, race-clock messages, and time windows should be visible at the current replay time.",
      },
    ],
    concepts: [
      {
        name: "merge_asof Alignment",
        category: "data",
        definition:
          "A time-series join that matches each row to the nearest or most recent row in another sorted time series.",
        explanation:
          "Telemetry sources often sample at different rates. merge_asof is useful when exact timestamps do not line up but nearby samples can be treated as the same moment.",
        relevance:
          "GridPulse uses merge_asof to combine car data, position data, lap number, and tire compound into replay rows.",
      },
      {
        name: "Telemetry Resampling",
        category: "data",
        definition:
          "Changing irregular or high-frequency samples into a regular time grid.",
        explanation:
          "A regular grid simplifies frontend playback. Continuous channels can be interpolated, while discrete channels need forward-fill or explicit missing-state handling.",
        relevance:
          "GridPulse resamples telemetry to one-second rows for smoother browser replay.",
      },
      {
        name: "Time-Base Shifting",
        category: "systems",
        definition:
          "Subtracting a common offset so multiple event streams share one replay timeline.",
        explanation:
          "Raw race data can include session-relative times, absolute times, or event times. A shared base prevents messages and telemetry from appearing at mismatched positions.",
        relevance:
          "GridPulse shifts time fields so telemetry, race control, team radio, and lap state align in the UI.",
      },
      {
        name: "Replay Request Deduplication",
        category: "web",
        definition:
          "Caching in-flight data requests so the same replay payload is fetched once for a given key.",
        explanation:
          "Heavy telemetry payloads are expensive. Deduplicating identical requests avoids backend load when React effects re-run or multiple components ask for the same race.",
        relevance:
          "GridPulse's useRaceReplayData hook stores promises in replayRequestCache by API URL, year, race, and retry token.",
      },
      {
        name: "Race Control Message Timeline",
        category: "data",
        definition:
          "A chronological stream of official race messages normalized onto the replay clock.",
        explanation:
          "Safety car, yellow flag, investigation, and other race-control messages explain why performance changed at a moment in the race.",
        relevance:
          "GridPulse normalizes race-control messages and displays them alongside telemetry replay.",
      },
    ],
    codeHighlights: [
      {
        title: "Telemetry merge and resample",
        description:
          "The backend creates replay-ready rows by aligning sources, resampling, interpolating continuous values, and forward-filling discrete state.",
        language: "python",
        code: `pos = pos.sort_values("Time")
car = car.sort_values("Time")
telemetry = pd.merge_asof(
    pos,
    car,
    on="Time",
    direction="nearest",
    tolerance=pd.Timedelta(milliseconds=250),
)

telemetry = telemetry.set_index("Time").resample("1s").first()
continuous = ["X", "Y", "Speed", "Distance", "Throttle", "Brake", "RPM"]
telemetry[continuous] = telemetry[continuous].interpolate(
    method="linear",
    limit_direction="both",
)
telemetry[["LapNumber", "Compound", "nGear", "DRS"]] = (
    telemetry[["LapNumber", "Compound", "nGear", "DRS"]].ffill()
)`,
        annotations: [
          "Continuous and categorical channels are filled differently.",
          "The tolerance prevents joining samples that are too far apart in time.",
        ],
      },
      {
        title: "Replay request cache",
        description:
          "The frontend caches in-flight replay requests so duplicate effects share the same network work.",
        language: "javascript",
        code: `const replayRequestCache = new Map();

function getReplayRequest(cacheKey, load) {
  if (replayRequestCache.has(cacheKey)) {
    return replayRequestCache.get(cacheKey);
  }

  const request = load().catch((error) => {
    replayRequestCache.delete(cacheKey);
    throw error;
  });

  replayRequestCache.set(cacheKey, request);
  return request;
}`,
        annotations: [
          "Failed requests are removed so retry can fetch again.",
          "The key includes API URL, year, race, and retry token.",
        ],
      },
    ],
    apiEndpoints: [
      {
        method: "GET",
        path: "/api/build_info",
        description:
          "Returns container build metadata so deployed environments can prove they are running the latest backend image.",
      },
      {
        method: "GET",
        path: "/api/seasons",
        description:
          "Returns seasons from 2018 through the current year for replay selection.",
      },
      {
        method: "GET",
        path: "/api/{year}/{race_name}/race/team_radio",
        description:
          "Returns team-radio messages normalized for the replay timeline when source data is available.",
      },
      {
        method: "GET",
        path: "/api/{year}/{race_name}/race/weather",
        description:
          "Returns weather samples used to explain stint, tire, and pace changes during the replay.",
      },
    ],
    databaseTables: [
      {
        name: "driver_session",
        description:
          "Driver-level race metadata including team color, classified position, total time, and driver number.",
        fields: ["session_id", "driver_number", "abbreviation", "team_color", "classified_position", "total_time"],
      },
      {
        name: "race_control_message",
        description:
          "Official messages normalized to replay seconds for timeline display.",
        fields: ["session_id", "time", "category", "message", "flag", "scope"],
      },
      {
        name: "team_radio_message",
        description:
          "Team-radio snippets normalized to replay time and linked to driver/session metadata.",
        fields: ["session_id", "driver", "time", "message", "source_url"],
      },
      {
        name: "weather_sample",
        description:
          "Weather readings for air temperature, track temperature, humidity, pressure, wind, and rainfall.",
        fields: ["session_id", "time", "air_temp", "track_temp", "humidity", "rainfall", "wind_speed"],
      },
    ],
    tradeoffs: [
      {
        decision: "Telemetry granularity",
        chose: "One-second resampled replay rows",
        over: "Sending every raw high-frequency sample",
        reasoning:
          "Raw telemetry can be large and uneven. One-second rows are smoother for browser replay and reduce payload size, while still showing strategy and performance trends.",
      },
      {
        decision: "Source alignment",
        chose: "merge_asof with tolerance",
        over: "Exact timestamp joins",
        reasoning:
          "Car and position data do not always share exact timestamps. Nearest-time joins with a tolerance recover usable rows without creating arbitrary matches.",
      },
      {
        decision: "Client request behavior",
        chose: "In-flight request cache",
        over: "Every hook run starts new network calls",
        reasoning:
          "Telemetry replay payloads are heavy. Reusing identical in-flight promises protects the backend and improves page stability.",
      },
      {
        decision: "Replay timeline",
        chose: "Shared race clock",
        over: "Independent component timers",
        reasoning:
          "Charts, map, lap panels, messages, sectors, and pit stops must agree on one current time to avoid replay drift.",
      },
    ],
    challenges: [
      {
        problem:
          "FastF1 versions and sessions can expose different message-loading capabilities.",
        solution:
          "Attempt session.load with messages and fall back to telemetry/laps/weather when messages are unsupported.",
        lesson:
          "External data libraries need compatibility paths around version differences.",
      },
      {
        problem:
          "Synthetic rows at time zero can make lap one appear to last through formation/grid delay.",
        solution:
          "Avoid injecting fake time-zero rows and leave leading LapNumber empty until the real first LapStartTime.",
        lesson:
          "Visualization fixes can corrupt domain meaning if they ignore race timing.",
      },
      {
        problem:
          "Race replay can fetch large payloads repeatedly during React effect reruns.",
        solution:
          "Cache in-flight replay requests and clear failed entries so retries remain explicit.",
        lesson:
          "Frontend data loading strategy matters when payloads are expensive.",
      },
    ],
    requirements: [
      "FastF1 cache directory must be writable; hosted environments can use /tmp/f1_cache.",
      "ALLOWED_ORIGINS must match the frontend origin unless wildcard mode is intentionally used.",
      "Telemetry replay expects sessions with laps and telemetry available from FastF1 or local extracted CSVs.",
      "Large races need payload-conscious frontend rendering and request deduplication.",
    ],
    futureImprovements: [
      "Add persistent processed-session cache keyed by year, race, session, driver set, and processing version.",
      "Add distance-based interpolation for driver comparison views where elapsed time hides corner-by-corner differences.",
      "Add source-quality badges for missing channels, interpolated segments, and fallback telemetry paths.",
      "Add lap-delta explanations that connect time loss to throttle, brake, gear, DRS, tire, and weather changes.",
    ],
    interviewQuestions: [
      {
        question: "Why use merge_asof for telemetry alignment?",
        answer:
          "Car and position telemetry are sampled separately and may not have identical timestamps. merge_asof joins the nearest reasonable sample so speed, throttle, X, and Y can share a row.",
        difficulty: "hard",
        category: "concepts",
      },
      {
        question: "Why resample telemetry to one-second intervals?",
        answer:
          "It reduces payload size, creates a stable replay cadence, and smooths uneven raw samples. Continuous values can be interpolated while discrete values are forward-filled.",
        difficulty: "medium",
        category: "tradeoffs",
      },
      {
        question: "Why should categorical telemetry be forward-filled instead of interpolated?",
        answer:
          "Values such as tire compound, gear, lap number, and DRS state are discrete. Interpolation would invent invalid intermediate states.",
        difficulty: "medium",
        category: "concepts",
      },
      {
        question: "How does GridPulse avoid replay drift?",
        answer:
          "It uses one shared current replay time. Every chart, message, sector, pit-stop indicator, and map sample is derived from that time.",
        difficulty: "medium",
        category: "architecture",
      },
      {
        question: "What is the purpose of time-base shifting?",
        answer:
          "It puts telemetry, race-control messages, radio, lap starts, and weather on one replay timeline even if the source data uses different relative or absolute time formats.",
        difficulty: "hard",
        category: "concepts",
      },
      {
        question: "Why cache in-flight replay requests on the client?",
        answer:
          "Telemetry payloads are heavy. If React effects or components request the same race data, sharing one promise prevents duplicate backend work and inconsistent loading states.",
        difficulty: "medium",
        category: "code",
      },
      {
        question: "What can go wrong if you inject a synthetic row at time zero?",
        answer:
          "Lap metadata can attach too early, making lap one appear to include formation or grid delay. That produces misleading lap duration and replay state.",
        difficulty: "hard",
        category: "concepts",
      },
      {
        question: "What would you add for production-grade telemetry caching?",
        answer:
          "A processed-session cache with versioned keys, source metadata, invalidation rules, payload compression, and explicit source-quality flags for missing or interpolated data.",
        difficulty: "hard",
        category: "architecture",
      },
    ],
    flashcards: [
      {
        front: "What does merge_asof solve in GridPulse?",
        back: "It aligns telemetry streams that have near but not identical timestamps.",
        difficulty: "hard",
      },
      {
        front: "Why are continuous and categorical telemetry channels filled differently?",
        back: "Continuous values can be interpolated; categorical states such as gear or tire compound should be forward-filled.",
        difficulty: "medium",
      },
      {
        front: "What prevents replay drift across views?",
        back: "A single shared replay clock used by every chart and panel.",
        difficulty: "medium",
      },
      {
        front: "Why cache replay requests in the frontend hook?",
        back: "To avoid duplicate heavy telemetry fetches for the same race and retry token.",
        difficulty: "medium",
      },
      {
        front: "What is time-base shifting?",
        back: "Subtracting a common offset so telemetry, messages, and events share one replay timeline.",
        difficulty: "hard",
      },
      {
        front: "Why avoid synthetic time-zero telemetry rows?",
        back: "They can attach lap metadata too early and distort lap-one duration.",
        difficulty: "hard",
      },
    ],
  },
};

function technicalTerm(
  name: string,
  category: Concept["category"],
  definition: string,
  explanation: string,
  relevance: string,
): Concept {
  return {
    name,
    category,
    definition,
    explanation,
    relevance,
  };
}

const technicalConcepts: Record<string, Concept[]> = {
  sentinel: [
    technicalTerm(
      "REST API",
      "web",
      "A request-response interface where clients call named HTTP endpoints to read or change application state.",
      "REST keeps command-style operations simple: the dashboard can start a simulation, submit an order, fetch snapshots, and request predictor results without holding a permanent connection for every action.",
      "Sentinel uses REST endpoints for explicit simulator controls and reserves the WebSocket path for live market streams.",
    ),
    technicalTerm(
      "FastAPI",
      "web",
      "A Python web framework that defines typed HTTP and WebSocket routes from Python functions.",
      "FastAPI fits Sentinel because the backend needs Python-native simulation and ML code while still exposing browser-friendly APIs with validation and OpenAPI documentation.",
      "It hosts the simulator control endpoints, predictor endpoints, and real-time WebSocket endpoint.",
    ),
    technicalTerm(
      "WebSocket",
      "systems",
      "A persistent two-way browser connection used when the server must push updates without repeated polling.",
      "A WebSocket stays open after the initial handshake, so market ticks, order-book deltas, liquidity metrics, and agent events can arrive as soon as the simulation produces them.",
      "Sentinel streams live simulator state to the dashboard instead of forcing the React app to poll every chart separately.",
    ),
    technicalTerm(
      "Async Event Loop",
      "systems",
      "A concurrency model that lets one process switch between many waiting tasks without starting a thread for each task.",
      "Async code is useful when a backend is coordinating network sockets, timer-driven simulation ticks, and lightweight background work. The event loop resumes each task when IO or a timer is ready.",
      "Sentinel uses this model to keep simulation control and live streaming responsive while many dashboard clients may be connected.",
    ),
    technicalTerm(
      "Reinforcement Learning",
      "ml",
      "A machine-learning setup where an agent learns actions by receiving rewards from an environment.",
      "Instead of training on fixed labels, an RL policy tries actions, observes state changes, and improves toward higher cumulative reward. It is useful for trading experiments because profit, inventory, and risk can all be encoded into the reward.",
      "Sentinel can compare rule-based market makers with learned policies that act inside the simulated market.",
    ),
    technicalTerm(
      "Proximal Policy Optimization",
      "ml",
      "An RL algorithm that updates a policy in small clipped steps to avoid unstable behavior after each training batch.",
      "PPO is popular because it is easier to tune than many older policy-gradient methods. The clipping objective discourages a new policy from moving too far away from the policy that collected the training data.",
      "Sentinel references PPO as the candidate method for training market-making behavior without letting the policy make extreme jumps between iterations.",
    ),
    technicalTerm(
      "Reward Function",
      "ml",
      "The scoring rule that tells an RL agent whether its behavior was useful.",
      "For a market-making agent, reward design matters more than model size: rewarding only short-term profit can create risky inventory, while adding spread capture, inventory penalty, and adverse-selection costs creates a more interview-defensible policy.",
      "Sentinel's RL path depends on reward terms that balance profit against inventory and liquidity risk.",
    ),
    technicalTerm(
      "Gymnasium Environment",
      "ml",
      "A standard Python interface with reset and step methods for RL training loops.",
      "Gymnasium wraps a domain problem as observations, actions, rewards, and done flags. That contract lets PPO or other RL libraries train without knowing Sentinel-specific simulator internals.",
      "Sentinel can expose its market simulator through a Gymnasium-style environment for policy experiments.",
    ),
    technicalTerm(
      "Random Forest",
      "ml",
      "An ensemble of decision trees whose predictions are averaged or voted to reduce single-tree overfitting.",
      "Random forests are useful as strong, interpretable baselines when tabular features drive a classification or regression task. They are not sequential policies, but they can score liquidity or large-order signals from engineered market features.",
      "Sentinel can use tree-based predictors as a baseline for market-signal panels before introducing more complex learned policies.",
    ),
    technicalTerm(
      "Zustand Store",
      "web",
      "A small React state store used to keep shared client state outside individual components.",
      "A dashboard with live updates needs one source of truth for connection status, selected symbols, recent ticks, and chart buffers. Zustand provides that without a large reducer setup.",
      "Sentinel uses a frontend store pattern so WebSocket messages can update multiple panels consistently.",
    ),
    technicalTerm(
      "Recharts",
      "data",
      "A React charting library for rendering time-series, bar, area, and composed charts from component props.",
      "Recharts is practical for interview dashboards because it keeps chart code close to React state and avoids writing low-level SVG logic for every panel.",
      "Sentinel uses chart components for price, liquidity, depth, and agent-performance panels.",
    ),
    technicalTerm(
      "Docker Compose",
      "devops",
      "A local orchestration file that starts related services with repeatable ports, volumes, and environment variables.",
      "Compose makes development reproducible when a project needs a frontend, backend, database, worker, or cache. It is lighter than Kubernetes and enough for local interview demos.",
      "Sentinel can package the backend and dashboard runtime so the simulator starts consistently on another machine.",
    ),
    technicalTerm(
      "CORS",
      "web",
      "Browser security rules that control which origins may call an API from frontend JavaScript.",
      "CORS is not backend authentication. It is a browser-enforced policy that decides whether a page from one origin can read responses from another origin.",
      "Sentinel needs CORS configured when the Next.js dashboard and FastAPI backend run on different localhost ports or deployment domains.",
    ),
    technicalTerm(
      "In-Memory State",
      "systems",
      "Runtime data kept inside a running process instead of persisted first to a database.",
      "In-memory state is fast and simple, but it makes horizontal scaling and restarts harder because another process does not automatically see the same simulator object.",
      "Sentinel keeps the active simulator in process for low-latency updates, which is why deployment and scaling need careful explanation.",
    ),
    technicalTerm(
      "Market Microstructure",
      "finance",
      "The study of how orders, liquidity, spreads, and matching rules form prices inside a market.",
      "Microstructure focuses on the mechanics beneath a visible price chart: who posts liquidity, who takes it, how queue priority works, and how large orders move the book.",
      "Sentinel is built around microstructure concepts such as order-book depth, liquidity shocks, market makers, and hidden institutional flow.",
    ),
  ],
  engram: [
    technicalTerm(
      "REST API",
      "web",
      "A request-response interface where clients call HTTP endpoints with methods such as GET and POST.",
      "REST is a good fit for chat and memory operations because the client can send a discrete request, receive a structured response, and retry failed calls with normal HTTP tooling.",
      "Engram exposes chat, memory lookup, health, and admin-style operations through HTTP endpoints.",
    ),
    technicalTerm(
      "OpenAI-Compatible API",
      "web",
      "An API shape that mimics common OpenAI chat or completion request and response fields.",
      "Compatibility lets existing clients point at a different base URL without rewriting message formatting, token settings, or response parsing.",
      "Engram can behave as a memory-enriching proxy in front of an LLM provider while preserving the familiar chat contract.",
    ),
    technicalTerm(
      "LLM Provider Adapter",
      "systems",
      "A boundary object that translates one internal request shape into a provider-specific API call.",
      "Adapters prevent provider details from leaking across the app. If models, auth headers, URLs, or response fields change, the update stays inside the provider boundary.",
      "Engram uses the adapter idea so memory retrieval and prompt enrichment remain independent of the chosen LLM provider.",
    ),
    technicalTerm(
      "Vector Embedding",
      "data",
      "A numeric representation of text where semantically similar text lands close together in vector space.",
      "Embeddings turn memory search from exact keyword matching into semantic retrieval. Two phrases can match even when they do not share the same words.",
      "Engram embeds chat turns and stored memories so pgvector can rank relevant memories for the next request.",
    ),
    technicalTerm(
      "PostgreSQL",
      "data",
      "A relational database used for durable structured records, indexes, constraints, and transactional writes.",
      "PostgreSQL gives Engram durable user-scoped memory rows, metadata fields, and extension support through pgvector without introducing a separate vector database.",
      "Engram stores memory content, embeddings, user ownership, metadata, and access records in PostgreSQL.",
    ),
    technicalTerm(
      "JSONB",
      "data",
      "PostgreSQL's binary JSON type for storing semi-structured metadata with index support.",
      "JSONB is useful when metadata changes faster than the core schema. It still lives inside the same transaction as the row it describes.",
      "Engram can attach source, extraction, model, and routing metadata to memories without adding a new column for every experiment.",
    ),
    technicalTerm(
      "Approximate Nearest Neighbor Search",
      "data",
      "A search technique that finds close vectors quickly without comparing against every row exactly.",
      "ANN trades a small amount of exactness for lower latency on large embedding tables. Index choices such as IVFFlat matter when the memory table grows.",
      "Engram can use vector indexes to keep semantic memory retrieval fast as stored memories increase.",
    ),
    technicalTerm(
      "Async Database Pool",
      "systems",
      "A managed group of reusable database connections used by async request handlers.",
      "Opening a new database connection for every request is expensive. A pool reuses connections and lets concurrent handlers wait cleanly when the database is saturated.",
      "Engram benefits from a pool because chat requests can trigger authentication, retrieval, writes, and observability logging.",
    ),
    technicalTerm(
      "Background Task",
      "systems",
      "Work scheduled after the user-facing response path so the API can return sooner.",
      "Background tasks are useful for extraction, summarization, indexing, and cleanup that should not block the response the user is waiting for.",
      "Engram schedules memory extraction after the model response so chat latency is not dominated by post-processing.",
    ),
    technicalTerm(
      "Authentication Header",
      "web",
      "An HTTP header that carries credentials such as a bearer token or API key.",
      "Keeping credentials in headers separates authentication data from the JSON body and works consistently across routes, proxies, and middleware.",
      "Engram verifies client API keys before allowing chat or memory operations.",
    ),
    technicalTerm(
      "API Key Hashing",
      "systems",
      "Storing a one-way hash of a secret instead of the secret itself.",
      "Hashing means a database leak does not directly expose usable keys. Verification hashes the presented key and compares it to the stored hash.",
      "Engram stores key hashes so client secrets are not kept in plaintext.",
    ),
    technicalTerm(
      "CORS",
      "web",
      "Browser rules that decide whether a frontend origin may read responses from an API origin.",
      "CORS is required when a browser app hosted on one origin calls an API hosted on another. It does not replace server-side auth.",
      "Engram needs CORS settings for browser-based demos or dashboards that call the API from a separate URL.",
    ),
    technicalTerm(
      "Docker Compose",
      "devops",
      "A configuration file for starting multiple local services with repeatable networking and environment variables.",
      "Compose is well suited to Engram because the API and PostgreSQL plus pgvector extension need to start together during local development.",
      "Engram can use Compose to run the API and vector-enabled database with predictable ports.",
    ),
    technicalTerm(
      "MCP Server",
      "systems",
      "A Model Context Protocol service that exposes tools or resources to an AI client through a standard contract.",
      "MCP separates a model client from the implementation details of external capabilities. The client calls named tools while the server handles auth, validation, and data access.",
      "Engram's MCP surface lets compatible agents read or write personal memory through a tool interface instead of only raw HTTP calls.",
    ),
  ],
  parkinsons: [
    technicalTerm(
      "Retrieval-Augmented Generation",
      "ml",
      "A pattern where a model response is grounded with retrieved documents or facts before generation.",
      "RAG helps reduce unsupported model answers by giving the generator relevant source context. It still needs careful citation, filtering, and domain safety checks.",
      "NeuroAssess uses RAG-style clinical context to make generated reports more explainable and tied to known medical material.",
    ),
    technicalTerm(
      "TF-IDF",
      "data",
      "A text scoring method that weights words by how often they appear in one document and how rare they are across all documents.",
      "TF-IDF is a strong lightweight baseline for document retrieval because it needs no training data and makes keyword relevance easy to inspect.",
      "NeuroAssess can use TF-IDF to retrieve medical knowledge snippets for report context.",
    ),
    technicalTerm(
      "Transformer Encoder",
      "ml",
      "A neural-network block that uses self-attention to build contextual token representations.",
      "Encoder-only transformers are effective for classification because every token can attend to the rest of the sequence before the final representation is scored.",
      "NeuroAssess references transformer-based biomedical models for classification and clinical text understanding.",
    ),
    technicalTerm(
      "PubMedBERT",
      "healthcare",
      "A BERT-style language model pretrained on biomedical literature.",
      "Domain pretraining matters because clinical and biomedical terms differ from general web text. PubMedBERT starts with representations closer to medical language.",
      "NeuroAssess can use biomedical encoders to improve medical text features compared with a generic language model.",
    ),
    technicalTerm(
      "BioGPT",
      "healthcare",
      "A generative language model trained for biomedical text tasks.",
      "Generative biomedical models can draft explanations, summaries, and report text, but they require guardrails because fluent medical text is not automatically clinically correct.",
      "NeuroAssess uses biomedical generation as part of the report-writing discussion, not as a replacement for diagnosis.",
    ),
    technicalTerm(
      "Clinical-T5",
      "healthcare",
      "A text-to-text transformer adapted for clinical language tasks.",
      "T5-style models frame many tasks as input text to output text, which is useful for summarization, explanation, and controlled report sections.",
      "NeuroAssess can use clinical text-to-text generation for structured report narratives when source context is available.",
    ),
    technicalTerm(
      "PyTorch Model",
      "ml",
      "A machine-learning model implemented with PyTorch tensors, modules, and serialized weights.",
      "PyTorch is commonly used for research-style deep learning because model code is Pythonic and training loops are explicit.",
      "NeuroAssess can train or load neural classifiers for Parkinsons risk prediction and supporting report features.",
    ),
    technicalTerm(
      "joblib Artifact",
      "ml",
      "A serialized Python object often used for scikit-learn models, vectorizers, and preprocessing pipelines.",
      "Saving preprocessing and model objects together prevents training-serving skew. The app should load the same scaler, encoder, or vectorizer used during training.",
      "NeuroAssess uses persisted model artifacts so the web app can run inference without retraining.",
    ),
    technicalTerm(
      "Patient-Level Split",
      "healthcare",
      "A train-test split where records from the same patient never appear in both sets.",
      "Medical datasets often have repeated visits or correlated measurements. Splitting by row can leak patient-specific patterns and inflate metrics.",
      "NeuroAssess must explain patient-level splitting to defend that model performance is not caused by data leakage.",
    ),
    technicalTerm(
      "Focal Loss",
      "ml",
      "A classification loss that down-weights easy examples and focuses training on harder or minority cases.",
      "Focal loss is useful when classes are imbalanced because it prevents abundant easy negatives from dominating the gradient.",
      "NeuroAssess discusses focal loss as an option for Parkinsons classification when positive and negative labels are uneven.",
    ),
    technicalTerm(
      "Model Calibration",
      "ml",
      "The process of making predicted probabilities match observed outcome frequencies.",
      "A classifier can rank cases well but still be overconfident. Calibration matters in healthcare because a 0.80 score should mean something close to 80 percent risk under the model assumptions.",
      "NeuroAssess needs calibrated confidence language so reports do not overstate a model score.",
    ),
    technicalTerm(
      "PDF Text Extraction",
      "data",
      "Parsing text content out of PDF files for indexing, retrieval, or display.",
      "PDF extraction is messy because layout, columns, tables, scans, and encodings vary. A robust pipeline should handle missing text and keep source metadata.",
      "NeuroAssess uses document extraction to make medical references available to the RAG/report path.",
    ),
    technicalTerm(
      "Flask API",
      "web",
      "A lightweight Python web API built with Flask route handlers.",
      "Flask is straightforward for ML prototypes because the same Python process can load models, preprocess requests, and return JSON responses.",
      "NeuroAssess exposes model inference and report generation through Flask routes.",
    ),
    technicalTerm(
      "CORS",
      "web",
      "Browser rules that control whether a frontend can read responses from a different backend origin.",
      "A Vite or React frontend on one port cannot freely call a Flask backend on another port unless the backend allows that origin.",
      "NeuroAssess needs CORS when the frontend and Flask API run separately during local development or deployment.",
    ),
  ],
  occasio: [
    technicalTerm(
      "REST API",
      "web",
      "A set of HTTP endpoints where clients use methods such as GET, POST, PATCH, and DELETE to operate on resources.",
      "REST maps well to events, registrations, users, payments, and tickets because each resource can have clear routes and request bodies.",
      "Occasio exposes resource-oriented backend endpoints for event discovery, booking, admin workflows, and ticket validation.",
    ),
    technicalTerm(
      "Prisma ORM",
      "data",
      "A TypeScript ORM that maps database tables to typed client methods and generated schema types.",
      "Prisma reduces manual SQL for common CRUD operations while preserving a schema file that documents models, relations, indexes, and constraints.",
      "Occasio uses Prisma to keep event, user, registration, payment, and ticket logic type-checked against the database schema.",
    ),
    technicalTerm(
      "PostgreSQL",
      "data",
      "A relational database for durable records, transactions, constraints, and joins.",
      "Event booking needs relational guarantees because users, registrations, tickets, payments, and organizer permissions must stay consistent.",
      "Occasio stores booking lifecycle data in PostgreSQL-backed relational tables.",
    ),
    technicalTerm(
      "Database Migration",
      "devops",
      "A versioned database schema change that can be applied consistently across environments.",
      "Migrations let a team evolve tables without manually editing production databases. They are critical when payment or ticketing data must not drift from application code.",
      "Occasio relies on migrations to keep Prisma schema changes aligned with deployed database state.",
    ),
    technicalTerm(
      "Payment Webhook",
      "systems",
      "A provider-to-server callback that reports payment status changes after checkout.",
      "Webhooks are necessary because payment confirmation may happen after the user leaves the checkout page. The backend must verify the callback before granting access.",
      "Occasio uses payment webhooks to move registrations from pending to paid and then issue tickets.",
    ),
    technicalTerm(
      "Idempotency Key",
      "systems",
      "A unique key used to make repeated requests or callbacks produce one final effect.",
      "Payment providers can retry webhooks, and clients can retry failed requests. Idempotency prevents duplicate registrations, duplicate tickets, or double application of a payment event.",
      "Occasio needs idempotent payment handling so retried callbacks do not create duplicate confirmed bookings.",
    ),
    technicalTerm(
      "HMAC Signature",
      "systems",
      "A keyed hash used to verify that a message came from a trusted sender and was not modified.",
      "For webhooks, the server recomputes the HMAC with the shared secret and compares it to the provider signature before trusting the payload.",
      "Occasio should verify payment webhook signatures before updating payment or ticket state.",
    ),
    technicalTerm(
      "QR Code Payload",
      "web",
      "The encoded data inside a QR code, usually a ticket id, token, or signed validation string.",
      "A QR code should not simply expose mutable user data. A good payload is compact, unique, and verifiable by the backend.",
      "Occasio uses QR-backed tickets so event staff can scan and validate entry without manually searching registrations.",
    ),
    technicalTerm(
      "Object Storage",
      "devops",
      "Cloud storage for files such as images, PDFs, and uploaded assets, separate from the relational database.",
      "Databases should store file metadata and URLs, while large binaries live in object storage for cheaper delivery and easier CDN integration.",
      "Occasio keeps event banners, uploaded assets, or generated ticket files outside the main relational tables.",
    ),
    technicalTerm(
      "Redis Queue",
      "systems",
      "A Redis-backed work queue used to process jobs outside the HTTP request path.",
      "Queues help with emails, ticket generation, reminders, and webhook follow-up because the user request can finish before slower side effects complete.",
      "Occasio can use queued jobs for confirmation emails and ticket delivery after payment confirmation.",
    ),
    technicalTerm(
      "JWT Session",
      "web",
      "A signed token containing claims that a server can verify without storing every session in a database.",
      "JWTs are useful for stateless auth, but they still need expiration, secret rotation, and careful claim design.",
      "Occasio uses authenticated requests to separate attendee, organizer, and admin workflows.",
    ),
    technicalTerm(
      "Unique Constraint",
      "data",
      "A database rule that prevents duplicate values for selected columns.",
      "Application checks can race under concurrency; database constraints are the final guard against duplicate registrations or repeated external payment IDs.",
      "Occasio needs unique constraints for fields such as payment order IDs, ticket codes, and one-user-one-event registration rules.",
    ),
    technicalTerm(
      "Cascade Delete",
      "data",
      "A relational rule where deleting a parent row automatically deletes or updates dependent child rows.",
      "Cascade behavior must be chosen carefully in booking systems because deleting an event may affect registrations, tickets, payments, and audit records.",
      "Occasio's data model has to decide which child records can cascade and which must be retained for payment history.",
    ),
    technicalTerm(
      "CORS",
      "web",
      "Browser rules that control which frontend origins may read API responses.",
      "Local and deployed frontends often run on a different origin than the backend API, so CORS settings must match the allowed client URLs.",
      "Occasio needs CORS for its web app to call the backend safely from development and production origins.",
    ),
  ],
  equityflow: [
    technicalTerm(
      "REST API",
      "web",
      "A request-response HTTP interface used for commands, snapshots, and account operations.",
      "REST is suitable for actions that have a clear beginning and end, such as placing an order, fetching holdings, changing provider preference, or loading a portfolio snapshot.",
      "EquityFlow uses REST alongside SSE so commands and streaming market updates are separated cleanly.",
    ),
    technicalTerm(
      "FastAPI",
      "web",
      "A Python API framework with typed request models, generated docs, and async route support.",
      "FastAPI lets a trading workstation keep provider calls, cache logic, and paper-trading state in Python while still serving a typed web API to the frontend.",
      "EquityFlow uses FastAPI for market data proxying, account operations, alerts, and streaming endpoints.",
    ),
    technicalTerm(
      "SSE Stream",
      "systems",
      "A one-way HTTP stream where the server continuously sends text events to the browser.",
      "Server-Sent Events are simpler than WebSockets when only the server needs to push updates. The browser reconnect behavior is also built in.",
      "EquityFlow uses SSE for live prices, alerts, and terminal-style updates where the client does not need full duplex messaging.",
    ),
    technicalTerm(
      "OAuth Access Token",
      "web",
      "A short-lived credential that authorizes API calls to a provider on behalf of a user or app.",
      "Broker integrations often require tokens rather than raw passwords. The backend must store, refresh, and scope them carefully.",
      "EquityFlow uses provider credentials to call market-data or brokerage APIs such as Upstox-style integrations.",
    ),
    technicalTerm(
      "Provider Adapter",
      "systems",
      "A wrapper that normalizes different external provider APIs behind one internal interface.",
      "Adapters make it possible to switch providers or fall back when one source is stale without changing every endpoint or UI component.",
      "EquityFlow uses provider adapters to hide Groww, Upstox, Yahoo-style, or mock-provider differences from the trading UI.",
    ),
    technicalTerm(
      "Request Cache",
      "systems",
      "A short-lived store that reuses recent external API responses to reduce latency and rate-limit pressure.",
      "Financial APIs can be slow, quota-limited, or unavailable. A cache gives the UI a fresher-than-nothing response while avoiding repeated calls for the same symbol.",
      "EquityFlow caches provider responses so charts and dashboards do not hammer upstream market-data APIs.",
    ),
    technicalTerm(
      "P&L",
      "finance",
      "Profit and loss, the gain or loss on positions after comparing entry cost with current or exit value.",
      "P&L can be realized after selling or unrealized while a position is still open. It is central to trading workflows because it drives risk and performance views.",
      "EquityFlow calculates portfolio and position-level P&L for paper trades and holdings views.",
    ),
    technicalTerm(
      "Margin",
      "finance",
      "Borrowed or reserved capital that allows a trader to hold positions larger than available cash.",
      "Margin increases exposure and risk. A platform must estimate required margin before accepting orders, especially for derivatives.",
      "EquityFlow explains margin estimation for F&O-style paper execution and risk panels.",
    ),
    technicalTerm(
      "Option Chain",
      "finance",
      "A table of available option contracts for an underlying asset across strikes and expiry dates.",
      "Option chains expose calls, puts, strikes, expiries, premiums, open interest, and implied-volatility style fields used by derivatives traders.",
      "EquityFlow uses option-chain data to support F&O analysis in the terminal-like interface.",
    ),
    technicalTerm(
      "Futures and Options",
      "finance",
      "Derivative contracts whose value depends on an underlying asset, index, or instrument.",
      "Futures create an obligation to buy or sell at a set price and date, while options provide a right with premium-based pricing. Both require contract-aware sizing and margin logic.",
      "EquityFlow needs F&O concepts for lot sizes, margin checks, option-chain display, and risk calculations.",
    ),
    technicalTerm(
      "Lot Size",
      "finance",
      "The fixed quantity of units represented by one derivatives contract.",
      "A user cannot always trade one share equivalent in F&O. Contract quantity affects notional exposure, margin, and P&L.",
      "EquityFlow validates derivative paper orders against contract lot sizes.",
    ),
    technicalTerm(
      "Tick Size",
      "finance",
      "The minimum price increment allowed for a tradable instrument.",
      "Tick size affects order validation and price rounding. A price that looks valid mathematically may still be rejected if it does not align to the tick.",
      "EquityFlow should round or reject order prices that do not match the instrument tick size.",
    ),
    technicalTerm(
      "Command Parser",
      "systems",
      "Logic that turns typed terminal commands into structured actions and arguments.",
      "A parser lets users interact quickly with a dense workstation UI, but it must provide useful errors when symbols, quantities, or command names are invalid.",
      "EquityFlow's terminal command flow converts text commands into watchlist, quote, order, or alert operations.",
    ),
    technicalTerm(
      "CORS",
      "web",
      "Browser rules that determine which frontend origins can read backend responses.",
      "Trading frontends are often served separately from Python APIs during local development, so CORS must allow the actual frontend origin without opening everything unnecessarily.",
      "EquityFlow needs CORS when the Next.js or React UI calls FastAPI from another origin.",
    ),
    technicalTerm(
      "Docker",
      "devops",
      "A container runtime that packages an app with its operating-system-level dependencies.",
      "Docker makes it easier to reproduce a backend runtime with the same Python version, packages, and startup command across machines.",
      "EquityFlow can containerize its backend market-data proxy for consistent local and deployment behavior.",
    ),
  ],
  gridpulse: [
    technicalTerm(
      "REST API",
      "web",
      "A request-response HTTP interface where each route returns a structured resource or computed result.",
      "REST is suitable for replay loading because the frontend can request race metadata, laps, telemetry slices, and derived analytics as normal JSON payloads.",
      "GridPulse uses REST endpoints for race discovery, replay metadata, telemetry, and analytics views.",
    ),
    technicalTerm(
      "FastAPI",
      "web",
      "A Python API framework with type hints, validation, async support, and generated documentation.",
      "FastAPI fits GridPulse because the heavy data work is in Python libraries such as FastF1 and pandas, while the frontend still needs a clean typed API.",
      "GridPulse serves race replay and analytics data from a FastAPI backend.",
    ),
    technicalTerm(
      "FastF1",
      "data",
      "A Python library for loading Formula 1 timing, telemetry, laps, weather, and session data.",
      "FastF1 handles domain-specific data access and caching that would be expensive to rebuild manually. The app still has to normalize that data for frontend replay.",
      "GridPulse uses FastF1 as the source layer for race and telemetry datasets.",
    ),
    technicalTerm(
      "pandas DataFrame",
      "data",
      "A tabular in-memory data structure with labeled columns and vectorized transformation operations.",
      "DataFrames are practical for telemetry because columns such as timestamp, speed, throttle, brake, lap, and driver can be filtered and transformed together.",
      "GridPulse uses pandas-style transformations before sending replay-ready JSON to the frontend.",
    ),
    technicalTerm(
      "Time Series",
      "data",
      "Data points ordered by time, often sampled at irregular or regular intervals.",
      "Replay systems need consistent time alignment so charts, maps, and event logs move together. Missing or irregular samples must be handled deliberately.",
      "GridPulse treats telemetry, race-control messages, and team-radio events as time-series data on one replay timeline.",
    ),
    technicalTerm(
      "merge_asof",
      "data",
      "A pandas operation that joins rows by nearest earlier or nearest nearby timestamp instead of exact equality.",
      "Telemetry sources rarely share exact timestamps. merge_asof aligns lap or event metadata to the closest relevant telemetry row without inventing exact matches.",
      "GridPulse uses as-of alignment to attach contextual race data to high-frequency telemetry samples.",
    ),
    technicalTerm(
      "Resampling",
      "data",
      "Changing the frequency of time-series data by aggregating or filling points at a new interval.",
      "Resampling can make uneven telemetry easier to replay, but aggressive resampling can hide spikes or distort timing.",
      "GridPulse resamples telemetry to balance smooth playback with payload size.",
    ),
    technicalTerm(
      "Interpolation",
      "data",
      "Estimating missing values between known data points.",
      "Interpolation can make charts and vehicle positions look continuous, but it should not create misleading facts where data is absent.",
      "GridPulse uses interpolation carefully for smoother replay visuals while preserving original event timing.",
    ),
    technicalTerm(
      "Forward Fill",
      "data",
      "A missing-data technique that carries the last known value forward until a new value appears.",
      "Forward fill is useful for state-like fields such as current lap or driver status, but it can be wrong for rapidly changing numeric values if overused.",
      "GridPulse can forward-fill metadata so telemetry rows keep the latest known lap or session context.",
    ),
    technicalTerm(
      "D3",
      "data",
      "A JavaScript visualization library for binding data to SVG, canvas, or DOM elements.",
      "D3 is useful when a visualization needs custom scales, axes, paths, or interaction beyond a standard chart component.",
      "GridPulse uses D3-style visualization for telemetry-heavy race views and track/replay interactions.",
    ),
    technicalTerm(
      "Recharts",
      "data",
      "A React charting library that renders common chart types from declarative components.",
      "Recharts is useful for dashboard panels where line, area, and composed charts can be assembled quickly from replay data.",
      "GridPulse can use Recharts for speed, throttle, brake, gap, and lap comparison panels.",
    ),
    technicalTerm(
      "Replay Clock",
      "systems",
      "A shared playback time value that drives all replay components.",
      "The replay clock prevents charts, maps, tables, and events from advancing independently. Every view derives its visible slice from the same current replay time.",
      "GridPulse uses a replay clock to synchronize telemetry, race-control messages, and driver views.",
    ),
    technicalTerm(
      "Request Cache",
      "systems",
      "A cache that stores expensive API or data-loading results so repeated requests are faster.",
      "Race telemetry can be slow to load and transform. Caching avoids repeatedly parsing the same session when users revisit a race or scrub views.",
      "GridPulse caches FastF1-derived data and replay metadata to reduce backend latency.",
    ),
    technicalTerm(
      "Docker",
      "devops",
      "A container runtime for packaging an application and its dependencies into a reproducible image.",
      "Docker helps with Python data applications because native packages, cache directories, and startup commands can otherwise drift across machines.",
      "GridPulse can containerize the backend so FastAPI, FastF1 dependencies, and cache behavior are reproducible.",
    ),
    technicalTerm(
      "CORS",
      "web",
      "Browser rules that decide whether a frontend origin may read backend API responses.",
      "A Vite or Next frontend calling a FastAPI backend from another port needs explicit allowed origins.",
      "GridPulse needs CORS in local development and split frontend-backend deployment.",
    ),
  ],
};

function appendText(base: string, extra?: string) {
  return extra ? `${base} ${extra}` : base;
}

function mergeConcepts(concepts: Concept[]) {
  const seen = new Set<string>();

  return concepts.filter((concept) => {
    const key = concept.name.toLowerCase();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export function enrichProject(project: Project): Project {
  const addition = additions[project.slug];

  if (!addition) {
    return project;
  }

  return {
    ...project,
    description: appendText(project.description, addition.descriptionAppend),
    architecture: {
      ...project.architecture,
      overview: appendText(
        project.architecture.overview,
        addition.architectureOverviewAppend,
      ),
      layers: [...project.architecture.layers, ...(addition.layers ?? [])],
    },
    techStack: [...project.techStack, ...(addition.techStack ?? [])],
    howItWorks: {
      ...project.howItWorks,
      steps: [...project.howItWorks.steps, ...(addition.howItWorksSteps ?? [])],
    },
    concepts: mergeConcepts([
      ...project.concepts,
      ...(addition.concepts ?? []),
      ...(technicalConcepts[project.slug] ?? []),
    ]),
    codeHighlights: [
      ...project.codeHighlights,
      ...(addition.codeHighlights ?? []),
    ],
    apiDesign: project.apiDesign
      ? {
          ...project.apiDesign,
          endpoints: [
            ...project.apiDesign.endpoints,
            ...(addition.apiEndpoints ?? []),
          ],
        }
      : project.apiDesign,
    databaseDesign: project.databaseDesign
      ? {
          ...project.databaseDesign,
          tables: [
            ...project.databaseDesign.tables,
            ...(addition.databaseTables ?? []),
          ],
        }
      : project.databaseDesign,
    tradeoffs: [...project.tradeoffs, ...(addition.tradeoffs ?? [])],
    challenges: [...project.challenges, ...(addition.challenges ?? [])],
    requirements: [...project.requirements, ...(addition.requirements ?? [])],
    futureImprovements: [
      ...project.futureImprovements,
      ...(addition.futureImprovements ?? []),
    ],
    interviewQuestions: [
      ...project.interviewQuestions,
      ...(addition.interviewQuestions ?? []),
    ],
    flashcards: [...project.flashcards, ...(addition.flashcards ?? [])],
  };
}
