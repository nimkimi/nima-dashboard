'use client';
import { useState, useEffect, useRef } from 'react';
import { FEEDS, fetchHN, fetchRSS, type FeedItem } from '@/lib/newsFeeds';
import styles from './NewsTabs.module.css';

const TAB_KEYS = Object.keys(FEEDS);

export default function NewsTabs() {
  const [activeTab, setActiveTab] = useState(TAB_KEYS[0]);
  const [data, setData] = useState<Record<string, FeedItem[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    TAB_KEYS.forEach(async (key) => {
      setLoading((l) => ({ ...l, [key]: true }));
      try {
        const feed = FEEDS[key];
        let items: FeedItem[];
        if (feed.type === 'hn') {
          items = await fetchHN(15);
        } else {
          try {
            items = await fetchRSS(feed.url);
          } catch {
            items = await fetchRSS(feed.fallbackUrl);
          }
        }
        setData((d) => ({ ...d, [key]: items }));
      } catch {
        setErrors((e) => ({ ...e, [key]: 'Could not load feed' }));
      } finally {
        setLoading((l) => ({ ...l, [key]: false }));
      }
    });
  }, []);

  function handleTabKeyDown(e: React.KeyboardEvent, idx: number) {
    let next = idx;
    if (e.key === 'ArrowRight') next = (idx + 1) % TAB_KEYS.length;
    else if (e.key === 'ArrowLeft') next = (idx - 1 + TAB_KEYS.length) % TAB_KEYS.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = TAB_KEYS.length - 1;
    else return;
    e.preventDefault();
    setActiveTab(TAB_KEYS[next]);
    tabRefs.current[next]?.focus();
  }

  const items = data[activeTab] ?? [];
  const isLoading = loading[activeTab];
  const err = errors[activeTab];

  return (
    <section className="card" aria-label="News">
      <div className={styles.tabList} role="tablist" aria-label="News categories">
        {TAB_KEYS.map((key, idx) => (
          <button
            key={key}
            ref={(el) => { tabRefs.current[idx] = el; }}
            className={`${styles.tab} ${activeTab === key ? styles.tabActive : ''}`}
            role="tab"
            aria-selected={activeTab === key}
            aria-controls={`tabpanel-${key}`}
            id={`tab-${key}`}
            tabIndex={activeTab === key ? 0 : -1}
            onClick={() => setActiveTab(key)}
            onKeyDown={(e) => handleTabKeyDown(e, idx)}
          >
            {FEEDS[key].label}
          </button>
        ))}
      </div>

      {TAB_KEYS.map((key) => (
        <div
          key={key}
          id={`tabpanel-${key}`}
          role="tabpanel"
          aria-labelledby={`tab-${key}`}
          hidden={activeTab !== key}
        >
          {activeTab === key && (
            <>
              {isLoading && <p className={styles.state}>Loading {FEEDS[key].ariaLabel}…</p>}
              {err && !isLoading && <p className={styles.state} role="alert">{err}</p>}
              {!isLoading && !err && (
                <ol className={styles.list}>
                  {items.map((item, i) => (
                    <li key={item.id} className={styles.item}>
                      <span className={styles.rank} aria-hidden="true">{i + 1}</span>
                      <div className={styles.content}>
                        <a href={item.url} className={styles.title} target="_blank" rel="noopener noreferrer">
                          {item.title}
                        </a>
                        <div className={styles.meta}>
                          <span>{item.source}</span>
                          {item.score != null && <span>▲ {item.score}</span>}
                          {item.comments != null && <span>💬 {item.comments}</span>}
                          {item.pubDate && <span>{item.pubDate}</span>}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </>
          )}
        </div>
      ))}
    </section>
  );
}
