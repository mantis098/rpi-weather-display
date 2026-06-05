import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import WbCloudy from '@mui/icons-material/WbCloudy';
import WaterDrop from '@mui/icons-material/WaterDrop';
import type { ForecastDay } from '../types/weather';
import { getWeatherDescription } from '../types/weather';
import WeatherIcon, { getWeatherIconColor } from './WeatherIcon';

interface ForecastRowProps {
  forecast: ForecastDay[];
}

export default function ForecastRow({ forecast }: ForecastRowProps) {
  return (
    <Card sx={{ bgcolor: 'background.paper' }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <WbCloudy sx={{ color: 'primary.main' }} />
          <Typography variant="caption" color="text.secondary">
            7-Tage-Vorhersage
          </Typography>
        </Stack>

        <Stack direction="row" spacing={0} sx={{ overflowX: 'auto' }}>
          {forecast.map((day, i) => {
            const iconColor = getWeatherIconColor(day.weatherCode);
            const isToday = i === 0;
            return (
              <Box
                key={day.date}
                sx={{
                  flex: '1 0 0',
                  minWidth: 90,
                  textAlign: 'center',
                  py: 1,
                  px: 0.5,
                  borderRadius: 1,
                  bgcolor: isToday ? 'action.selected' : 'transparent',
                }}
              >
                <Typography
                  variant="body2"
                  color={isToday ? 'primary.main' : 'text.secondary'}
                  sx={{ fontWeight: isToday ? 'fontWeightBold' : 'fontWeightRegular', mb: 1 }}
                >
                  {isToday ? 'Heute' : day.weekday}
                </Typography>

                <WeatherIcon
                  code={day.weatherCode}
                  sx={{ fontSize: 28, color: iconColor, mb: 0.5 }}
                />

                <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 1, fontSize: '0.65rem', textTransform: 'none' }}>
                  {getWeatherDescription(day.weatherCode)}
                </Typography>

                <Stack direction="row" justifyContent="center" spacing={0.5} alignItems="baseline">
                  <Typography variant="body2" color="text.primary" sx={{ fontWeight: 'fontWeightMedium' }}>
                    {day.tempMax}\u00b0
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                    {day.tempMin}\u00b0
                  </Typography>
                </Stack>

                {day.precipitationProbability > 0 && (
                  <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.25} sx={{ mt: 0.5 }}>
                    <WaterDrop sx={{ fontSize: 12, color: 'info.main' }} />
                    <Typography variant="caption" color="info.main" sx={{ fontSize: '0.65rem', textTransform: 'none' }}>
                      {day.precipitationProbability}%
                    </Typography>
                  </Stack>
                )}
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}
