import { useEffect, useState } from "react"

export const Sender = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    // const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [pc, setPC] = useState<RTCPeerConnection | null>(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');
        console.log('Sender: WebSocket connected' + pc);
        setSocket(socket);
        socket.onopen = () => {
            socket.send(JSON.stringify({
                type: 'sender'
            }));
        }
    }, []);

// Sender.tsx
const initiateConn = async () => {
  if (!socket) return;

  const pc = new RTCPeerConnection();
  setPC(pc);

pc.ontrack = (event) => {
  const remoteVideo = document.createElement("video");
  remoteVideo.srcObject = event.streams[0]; // ✅ includes audio
  remoteVideo.autoplay = true;
  remoteVideo.playsInline = true;
  document.body.appendChild(remoteVideo);
};


  pc.onicecandidate = (event) => {
    if (event.candidate) {
      socket.send(JSON.stringify({
        type: "iceCandidate",
        candidate: event.candidate,
      }));
    }
  };

  socket.onmessage = async (event) => {
    const message = JSON.parse(event.data);
    if (message.type === "createAnswer") {
      await pc.setRemoteDescription(message.sdp);
    } else if (message.type === "iceCandidate") {
      await pc.addIceCandidate(message.candidate);
    }
  };

  // Add local video/audio tracks
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  stream.getTracks().forEach(track => pc.addTrack(track, stream));

  // Show local preview
  const localVideo = document.createElement("video");
  localVideo.srcObject = stream;
  localVideo.autoplay = true;
  localVideo.muted = true;
  document.body.appendChild(localVideo);

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  socket.send(JSON.stringify({ type: "createOffer", sdp: pc.localDescription }));
};

    // const getCameraStreamAndSend = (pc: RTCPeerConnection) => {
    //     navigator.mediaDevices.getUserMedia({ video: true, audio:true }).then((stream) => {
    //         const video = document.createElement('video');
    //         video.srcObject = stream;
    //         video.play();
    //         // this is wrong, should propogate via a component
    //         document.body.appendChild(video);
    //         stream.getTracks().forEach((track) => {
    //             pc?.addTrack(track);
    //         });
    //     });
    // }
    

    return <div>
        Sender
        <button onClick={initiateConn}> Send data </button>
    </div>
}