# === Build stage ===
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./

RUN npm config set registry https://registry.npmjs.org/

RUN rm -f package-lock.json

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

# === Runtime stage ===
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/whitecomm_frontend/browser/ /usr/share/nginx/html/
EXPOSE 80
