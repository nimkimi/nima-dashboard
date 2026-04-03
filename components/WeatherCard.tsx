'use client';
import { useWeather } from '@/hooks/useWeather';
import styles from './WeatherCard.module.css';

export default function WeatherCard() {
  const { weather, loading, error } = useWeather();

  return (
    <section className="card" aria-label="Weather">
      <p className="card-label">🌤 Weather</p>

      {loading && <p className={styles.state}>Detecting location…</p>}
      {error && <p className={styles.state} role="alert">{error}</p>}

      {weather && (
        <div className={styles.body}>
          <div className={styles.main}>
            <span className={styles.icon} aria-hidden="true">{weather.icon}</span>
            <div>
              <span className={styles.temp}>{weather.temp}°C</span>
              <span className={styles.condition}>{weather.condition}</span>
            </div>
          </div>
          <p className={styles.city}>{weather.city}</p>
          <ul className={styles.stats} aria-label="Weather details">
            <li>
              <span className={styles.statLabel}>Feels like</span>
              <span className={styles.statValue}>{weather.feelsLike}°</span>
            </li>
            <li>
              <span className={styles.statLabel}>Humidity</span>
              <span className={styles.statValue}>{weather.humidity}%</span>
            </li>
            <li>
              <span className={styles.statLabel}>Wind</span>
              <span className={styles.statValue}>{weather.windSpeed} mph</span>
            </li>
          </ul>
        </div>
      )}
    </section>
  );
}
