# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Product Overview

**Cultural Exchange Hub** — a lightweight, mobile-friendly, multilingual web application that allows users to post cultural stories, explore a global feed, and ask cultural questions via a chatbot. All powered by Claude for translation and simplification.

Key constraint: Built under limited Claude Pro license credits — minimize redundant API calls.

---

## Tech Stack (Planned)

- **Frontend**: React (Vite), TailwindCSS — lightweight, mobile-first
- **Backend**: Node.js + Express (or FastAPI if Python preferred)
- **AI Layer**: Anthropic Claude API — translation, simplification, chatbot Q&A
- **Database**: Supabase (Postgres) or Firebase — stories, users, notifications
- **Auth**: Supabase Auth or Firebase Auth
- **i18n**: react-i18next for UI strings; Claude handles story-level translation

---

## Core Features & Architecture

### 1. Post Cultural Story
- User submits short text + optional image/audio
- On submit → call Claude API to simplify content and translate into 3+ languages
- Store original + translated versions in DB

### 2. Explore Feed
- Fetch stories from DB, serve in user's preferred language
- Include "Did you know?" snippets (Claude-generated at post time, cached)

### 3. Chatbot Q&A
- User types a cultural question
- Send to Claude with system prompt scoped to cultural knowledge
- Stream response back to UI

### 4. Notifications
- Daily digest (cron job) or instant alerts on new stories
- Users opt-in; store preference in DB

---

## Claude API Usage Guidelines

- Use **prompt caching** (`cache_control`) on system prompts to reduce credit usage
- For translations: batch all target languages in one API call per story
- For chatbot: stream responses (`stream=True`) for better UX
- Default model: `claude-sonnet-4-6` (balance of quality and cost)
- Avoid calling Claude on read paths — only on write (post) and chat

---

## Project Structure

```
CultureConnect/
├── frontend/src/
│   ├── pages/         Login.jsx · ExploreFeed.jsx · PostStory.jsx · Chatbot.jsx
│   ├── components/    TopBar.jsx · BottomNav.jsx · StoryCard.jsx · DidYouKnow.jsx · CategoryChip.jsx
│   ├── i18n/locales/  en · fr · hi · ta · kn  (JSON translation files)
│   ├── lib/           supabase.js  (frontend client, anon key)
│   ├── App.jsx        React Router routes
│   └── main.jsx       Entry — imports i18n before App
├── backend/
│   ├── routes/        stories.js · chat.js
│   ├── services/      claude.js (Anthropic SDK) · supabase.js (service role key)
│   ├── jobs/          dailyDigest.js  (cron — TODO)
│   └── index.js       Express entry, proxied from Vite at /api
└── .env.example       Template for both frontend and backend env vars
```

---

## Development Commands

```bash
# Frontend (React + Vite)
cd frontend && npm install
npm run dev          # http://localhost:5173
npm run build        # production build → dist/

# Backend (Express)
cd backend && npm install
cp ../.env.example .env   # fill in keys
npm run dev          # http://localhost:4000 (node --watch)
npm start            # production

# Both together (two terminals)
cd frontend && npm run dev
cd backend  && npm run dev
```

## Environment Variables

Copy `.env.example` → `frontend/.env` and `backend/.env`, then fill in:
- `VITE_SUPABASE_URL` / `SUPABASE_URL` — from Supabase project settings
- `VITE_SUPABASE_ANON_KEY` — public anon key (frontend)
- `SUPABASE_SERVICE_KEY` — service role key (backend only, never expose to frontend)
- `ANTHROPIC_API_KEY` — from console.anthropic.com

## Supabase Setup

Create a `stories` table with columns:
```
id            uuid primary key default gen_random_uuid()
text          text not null
simplified    text
categories    text[]
language      text
location      text not null
media_url     text
translations  jsonb   -- { fr: {title,text}, hi: {...}, ta: {...}, kn: {...} }
created_at    timestamptz default now()
```

Enable Storage bucket named `media` (public) for image/video uploads.

---

## Success Criteria (Demo Targets)

- 50%+ of demo participants post or explore a story
- Users spend >3 min on feed or chatbot
- Stories auto-translated into at least 3 languages via Claude
- >30% of users opt into daily digest notifications
- Demo shows one post becoming instantly accessible worldwide
