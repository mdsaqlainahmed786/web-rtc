import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let senderSocket: null | WebSocket = null;
let receiverSocket: null | WebSocket = null;

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data: any) {
    const message = JSON.parse(data);
    // identify-as-sender
    // identify-as-receiver
    // create offer
    // create answer
    // create icecandidate

    if(message.type === 'identify-as-sender') {
      senderSocket = ws;
    }
    else if(message.type === 'identify-as-receiver') {
      receiverSocket = ws;
    }
    else if(message.type==='create-offer'){
        receiverSocket?.send(JSON.stringify(message));
    }
    else if(message.type==='create-answer'){
        senderSocket?.send(JSON.stringify(message));
    }
    console.log(`Received message: ${message}`);
  });

});