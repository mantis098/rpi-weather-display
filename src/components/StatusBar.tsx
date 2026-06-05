import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import type { MqttStatus } from '../hooks/useMqttWeather';

interface StatusBarProps {
  status: MqttStatus;
  stationName: string;
}

export default function StatusBar({ status, stationName }: StatusBarProps) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 1 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography variant="h5" color="text.primary" sx={{ fontWeight: 'fontWeightMedium' }}>
          {stationName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {dateStr}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={2} alignItems="center">
        {status.lastMessageAt && (
          <Typography variant="body2" color="text.secondary">
            Letztes Update: {status.lastMessageAt.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
          </Typography>
        )}
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: status.connected ? 'success.main' : 'error.main',
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'none' }}>
            {status.connected ? 'MQTT Verbunden' : 'Getrennt'}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
