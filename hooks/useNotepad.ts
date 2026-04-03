'use client';
import { useState, useEffect, useCallback } from 'react';

const COOKIE_NAME = 'dash_note_v2';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
const CHANNEL_NAME = 'dash_notepad_v2';

function readCookie(): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : '';
}

function writeCookie(value: string) {
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(value)}; path=/; SameSite=Strict; max-age=${COOKIE_MAX_AGE}`;
}

function deleteCookie() {
  document.cookie = `${COOKIE_NAME}=; path=/; SameSite=Strict; max-age=0`;
}

interface UseNotepadResult {
  note: string;
  setNote: (value: string) => void;
  clearNote: () => void;
}

export function useNotepad(): UseNotepadResult {
  const [note, setNoteState] = useState(() => readCookie());

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const ch = new BroadcastChannel(CHANNEL_NAME);
    ch.onmessage = (e) => {
      if (e.data?.type === 'NOTE_UPDATE') {
        setNoteState(e.data.value);
        writeCookie(e.data.value);
      }
    };
    return () => ch.close();
  }, []);

  const setNote = useCallback((value: string) => {
    setNoteState(value);
    writeCookie(value);
    if (typeof BroadcastChannel !== 'undefined') {
      const ch = new BroadcastChannel(CHANNEL_NAME);
      ch.postMessage({ type: 'NOTE_UPDATE', value });
      ch.close();
    }
  }, []);

  const clearNote = useCallback(() => {
    setNoteState('');
    deleteCookie();
    if (typeof BroadcastChannel !== 'undefined') {
      const ch = new BroadcastChannel(CHANNEL_NAME);
      ch.postMessage({ type: 'NOTE_UPDATE', value: '' });
      ch.close();
    }
  }, []);

  return { note, setNote, clearNote };
}
