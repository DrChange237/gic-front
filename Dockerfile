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

# Servir avec Nginx
FROM nginx:alpine
# Copier la version production à la racine
COPY --from=build-prod /app/dist/browser /usr/share/nginx/html
# Copier la version dev dans /demo
COPY --from=build-dev /app/dist/browser /usr/share/nginx/html/demo
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]