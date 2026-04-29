# Dashboard Redesign — Design Spec
**Date:** 2026-04-29  
**Status:** Approved

---

## Summary

Full component redesign of the nima-dashboard to a modern Aurora Glass aesthetic with an Ocean Depth color palette. All existing data logic, hooks, and accessibility attributes are preserved — only component structure and CSS change.

---

## Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Aesthetic | Aurora Glass | Frosted glass cards floating over a gradient mesh background |
| Layout | Horizontal Flow (C) | Clock+search inline at top; widget row in middle; news full-width at bottom |
| Color palette | Ocean Depth | Electric cobalt (#0050d2) + arctic teal (#00c8e8) gradients |
| Implementation | Full component redesign (Option 3) | New component boundaries, new CSS, new composition in `page.tsx` |

---

## Visual Design

### Background
A fixed full-viewport gradient mesh using layered radial gradients:
- Top-left bloom: `rgba(0, 90, 210, 0.75)` (cobalt)
- Bottom-right bloom: `rgba(0, 210, 220, 0.60)` (teal)
- Mid-field depth: `rgba(0, 50, 160, 0.35)` (deep navy)
- Top-right highlight: `rgba(0, 160, 200, 0.30)` (sky)
- Base: `#030610`

### Glass Cards
```css
background: rgba(255, 255, 255, 0.065);
backdrop-filter: blur(24px) saturate(160%);
border: 1px solid rgba(255, 255, 255, 0.11);
border-radius: 18px;
```
Top-edge inner highlight: 1px linear gradient `transparent → rgba(255,255,255,0.18) → transparent`.

### Typography
- Font: Inter (Google Fonts) with system-ui fallback
- Clock time: 52px, weight 800, gradient text `#ffffff → #80e8ff → #30d0f0`
- Section eyebrows: 10px, weight 600, letter-spacing 2.5px, uppercase, `rgba(255,255,255,0.25)`
- Body text: 13–14px, `rgba(255,255,255,0.82)`
- Muted/meta: `rgba(255,255,255,0.22–0.35)`

### Accent Colors
- Primary interactive: `#00c8e8` (teal)
- Active states: `rgba(0, 200, 240, 0.8)`
- Hover glows: `rgba(0, 180, 230, 0.12)` background, `rgba(0, 200, 240, 0.25)` border

---

## Component Architecture

### New: `HeroBar`
**Replaces:** `Clock` + `SearchBar` (both deleted)  
**File:** `components/HeroBar.tsx` + `components/HeroBar.module.css`

Layout: single glass card, horizontal flex.
- **Left pane** (`hero-clock`): greeting (uppercase teal label), large gradient time, muted date. Uses `useClock()` hook.
- **Right pane** (`hero-search`): search input row + engine pill switcher. Contains the `toDirectUrl` logic from old `SearchBar`. Engines: Google, DuckDuckGo, Perplexity.
- Divider: `border-right: 1px solid rgba(255,255,255,0.08)` between panes.

### Updated: `WeatherCard`
**File:** `components/WeatherCard.tsx` + `components/WeatherCard.module.css` (rewritten)

- Card eyebrow: "WEATHER" label
- Main row: emoji icon + large gradient temperature + unit
- Condition string below
- City with 📍 prefix
- Stats row (Feels like / Humidity / Wind) separated by top border
- Uses existing `useWeather()` hook unchanged

### Updated: `QuickLinks`
**File:** `components/QuickLinks.tsx` + `components/QuickLinks.module.css` (rewritten)

- Card eyebrow: "QUICK LINKS"
- Icon grid: `auto-fill, minmax(88px, 1fr)`
- Each tile: emoji icon on top, label below, glass tile with hover teal glow + `translateY(-2px)`
- Add button: dashed border tile, `+` icon + "Add" label
- Edit/remove mode: same logic as current, visual treatment updated
- Uses existing `loadLinks` / `saveLinks` / `resetLinks` unchanged

### Updated: `Notepad`
**File:** `components/Notepad.tsx` + `components/Notepad.module.css` (rewritten)

- Card eyebrow: "SCRATCH PAD"
- Textarea: `background: rgba(0,0,0,0.15)`, dark inset, italic placeholder
- Footer: "Saved · syncs across tabs" hint left, "Clear" teal button right
- Uses existing `useNotepad()` hook unchanged

### New: `NewsPanel`
**Replaces:** `NewsTabs`  
**File:** `components/NewsPanel.tsx` + `components/NewsPanel.module.css`

- Tab bar: borderless, bottom-border active indicator in teal, story count right-aligned
- Article list: rank number (muted) + title (hover → teal) + meta row (source pill, score, comment count, age)
- Uses existing `FEEDS`, `fetchHN`, `fetchRSS`, `FeedItem` from `lib/newsFeeds.ts` unchanged
- Keyboard navigation (ArrowLeft/Right/Home/End) preserved

### Page Layout: `page.tsx`
New composition:
```
<body>            ← gradient mesh background (globals.css on html/body)
  <HeroBar />     ← full-width clock + search card
  <WidgetRow>     ← flex row
    <WeatherCard />
    <QuickLinks />
    <Notepad />
  </WidgetRow>
  <NewsPanel />   ← full-width
</body>
```
`WidgetRow` is a layout-only wrapper div (no dedicated component file needed — just a styled `<div>` in `page.tsx`).

---

## CSS Architecture

### `globals.css` changes
- CSS variables updated to Ocean Depth palette
- `html, body` gets the gradient mesh background (fixed, full-viewport)
- `.glass` utility class added for the shared card treatment
- `.card-eyebrow` replaces `.card-label`
- Scrollbar styling unchanged

### New CSS variables
```css
--bg: #030610;
--accent: #00c8e8;
--accent-dim: rgba(0, 200, 240, 0.5);
--accent-glow: rgba(0, 180, 230, 0.12);
--glass-bg: rgba(255, 255, 255, 0.065);
--glass-border: rgba(255, 255, 255, 0.11);
--text: #e4e4f0;
--muted: rgba(255, 255, 255, 0.45);
--dim: rgba(255, 255, 255, 0.25);
```

---

## What Does NOT Change

- All custom hooks: `useClock`, `useWeather`, `useNotepad`
- All data/lib files: `lib/links.ts`, `lib/newsFeeds.ts`
- All accessibility: `aria-label`, `role`, keyboard navigation, `.sr-only`, skip link
- Next.js app structure: routing, metadata (note: `app/layout.tsx` gets one change — Inter font import added)
- `tsconfig.json`, `package.json`, build config

---

## Files Affected

| Action | File |
|---|---|
| Create | `components/HeroBar.tsx` |
| Create | `components/HeroBar.module.css` |
| Create | `components/NewsPanel.tsx` |
| Create | `components/NewsPanel.module.css` |
| Delete | `components/Clock.tsx` |
| Delete | `components/Clock.module.css` |
| Delete | `components/SearchBar.tsx` |
| Delete | `components/SearchBar.module.css` |
| Delete | `components/NewsTabs.tsx` |
| Delete | `components/NewsTabs.module.css` |
| Rewrite | `components/WeatherCard.tsx` |
| Rewrite | `components/WeatherCard.module.css` |
| Rewrite | `components/QuickLinks.tsx` |
| Rewrite | `components/QuickLinks.module.css` |
| Rewrite | `components/Notepad.tsx` |
| Rewrite | `components/Notepad.module.css` |
| Rewrite | `app/globals.css` |
| Rewrite | `app/page.tsx` |
| Rewrite | `app/page.module.css` |
| Update | `app/layout.tsx` (add Inter font import via `next/font/google`) |
