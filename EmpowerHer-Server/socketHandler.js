const initializeSockets = (io) => {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Listen for SOS event from the app
    socket.on("sos", (data) => {
      console.log("Received SOS from app:", data.reportId);
      io.emit("showNotification", { reportId: data.reportId });
    });

    // Listen for message from the app and forward to web
    socket.on("sendMessageToWeb", (data) => {
      console.log("Received message from app:", data.message);
      io.emit("receiveMessageFromApp", { message: data.message });
    });

    // Listen for message from the web and forward to the app
    socket.on("sendMessageToApp", (data) => {
      console.log("Sending message to app:", data.message);
      io.emit("receiveMessageFromWeb", { message: data.message });
    });

    // Listen for "updatedLocation" from app and forward to the web
    socket.on("updatedLocation", (data) => {
      console.log("Received updated location from app:", data.location);
      io.emit("receiveLocationUpdate", { location: data.location });
    });

    // Listen for "safe" declaration from the app
    socket.on("declareSafe", () => {
      console.log("User declared safe");
      io.emit("receiveSafeNotification", { message: "I'm is safe" });
    });

    socket.on("endConversation", () => {
      console.log("User ended the conversation");
      io.emit("receiveEndConversationNotification", {
        message: "User ended the conversation",
      });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

export default initializeSockets;
