# Etapa de build
FROM node:20-slim AS builder

WORKDIR /usr/src/app

# Instalar dependencias de sistema necesarias
RUN apt-get update && apt-get install -y \
    libvips-dev \
    libvips-tools

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Ejecutar build
RUN npm run build

# Etapa de producción
FROM node:20-slim

WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Copiar archivos compilados
COPY dist ./dist

# Exponer puerto
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "dist/app.js"]
