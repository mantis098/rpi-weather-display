import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import type { WeatherData } from '../types/weather';

function generateDemoData(): WeatherData {
  const hour = new Date().getHours();
  const baseTemp = 18 + Math.sin((hour - 6) * Math.PI / 12) * 8;
  return {
    temperature: baseTemp + (Math.random() - 0.5) * 2,
    temperatureIndoor: 22 + (Math.random() - 0.5) * 1,
    humidity: 55 + Math.random() * 20,
    humidityIndoor: 45 + Math.random() * 10,
    pressureRelative: 1013 + (Math.random() - 0.5) * 20,
    pressureAbsolute: 1010 + (Math.random() - 0.5) * 20,
    windDirection: Math.random() * 360,
    windSpeed: 5 + Math.random() * 20,
    windGust: 10 + Math.random() * 25,
    maxDailyGust: 30 + Math.random() * 20,
    rainRate: Math.random() > 0.7 ? Math.random() * 5 : 0,
    dailyRain: Math.random() * 8,
    weeklyRain: Math.random() * 25,
    monthlyRain: Math.random() * 60,
    solarRadiation: hour >= 6 && hour <= 20 ? Math.sin((hour - 6) * Math.PI / 14) * 800 : 0,
    uvIndex: hour >= 8 && hour <= 18 ? Math.sin((hour - 8) * Math.PI / 10) * 8 : 0,
    dewPoint: baseTemp - 8 + (Math.random() - 0.5) * 3,
    windChill: baseTemp - 2 + (Math.random() - 0.5) * 2,
    feelsLike: baseTemp - 1 + (Math.random() - 0.5) * 3,
    lastUpdate: new Date(),
  };
}

interface DemoOverlayProps {
  onData: (data: WeatherData) => void;
  isConnected: boolean;
}

export default function DemoOverlay({ onData, isConnected }: DemoOverlayProps) {
  const [active, setActive] = useState(!isConnected);

  useEffect(() => {
    if (isConnected) {
      setActive(false);
      return;
    }

    setActive(true);
    onData(generateDemoData());

    const interval = setInterval(() => {
      onData(generateDemoData());
    }, 5000);

    return () => clearInterval(interval);
  }, [isConnected, onData]);

  if (!active) return null;

  return (
    <Box sx={{ position: 'fixed', top: 8, right: 8, zIndex: 'tooltip' }}>
      <Alert severity="info" variant="outlined" sx={{ py: 0, bgcolor: 'background.paper' }}>
        <Typography variant="caption" sx={{ textTransform: 'none' }}>
          Demo-Modus -- Keine MQTT-Verbindung
        </Typography>
      </Alert>
    </Box>
  );
}
