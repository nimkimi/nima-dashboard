"use client";
import { useState } from "react";
import styles from "./SearchBar.module.css";

interface Engine {
  key: string;
  label: string;
  url: string;
}

const ENGINES: Engine[] = [
  { key: "google", label: "Google", url: "https://www.google.com/search?q=" },
  { key: "ddg", label: "DuckDuckGo", url: "https://duckduckgo.com/?q=" },
  {
    key: "perplexity",
    label: "Perplexity",
    url: "https://www.perplexity.ai/search?q=",
  },
];

function toDirectUrl(input: string): string | null {
  const value = input.trim();
  if (!value) return null;

  if (/^https?:\/\//i.test(value)) {
    try {
      return new URL(value).href;
    } catch {
      return null;
    }
  }

  const domainLike = /^(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:[/:?#].*)?$/i;
  if (domainLike.test(value)) {
    try {
      return new URL(`https://${value}`).href;
    } catch {
      return null;
    }
  }

  return null;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [engine, setEngine] = useState("google");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = query.trim();
    if (!value) return;

    const directUrl = toDirectUrl(value);
    if (directUrl) {
      window.open(directUrl, "_blank", "noopener");
      setQuery("");
      return;
    }

    const selectedEngine =
      ENGINES.find((eng) => eng.key === engine) ?? ENGINES[0];
    const { url } = selectedEngine;
    window.open(`${url}${encodeURIComponent(value)}`, "_blank", "noopener");
    setQuery("");
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      role="search"
      aria-label="Web search"
    >
      <div className={styles.wrap}>
        <span className={styles.icon} aria-hidden="true">
          🔍
        </span>
        <input
          className={styles.input}
          type="search"
          placeholder="Search the web…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search query"
        />
        <select
          className={styles.select}
          value={engine}
          onChange={(e) => setEngine(e.target.value)}
          aria-label="Search engine"
        >
          {ENGINES.map((eng) => (
            <option key={eng.key} value={eng.key}>
              {eng.label}
            </option>
          ))}
        </select>
        <button className={styles.btn} type="submit" aria-label="Search">
          Go
        </button>
      </div>
    </form>
  );
}
