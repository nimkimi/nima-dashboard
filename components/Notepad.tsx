'use client';
import { useNotepad } from '@/hooks/useNotepad';
import styles from './Notepad.module.css';

export default function Notepad() {
  const { note, setNote, clearNote } = useNotepad();

  return (
    <section className="card" aria-label="Scratch pad">
      <p className="card-label">
        📝 Scratch Pad
        <span className={styles.hint}>Saved for 30 days • syncs across tabs</span>
        {note && (
          <button className={styles.clearBtn} onClick={clearNote} aria-label="Clear notes">
            Clear
          </button>
        )}
      </p>
      <textarea
        className={styles.textarea}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Quick notes, ideas, links…"
        aria-label="Scratch pad text area"
        spellCheck
        rows={5}
      />
      <p className={styles.chars} aria-live="polite" aria-atomic="true">
        {note.length > 0 ? `${note.length} chars` : ''}
      </p>
    </section>
  );
}
