import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Thermostat from '@mui/icons-material/Thermostat';
import type { WeatherData } from '../types/weather';
import type { ForecastDay } from '../types/weather';
import WeatherIcon, { getWeatherIconColor } from './WeatherIcon';

interface CurrentConditionsProps {
  weather: WeatherData;
  todayForecast: ForecastDay | null;
}

export default function CurrentConditions({ weather, todayForecast }: CurrentConditionsProps) {
  const weatherCode = todayForecast?.weatherCode ?? 0;
  const iconColor = getWeatherIconColor(weatherCode);

  return (
    <Card
      sx={{
        height: '100%',
        bgcolor: 'background.paper',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${iconColor}, transparent)`,
        }}
      />
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Thermostat sx={{ color: 'secondary.main' }} />
              <Typography variant="caption" color="text.secondary">
                Aktuelle Bedingungen
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {weather.lastUpdate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={3}>
            <WeatherIcon
              code={weatherCode}
              sx={{ fontSize: 72, color: iconColor }}
            />
            <Box>
              <Typography variant="h1" component="div" color="text.primary" sx={{ lineHeight: 1 }}>
                {weather.temperature.toFixed(1)}\u00b0
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                Gefuehlt {weather.feelsLike.toFixed(1)}\u00b0C
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {todayForecast && (
              <Chip
                size="small"
                label={`${todayForecast.tempMin}\u00b0 / ${todayForecast.tempMax}\u00b0`}
                sx={{ bgcolor: 'action.hover' }}
              />
            )}
            <Chip
              size="small"
              label={`Taupunkt ${weather.dewPoint.toFixed(1)}\u00b0C`}
              sx={{ bgcolor: 'action.hover' }}
            />
            {todayForecast && todayForecast.precipitationProbability > 0 && (
              <Chip
                size="small"
                label={`Regen ${todayForecast.precipitationProbability}%`}
                sx={{ bgcolor: 'action.hover' }}
              />
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
