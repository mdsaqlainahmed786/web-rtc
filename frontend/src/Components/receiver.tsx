import { useEffect, useRef, useState } from "react";

function Receiver() {
  const [sockets, setSocket] = useState<WebSocket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const socket = new WebSocket("wss://web-rtc-yfb6.onrender.com");
    setSocket(socket);


    socket.onopen = () => {
      console.log("Receiver: WebSocket connected");
      socket.send(JSON.stringify({ type: "receiver" }));
    };

    socket.onmessage = async (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "createOffer") {
        const pc = new RTCPeerConnection();
        pcRef.current = pc;

        // Remote video/audio → Receiver
        pc.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.send(JSON.stringify({ type: "iceCandidate", candidate: event.candidate }));
          }
        };

        // Local camera + mic → Sender
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

        // Show local preview (muted so no echo)
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }

        await pc.setRemoteDescription(message.sdp);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.send(JSON.stringify({ type: "createAnswer", sdp: pc.localDescription }));
      }

      if (message.type === "iceCandidate" && pcRef.current) {
        await pcRef.current.addIceCandidate(message.candidate);
      }
      console.log(sockets)
    };
  }, []);

  return (
    <div>
      <h3>Receiver</h3>
      <video ref={localVideoRef} autoPlay muted playsInline style={{ width: "200px", background: "gray" }} />
      <video ref={remoteVideoRef} autoPlay playsInline style={{ width: "400px", background: "black" }} />
    </div>
  );
}

export default Receiver;
