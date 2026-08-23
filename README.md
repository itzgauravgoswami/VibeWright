# TrendForge: Autonomous Trend Intelligence, RAG Grounding, Content Repurposing & Calendar Sync Platform

TrendForge is an enterprise-grade autonomous AI platform designed to discover emerging web trends, verify factual evidence using Retrieval-Augmented Generation (RAG), synthesize grounded publications using Google Gemini AI, repurpose one authoritative Master Content idea into platform-native formats while maintaining brand voice consistency, schedule automated multi-channel publishing via the Swytchcode execution boundary, and auto-sync scheduled content to Google Calendar.

---

## Executive Summary

Modern content marketing and strategic intelligence teams face three critical challenges:
1. **Information Overload**: Identifying high-impact emerging market trends across web news, social chatter, and technical publications.
2. **AI Hallucination Risks**: Generating unverified or factual-free social/editorial content that damages brand reputation.
3. **Multi-Channel Repurposing & Scheduling Efficiency**: Transforming one core piece of research into platform-native formats (Short-form Video Scripts, Social Threads, Captions, Blog Snippets) without compromising brand voice or evidence grounding, and keeping executive teams synchronized via Google Calendar.

TrendForge addresses all three challenges through a unified end-to-end pipeline:
```text
CURRENT TRENDS ➔ RANDOMIZED DISCOVERY (1-3) ➔ RAG RESEARCH ➔ TREND ANALYSIS ➔ TREND SCORING ➔ MASTER CONTENT ➔ CONTENT REPURPOSING ➔ MULTIPLE FORMATS ➔ BRAND & EVIDENCE CONSISTENCY ➔ QUALITY VALIDATION ➔ HUMAN APPROVAL ➔ SCHEDULING ➔ SWYTCHCODE AUTOMATION & GOOGLE CALENDAR SYNC ➔ PUBLISHING ➔ ANALYTICS
```

---

## Key System Architecture & Extensions

```text
Web Data Discovery (Random 1-3 Candidates) ➔ Vector Chunking & Embedding ➔ Weaviate Vector DB
                                                                                    │
                                                                                    ▼
Swytchcode & Google Calendar Kernel ◄── Human Approval ◄── Gemini 3.6 Flash Master & Repurposing Engine
                                                                                    │
                                                                                    ├── Short-Form Video Script (Hook, Body, CTA)
                                                                                    ├── Social Thread (Progressive Flow 1-7)
                                                                                    ├── Social Caption (Engaging + Non-spammy Tags)
                                                                                    └── Blog Snippet (SEO Title, Intro, Insights)
```

### Core Execution Stages

1. **Randomized Trend Discovery Engine**: Scans live web signals and evaluates a randomized candidate pool of **1, 2, or 3** unique emerging trends per scan (`Math.floor(Math.random() * 3) + 1`) across a transparent 4-factor scoring model:
   - Popularity Weight (35%)
   - Growth Velocity (30%)
   - Recency Signal (20%)
   - Market Relevance (15%)

2. **Weaviate RAG Retrieval**: Queries indexed vector stores to retrieve top semantic context excerpts and supporting evidence claims for every discovered trend.

3. **Master Content Generation**: Synthesizes authoritative Master Content as the single source of truth containing core messages, key factual claims, evidence sources, and grounding quality scores.

4. **Multi-Format Repurposing Engine**: Transforms Master Content into 4 platform-native formats:
   - **Short-form Video Script**: Structured into HOOK, BODY, KEY INSIGHT, CTA with spoken delivery pacing.
   - **Social Thread**: 5-7 progressive posts with hooks, context, insights, evidence, and CTA.
   - **Social Caption**: Concise engagement caption with clear CTA and non-spammy hashtags.
   - **Blog Snippet**: SEO-friendly title, introduction, key insight, supporting context, and meta description.

5. **AI Validation Layers**:
   - **Brand Consistency Score** (% + Matches & Improvements breakdown against persistent Brand Profile).
   - **Evidence Coverage Score** (% + Claim-level traceability references).
   - **Cross-Format & Message Consistency Score** (% verifying core idea preservation).
   - **Platform Fit Score** (% evaluating structure, tone, and medium conventions).

6. **Swytchcode & Google Calendar Execution Kernel**:
   - Enforces execution boundaries to schedule and dispatch approved content packages at fixed daily intervals via Swytchcode.
   - Automatically syncs scheduled posts to **Google Calendar** with event titles, evidence scores, brand match %, and 15-minute popup reminders.

