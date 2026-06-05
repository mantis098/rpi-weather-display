export interface EcowittData {
  tempf?: number;
  tempinf?: number;
  humidity?: number;
  humidityin?: number;
  baromrelin?: number;
  baromabsin?: number;
  winddir?: number;
  windspeedmph?: number;
  windgustmph?: number;
  maxdailygust?: number;
  rainratein?: number;
  eventrainin?: number;
  hourlyrainin?: number;
  dailyrainin?: number;
  weeklyrainin?: number;
  monthlyrainin?: number;
  totalrainin?: number;
  solarradiation?: number;
  uv?: number;
  dateutc?: string;
  dewpointf?: number;
  windchillf?: number;
  feelslikef?: number;
}

export interface WeatherData {
  temperature: number;
  temperatureIndoor: number;
  humidity: number;
  humidityIndoor: number;
  pressureRelative: number;
  pressureAbsolute: number;
  windDirection: number;
  windSpeed: number;
  windGust: number;
  maxDailyGust: number;
  rainRate: number;
  dailyRain: number;
  weeklyRain: number;
  monthlyRain: number;
  solarRadiation: number;
  uvIndex: number;
  dewPoint: number;
  windChill: number;
  feelsLike: number;
  lastUpdate: Date;
}

export interface ForecastDay {
  date: string;
  weekday: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  precipitationProbability: number;
  windSpeedMax: number;
  windDirection: number;
  uvIndexMax: number;
}

export function fahrenheitToCelsius(f: number): number {
  return (f - 32) * (5 / 9);
}

export function mphToKmh(mph: number): number {
  return mph * 1.60934;
}

export function inchesToMm(inches: number): number {
  return inches * 25.4;
}

export function inHgToHpa(inHg: number): number {
  return inHg * 33.8639;
}

export function parseEcowittData(raw: Record<string, unknown>): WeatherData {
  const num = (key: string, fallback = 0): number => {
    const val = raw[key];
    if (val === undefined || val === null) return fallback;
    const n = Number(val);
    return isNaN(n) ? fallback : n;
  };

  return {
    temperature: fahrenheitToCelsius(num('tempf')),
    temperatureIndoor: fahrenheitToCelsius(num('tempinf')),
    humidity: num('humidity'),
    humidityIndoor: num('humidityin'),
    pressureRelative: inHgToHpa(num('baromrelin')),
    pressureAbsolute: inHgToHpa(num('baromabsin')),
    windDirection: num('winddir'),
    windSpeed: mphToKmh(num('windspeedmph')),
    windGust: mphToKmh(num('windgustmph')),
    maxDailyGust: mphToKmh(num('maxdailygust')),
    rainRate: inchesToMm(num('rainratein')),
    dailyRain: inchesToMm(num('dailyrainin')),
    weeklyRain: inchesToMm(num('weeklyrainin')),
    monthlyRain: inchesToMm(num('monthlyrainin')),
    solarRadiation: num('solarradiation'),
    uvIndex: num('uv'),
    dewPoint: fahrenheitToCelsius(num('dewpointf')),
    windChill: fahrenheitToCelsius(num('windchillf')),
    feelsLike: fahrenheitToCelsius(num('feelslikef')),
    lastUpdate: new Date(),
  };
}

export function getWindDirectionLabel(deg: number): string {
  const dirs = ['N', 'NNO', 'NO', 'ONO', 'O', 'OSO', 'SO', 'SSO', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

export function getUvLevel(uv: number): { label: string; color: string } {
  if (uv <= 2) return { label: 'Niedrig', color: '#4caf50' };
  if (uv <= 5) return { label: 'Mittel', color: '#ffeb3b' };
  if (uv <= 7) return { label: 'Hoch', color: '#ff9800' };
  if (uv <= 10) return { label: 'Sehr hoch', color: '#f44336' };
  return { label: 'Extrem', color: '#9c27b0' };
}

export function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: 'Klar',
    1: 'Vorwiegend klar',
    2: 'Teilweise bewoelkt',
    3: 'Bedeckt',
    45: 'Nebel',
    48: 'Reifnebel',
    51: 'Leichter Nieselregen',
    53: 'Nieselregen',
    55: 'Starker Nieselregen',
    61: 'Leichter Regen',
    63: 'Regen',
    65: 'Starker Regen',
    66: 'Gefrierender Regen',
    67: 'Starker gefrierender Regen',
    71: 'Leichter Schneefall',
    73: 'Schneefall',
    75: 'Starker Schneefall',
    77: 'Schneegriesel',
    80: 'Leichte Regenschauer',
    81: 'Regenschauer',
    82: 'Starke Regenschauer',
    85: 'Leichte Schneeschauer',
    86: 'Starke Schneeschauer',
    95: 'Gewitter',
    96: 'Gewitter mit Hagel',
    99: 'Starkes Gewitter mit Hagel',
  };
  return descriptions[code] ?? 'Unbekannt';
}
