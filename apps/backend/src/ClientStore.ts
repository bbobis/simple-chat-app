import { v4 as uuidv4 } from 'uuid';
import { RawData, WebSocket } from 'ws';

const store = new Map<string, WebSocket>();

export function register(ws: WebSocket) {
  const id = uuidv4();
  store.set(id, ws);

  ws.on('message', (data) => {
    broadcast(data, id);
  });

  ws.on('close', () => {
    store.delete(id);
  });

  ws.on('error', (e) => {
    console.log('Error', e);
  });
}

function broadcast(data: RawData, senderId) {
  store.forEach((ws, id) => {
    if (senderId === id) return;
    if (ws.readyState !== ws.OPEN) return;
    ws.send(String(data));
  });
}
