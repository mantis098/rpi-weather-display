FROM node:20-slim AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

ARG VITE_MQTT_URL=ws://mosquitto:9001
ARG VITE_MQTT_TOPIC=ecowitt/weather
ARG VITE_LATITUDE=51.05
ARG VITE_LONGITUDE=13.74
ARG VITE_STATION_NAME=Wetterstation WS90

RUN npm run build

FROM nginx:alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
