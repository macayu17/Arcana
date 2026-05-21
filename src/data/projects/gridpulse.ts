import type { Project } from "@/lib/types";

export const gridpulse: Project = {
  slug: "gridpulse",
  name: "GridPulse",
  tagline: "Formula 1 telemetry analytics and replay platform for lap, sector, and driver comparison.",
  description:
    "GridPulse ingests race telemetry, normalizes high-frequency time-series data, and renders interactive replay and analysis views for speed, throttle, brake, gear, tires, and lap comparisons.",
  repo: "https://github.com/macayu17/GridPulse",
  status: "active",
  domain: "Motorsport analytics",
  domainColor:
    "border-red-500/30 bg-red-500/10 text-red-800 dark:text-red-300",
  icon: "gauge",
  architecture: {
    overview:
      "A FastAPI backend fetches or accepts F1 telemetry, processes it into aligned series, and serves it to a React plus D3 visualization layer. Replay mode synchronizes charts and session state over time.",
    diagram: `graph TD
      Source[FastF1 or OpenF1 data] --> Ingest[Telemetry ingestion]
      Ingest --> Normalize[Time-series normalization]
      Normalize --> Storage[Processed session store]
      Storage --> API[FastAPI visualization API]
      API --> Charts[React + D3 charts]
      API --> Replay[Replay engine]
      Replay --> Charts`,
    layers: [
      {
        name: "Ingestion layer",
        description:
          "Fetches race, driver, lap, tire, and telemetry data from FastF1 or OpenF1 style sources.",
        technologies: ["Python", "FastF1", "OpenF1"],
      },
      {
        name: "Processing layer",
        description:
          "Aligns time-series channels, segments laps and sectors, and computes replay-ready samples.",
        technologies: ["Python", "pandas"],
      },
      {
        name: "API layer",
        description:
          "Serves sessions, lap comparisons, telemetry channels, and replay metadata.",
        technologies: ["FastAPI"],
      },
      {
        name: "Visualization layer",
        description:
          "Renders SVG and canvas-style views for speed traces, throttle/brake overlays, and replay panels.",
        technologies: ["React", "D3.js"],
      },
    ],
  },
  techStack: [
    {
      name: "FastAPI",
      role: "Telemetry API, replay metadata, and processed session endpoints.",
      category: "backend",
    },
    {
      name: "Python",
      role: "Data ingestion, normalization, lap segmentation, and metric computation.",
      category: "backend",
    },
    {
      name: "React",
      role: "Interactive telemetry workspace and replay screens.",
      category: "frontend",
    },
    {
      name: "D3.js",
      role: "Custom SVG visualizations for lap traces and driver comparisons.",
      category: "library",
    },
    {
      name: "Docker",
      role: "Reproducible local and deployment environment.",
      category: "devops",
    },
    {
      name: "FastF1 / OpenF1",
      role: "Source data adapters for race telemetry and session metadata.",
      category: "library",
    },
  ],
  howItWorks: {
    summary:
      "Telemetry is ingested from a race data source, normalized into comparable time-series channels, exposed through an API, and replayed in the browser with synchronized visualizations.",
    steps: [
      {
        step: 1,
        title: "Load session data",
        description:
          "The backend fetches race session, driver, lap, tire, and telemetry records for a selected event.",
      },
      {
        step: 2,
        title: "Normalize channels",
        description:
          "Speed, throttle, brake, gear, RPM, and timestamps are aligned so comparisons use a common timeline.",
      },
      {
        step: 3,
        title: "Segment laps",
        description:
          "The processor splits telemetry by lap and sector so driver comparisons are meaningful.",
      },
      {
        step: 4,
        title: "Serve analysis views",
        description:
          "FastAPI returns processed traces, deltas, tire windows, and replay metadata to the frontend.",
      },
      {
        step: 5,
        title: "Synchronize replay",
        description:
          "The browser advances a replay clock and updates every chart from the same timestamp.",
      },
    ],
    sequenceDiagram: `sequenceDiagram
      participant UI as React UI
      participant API as FastAPI
      participant Source as Telemetry Source
      participant Proc as Processor
      UI->>API: Request session
      API->>Source: Fetch raw telemetry
      API->>Proc: Normalize and segment
      Proc-->>API: Replay-ready data
      API-->>UI: Traces and metadata
      UI->>UI: Synchronized replay`,
  },
  concepts: [
    {
      name: "Time-Series Processing",
      category: "data",
      definition:
        "Handling ordered data points indexed by time.",
      explanation:
        "Telemetry channels arrive as sequences with timestamps. Comparing drivers requires alignment so speed, throttle, and brake values refer to the same moment or distance.",
      relevance:
        "GridPulse normalizes high-frequency F1 telemetry before rendering lap comparisons and replay.",
    },
    {
      name: "D3 Data Binding",
      category: "web",
      definition:
        "Binding data values to DOM or SVG elements to render custom visualizations.",
      explanation:
        "D3 gives low-level control over scales, axes, paths, transitions, and interactions, which is important for custom motorsport charts.",
      relevance:
        "GridPulse uses D3-style visualization logic for speed traces, throttle/brake overlays, and lap delta charts.",
    },
    {
      name: "Telemetry Analysis",
      category: "data",
      definition:
        "Extracting insight from sensor and performance channels such as speed, throttle, brake, gear, and tire data.",
      explanation:
        "Telemetry explains not just what lap time was achieved but how it was achieved: braking points, traction, acceleration, and tire strategy.",
      relevance:
        "GridPulse turns raw race data into interview-ready visuals about driver behavior and performance.",
    },
    {
      name: "Race Replay",
      category: "systems",
      definition:
        "A playback engine that advances recorded events in chronological order.",
      explanation:
        "Replay systems need a stable clock, synchronized views, seek controls, and consistent state reconstruction from historical samples.",
      relevance:
        "GridPulse replays race telemetry and keeps charts synchronized to the same replay timestamp.",
    },
    {
      name: "Containerization",
      category: "devops",
      definition:
        "Packaging an application and its dependencies into a portable container image.",
      explanation:
        "Telemetry processing can depend on Python libraries, native packages, and data files. Containers make the runtime reproducible.",
      relevance:
        "GridPulse uses Docker to keep local and deployment environments consistent.",
    },
  ],
  codeHighlights: [
    {
      title: "Replay cursor lookup",
      description:
        "The replay engine finds the closest telemetry sample for the active replay time.",
      language: "typescript",
      code: `export function sampleAtTime(samples: TelemetrySample[], elapsedMs: number) {
  let left = 0;
  let right = samples.length - 1;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (samples[mid].elapsedMs < elapsedMs) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return samples[left];
}`,
      annotations: [
        "Binary search avoids scanning every sample on each animation frame.",
        "A shared elapsed time keeps speed, throttle, brake, and map views synchronized.",
      ],
    },
    {
      title: "Telemetry normalization",
      description:
        "Raw records are converted into a consistent shape before charts consume them.",
      language: "python",
      code: `def normalize_telemetry(frame):
    columns = ["Time", "Speed", "Throttle", "Brake", "nGear", "RPM"]
    telemetry = frame[columns].copy()
    telemetry["elapsed_ms"] = (
        telemetry["Time"] - telemetry["Time"].iloc[0]
    ).dt.total_seconds() * 1000
    telemetry["brake"] = telemetry["Brake"].astype(bool)
    return telemetry.drop(columns=["Time"])`,
      annotations: [
        "A consistent elapsed_ms axis makes frontend replay independent of source timestamps.",
        "The chart layer receives cleaned values instead of source-specific column names.",
      ],
    },
  ],
  apiDesign: {
    baseUrl: "http://localhost:8000/api",
    endpoints: [
      {
        method: "GET",
        path: "/sessions",
        description:
          "Lists available seasons, races, and sessions for telemetry analysis.",
      },
      {
        method: "GET",
        path: "/sessions/{sessionId}/telemetry",
        description:
          "Returns processed telemetry channels for selected drivers and laps.",
      },
      {
        method: "GET",
        path: "/sessions/{sessionId}/replay",
        description:
          "Returns replay metadata and synchronized samples for playback.",
      },
      {
        method: "GET",
        path: "/sessions/{sessionId}/compare",
        description:
          "Returns lap deltas and channel overlays for driver comparison.",
      },
    ],
  },
  databaseDesign: {
    type: "Processed telemetry cache",
    diagram: `erDiagram
      SESSION ||--o{ LAP : contains
      DRIVER ||--o{ LAP : drives
      LAP ||--o{ TELEMETRY_SAMPLE : has
      SESSION ||--o{ TIRE_STINT : includes`,
    tables: [
      {
        name: "sessions",
        description:
          "Race weekend metadata such as season, round, race name, and session type.",
        fields: ["session_id", "season", "round", "name", "type"],
      },
      {
        name: "laps",
        description:
          "Lap-level timing, driver, sector, and tire information.",
        fields: ["lap_id", "session_id", "driver", "lap_number", "lap_time"],
      },
      {
        name: "telemetry_samples",
        description:
          "Aligned channel samples used by charts and replay.",
        fields: ["lap_id", "elapsed_ms", "speed", "throttle", "brake", "gear", "rpm"],
      },
    ],
  },
  tradeoffs: [
    {
      decision: "Charting library",
      chose: "D3.js",
      over: "Chart.js or Recharts",
      reasoning:
        "F1 telemetry needs custom scales, synchronized cursors, overlays, and non-standard interactions that are easier with D3 primitives.",
    },
    {
      decision: "Backend processing",
      chose: "FastAPI with Python",
      over: "Browser-only parsing",
      reasoning:
        "Python has stronger data tooling for telemetry normalization, and the browser should receive replay-ready payloads.",
    },
    {
      decision: "Deployment runtime",
      chose: "Docker",
      over: "Host-machine setup",
      reasoning:
        "Telemetry libraries can be environment-sensitive, so containers reduce setup drift.",
    },
  ],
  challenges: [
    {
      problem:
        "Telemetry sources can have uneven sampling and missing channels.",
      solution:
        "Normalize timestamps, keep channel availability explicit, and make charts tolerant of missing series.",
      lesson:
        "Data visualization correctness starts with clear assumptions about source quality.",
    },
    {
      problem:
        "Replay views can drift if each chart manages its own time state.",
      solution:
        "Use one replay clock and derive all chart cursors from that shared elapsed time.",
      lesson:
        "Synchronized visualization needs a single source of temporal truth.",
    },
  ],
  requirements: [
    "Python 3.x with FastAPI for the processing API.",
    "React and D3.js for custom telemetry visualizations.",
    "Docker for reproducible local setup.",
    "FastF1 or OpenF1-style data source for race telemetry.",
  ],
  targetAudience: [
    "Formula 1 fans exploring driver performance.",
    "Motorsport data analysts comparing laps and stints.",
    "Developers explaining time-series visualization systems.",
  ],
  futureImprovements: [
    "Add live session monitoring when source latency allows it.",
    "Persist processed race caches for faster repeat analysis.",
    "Add tire degradation modeling and pit strategy simulation.",
  ],
  interviewQuestions: [
    {
      question: "Why use D3 instead of a standard chart library?",
      answer:
        "Telemetry charts need synchronized cursors, custom overlays, and precise control over scales and SVG paths. D3 gives the primitives to build those interactions directly.",
      difficulty: "medium",
      category: "tradeoffs",
    },
    {
      question: "What makes telemetry comparison difficult?",
      answer:
        "Drivers and channels may not align naturally by timestamp. The data must be normalized to a common elapsed time or distance axis before comparing speed, throttle, brake, and gear.",
      difficulty: "medium",
      category: "concepts",
    },
    {
      question: "How do you prevent replay drift across charts?",
      answer:
        "Use one shared replay clock and derive every chart cursor and sample lookup from that clock instead of allowing each visualization to manage its own timer.",
      difficulty: "hard",
      category: "architecture",
    },
  ],
  flashcards: [
    {
      front: "What is the core data shape in GridPulse?",
      back: "Aligned time-series telemetry samples for channels such as speed, throttle, brake, gear, and RPM.",
      difficulty: "easy",
    },
    {
      front: "Why normalize telemetry before visualization?",
      back: "So different channels, laps, and drivers can be compared on a shared time or distance axis.",
      difficulty: "medium",
    },
    {
      front: "Why should replay use one shared clock?",
      back: "It keeps every chart, cursor, and replay panel synchronized to the same point in time.",
      difficulty: "hard",
    },
  ],
};
