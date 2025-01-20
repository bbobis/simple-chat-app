import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import { register } from './ClientStore';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.WebSocketServer({ noServer: true, path: '/chat' });

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

// Handles http Connection:Upgrade request
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws, request) => {
    wss.emit('connection', ws, request);
  });
});

wss.on('connection', (ws) => {
  register(ws);
});

server.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
