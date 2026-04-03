'use client';
import { useState, useEffect } from 'react';

interface WmoEntry {
  label: string;
  icon: string;
}

const WMO_CODES: Record<number, WmoEntry> = {
  0:  { label: 'Clear sky',            icon: '☀️' },
  1:  { label: 'Mainly clear',         icon: '🌤️' },
  2:  { label: 'Partly cloudy',        icon: '⛅' },
  3:  { label: 'Overcast',             icon: '☁️' },
  45: { label: 'Foggy',                icon: '🌫️' },
  48: { label: 'Icy fog',              icon: '🌫️' },
  51: { label: 'Light drizzle',        icon: '🌦️' },
  53: { label: 'Drizzle',              icon: '🌦️' },
  55: { label: 'Heavy drizzle',        icon: '🌧️' },
  61: { label: 'Light rain',           icon: '🌧️' },
  63: { label: 'Rain',                 icon: '🌧️' },
  65: { label: 'Heavy rain',           icon: '🌧️' },
  71: { label: 'Light snow',           icon: '🌨️' },
  73: { label: 'Snow',                 icon: '❄️' },
  75: { label: 'Heavy snow',           icon: '❄️' },
  80: { label: 'Rain showers',         icon: '🌦️' },
  81: { label: 'Rain showers',         icon: '🌧️' },
  82: { label: 'Violent showers',      icon: '⛈️' },
  95: { label: 'Thunderstorm',         icon: '⛈️' },
  96: { label: 'Thunderstorm w/ hail', icon: '⛈️' },
  99: { label: 'Thunderstorm w/ hail', icon: '⛈️' },
};

export interface Weather {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  icon: string;
  city: string;
}

interface UseWeatherResult {
  weather: Weather | null;
  loading: boolean;
  error: string | null;
}

export function useWeather(): UseWeatherResult {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchWeather(lat: number, lon: number) {
      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        );
        const geo = await geoRes.json();
        const city =
          geo.address?.city ||
          geo.address?.town ||
          geo.address?.village ||
          geo.address?.county ||
          'Unknown location';

        const url =
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
          `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code` +
          `&wind_speed_unit=mph&temperature_unit=celsius&timezone=auto`;

        const wRes = await fetch(url);
        const wData = await wRes.json();
        const c = wData.current;
        const wmo = WMO_CODES[c.weather_code as number] ?? { label: 'Unknown', icon: '🌡️' };

        if (!cancelled) {
          setWeather({
            temp: Math.round(c.temperature_2m),
            feelsLike: Math.round(c.apparent_temperature),
            humidity: c.relative_humidity_2m,
            windSpeed: Math.round(c.wind_speed_10m),
            condition: wmo.label,
            icon: wmo.icon,
            city,
          });
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError('Could not load weather');
          setLoading(false);
        }
      }
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      () => {
        if (!cancelled) {
          setError('Location access denied');
          setLoading(false);
        }
      },
      { timeout: 8000 }
    );

    return () => { cancelled = true; };
  }, []);

  return { weather, loading, error };
}
