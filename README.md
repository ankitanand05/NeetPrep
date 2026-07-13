# NeetPrep

A premium, frontend-only NEET chapter-wise question practice platform. No backend — everything runs in the browser and persists locally via IndexedDB.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion · Zustand · Dexie.js (IndexedDB) · Recharts · next-themes · PWA (installable, offline-capable)

## Features

- Chapter-wise practice across Physics, Chemistry (Physical/Inorganic/Organic), Botany, and Zoology, following the full NEET/NCERT syllabus
- Exam-style practice screen: timer, question palette, bookmarks, mark-for-review, shuffle
- Results with score breakdown, charts, and topic/difficulty analysis
- Review screen with explanations and student-vs-correct-answer comparison
- Progress, bookmarks, and streaks stored locally in IndexedDB — works offline

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding Questions

Drop a new chapter JSON file under `src/data/<subject>/` following the `Question` type in `src/types/question.ts`, then register it in `src/data/manifest.ts`. No other code changes are needed — the chapter list, stats, and practice flow pick it up automatically.

## Deployment

Configured for [Render](https://render.com) via `render.yaml` (Node web service — `npm run build` then `npm run start`). Push to GitHub and create a new Render Web Service from this repo, or use the Render Blueprint (`render.yaml`) for one-click setup.
