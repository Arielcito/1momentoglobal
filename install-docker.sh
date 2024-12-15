#!/bin/bash

# Actualizar el sistema
sudo apt-get update
sudo apt-get upgrade -y

# Instalar paquetes necesarios
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Añadir la clave GPG oficial de Docker
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Configurar el repositorio
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Actualizar el índice de paquetes
sudo apt-get update

# Instalar Docker
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Iniciar y habilitar Docker
sudo systemctl start docker
sudo systemctl enable docker

# Crear grupo docker y añadir usuario actual
sudo groupadd docker
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo apt-get install -y docker-compose 