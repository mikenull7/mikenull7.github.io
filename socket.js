export const sosSocket = new WebSocket("ws://localhost:49122");

sosSocket.onopen = () => {
  console.log("Connected to SOS.");
};
