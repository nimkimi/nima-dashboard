'use client';
import { useState } from 'react';
import { useClock } from '@/hooks/useClock';
import styles from './HeroBar.module.css';

const ENGINES = [
  { key: 'google',     label: 'Google',     url: 'https://www.google.com/search?q=' },
  { key: 'ddg',        label: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
  { key: 'perplexity', label: 'Perplexity', url: 'https://www.perplexity.ai/search?q=' },
];

function toDirectUrl(input: string): string | null {
  const value = input.trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) {
    try { return new URL(value).href; } catch { return null; }
  }
  const domainLike = /^(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:[/:?#].*)?$/i;
  if (domainLike.test(value)) {
    try { return new URL(`https://${value}`).href; } catch { return null; }
  }
  return null;
}

export default function HeroBar() {
  const { time, date, greeting } = useClock();
  const [query, setQuery] = useState('');
  const [engine, setEngine] = useState('google');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = query.trim();
    if (!value) return;
    const direct = toDirectUrl(value);
    if (direct) {
      window.open(direct, '_blank', 'noopener');
    } else {
      const eng = ENGINES.find((e) => e.key === engine) ?? ENGINES[0];
      window.open(`${eng.url}${encodeURIComponent(value)}`, '_blank', 'noopener');
    }
    setQuery('');
  }

  return (
    <header className={`glass ${styles.root}`}>
      <div className={styles.clock}>
        <p className={styles.greeting}>{greeting}, Nima</p>
        <time className={styles.time} dateTime={time} aria-live="off">{time}</time>
        <p className={styles.date}>{date}</p>
      </div>

      <div className={styles.divider} aria-hidden="true" />

      <div className={styles.searchArea}>
        <form
          className={styles.form}
          onSubmit={handleSubmit}
          role="search"
          aria-label="Web search"
        >
          <div className={styles.inputRow}>
            <span className={styles.searchIcon} aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </span>
            <input
              className={styles.input}
              type="search"
              placeholder="Search the web or enter a URL…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search query"
              autoComplete="off"
            />
            <button className={styles.submitBtn} type="submit" aria-label="Search">
              ↵
            </button>
          </div>
          <div className={styles.engines} role="group" aria-label="Search engine">
            {ENGINES.map((eng) => (
              <button
                key={eng.key}
                type="button"
                className={`${styles.enginePill} ${engine === eng.key ? styles.engineActive : ''}`}
                onClick={() => setEngine(eng.key)}
                aria-pressed={engine === eng.key}
              >
                {eng.label}
              </button>
            ))}
          </div>
        </form>
      </div>
    </header>
  );
}
