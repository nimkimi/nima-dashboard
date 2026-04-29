'use client';
import { useState, useId } from 'react';
import { loadLinks, saveLinks, resetLinks, type Link } from '@/lib/links';
import styles from './QuickLinks.module.css';

export default function QuickLinks() {
  const [links, setLinks] = useState<Link[]>(() => loadLinks());
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Omit<Link, 'id'>>({ label: '', url: '', icon: '🔗' });
  const formId = useId();

  function persistLinks(next: Link[]) {
    setLinks(next);
    saveLinks(next);
  }

  function addLink(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.label.trim() || !draft.url.trim()) return;
    const url = draft.url.startsWith('http') ? draft.url : `https://${draft.url}`;
    persistLinks([...links, { id: Date.now().toString(), label: draft.label, url, icon: draft.icon || '🔗' }]);
    setDraft({ label: '', url: '', icon: '🔗' });
    setEditing(false);
  }

  return (
    <section className={`glass ${styles.root}`} aria-label="Quick links">
      <div className={styles.header}>
        <p className="eyebrow" style={{ marginBottom: 0, flex: 1 }}>Quick Links</p>
        <button
          className={styles.editBtn}
          onClick={() => setEditing((v) => !v)}
          aria-expanded={editing}
          aria-label={editing ? 'Close editor' : 'Add link'}
        >
          {editing ? '✕' : '+'}
        </button>
      </div>

      {editing && (
        <form id={formId} className={styles.addForm} onSubmit={addLink} aria-label="Add new link">
          <input
            className={styles.addInput}
            type="text"
            placeholder="Label"
            value={draft.label}
            onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
            required
            aria-label="Link label"
          />
          <input
            className={styles.addInput}
            type="url"
            placeholder="https://…"
            value={draft.url}
            onChange={(e) => setDraft((d) => ({ ...d, url: e.target.value }))}
            required
            aria-label="Link URL"
          />
          <input
            className={`${styles.addInput} ${styles.emojiInput}`}
            type="text"
            placeholder="Icon"
            value={draft.icon}
            maxLength={4}
            onChange={(e) => setDraft((d) => ({ ...d, icon: e.target.value }))}
            aria-label="Link icon emoji"
          />
          <div className={styles.formActions}>
            <button className={styles.saveBtn} type="submit">Save</button>
            <button className={styles.resetBtn} type="button" onClick={() => setLinks(resetLinks())}>
              Reset
            </button>
          </div>
        </form>
      )}

      <ul className={styles.grid} role="list">
        {links.map((link) => (
          <li key={link.id} className={styles.item}>
            <a
              href={link.url}
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={styles.linkIcon} aria-hidden="true">{link.icon}</span>
              <span className={styles.linkLabel}>{link.label}</span>
            </a>
            {editing && (
              <button
                className={styles.removeBtn}
                onClick={() => persistLinks(links.filter((l) => l.id !== link.id))}
                aria-label={`Remove ${link.label}`}
              >
                ✕
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
