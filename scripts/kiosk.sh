#!/bin/bash
set -e

echo "=== Kiosk-Modus fuer Raspberry Pi einrichten ==="

sudo apt-get update
sudo apt-get install -y --no-install-recommends \
    chromium-browser \
    xdotool \
    unclutter \
    xserver-xorg \
    x11-xserver-utils \
    xinit \
    openbox

mkdir -p ~/.config/openbox

cat > ~/.config/openbox/autostart << 'EOF'
xset s off
xset s noblank
xset -dpms

unclutter -idle 0.5 -root &

while ! curl -sf http://localhost:8080 > /dev/null 2>&1; do
    sleep 2
done

chromium-browser \
    --noerrdialogs \
    --disable-infobars \
    --disable-translate \
    --disable-features=TranslateUI \
    --kiosk \
    --incognito \
    --disable-pinch \
    --overscroll-history-navigation=0 \
    --check-for-update-interval=31536000 \
    http://localhost:8080 &
EOF

sudo tee /etc/systemd/system/kiosk.service > /dev/null << EOF
[Unit]
Description=Wetterstation Kiosk Display
After=network-online.target docker.service
Wants=network-online.target

[Service]
User=$USER
Environment=DISPLAY=:0
ExecStartPre=/bin/sleep 10
ExecStart=/usr/bin/startx /usr/bin/openbox-session -- -nocursor
Restart=on-failure
RestartSec=5

[Install]
WantedBy=graphical.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable kiosk.service

echo ""
echo "=== Kiosk-Modus eingerichtet ==="
echo "Der Kiosk startet automatisch nach dem naechsten Neustart."
echo "Zum sofortigen Start: sudo systemctl start kiosk"
echo "Zum Deaktivieren: sudo systemctl disable kiosk"
