import WbSunny from '@mui/icons-material/WbSunny';
import Cloud from '@mui/icons-material/Cloud';
import WbCloudy from '@mui/icons-material/WbCloudy';
import Foggy from '@mui/icons-material/Foggy';
import Grain from '@mui/icons-material/Grain';
import WaterDrop from '@mui/icons-material/WaterDrop';
import AcUnit from '@mui/icons-material/AcUnit';
import Thunderstorm from '@mui/icons-material/Thunderstorm';
import CloudySnowing from '@mui/icons-material/CloudySnowing';
import NightsStay from '@mui/icons-material/NightsStay';
import type { SxProps, Theme } from '@mui/material/styles';

interface WeatherIconProps {
  code: number;
  sx?: SxProps<Theme>;
  isNight?: boolean;
}

export default function WeatherIcon({ code, sx, isNight }: WeatherIconProps) {
  const props = { sx };

  if (code === 0) return isNight ? <NightsStay {...props} /> : <WbSunny {...props} />;
  if (code <= 2) return <WbCloudy {...props} />;
  if (code === 3) return <Cloud {...props} />;
  if (code <= 48) return <Foggy {...props} />;
  if (code <= 55) return <Grain {...props} />;
  if (code <= 67) return <WaterDrop {...props} />;
  if (code <= 77) return <AcUnit {...props} />;
  if (code <= 82) return <WaterDrop {...props} />;
  if (code <= 86) return <CloudySnowing {...props} />;
  if (code >= 95) return <Thunderstorm {...props} />;
  return <Cloud {...props} />;
}

export function getWeatherIconColor(code: number): string {
  if (code === 0) return '#ffd54f';
  if (code <= 2) return '#90caf9';
  if (code === 3) return '#78909c';
  if (code <= 48) return '#b0bec5';
  if (code <= 55) return '#4fc3f7';
  if (code <= 67) return '#42a5f5';
  if (code <= 77) return '#e0e0e0';
  if (code <= 82) return '#42a5f5';
  if (code <= 86) return '#e0e0e0';
  if (code >= 95) return '#ffa726';
  return '#90a4ae';
}
