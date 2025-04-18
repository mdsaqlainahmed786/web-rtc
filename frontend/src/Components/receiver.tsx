import { useEffect, useState, useRef } from "react";

function Receiver() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // const [pc, setPc] = useState<RTCPeerConnection | null>(null);
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/ws");
    setSocket(socket);
    socket.onopen = () => {
      console.log("WebSocket connection established");
      socket.send(JSON.stringify({ type: "receiver" }));
    };
  }, []);
  if (socket) {
    // console.log("socket", socket);
    socket.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      let pc: RTCPeerConnection | null = null;
      console.log("CONNECTION NEEDED!!!");
      if (message.type === "createOffer") {
        pc = new RTCPeerConnection();
        pc.setRemoteDescription(message.sdp);
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.send(
              JSON.stringify({
                type: "iceCandidate",
                candidate: event.candidate,
              })
            );
          }
        };
        pc.ontrack = (event) => {
          if (videoRef.current) {
            videoRef.current.srcObject = new MediaStream([event.track]);
            videoRef.current.play();
          }
        };
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.send(
          JSON.stringify({ type: "createAnswer", sdp: pc.localDescription })
        );
      } else if (message.type === "iceCandidate") {
        if (pc! == null) {
          //@ts-expect-error blah I don't care about this right now
          await pc.addIceCandidate(message.candidate);
        } else {
          console.error("PeerConnection is not initialized");
        }
      }
    };
  }
  return (
    <>
      <div>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted // 🔥 this is the fix
          controls={false}
          style={{ width: "500px", height: "auto", backgroundColor: "black" }}
        />
      </div>
    </>
  );
}

export default Receiver;
