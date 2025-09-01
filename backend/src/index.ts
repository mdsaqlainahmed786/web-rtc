import { WebSocket, WebSocketServer } from 'ws';
const wss = new WebSocketServer({ port: 8080 });

const rooms: Record<string, { sender?: WebSocket, receiver?: WebSocket }> = {};

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    const message = JSON.parse(data.toString());
    const { type, room, sdp, candidate } = message;

    if (!rooms[room]) rooms[room] = {};

    if (type === 'sender') {
      rooms[room].sender = ws;
    } else if (type === 'receiver') {
      rooms[room].receiver = ws;
    } else if (type === 'createOffer' && rooms[room].receiver) {
      rooms[room].receiver.send(JSON.stringify({ type: 'createOffer', sdp }));
    } else if (type === 'createAnswer' && rooms[room].sender) {
      rooms[room].sender.send(JSON.stringify({ type: 'createAnswer', sdp }));
    } else if (type === 'iceCandidate') {
      if (ws === rooms[room].sender && rooms[room].receiver) {
        rooms[room].receiver.send(JSON.stringify({ type: 'iceCandidate', candidate }));
      } else if (ws === rooms[room].receiver && rooms[room].sender) {
        rooms[room].sender.send(JSON.stringify({ type: 'iceCandidate', candidate }));
      }
    }
  });
});
