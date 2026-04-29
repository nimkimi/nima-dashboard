'use client';
import { useNotepad } from '@/hooks/useNotepad';
import styles from './Notepad.module.css';

export default function Notepad() {
  const { note, setNote, clearNote } = useNotepad();

  return (
    <section className={`glass ${styles.root}`} aria-label="Scratch pad">
      <div className={styles.header}>
        <p className="eyebrow" style={{ marginBottom: 0, flex: 1 }}>Scratch Pad</p>
        {note && (
          <button className={styles.clearBtn} onClick={clearNote} aria-label="Clear notes">
            Clear
          </button>
        )}
      </div>
      <textarea
        className={styles.textarea}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Quick notes, ideas, links…"
        aria-label="Scratch pad text area"
        spellCheck
      />
      <div className={styles.footer}>
        <span className={styles.hint}>Saved · syncs across tabs</span>
        <span
          className={styles.chars}
          aria-live="polite"
          aria-atomic="true"
        >
          {note.length > 0 ? `${note.length} chars` : ''}
        </span>
      </div>
    </section>
  );
}
