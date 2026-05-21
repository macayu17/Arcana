import type { Project } from "@/lib/types";

export const occasio: Project = {
  slug: "occasio",
  name: "Occasio",
  tagline: "Event booking and management platform with payments, QR ticketing, and organizer workflows.",
  description:
    "Occasio helps organizers publish events, sell tickets, manage attendees, process payments, and verify QR tickets from an operational dashboard.",
  repo: "https://github.com/macayu17",
  status: "completed",
  domain: "Event commerce",
  domainColor:
    "border-cyan-500/30 bg-cyan-500/10 text-cyan-800 dark:text-cyan-300",
  icon: "calendar-check",
  architecture: {
    overview:
      "The product uses a React and Vite frontend with a Node backend. The backend owns event data, bookings, uploads, payments, and webhooks, while the frontend gives organizers and attendees separate flows.",
    diagram: `graph TD
      Attendee[Attendee UI] --> API[Node API]
      Organizer[Organizer dashboard] --> API
      API --> Events[(Event data)]
      API --> Uploads[Upload middleware]
      API --> Payments[Payment gateway]
      Payments --> Webhooks[Payment webhooks]
      Webhooks --> API
      API --> Tickets[QR ticket service]
      Tickets --> Attendee`,
    layers: [
      {
        name: "Attendee experience",
        description:
          "Event discovery, booking flow, payment initiation, ticket retrieval, and QR access.",
        technologies: ["React", "Vite", "Tailwind"],
      },
      {
        name: "Organizer console",
        description:
          "Event creation, capacity management, media uploads, and attendee reporting.",
        technologies: ["React", "Client-side routing"],
      },
      {
        name: "Backend API",
        description:
          "RESTful endpoints for events, users, bookings, uploads, payments, and ticket verification.",
        technologies: ["Node.js", "Express"],
      },
      {
        name: "Commerce and verification",
        description:
          "Payment gateway integration, webhook reconciliation, and QR-based entry validation.",
        technologies: ["Razorpay", "PhonePe", "QR codes"],
      },
    ],
  },
  techStack: [
    {
      name: "React",
      role: "Attendee and organizer user interfaces.",
      category: "frontend",
    },
    {
      name: "Vite",
      role: "Fast local development and SPA bundling.",
      category: "frontend",
    },
    {
      name: "Node.js",
      role: "Backend runtime for REST APIs and payment callbacks.",
      category: "backend",
    },
    {
      name: "Express",
      role: "Routing, middleware, and controller organization.",
      category: "backend",
    },
    {
      name: "Razorpay / PhonePe",
      role: "Payment initiation, status checks, and webhook confirmation.",
      category: "library",
    },
    {
      name: "Upload middleware",
      role: "Event poster and media upload handling.",
      category: "backend",
    },
  ],
  howItWorks: {
    summary:
      "Organizers create events and attendees book tickets. Payments are reconciled through webhooks, then QR tickets become valid for entry scanning.",
    steps: [
      {
        step: 1,
        title: "Create event",
        description:
          "An organizer enters event details, capacity, ticket rules, and media assets.",
      },
      {
        step: 2,
        title: "Publish listing",
        description:
          "The event appears in the attendee-facing catalog with date, venue, price, and availability.",
      },
      {
        step: 3,
        title: "Book and pay",
        description:
          "The attendee chooses quantity, starts payment, and the backend creates a pending booking.",
      },
      {
        step: 4,
        title: "Reconcile webhook",
        description:
          "The payment provider calls the backend, which verifies the payload and marks the booking paid.",
      },
      {
        step: 5,
        title: "Issue and scan ticket",
        description:
          "The system generates a QR ticket that can be verified at check-in against booking state.",
      },
    ],
    sequenceDiagram: `sequenceDiagram
      participant User as Attendee
      participant UI as React UI
      participant API as Node API
      participant Pay as Payment Gateway
      User->>UI: Book event
      UI->>API: Create pending booking
      API->>Pay: Create payment order
      Pay-->>UI: Payment session
      Pay->>API: Webhook success
      API-->>UI: Paid booking and QR ticket`,
  },
  concepts: [
    {
      name: "Event-Driven Architecture",
      category: "systems",
      definition:
        "A pattern where important changes are represented as events consumed by other parts of the system.",
      explanation:
        "Payments and ticket state are naturally event-driven because external gateways confirm payment asynchronously after a user leaves the app flow.",
      relevance:
        "Occasio treats payment callbacks as events that transition bookings from pending to paid.",
    },
    {
      name: "Payment Webhooks",
      category: "web",
      definition:
        "Server-to-server callbacks sent by a payment provider when a transaction changes state.",
      explanation:
        "Webhooks are more reliable than trusting the browser redirect because they come directly from the payment provider and can be verified server-side.",
      relevance:
        "Occasio uses webhooks to confirm Razorpay or PhonePe payment status before issuing tickets.",
    },
    {
      name: "QR Ticketing",
      category: "web",
      definition:
        "Encoding ticket identifiers into scannable QR codes for quick verification.",
      explanation:
        "A QR code should not be treated as proof by itself. The backend must verify the encoded ticket against booking state and scan history.",
      relevance:
        "Occasio generates QR tickets for paid bookings and validates them during event entry.",
    },
    {
      name: "Role-Based Access Control",
      category: "web",
      definition:
        "Restricting actions based on user roles such as organizer, admin, or attendee.",
      explanation:
        "RBAC reduces risk by making sure an attendee cannot access organizer reporting or modify event capacity.",
      relevance:
        "Occasio separates attendee booking paths from organizer event management workflows.",
    },
    {
      name: "RESTful API Design",
      category: "web",
      definition:
        "HTTP resource routes that use methods like GET, POST, PATCH, and DELETE consistently.",
      explanation:
        "A predictable REST API makes frontend flows easier to reason about and keeps booking, event, and ticket operations explicit.",
      relevance:
        "Occasio's backend exposes events, bookings, payments, and ticket verification through resource-oriented routes.",
    },
  ],
  codeHighlights: [
    {
      title: "Payment webhook reconciliation",
      description:
        "The backend should verify provider callbacks before marking a booking as paid.",
      language: "javascript",
      code: `async function handlePaymentWebhook(req, res) {
  const signatureValid = verifyGatewaySignature(req.headers, req.body);
  if (!signatureValid) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  const booking = await Booking.findOne({ paymentOrderId: req.body.orderId });
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  booking.status = "paid";
  booking.ticketCode = createTicketCode(booking.id);
  await booking.save();

  return res.json({ ok: true });
}`,
      annotations: [
        "The browser redirect is not trusted as payment proof.",
        "Ticket issuance happens after server-side payment confirmation.",
      ],
    },
    {
      title: "QR ticket verification",
      description:
        "Ticket scanning checks booking state and prevents duplicate entry.",
      language: "javascript",
      code: `async function verifyTicket(code) {
  const booking = await Booking.findOne({ ticketCode: code });
  if (!booking || booking.status !== "paid") {
    return { valid: false, reason: "Ticket is not paid" };
  }

  if (booking.checkedInAt) {
    return { valid: false, reason: "Ticket already used" };
  }

  booking.checkedInAt = new Date();
  await booking.save();
  return { valid: true, attendeeName: booking.attendeeName };
}`,
      annotations: [
        "The encoded code is only an identifier; the backend decides validity.",
        "Duplicate scan prevention is part of the verification path.",
      ],
    },
  ],
  apiDesign: {
    baseUrl: "http://localhost:5000/api",
    endpoints: [
      {
        method: "GET",
        path: "/events",
        description:
          "Lists published events with dates, venue, capacity, and ticket status.",
      },
      {
        method: "POST",
        path: "/bookings",
        description:
          "Creates a pending booking and payment order for selected tickets.",
        requestBody: '{ "eventId": "evt_42", "quantity": 2 }',
        responseBody: '{ "bookingId": "book_91", "paymentOrderId": "order_77" }',
      },
      {
        method: "POST",
        path: "/payments/webhook",
        description:
          "Verifies gateway callback and updates booking payment state.",
      },
      {
        method: "POST",
        path: "/tickets/verify",
        description:
          "Validates a QR ticket and records check-in.",
        requestBody: '{ "ticketCode": "TICKET-9F42" }',
      },
    ],
  },
  databaseDesign: {
    type: "Document or relational event booking store",
    diagram: `erDiagram
      USER ||--o{ EVENT : organizes
      EVENT ||--o{ BOOKING : receives
      BOOKING ||--|| PAYMENT : has
      BOOKING ||--|| TICKET : issues`,
    tables: [
      {
        name: "events",
        description:
          "Event listing, schedule, venue, capacity, and organizer ownership.",
        fields: ["id", "organizer_id", "title", "venue", "starts_at", "capacity"],
      },
      {
        name: "bookings",
        description:
          "Attendee booking intent and status transitions from pending to paid.",
        fields: ["id", "event_id", "attendee_id", "quantity", "status"],
      },
      {
        name: "tickets",
        description:
          "QR ticket codes and check-in timestamps linked to paid bookings.",
        fields: ["id", "booking_id", "ticket_code", "checked_in_at"],
      },
    ],
  },
  tradeoffs: [
    {
      decision: "Frontend framework",
      chose: "React with Vite",
      over: "Next.js",
      reasoning:
        "The app is an operational SPA where authenticated workflows matter more than SEO or server rendering.",
    },
    {
      decision: "Payment truth source",
      chose: "Gateway webhook",
      over: "Frontend success redirect",
      reasoning:
        "The redirect can be interrupted or forged. The provider webhook gives server-side confirmation.",
    },
    {
      decision: "Ticket format",
      chose: "QR code identifier",
      over: "Printable free-form receipt",
      reasoning:
        "A QR identifier can be scanned quickly and verified against backend state during entry.",
    },
  ],
  challenges: [
    {
      problem:
        "Payment state can become inconsistent if the user closes the browser after payment.",
      solution:
        "Use webhooks as the authority and let the booking page poll or refresh state.",
      lesson:
        "Commerce flows should treat the server-side payment event as the source of truth.",
    },
    {
      problem:
        "Event posters and uploaded assets need consistent handling across routes.",
      solution:
        "Centralize upload middleware and keep event metadata separate from file storage concerns.",
      lesson:
        "Media upload is a backend boundary, not just a form field.",
    },
  ],
  requirements: [
    "Node.js and npm for backend and frontend development.",
    "Payment gateway credentials for Razorpay or PhonePe flows.",
    "File upload storage configuration for event media.",
    "Organizer and attendee role handling.",
  ],
  targetAudience: [
    "College festival committees and student organizers.",
    "Conference and workshop organizers.",
    "Small event teams that need booking and entry validation.",
  ],
  futureImprovements: [
    "Add live organizer analytics for sales, capacity, and check-ins.",
    "Support seat maps and tiered ticket inventory.",
    "Add automated refund and cancellation workflows.",
  ],
  interviewQuestions: [
    {
      question: "Why should webhooks decide payment success?",
      answer:
        "The webhook comes from the provider to the server and can be signature-verified. A browser redirect is user-controlled and can fail after payment, so it is not reliable enough to issue tickets.",
      difficulty: "medium",
      category: "architecture",
    },
    {
      question: "What does QR verification need beyond decoding the QR code?",
      answer:
        "The backend must confirm the ticket exists, belongs to a paid booking, matches the event, and has not already been checked in.",
      difficulty: "easy",
      category: "concepts",
    },
    {
      question: "What would you add for high-volume events?",
      answer:
        "I would add idempotent payment handlers, queue-backed email delivery, cached event listing reads, rate-limited ticket verification, and an offline check-in fallback.",
      difficulty: "hard",
      category: "tradeoffs",
    },
  ],
  flashcards: [
    {
      front: "What is the source of truth for paid status in Occasio?",
      back: "The server-side payment webhook after signature verification.",
      difficulty: "easy",
    },
    {
      front: "Why is RBAC important in an event platform?",
      back: "It prevents attendees from accessing organizer actions such as capacity edits, reports, and check-in controls.",
      difficulty: "medium",
    },
    {
      front: "What prevents duplicate ticket use?",
      back: "The ticket verification route records checkedInAt and rejects later scans for the same ticket.",
      difficulty: "hard",
    },
  ],
};