7. **24 Skin Bank Token-Driven Design System**:
   - Implementation-ready UI design tokens built for clean visual consistency.
   - Typography Scale (`Newsreader, serif` headings, scale from `11px` to `20px`).
   - WCAG 2.2 AA accessibility focus-visible rules (`2px solid #2563eb`).

---

## Technology Stack

### Frontend Application
- **Framework**: React 18 (Vite build system)
- **Navigation**: React Router DOM v6
- **Styling**: 24 Skin Bank Token Design System (CSS Tokens + Tailwind CSS)
- **Data Visualization**: Recharts
- **Component Icons**: Lucide React (Zero emoji UI specification)

### Backend Orchestrator
- **Runtime**: Node.js & Express.js
- **Primary AI LLM**: Google Gemini API (`gemini-3.6-flash`)
- **Vector RAG Store**: Weaviate Vector Database
- **Automation Kernel**: Swytchcode Execution Boundary Adapter (`@swytchcode/runtime`)
- **Calendar Integration**: Google Calendar API & Web Sync Service (`googleCalendarService.js`)
- **Logging & Diagnostics**: Structured Winston Logger

---

## Repository Structure

```text
VibeWright/
├── backend/
│   ├── config/             # Environment variables and system matrix
│   ├── controllers/        # Express API request controllers (trends, content, repurpose, brand, calendar, automation, analytics)
│   ├── middlewares/        # Error handling and request logging
│   ├── routes/             # RESTful API route definitions (health, agent, integrations, trends, content, repurpose, brand, calendar, automation)
│   ├── services/
│   │   ├── agent/          # Tool registry and planner
│   │   ├── ai/             # Gemini API integration service (gemini-3.6-flash)
│   │   ├── analytics/      # Metric aggregation service
│   │   ├── automation/     # Swytchcode task creation adapter
│   │   ├── calendar/       # Google Calendar API & Web Sync Service
│   │   ├── content/        # Content generation & approval store
│   │   ├── discovery/      # Web trend discovery service
│   │   ├── knowledge/      # Knowledge base search service
│   │   ├── media/          # Cloudinary media processing service
│   │   ├── rag/            # Weaviate vector retrieval service
│   │   ├── repurposing/    # Brand profile & multi-format repurposing engine
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
    │   ├── components/     # Layout, BrandDNAPanel, EvidenceChainVisualizer
    │   ├── pages/          # Dashboard, Trends, Content, RepurposeList, RepurposeWorkspace, RepurposeFormatDetail, Calendar, Analytics, Sources, Activity, Settings
    │   ├── routes/         # React Router DOM v6 AppRoutes definitions
    │   ├── services/       # Frontend API client methods (Google Calendar, Repurpose, Trends)
    │   ├── App.jsx         # React application root
    │   └── index.css       # 24 Skin Bank token design system stylesheet
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
GOOGLE_CALENDAR_ACCOUNT_EMAIL=your_email@gmail.com
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
- `POST /api/trends/discover` - Triggers real-time web discovery and Gemini 3.6 Flash trend evaluation (randomly discovers 1 to 3 trends per scan).

### Grounded Content & Repurposing (Round B)
- `GET /api/repurpose` - Lists all Master Content items eligible for repurposing.
- `GET /api/repurpose/:contentId` - Retrieves Master Content and all derivative repurposed formats.
- `POST /api/repurpose/:contentId/generate` - Generates Video Script, Thread, Caption, and Blog Snippet using Gemini 3.6 Flash.
- `POST /api/repurpose/:contentId/:format/regenerate` - Regenerates a specific format with improvement parameters.
- `PUT /api/repurpose/:contentId/:format` - Edits derivative format and recalculates Brand & Evidence scores live.
- `POST /api/repurpose/:contentId/schedule` - One-click schedules complete derivative content package via Swytchcode and Google Calendar.

### Brand Profile & Persona
- `GET /api/settings/brand` - Retrieves active Brand Profile settings.
- `PUT /api/settings/brand` - Updates Brand Identity, Voice chips, writing rules, and custom prompt guardrails.

### Google Calendar Integration
- `GET /api/calendar/google-status` - Returns Google Calendar connection status and account email.
- `POST /api/calendar/google-sync` - Syncs a scheduled post event to Google Calendar.
- `GET /api/calendar/google-events` - Lists all active synced Google Calendar events.

### Automation and Publishing
- `GET /api/automation/status` - Returns Swytchcode kernel schedule and safety parameters.
- `POST /api/automation/run` - Manually triggers the fixed-time daily publishing workflow.

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
