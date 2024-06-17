const remoteVideo = document.getElementById('remoteVideo');
const signalingServerUrl = 'ws://' + window.location.hostname + ':8081/ws';
let localStream;
let peerConnection;

const configuration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

const ws = new WebSocket(signalingServerUrl);

ws.onmessage = async (message) => {
  const data = JSON.parse(message.data);
  console.log('Received message:', data);
  switch (data.type) {
    case 'offer':
      await peerConnection.setRemoteDescription(new RTCSessionDescription(data));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      ws.send(JSON.stringify(peerConnection.localDescription));
      break;
    case 'answer':
      await peerConnection.setRemoteDescription(new RTCSessionDescription(data));
      break;
    case 'candidate':
      const candidate = new RTCIceCandidate(data.candidate);
      await peerConnection.addIceCandidate(candidate);
      break;
    default:
      console.error('Unknown message type:', data.type);
  }
};

async function start() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true });
    remoteVideo.srcObject = localStream;

    peerConnection = new RTCPeerConnection(configuration);

    peerConnection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        ws.send(JSON.stringify({ type: 'candidate', candidate }));
      }
    };

    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      console.log('Received remote stream');
      remoteVideo.srcObject = remoteStream;
    };

    localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    ws.send(JSON.stringify(offer));
  } catch (error) {
    console.error('Error accessing media devices.', error);
  }
}

ws.onopen = () => {
  console.log('WebSocket connection opened');
  start();
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('WebSocket connection closed');
};
