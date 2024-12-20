export const sosSocket = new WebSocket(
  "ws://https://mikenull7-guthub-io.vercel.app/0"
);

sosSocket.onopen = () => {
  console.log("Connected to SOS.");
};

sosSocket.onmessage = (event) => {
  console.log(event.data);
};
