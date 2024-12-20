export const sosSocket = new WebSocket(
  "wss://https://mikenull7-guthub-io.vercel.app/"
);

sosSocket.onopen = () => {
  console.log("Connected to SOS.");
};

sosSocket.onmessage = (event) => {
  console.log(event.data);
};
