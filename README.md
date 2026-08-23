# TrendForge: Autonomous Trend Intelligence and Grounded Content Publishing Platform

TrendForge is an enterprise-grade autonomous AI platform designed to discover emerging web trends, verify factual evidence using Retrieval-Augmented Generation (RAG), synthesize grounded publications using Google Gemini AI, and schedule automated multi-channel publishing via the Swytchcode execution boundary.

---

## Executive Summary

Modern content marketing and strategic intelligence teams face two critical challenges:
1. Information Overload: Identifying high-impact emerging market trends across web news, social chatter, and technical publications.
2. AI Hallucination Risks: Generating unverified or factual-free social/editorial content that damages brand reputation.

TrendForge addresses both challenges by combining continuous web discovery, Weaviate vector database retrieval, Google Gemini 3.6 Flash reasoning, and a 5-factor anti-hallucination quality audit into an automated daily publishing workflow managed by Swytchcode.

---

## Key System Architecture

```text
Web Data Discovery -> Vector Chunking & Embedding -> Weaviate Vector DB
                                                             |
                                                             v
Swytchcode Publishing Kernel <- Human Approval Gate <- Gemini 3.6 Flash RAG Engine
```

### Core Execution Stages

1. Trend Discovery Engine: Scans live web signals and evaluates candidates across a transparent 4-factor scoring model:
   - Popularity Weight (35%)
   - Growth Velocity (30%)
   - Recency Signal (20%)
   - Market Relevance (15%)

2. Weaviate RAG Retrieval: Queries indexed vector stores to retrieve top semantic context excerpts and supporting evidence claims for every discovered trend.

3. Gemini 3.6 Flash Reasoning: Synthesizes platform-specific publications (LinkedIn, Twitter/X, Instagram, Email Newsletters) grounded strictly in retrieved source context.

4. 5-Factor Anti-Hallucination Audit: Evaluates generated content prior to approval:
   - Grounding Confidence Score
   - Contextual Relevance
   - Readability Metric
   - Brand Tone Consistency
   - Evidence Source Coverage

5. Swytchcode Execution Kernel: Enforces execution boundaries to schedule and dispatch approved publications at fixed daily intervals.

---

## Technology Stack

### Frontend Application
- Framework: React 18 (Vite build system)
- Navigation: React Router DOM v6
- Styling: Custom Design System (CSS Tokens + Tailwind CSS)
- Data Visualization: Recharts
- Component Icons: Lucide React (Zero emoji UI specification)

### Backend Orchestrator
- Runtime: Node.js & Express.js
- Primary AI LLM: Google Gemini API (gemini-3.6-flash)
- Vector RAG Store: Weaviate Vector Database
- Automation Kernel: Swytchcode Execution Boundary Adapter (`@swytchcode/runtime`)
- Logging & Diagnostics: Structured Winston Logger

---

## Repository Structure

```text
VibeWright/
├── backend/
│   ├── config/             # Environment variables and system matrix
│   ├── controllers/        # Express API request controllers
│   ├── middlewares/        # Error handling and request logging
│   ├── routes/             # RESTful API route definitions
│   ├── services/
│   │   ├── agent/          # Tool registry and planner
│   │   ├── ai/             # Gemini API integration service
│   │   ├── analytics/      # Metric aggregation service
│   │   ├── automation/     # Swytchcode task creation adapter
│   │   ├── content/        # Content generation & approval store
│   │   ├── discovery/      # Web trend discovery service
│   │   ├── rag/            # Weaviate vector retrieval service
│   │   ├── scheduler/      # Daily fixed-time publishing queue
│   │   └── swytchcode/     # Swytchcode execution boundary adapter
│   ├── utils/              # Structured logging utilities
│   ├── server.js           # Express application entry point
│   ├── .env.example        # Environment variable template
│   └── package.json        # Node.js backend dependencies
│
└── frontend/
    ├── public/             # Brand logos and static assets
    ├── src/
    │   ├── components/     # TopNavbar, Sidebar, AppShell, UI components
    │   ├── pages/          # Dashboard, Trends, Content, Calendar, Analytics, Sources, Activity
    │   ├── services/       # Frontend API client methods
    │   ├── App.jsx         # React application router
    │   └── index.css       # Unified design system stylesheet
    ├── index.html          # HTML entry point
    └── package.json        # Frontend React dependencies
```

---

## Installation and Setup

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### 1. Environment Configuration

Copy `.env.example` to `.env` inside the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Configure your primary Google Gemini API key in `backend/.env`:

```env
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=your_google_gemini_api_key_here
GEMINI_MODEL=gemini-3.6-flash
SWYTCHCODE_BASE_URL=https://api.swytchcode.com
```

### 2. Backend Server Setup

Install dependencies and start the backend development server:

```bash
cd backend
npm install
npm run dev
```

The Express server will initialize on `http://localhost:5000`.

### 3. Frontend Application Setup

In a separate terminal window, install frontend dependencies and start Vite:

```bash
cd frontend
npm install
npm run dev
```

The React frontend will be available at `http://localhost:5173`.

---

## API Reference

### Health and System Integration
- `GET /api/health` - Returns orchestrator status, version, and uptime.
- `GET /api/integrations` - Returns system capability matrix (Gemini, Weaviate, Swytchcode status).

### Trend Intelligence
- `GET /api/trends` - Lists discovered trends with filtering and search parameters.
- `GET /api/trends/:id` - Retrieves detailed breakdown and source evidence for a specific trend.
- `POST /api/trends/discover` - Triggers real-time web discovery and Gemini 3.6 Flash trend evaluation.

### Grounded Content Studio
- `GET /api/content` - Lists generated content items filtered by status or platform.
- `POST /api/content` - Generates RAG-grounded content with explicit claim traceability.
- `POST /api/content/:id/approve` - Approves a draft item for publishing.
- `POST /api/content/:id/schedule` - Adds an approved item to the Swytchcode daily queue.

### Automation and Publishing
- `GET /api/automation/status` - Returns Swytchcode kernel schedule and safety parameters.
- `POST /api/automation/run` - Manually triggers the fixed-time daily publishing workflow.

### Analytics and Audit
- `GET /api/analytics` - Returns real-time metrics on trend velocity, category distribution, and quality audits.
- `GET /api/activity` - Returns audit trail of system executions.
- `GET /api/sources` - Returns indexed Weaviate vector knowledge sources.

---

## Production Build

To build the frontend application for production:

```bash
cd frontend
npm run build
```

The minified production assets will be generated in `frontend/dist/`.

---

## License

This project is licensed under the MIT License.
