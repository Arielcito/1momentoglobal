# API de Streaming - Documentación

## Endpoints para Viewers

### Obtener Streams Activos
Obtiene una lista de todos los streams que están actualmente en vivo.

**Endpoint:** `GET /stream/live`

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta Exitosa (200):**
```json
[
  {
    "id": "string",
    "title": "string",
    "isLive": true,
    "userId": "string",
    "ingressId": "string",
    "user": {
      "name": "string",
      "image": "string"
    }
  }
]
```

### Obtener Detalles de un Stream Específico
Obtiene información detallada de un stream específico.

**Endpoint:** `GET /stream/live/{streamId}`

**Headers:**
```
Authorization: Bearer <token>
```

**Parámetros URL:**
- `streamId`: ID del stream (string)

**Respuesta Exitosa (200):**
```json
{
  "id": "string",
  "title": "string",
  "name": "string",
  "description": "string",
  "isLive": true,
  "userId": "string",
  "user": {
    "name": "string",
    "image": "string"
  }
}
```

### Obtener Token de Viewer
Genera un token para unirse a una sala como espectador.

**Endpoint:** `POST /stream/viewer-token`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "room_name": "string"
}
```

**Respuesta Exitosa (200):**
```json
{
  "token": "string",
  "ws_url": "string"
}
```

## Flujo de Uso para Viewers

1. Obtener la lista de streams activos usando `GET /stream/live`
2. Seleccionar un stream específico y obtener sus detalles con `GET /stream/live/{streamId}`
3. Generar un token de viewer usando `POST /stream/viewer-token` con el `room_name` del stream
4. Usar el token y ws_url recibidos para conectarse al stream mediante WebSocket

## Códigos de Error

- `404`: Stream no encontrado
- `500`: Error del servidor 