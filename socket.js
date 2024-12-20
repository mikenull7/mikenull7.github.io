export const sosSocket = new WebSocket("ws://localhost:49122");

sosSocket.onopen = () => {
  console.log("Connected to SOS. you dumb son of a bitch");
};

sosSocket.addEventListener("message", (event) => {
  const message = event.data;

  console.log(message);
  // Handle incoming messages from the server
});
sosSocket.onmessage = (event) => {
  console.log(event.data);
};

export const forwardToOverlay = (message) => {
  const overlaySocket = new WebSocket("wss://mikenull7-guthub-io.vercel.app"); // Your Vercel WebSocket URL

  overlaySocket.onopen = () => {
    console.log("Connected to overlay");
    overlaySocket.send(message); // Forward the Rocket League data to the overlay
  };

  overlaySocket.onmessage = (event) => {
    console.log("Overlay received data:", event.data);
  };

  overlaySocket.onclose = () => {
    console.log("Disconnected from overlay");
  };
};
