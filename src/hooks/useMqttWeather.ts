import { useState, useEffect, useCallback, useRef } from 'react';
import mqtt from 'mqtt';
import type { WeatherData } from '../types/weather';
import { parseEcowittData } from '../types/weather';

const MQTT_URL = import.meta.env.VITE_MQTT_URL || 'ws://localhost:9001';
const MQTT_TOPIC = import.meta.env.VITE_MQTT_TOPIC || 'ecowitt/weather';
const MQTT_USER = import.meta.env.VITE_MQTT_USER || '';
const MQTT_PASS = import.meta.env.VITE_MQTT_PASS || '';

export interface MqttStatus {
  connected: boolean;
  error: string | null;
  lastMessageAt: Date | null;
}

export function useMqttWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [status, setStatus] = useState<MqttStatus>({
    connected: false,
    error: null,
    lastMessageAt: null,
  });
  const clientRef = useRef<mqtt.MqttClient | null>(null);

  const handleMessage = useCallback((_topic: string, message: Buffer) => {
    try {
      const raw = JSON.parse(message.toString());
      const data = parseEcowittData(raw);
      setWeather(data);
      setStatus((prev) => ({ ...prev, lastMessageAt: new Date() }));
    } catch {
      // skip malformed messages
    }
  }, []);

  useEffect(() => {
    const options: mqtt.IClientOptions = {
      reconnectPeriod: 5000,
      connectTimeout: 10000,
    };
    if (MQTT_USER) {
      options.username = MQTT_USER;
      options.password = MQTT_PASS;
    }

    const client = mqtt.connect(MQTT_URL, options);
    clientRef.current = client;

    client.on('connect', () => {
      setStatus((prev) => ({ ...prev, connected: true, error: null }));
      client.subscribe(MQTT_TOPIC);
    });

    client.on('error', (err) => {
      setStatus((prev) => ({ ...prev, connected: false, error: err.message }));
    });

    client.on('close', () => {
      setStatus((prev) => ({ ...prev, connected: false }));
    });

    client.on('message', handleMessage);

    return () => {
      client.end();
      clientRef.current = null;
    };
  }, [handleMessage]);

  return { weather, status };
}
