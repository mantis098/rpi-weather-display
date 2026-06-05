# Raspberry Pi Wetterstation Display

Wetterstation-Dashboard fuer den Raspberry Pi mit HDMI-Display. Zeigt Echtzeit-Wetterdaten von einer Ecowitt WS90 Wetterstation (via GW3000 Gateway) sowie eine 7-Tage-Vorhersage an.

## Features

- **Echtzeit-Wetterdaten** via MQTT vom Ecowitt GW3000
- **7-Tage-Vorhersage** ueber Open-Meteo API (kostenlos, kein API-Key noetig)
- **Kiosk-Modus** fuer den Raspberry Pi (Vollbild-Anzeige)
- **Docker Compose** fuer einfache Installation
- **Dark-Mode** Dashboard, optimiert fuer HDMI-Displays
- **Demo-Modus** wenn keine MQTT-Verbindung besteht

## Angezeigte Daten

- Temperatur (aussen/innen), Gefuehlte Temperatur, Taupunkt
- Luftfeuchtigkeit (aussen/innen)
- Luftdruck (relativ)
- Wind (Geschwindigkeit, Richtung, Boeen) mit Kompass
- Niederschlag (aktuell, taeglich)
- UV-Index und Solarstrahlung
- 7-Tage-Wettervorhersage mit Symbolen

## Hardware-Voraussetzungen

- Ecowitt WS90 Wetterstation
- Ecowitt GW3000 Gateway (oder kompatibel: GW1000, GW2000)
- Raspberry Pi (3B+ oder neuer empfohlen)
- HDMI-Display

## Schnellstart

### 1. Repository klonen

```bash
git clone https://github.com/mantis098/rpi-weather-display.git
cd rpi-weather-display
```

### 2. Installation ausfuehren

```bash
chmod +x scripts/install.sh
./scripts/install.sh
```

Das Script installiert Docker (falls noetig), erstellt die Konfiguration und startet die Container.

### 3. GW3000 konfigurieren

1. GW3000 Weboberflaeche oeffnen (IP-Adresse des Gateways im Browser)
2. **Weather Services** > **Customized** > **MQTT** aktivieren
3. Server: IP-Adresse des Raspberry Pi
4. Port: `1883`
5. Topic: `ecowitt/weather`

### 4. Kiosk-Modus einrichten (optional)

```bash
chmod +x scripts/kiosk.sh
./scripts/kiosk.sh
sudo reboot
```

Nach dem Neustart startet der Raspberry Pi automatisch die Wetteranzeige im Vollbild.

## Konfiguration

Kopiere `.env.example` nach `.env` und passe die Werte an:

```bash
cp .env.example .env
nano .env
```

| Variable | Beschreibung | Standard |
|----------|-------------|----------|
| `VITE_MQTT_URL` | MQTT WebSocket URL | `ws://localhost:9001` |
| `VITE_MQTT_TOPIC` | MQTT Topic | `ecowitt/weather` |
| `VITE_LATITUDE` | Breitengrad fuer Vorhersage | `51.05` |
| `VITE_LONGITUDE` | Laengengrad fuer Vorhersage | `13.74` |
| `VITE_STATION_NAME` | Anzeigename der Station | `Wetterstation WS90` |

## Update

```bash
cd rpi-weather-display
./scripts/update.sh
```

## Architektur

```
Browser (Chromium Kiosk)
    |
    |-- WebSocket --> Mosquitto MQTT Broker <-- GW3000 (MQTT)
    |-- HTTP     --> Nginx (statische Dateien)
    |-- HTTPS    --> Open-Meteo API (7-Tage-Vorhersage)
```

### Docker-Container

- **mosquitto**: Eclipse Mosquitto MQTT Broker (Ports 1883 + 9001)
- **weather-display**: Nginx mit der React-App (Port 8080)

## Entwicklung

```bash
npm install
npm run dev
```

Die App startet im Demo-Modus mit simulierten Wetterdaten, wenn keine MQTT-Verbindung besteht.

## Technologien

- React 19 + TypeScript
- Material UI 7
- MQTT.js (WebSocket)
- Open-Meteo API
- Docker + Nginx
- Vite
