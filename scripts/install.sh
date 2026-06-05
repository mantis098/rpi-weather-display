#!/bin/bash
set -e

echo "=== Wetterstation Display - Installation ==="

if ! command -v docker &> /dev/null; then
    echo "Docker wird installiert..."
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker "$USER"
    echo "Docker installiert. Bitte einmal ab- und wieder anmelden."
fi

if ! docker compose version &> /dev/null; then
    echo "Docker Compose Plugin wird installiert..."
    sudo apt-get update
    sudo apt-get install -y docker-compose-plugin
fi

if [ ! -f .env ]; then
    echo ""
    echo "Konfiguration erstellen..."
    cp .env.example .env

    read -rp "Breitengrad (z.B. 51.05): " lat
    read -rp "Laengengrad (z.B. 13.74): " lon
    read -rp "Stationsname (z.B. Meine Wetterstation): " name

    if [ -n "$lat" ]; then sed -i "s/VITE_LATITUDE=.*/VITE_LATITUDE=$lat/" .env; fi
    if [ -n "$lon" ]; then sed -i "s/VITE_LONGITUDE=.*/VITE_LONGITUDE=$lon/" .env; fi
    if [ -n "$name" ]; then sed -i "s/VITE_STATION_NAME=.*/VITE_STATION_NAME=$name/" .env; fi

    echo ".env Datei erstellt."
fi

echo ""
echo "Container werden gebaut und gestartet..."
docker compose up -d --build

echo ""
echo "=== Installation abgeschlossen ==="
echo "Wetteranzeige erreichbar unter: http://localhost:8080"
echo ""
echo "MQTT-Broker laeuft auf Port 1883 (TCP) und 9001 (WebSocket)"
echo ""
echo "Ecowitt GW3000 Konfiguration:"
echo "  1. GW3000 Weboberflaeche oeffnen"
echo "  2. Weather Services > Customized > MQTT aktivieren"
echo "  3. Server: $(hostname -I | awk '{print $1}')"
echo "  4. Port: 1883"
echo "  5. Topic: ecowitt/weather"
echo ""
