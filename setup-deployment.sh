#!/bin/bash

# Crear directorio para el script de despliegue
sudo mkdir -p /opt/deployment
sudo chown $USER:$USER /opt/deployment

# Crear script de despliegue
cat << 'EOF' > /opt/deployment/deploy.sh
#!/bin/bash

# Configurar variables
SERVER_IMAGE="tu-usuario-dockerhub/1movement-server:latest"
CLIENT_IMAGE="tu-usuario-dockerhub/1movement-client:latest"
SERVER_CONTAINER="1movement-server"
CLIENT_CONTAINER="1movement-client"

# Crear red de Docker si no existe
docker network create movement-network 2>/dev/null || true

# Actualizar servidor
echo "Actualizando servidor..."
docker pull $SERVER_IMAGE
docker stop $SERVER_CONTAINER 2>/dev/null
docker rm $SERVER_CONTAINER 2>/dev/null
docker run -d \
  --name $SERVER_CONTAINER \
  --network movement-network \
  --restart unless-stopped \
  -p 3001:3000 \
  -e NODE_ENV=production \
  $SERVER_IMAGE

# Actualizar cliente
echo "Actualizando cliente..."
docker pull $CLIENT_IMAGE
docker stop $CLIENT_CONTAINER 2>/dev/null
docker rm $CLIENT_CONTAINER 2>/dev/null
docker run -d \
  --name $CLIENT_CONTAINER \
  --network movement-network \
  --restart unless-stopped \
  -p 3000:3000 \
  -e DATABASE_URL=${DATABASE_URL} \
  -e DIRECT_URL=${DIRECT_URL} \
  -e NEXTAUTH_URL=${NEXTAUTH_URL} \
  -e NEXTAUTH_SECRET=${NEXTAUTH_SECRET} \
  $CLIENT_IMAGE
EOF

# Hacer ejecutable el script
chmod +x /opt/deployment/deploy.sh

# Crear archivo de variables de entorno
cat << EOF > /opt/deployment/.env
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_url
NEXTAUTH_URL=your_nextauth_url
NEXTAUTH_SECRET=your_nextauth_secret
EOF

# Crear servicio systemd
sudo tee /etc/systemd/system/deployment.service << EOF
[Unit]
Description=Movement Global Deployment Service
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
EnvironmentFile=/opt/deployment/.env
ExecStart=/opt/deployment/deploy.sh
RemainAfterExit=yes
User=$USER

[Install]
WantedBy=multi-user.target
EOF

# Recargar systemd y habilitar el servicio
sudo systemctl daemon-reload
sudo systemctl enable deployment
sudo systemctl start deployment