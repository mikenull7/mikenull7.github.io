export const sosSocket = new WebSocket("ws://localhost:8080");

sosSocket.onopen = () => {
  console.log("Connected to SOS. you dumb son of a bitch");
};

sosSocket.onmessage = (event) => {
  console.log(event.data);
};
