import type { ReactNode } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  unit: string;
  subValue?: string;
  color?: string;
}

export default function MetricCard({ icon, label, value, unit, subValue, color }: MetricCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        bgcolor: 'background.paper',
        transition: (t) => t.transitions.create('box-shadow', { duration: t.transitions.duration.short }),
        '&:hover': {
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ color: color ?? 'primary.main', display: 'flex' }}>{icon}</Box>
            <Typography variant="caption" color="text.secondary">
              {label}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="baseline" spacing={0.5}>
            <Typography variant="h3" component="span" color="text.primary">
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {unit}
            </Typography>
          </Stack>
          {subValue && (
            <Typography variant="body2" color="text.secondary">
              {subValue}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
