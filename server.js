const express = require('express');
const WebSocket = require('ws');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

// Configuración de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'WebSocket API',
      description: 'API para interactuar con WebSocket',
      version: '1.0.0',
    },
  },
  apis: ['./server.js'], // Apuntar a nuestro archivo para documentar
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Usar Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Crear el servidor WebSocket
const wss = new WebSocket.Server({ noServer: true });

// Cuando un cliente se conecta
wss.on('connection', ws => {
  console.log('Cliente conectado');
  
  // Enviar un mensaje al cliente
  ws.send('¡Hola Mundo desde WebSocket!');
  
  // Recibir mensajes del cliente
  ws.on('message', message => {
    console.log('Mensaje recibido: %s', message);
  });
});

// Configurar WebSocket para trabajar con el servidor HTTP de Express
app.server = app.listen(port, () => {
  console.log(`Servidor HTTP escuchando en http://localhost:${port}`);
});

app.server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, ws => {
    wss.emit('connection', ws, request);
  });
});

// Ruta de la API RESTful que usaremos para documentar con Swagger
/**
 * @swagger
 * /api/hello:
 *   get:
 *     description: Devuelve un mensaje de saludo.
 *     responses:
 *       200:
 *         description: Saludo exitoso.
 */
app.get('/api/hello', (req, res) => {
  res.send('¡Hola Mundo desde Websocket!');
});
