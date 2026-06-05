import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Navigation from '@mui/icons-material/Navigation';
import Air from '@mui/icons-material/Air';
import { getWindDirectionLabel } from '../types/weather';

interface WindCompassProps {
  direction: number;
  speed: number;
  gust: number;
  maxDailyGust: number;
}

export default function WindCompass({ direction, speed, gust, maxDailyGust }: WindCompassProps) {
  return (
    <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Air sx={{ color: 'primary.main' }} />
            <Typography variant="caption" color="text.secondary">
              Wind
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                position: 'relative',
                width: 100,
                height: 100,
                borderRadius: '50%',
                border: '2px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {['N', 'O', 'S', 'W'].map((dir, i) => (
                <Typography
                  key={dir}
                  variant="caption"
                  sx={{
                    position: 'absolute',
                    fontSize: '0.6rem',
                    color: 'text.secondary',
                    ...(i === 0 && { top: 4, left: '50%', transform: 'translateX(-50%)' }),
                    ...(i === 1 && { right: 4, top: '50%', transform: 'translateY(-50%)' }),
                    ...(i === 2 && { bottom: 4, left: '50%', transform: 'translateX(-50%)' }),
                    ...(i === 3 && { left: 4, top: '50%', transform: 'translateY(-50%)' }),
                  }}
                >
                  {dir}
                </Typography>
              ))}
              <Navigation
                sx={{
                  fontSize: 36,
                  color: 'primary.main',
                  transform: `rotate(${direction}deg)`,
                  transition: (t) => t.transitions.create('transform', { duration: t.transitions.duration.standard }),
                }}
              />
            </Box>

            <Stack spacing={0.5} sx={{ flex: 1 }}>
              <Typography variant="h3" component="div" color="text.primary">
                {speed.toFixed(1)} km/h
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {getWindDirectionLabel(direction)} ({Math.round(direction)}{'\u00b0'})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Boeen: {gust.toFixed(1)} km/h
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Max. heute: {maxDailyGust.toFixed(1)} km/h
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
