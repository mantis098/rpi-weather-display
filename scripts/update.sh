#!/bin/bash
set -e

echo "=== Wetterstation Display - Update ==="

git pull
docker compose up -d --build

echo "Update abgeschlossen. Anzeige unter http://localhost:8080"
