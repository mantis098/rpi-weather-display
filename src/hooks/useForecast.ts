import { useState, useEffect } from 'react';
import type { ForecastDay } from '../types/weather';

const LAT = import.meta.env.VITE_LATITUDE || '51.05';
const LON = import.meta.env.VITE_LONGITUDE || '13.74';

const WEEKDAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

export function useForecast() {
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchForecast() {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant,uv_index_max&timezone=auto&forecast_days=7`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (cancelled) return;

        const days: ForecastDay[] = data.daily.time.map((date: string, i: number) => {
          const d = new Date(date + 'T12:00:00');
          return {
            date,
            weekday: WEEKDAYS[d.getDay()],
            tempMax: Math.round(data.daily.temperature_2m_max[i]),
            tempMin: Math.round(data.daily.temperature_2m_min[i]),
            weatherCode: data.daily.weather_code[i],
            precipitationProbability: data.daily.precipitation_probability_max[i],
            windSpeedMax: Math.round(data.daily.wind_speed_10m_max[i]),
            windDirection: data.daily.wind_direction_10m_dominant[i],
            uvIndexMax: data.daily.uv_index_max[i],
          };
        });

        setForecast(days);
        setError(null);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Vorhersage konnte nicht geladen werden');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchForecast();
    const interval = setInterval(fetchForecast, 30 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return { forecast, loading, error };
}
