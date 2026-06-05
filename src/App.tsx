import { useState, useCallback } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import theme from './theme';
import { useMqttWeather } from './hooks/useMqttWeather';
import { useForecast } from './hooks/useForecast';
import type { WeatherData } from './types/weather';
import { getUvLevel } from './types/weather';
import StatusBar from './components/StatusBar';
import CurrentConditions from './components/CurrentConditions';
import MetricCard from './components/MetricCard';
import WindCompass from './components/WindCompass';
import ForecastRow from './components/ForecastRow';
import DemoOverlay from './components/DemoOverlay';
import Opacity from '@mui/icons-material/Opacity';
import Compress from '@mui/icons-material/Compress';
import WaterDrop from '@mui/icons-material/WaterDrop';
import WbSunny from '@mui/icons-material/WbSunny';
import Visibility from '@mui/icons-material/Visibility';
import DeviceThermostat from '@mui/icons-material/DeviceThermostat';

const STATION_NAME = import.meta.env.VITE_STATION_NAME || 'Wetterstation WS90';

function App() {
  const { weather: mqttWeather, status } = useMqttWeather();
  const { forecast } = useForecast();
  const [demoWeather, setDemoWeather] = useState<WeatherData | null>(null);

  const handleDemoData = useCallback((data: WeatherData) => {
    setDemoWeather(data);
  }, []);

  const weather = mqttWeather ?? demoWeather;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DemoOverlay onData={handleDemoData} isConnected={status.connected} />
      <Box
        sx={{
          height: '100vh',
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          gap: 2,
        }}
      >
        <StatusBar status={status} stationName={STATION_NAME} />

        {weather ? (
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <Grid container spacing={2} sx={{ height: '100%' }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
                  <CurrentConditions
                    weather={weather}
                    todayForecast={forecast.length > 0 ? forecast[0] : null}
                  />
                  <WindCompass
                    direction={weather.windDirection}
                    speed={weather.windSpeed}
                    gust={weather.windGust}
                    maxDailyGust={weather.maxDailyGust}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 8 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6, lg: 4 }}>
                      <MetricCard
                        icon={<Opacity />}
                        label="Luftfeuchtigkeit"
                        value={weather.humidity.toFixed(0)}
                        unit="%"
                        subValue={`Innen: ${weather.humidityIndoor.toFixed(0)}%`}
                        color={theme.palette.info.main}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, lg: 4 }}>
                      <MetricCard
                        icon={<Compress />}
                        label="Luftdruck"
                        value={weather.pressureRelative.toFixed(1)}
                        unit="hPa"
                        color={theme.palette.secondary.main}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, lg: 4 }}>
                      <MetricCard
                        icon={<WaterDrop />}
                        label="Niederschlag Heute"
                        value={weather.dailyRain.toFixed(1)}
                        unit="mm"
                        subValue={weather.rainRate > 0 ? `Aktuell: ${weather.rainRate.toFixed(1)} mm/h` : 'Kein Regen'}
                        color={theme.palette.info.light}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, lg: 4 }}>
                      <MetricCard
                        icon={<WbSunny />}
                        label="UV-Index"
                        value={weather.uvIndex.toFixed(1)}
                        unit={getUvLevel(weather.uvIndex).label}
                        color={getUvLevel(weather.uvIndex).color}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, lg: 4 }}>
                      <MetricCard
                        icon={<Visibility />}
                        label="Solarstrahlung"
                        value={weather.solarRadiation.toFixed(0)}
                        unit="W/m\u00b2"
                        color="#ffd54f"
                      />
                    </Grid>
                    <Grid size={{ xs: 6, lg: 4 }}>
                      <MetricCard
                        icon={<DeviceThermostat />}
                        label="Innentemperatur"
                        value={weather.temperatureIndoor.toFixed(1)}
                        unit="\u00b0C"
                        subValue={`Feuchte: ${weather.humidityIndoor.toFixed(0)}%`}
                        color={theme.palette.success.main}
                      />
                    </Grid>
                  </Grid>

                  {forecast.length > 0 && <ForecastRow forecast={forecast} />}
                </Box>
              </Grid>
            </Grid>
          </Box>
        ) : null}
      </Box>
    </ThemeProvider>
  );
}

export default App;
