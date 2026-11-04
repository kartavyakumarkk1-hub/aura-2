# Aura Replica — Vercel-ready

A React + Vite local-first Aura-inspired web app.

## Run locally
```bash
npm install
npm run dev
```

## Deploy to Vercel
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`
- Root directory: repository root (the folder containing `package.json` and `index.html`)

## Features in this iteration
- Zeroed starting balance, level 1, zero XP and no completed actions.
- Preloaded Explore library with hobbies, habits, vices and side quests; difficulty, points, category, descriptions and image collages.
- Tall vertically scrollable Explore cards inspired by the PDF.
- Four-pillar dashboard, daily completion tracking and XP/aura rewards.
- Days timeline with activity, mood, points and journal snapshots.
- Journal integrated into Profile.
- Growth lessons and photo-backed challenge cards.
- Five themes, profile customization, local persistence and JSON import/export.

## Data and backend
This build persists data in the visitor's browser using localStorage. It does not require an API key or external backend, but it is not multi-device cloud sync or a hosted database. For real accounts, cross-device sync and server-side backups, connect a database/auth provider such as Supabase in a later backend phase.

## Images
Explore and Growth photo cards use remote Unsplash image URLs and therefore need an internet connection to load those images. Core tracking and local data storage do not require an API.
