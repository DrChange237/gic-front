# Build Production
FROM node:18-alpine AS build-prod
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

# Build Dev
FROM node:18-alpine AS build-dev
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=development

# Conteneur Production (port 80)
FROM nginx:alpine AS prod
COPY --from=build-prod /app/dist/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

# Conteneur Dev (port 8080)
FROM nginx:alpine AS dev
COPY --from=build-dev /app/dist/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080