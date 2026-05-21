import type { Project } from "@/lib/types";

export const engram: Project = {
  slug: "engram",
  name: "Engram",
  tagline: "Self-hostable AI memory layer with proxy injection, pgvector retrieval, and MCP access.",
  description:
    "Engram sits between applications and LLM providers, retrieves relevant memories from PostgreSQL with pgvector, injects them into prompts, forwards the request, and stores durable memories after the response.",
  repo: "https://github.com/macayu17/Engram",
  status: "active",
  domain: "AI infrastructure",
  domainColor:
    "border-teal-500/30 bg-teal-500/10 text-teal-800 dark:text-teal-300",
  icon: "brain-circuit",
  architecture: {
    overview:
      "Engram is a four-service Docker Compose stack: FastAPI proxy, PostgreSQL 16 with pgvector, a TypeScript MCP server, and a Next.js dashboard protected by Clerk.",
    diagram: `graph LR
      App[Client app] --> API[FastAPI proxy]
      API --> Provider[LLM provider]
      API <--> DB[(PostgreSQL 16 + pgvector)]
      MCP[TypeScript MCP server] <--> API
      Dashboard[Next.js dashboard] --> API
      Dashboard --> Clerk[Clerk auth]
      API --> Extractor[Memory extraction pipeline]
      Extractor --> DB`,
    layers: [
      {
        name: "Proxy API",
        description:
          "Intercepts OpenAI-compatible chat requests, authenticates users, retrieves memory, and forwards enriched messages.",
        technologies: ["FastAPI", "Python", "OpenAI-compatible HTTP"],
      },
      {
        name: "Memory store",
        description:
          "Stores users, API key hashes, memory text, metadata, and vector(384) embeddings.",
        technologies: ["PostgreSQL 16", "pgvector"],
      },
      {
        name: "Agent tool layer",
        description:
          "Exposes memory reads and writes to AI coding agents through Model Context Protocol tools.",
        technologies: ["TypeScript", "MCP SDK"],
      },
      {
        name: "Developer console",
        description:
          "Lets users inspect, search, and manage memories through a Next.js dashboard with Clerk sessions.",
        technologies: ["Next.js", "Clerk", "TypeScript"],
      },
    ],
  },
  techStack: [
    {
      name: "FastAPI",
      role: "OpenAI-compatible proxy, user API, and memory extraction orchestrator.",
      category: "backend",
    },
    {
      name: "PostgreSQL 16",
      role: "Primary durable store for users, memory records, and metadata.",
      category: "database",
    },
    {
      name: "pgvector",
      role: "Similarity search over vector(384) embeddings.",
      category: "database",
    },
    {
      name: "TypeScript MCP",
      role: "Agent-facing tools for memory lookup and capture.",
      category: "backend",
    },
    {
      name: "Next.js",
      role: "Dashboard for memory inspection and service administration.",
      category: "frontend",
    },
    {
      name: "Docker Compose",
      role: "Self-hosted orchestration for API, database, MCP, and dashboard services.",
      category: "devops",
    },
    {
      name: "Clerk",
      role: "Authentication and session management for the dashboard.",
      category: "library",
    },
  ],
  howItWorks: {
    summary:
      "A client sends a chat request to Engram instead of directly to the model provider. Engram authenticates the user, retrieves semantically similar memories, injects them into the prompt, forwards the request, and stores durable memories from the completed conversation.",
    steps: [
      {
        step: 1,
        title: "Register a user",
        description:
          "The API creates a user and returns a one-time API key while storing only its hash.",
      },
      {
        step: 2,
        title: "Receive chat traffic",
        description:
          "The client calls /v1/chat with X-Engram-Key, X-Engram-User-ID, and provider headers.",
      },
      {
        step: 3,
        title: "Retrieve memory",
        description:
          "The API embeds the current conversation and queries pgvector for memories with high semantic similarity.",
        details:
          "Vector search lets 'prefers concise answers' match future requests about response style even when words differ.",
      },
      {
        step: 4,
        title: "Inject context and forward",
        description:
          "Relevant memories are added to the message context before the request is forwarded to the configured LLM provider.",
      },
      {
        step: 5,
        title: "Extract durable memories",
        description:
          "After the response, an extraction pass identifies stable preferences, decisions, and facts for future retrieval.",
      },
    ],
    sequenceDiagram: `sequenceDiagram
      participant Client
      participant API as Engram API
      participant DB as pgvector
      participant LLM as LLM provider
      Client->>API: POST /v1/chat
      API->>API: Verify key hash
      API->>DB: Similarity search
      DB-->>API: Relevant memories
      API->>LLM: Enriched chat request
      LLM-->>API: Model response
      API-->>Client: Response
      API->>DB: Store extracted memories`,
  },
  concepts: [
    {
      name: "Vector Embeddings",
      category: "ml",
      definition:
        "Dense numeric representations of text that allow semantic comparison.",
      explanation:
        "Embedding models convert text into vectors where related meanings land near each other. This enables retrieval by intent rather than exact keyword overlap.",
      relevance:
        "Engram stores memories as vector(384) embeddings so the proxy can retrieve relevant personal context for a new chat turn.",
    },
    {
      name: "pgvector",
      category: "data",
      definition:
        "A PostgreSQL extension for storing vectors and running similarity search.",
      explanation:
        "pgvector keeps semantic search inside PostgreSQL. It supports vector columns and distance operators without requiring a separate vector database.",
      relevance:
        "Engram uses pgvector to keep memory text, metadata, and embeddings in one operational database.",
    },
    {
      name: "LLM Proxy Pattern",
      category: "systems",
      definition:
        "A middleware service that sits between clients and model providers to add cross-cutting behavior.",
      explanation:
        "A proxy can add authentication, logging, retrieval, transformations, and post-processing while preserving a familiar provider API for clients.",
      relevance:
        "Engram uses this pattern to add memory injection without forcing applications to rewrite their model-calling code.",
    },
    {
      name: "Model Context Protocol",
      category: "systems",
      definition:
        "A protocol that lets AI agents call external tools and access external context in a standardized way.",
      explanation:
        "MCP separates tool definitions from the agent runtime. A server can expose capabilities such as search, memory capture, or database access.",
      relevance:
        "Engram ships a TypeScript MCP server so coding agents can read or write memories directly.",
    },
    {
      name: "API Key Hashing",
      category: "devops",
      definition:
        "A security pattern where only a hash of a secret key is stored.",
      explanation:
        "If the database is exposed, raw API keys should not be recoverable. The server compares submitted keys by hashing them with the same method.",
      relevance:
        "Engram shows the API key once at creation and stores only the hash for future verification.",
    },
  ],
  codeHighlights: [
    {
      title: "Memory retrieval before provider call",
      description:
        "The proxy enriches requests by retrieving user-specific memories before forwarding to the LLM provider.",
      language: "python",
      code: `async def handle_chat(request, user):
    query_embedding = await embed_messages(request.messages)
    memories = await memory_store.search(
        user_id=user.id,
        embedding=query_embedding,
        limit=8,
    )

    enriched_messages = inject_memories(request.messages, memories)
    response = await provider_client.chat(
        model=request.model,
        messages=enriched_messages,
    )

    schedule_memory_extraction(user.id, request.messages, response)
    return response`,
      annotations: [
        "Retrieval happens before provider forwarding, so the model sees relevant durable context.",
        "Extraction is scheduled after response generation to avoid slowing down the user-facing path.",
      ],
    },
    {
      title: "pgvector similarity query",
      description:
        "Memory lookup ranks rows by distance between the stored embedding and the conversation embedding.",
      language: "sql",
      code: `select id, content, metadata
from memories
where user_id = $1
order by embedding <=> $2
limit 8;`,
      annotations: [
        "The vector operator returns nearest memories by semantic distance.",
        "Filtering by user_id keeps personal memory isolated per account.",
      ],
    },
  ],
  apiDesign: {
    baseUrl: "http://localhost:8000",
    endpoints: [
      {
        method: "POST",
        path: "/users",
        description:
          "Creates an Engram user and returns the one-time API key.",
        requestBody: '{ "email": "ayush@example.com" }',
        responseBody: '{ "userId": "usr_9v2", "apiKey": "engram_live_..." }',
      },
      {
        method: "POST",
        path: "/v1/chat",
        description:
          "OpenAI-compatible chat endpoint with memory retrieval and post-response extraction.",
        requestBody:
          '{ "model": "gpt-4.1-mini", "messages": [{ "role": "user", "content": "Use my style preferences" }] }',
        responseBody:
          '{ "id": "chatcmpl_...", "choices": [{ "message": { "role": "assistant", "content": "..." } }] }',
      },
      {
        method: "GET",
        path: "/memories/search",
        description:
          "Searches durable memories for dashboard and MCP clients.",
        responseBody:
          '{ "results": [{ "content": "Prefers concise engineering summaries", "score": 0.82 }] }',
      },
    ],
  },
  databaseDesign: {
    type: "PostgreSQL 16 with pgvector",
    diagram: `erDiagram
      USERS ||--o{ MEMORIES : owns
      USERS ||--o{ API_KEYS : authenticates
      MEMORIES ||--o{ MEMORY_EVENTS : tracks`,
    tables: [
      {
        name: "users",
        description:
          "Application users who own isolated memory collections.",
        fields: ["id", "email", "created_at"],
      },
      {
        name: "api_keys",
        description:
          "One-way hashes of user API keys with creation and revocation metadata.",
        fields: ["id", "user_id", "key_hash", "created_at", "revoked_at"],
      },
      {
        name: "memories",
        description:
          "Durable memory content, metadata, and vector(384) embeddings.",
        fields: ["id", "user_id", "content", "metadata", "embedding vector(384)", "created_at"],
      },
    ],
  },
  tradeoffs: [
    {
      decision: "Memory architecture",
      chose: "Proxy service",
      over: "Client-side SDK only",
      reasoning:
        "A proxy can support any OpenAI-compatible client and centralize retrieval, injection, extraction, and audit behavior.",
    },
    {
      decision: "Vector storage",
      chose: "pgvector",
      over: "Pinecone or Weaviate",
      reasoning:
        "Per-user memory volumes fit well inside PostgreSQL, and one database simplifies self-hosting, backup, and migrations.",
    },
    {
      decision: "Service shape",
      chose: "Docker Compose",
      over: "Kubernetes",
      reasoning:
        "The target user is a self-hosting developer. Compose keeps the four services understandable and easy to run locally.",
    },
  ],
  challenges: [
    {
      problem:
        "Automatic memory extraction can store noisy or transient facts if it is too eager.",
      solution:
        "Treat durable memories as stable preferences, decisions, or repeated facts and keep extraction separate from request forwarding.",
      lesson:
        "Memory systems need precision and user inspectability, not just aggressive capture.",
    },
    {
      problem:
        "Dashboard and API need secure service-to-service communication without leaking credentials to the browser.",
      solution:
        "Use an ENGRAM_SERVICE_KEY for internal dashboard API calls and keep user API keys server-side.",
      lesson:
        "Self-hostable systems still need production-grade boundaries between browser, dashboard server, and API.",
    },
  ],
  requirements: [
    "Docker and Docker Compose for the four-service stack.",
    "PostgreSQL 16 with the pgvector extension.",
    "OpenAI API key or another compatible LLM provider key.",
    "Clerk account and ENGRAM_SERVICE_KEY for dashboard authentication.",
  ],
  targetAudience: [
    "AI application developers who need persistent personalized context.",
    "Teams that want self-hosted memory instead of a managed black box.",
    "Agent builders using MCP-enabled coding tools.",
  ],
  futureImprovements: [
    "Add per-memory confidence and source attribution.",
    "Expose memory review workflows before permanent storage.",
    "Support multiple embedding providers with migration tooling.",
  ],
  interviewQuestions: [
    {
      question: "Why use a proxy instead of asking each app to manage memory?",
      answer:
        "A proxy centralizes memory behavior and preserves compatibility with existing OpenAI-style clients. Apps keep sending chat requests while Engram handles authentication, retrieval, injection, forwarding, and extraction.",
      difficulty: "medium",
      category: "architecture",
    },
    {
      question: "Why is pgvector enough for Engram's first version?",
      answer:
        "The query pattern is scoped by user and memory volumes are moderate. PostgreSQL already stores the memory text and metadata, so pgvector avoids another operational system while still supporting semantic retrieval.",
      difficulty: "medium",
      category: "tradeoffs",
    },
    {
      question: "How does Engram protect API keys?",
      answer:
        "It shows the raw key once, stores only a hash, and verifies future requests by hashing the submitted key. That reduces blast radius if the database is exposed.",
      difficulty: "easy",
      category: "concepts",
    },
  ],
  flashcards: [
    {
      front: "What database feature powers Engram's semantic memory search?",
      back: "pgvector, storing embeddings in a vector(384) column and ranking by vector distance.",
      difficulty: "easy",
    },
    {
      front: "What are Engram's four Compose services?",
      back: "FastAPI API, PostgreSQL with pgvector, TypeScript MCP server, and Next.js dashboard.",
      difficulty: "medium",
    },
    {
      front: "Why does Engram extract memory after returning the provider response?",
      back: "It keeps the interactive chat path fast and isolates durable memory decisions from response streaming.",
      difficulty: "hard",
    },
  ],
};
