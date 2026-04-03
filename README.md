# Nima's Dashboard

Personal developer start page built with Next.js.

This version has **no login/auth flow** and **no chat assistant**.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# http://localhost:3000
```

## Available Scripts

- `npm run dev` — start local development server
- `npm run build` — create production build
- `npm run start` — run production server
- `npm run lint` — run ESLint checks

## Project Structure

```
nima-dashboard/
├── app/
│   ├── globals.css         ← Design tokens + shared styles
│   ├── layout.tsx
│   ├── page.tsx            ← Dashboard layout/composition
│   └── page.module.css
├── components/             ← One file per widget
│   ├── Clock.jsx / .css
│   ├── SearchBar.jsx / .css
│   ├── WeatherCard.jsx / .css
│   ├── QuickLinks.jsx / .css
│   ├── Notepad.jsx / .css
│   └── NewsTabs.jsx / .css
├── hooks/
│   ├── useClock.js
│   ├── useWeather.js       ← Open-Meteo, no API key needed
│   └── useNotepad.js       ← cookie persistence + BroadcastChannel sync
└── lib/
	├── links.js            ← default links + localStorage helpers
	└── newsFeeds.js        ← HN + RSS fetch helpers
```

## Customizing

- **Quick links** — click `+ Add` on the dashboard; stored in localStorage
- **News feeds** — edit `lib/newsFeeds.js` to swap RSS URLs
- **Accent color** — change `--accent` in `app/globals.css`
