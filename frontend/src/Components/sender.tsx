import React from "react";
import { useEffect, useState } from "react";

function Sender() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/ws");
    setSocket(socket);
    socket.onopen = () => {
      console.log("WebSocket connection established");
      socket.send(JSON.stringify({ type: "sender" }));
    };
  }, []);
  const handleSend = async () => {
    if (!socket) return;
    const pc = new RTCPeerConnection();
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket?.send(
      JSON.stringify({ type: "createOffer", sdp: pc.localDescription })
    );
    socket.onmessage = async(msg) =>{
      const message = JSON.parse(msg.data);
      if(message.type==="createAnswer"){
        await pc.setRemoteDescription(message.sdp);
      }
    }
  };

  return (
    <>
      <div>Sender</div>
      <button onClick={handleSend}>Send</button>
    </>
  );
}

export default Sender;
