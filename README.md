# WebSocket Server - Political Parties API

Servidor WebSocket para administrar partidos políticos y sus votos en tiempo real.

## Instalación

1. Clona el repositorio.
2. Instala las dependencias.

```bash
bun install
```

3. Crea un archivo `.env` basado en `.env.template`.

4. Inicia el servidor.

```bash
bun run dev
```

---

# Probar el WebSocket

Abre:

```
http://localhost:3200
```

Desde la consola del navegador puedes enviar mensajes usando el objeto `socket`.

Ejemplo:

```javascript
const message = {
  type: "GET_PARTIES",
};

socket.send(JSON.stringify(message));
```

Todos los mensajes enviados al servidor deben tener el siguiente formato:

```ts
{
  type: string;
  payload?: object;
}
```

---

# Message Types

## GET_PARTIES

Obtiene la lista de partidos registrados.

### Request

```json
{
  "type": "GET_PARTIES"
}
```

### Response

```json
{
  "type": "PARTIES_LIST",
  "payload": [
    {
      "id": "...",
      "name": "PAN",
      "votes": 5,
      "color": "#1976D2",
      "borderColor": "#0D47A1"
    }
  ]
}
```

---

## ADD_PARTY

Crea un nuevo partido político.

### Request

```json
{
  "type": "ADD_PARTY",
  "payload": {
    "name": "Nuevo Partido",
    "color": "#2196F3",
    "borderColor": "#0D47A1"
  }
}
```

### Response

```json
{
  "type": "PARTY_ADDED",
  "payload": {
    "id": "...",
    "name": "Nuevo Partido",
    "votes": 0,
    "color": "#2196F3",
    "borderColor": "#0D47A1"
  }
}
```

---

## UPDATE_PARTY

Actualiza la información de un partido.

Todos los campos son opcionales excepto `id`.

### Request

```json
{
  "type": "UPDATE_PARTY",
  "payload": {
    "id": "party-id",
    "name": "Nuevo nombre",
    "color": "#42A5F5",
    "borderColor": "#1565C0",
    "votes": 25
  }
}
```

### Response

```json
{
  "type": "PARTY_UPDATED",
  "payload": {
    "id": "party-id",
    "name": "Nuevo nombre",
    "votes": 25,
    "color": "#42A5F5",
    "borderColor": "#1565C0"
  }
}
```

---

## DELETE_PARTY

Elimina un partido.

### Request

```json
{
  "type": "DELETE_PARTY",
  "payload": {
    "id": "party-id"
  }
}
```

### Response

```json
{
  "type": "PARTY_DELETED",
  "payload": {
    "id": "party-id"
  }
}
```

---

## INCREMENT_VOTES

Incrementa en **1** el número de votos de un partido.

### Request

```json
{
  "type": "INCREMENT_VOTES",
  "payload": {
    "id": "party-id"
  }
}
```

### Response

```json
{
  "type": "VOTES_UPDATED",
  "payload": {
    "id": "party-id",
    "votes": 11
  }
}
```

---

## DECREMENT_VOTES

Disminuye en **1** el número de votos de un partido.

### Request

```json
{
  "type": "DECREMENT_VOTES",
  "payload": {
    "id": "party-id"
  }
}
```

### Response

```json
{
  "type": "VOTES_UPDATED",
  "payload": {
    "id": "party-id",
    "votes": 9
  }
}
```

---

# Error Response

Cuando ocurre un error, el servidor responde con el siguiente formato:

```json
{
  "type": "ERROR",
  "payload": {
    "error": "Error description"
  }
}
```

Ejemplos:

```json
{
  "type": "ERROR",
  "payload": {
    "error": "Party ID is required"
  }
}
```

```json
{
  "type": "ERROR",
  "payload": {
    "error": "Party with id abc123 not found"
  }
}
```

---

# Ejemplos rápidos

```javascript
socket.send(
  JSON.stringify({
    type: "GET_PARTIES",
  })
);

socket.send(
  JSON.stringify({
    type: "ADD_PARTY",
    payload: {
      name: "Morena",
      color: "#8B0000",
      borderColor: "#5C0000",
    },
  })
);

socket.send(
  JSON.stringify({
    type: "INCREMENT_VOTES",
    payload: {
      id: "party-id",
    },
  })
);
```