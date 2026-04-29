'use client';
import { useWeather } from '@/hooks/useWeather';
import styles from './WeatherCard.module.css';

export default function WeatherCard() {
  const { weather, loading, error } = useWeather();

  return (
    <section className={`glass ${styles.root}`} aria-label="Weather">
      <p className="eyebrow">Weather</p>

      {loading && <p className={styles.state}>Detecting location…</p>}
      {error && <p className={styles.state} role="alert">{error}</p>}

      {weather && (
        <div className={styles.body}>
          <div className={styles.main}>
            <span className={styles.icon} aria-hidden="true">{weather.icon}</span>
            <div className={styles.tempGroup}>
              <span className={styles.temp}>{weather.temp}</span>
              <span className={styles.unit}>°C</span>
            </div>
          </div>
          <p className={styles.condition}>{weather.condition}</p>
          <p className={styles.city}>📍 {weather.city}</p>
          <ul className={styles.stats} aria-label="Weather details">
            <li className={styles.stat}>
              <span className={styles.statLabel}>Feels</span>
              <span className={styles.statValue}>{weather.feelsLike}°</span>
            </li>
            <li className={styles.stat}>
              <span className={styles.statLabel}>Hum.</span>
              <span className={styles.statValue}>{weather.humidity}%</span>
            </li>
            <li className={styles.stat}>
              <span className={styles.statLabel}>Wind</span>
              <span className={styles.statValue}>{weather.windSpeed}<small>mph</small></span>
            </li>
          </ul>
        </div>
      )}
    </section>
  );
}
