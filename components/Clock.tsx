'use client';
import { useClock } from '@/hooks/useClock';
import styles from './Clock.module.css';

export default function Clock() {
  const { time, date, greeting } = useClock();

  return (
    <div className={styles.root}>
      <p className={styles.greeting}>{greeting}, Nima</p>
      <time className={styles.time} dateTime={time} aria-live="off">
        {time}
      </time>
      <p className={styles.date}>{date}</p>
    </div>
  );
}
