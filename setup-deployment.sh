#!/bin/bash

# Crear directorio para el script de despliegue
sudo mkdir -p /opt/deployment
sudo chown $USER:$USER /opt/deployment

# Crear script de despliegue
cat << 'EOF' > /opt/deployment/deploy.sh
#!/bin/bash

# Configurar variables
DOCKER_IMAGE="tu-usuario-dockerhub/1movementglobal:latest"
CONTAINER_NAME="1movement-app"

# Obtener la nueva imagen
docker pull $DOCKER_IMAGE

# Detener y eliminar el contenedor existente si existe
docker stop $CONTAINER_NAME 2>/dev/null
docker rm $CONTAINER_NAME 2>/dev/null

# Crear y ejecutar el nuevo contenedor
docker run -d \
  --name $CONTAINER_NAME \
  --restart unless-stopped \
  -p 3000:3000 \
  -e NODE_ENV=production \
  $DOCKER_IMAGE
EOF

# Hacer ejecutable el script
chmod +x /opt/deployment/deploy.sh

# Crear servicio systemd para el despliegue automático
sudo tee /etc/systemd/system/deployment.service << EOF
[Unit]
Description=Deployment Service
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
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