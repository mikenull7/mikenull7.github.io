export const sosSocket = new WebSocket("ws://localhost:49122");

sosSocket.onopen = () => {
  console.log("Connected to SOS. how many times do we have to do this");
};

sosSocket.addEventListener("message", (event) => {
  const message = event.data;

  // console.log(message);
  // Handle incoming messages from the server
});
sosSocket.onmessage = (event) => {
  //console.log(event.data);
};

export const relaySocket = new WebSocket("ws://localhost:8081");

relaySocket.onopen = () => {
  console.log("✅ Connected to Relay");

  // Register for custom:title
  relaySocket.send(
    JSON.stringify({
      event: "wsRelay:register",
      data: "custom:title",
    })
  );
};

relaySocket.addEventListener("message", (event) => {
  const parsed = JSON.parse(event.data);
  console.log("📡 Relay Message:", parsed.event, parsed.data);

  if (parsed.event === "custom:title") {
    console.log("🏷️ Received custom title:", parsed.data);
    // TODO: Update overlay title DOM here
  }
});

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
