import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Map from "./Map";

const Response = () => {
  const [socket, setSocket] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [location, setLocation] = useState("37.78825,-122.4324");
  const messagesEndRef = useRef(null); // Ref for messages container

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(import.meta.env.VITE_SERVER_URL);
    setSocket(newSocket);

    newSocket.on("showNotification", (data) => {
      setMessages((prev) => [...prev, `New Emergency Report Detected`]);
    });

    // Listen for messages from the app
    newSocket.on("receiveMessageFromApp", (data) => {
      setMessages((prev) => [...prev, `user: ${data.message}`]);
    });

    newSocket.on("receiveSafeNotification", () => {
      setMessages((prev) => [...prev, `User has ensured her safety`]);
    });

    // Listen for location updates from the app
    newSocket.on("receiveLocationUpdate", (data) => {
      console.log(data.location);
      setLocation(data.location);
    });

    newSocket.emit("endConversation", (data) => {
      newSocket.disconnect();
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Only scroll when messages change, not location

  // Function to send a message to the app
  const handleSendMessage = () => {
    if (inputMessage.trim() && socket) {
      socket.emit("sendMessageToApp", { message: inputMessage });
      setMessages((prev) => [...prev, `You: ${inputMessage}`]);
      setInputMessage("");
    }
  };

  const handleAcknowlegdement = () => {
    const message =
      "Your message has been acknowledged. We will send you help ASAP.";
    if (socket) {
      socket.emit("sendMessageToApp", { message: message });
      setMessages((prev) => [...prev, `You: ${message}`]);
    }
  };

  const handlePathakLocated = () => {
    const message =
      "A nearby Pathak has been located which will rescue you immediately.";
    if (socket) {
      socket.emit("sendMessageToApp", { message: message });
      setMessages((prev) => [...prev, `You: ${message}`]);
    }
  };

  const handleEndConversation = () => {
    if (window.confirm("Are you sure you want to end the conversation?")) {
      const message = "This support session has been ended";
      if (socket) {
        socket.emit("sendMessageToApp", { message: message });
        setMessages((prev) => [...prev, `You: ${message}`]);
      }
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-lg p-4 border rounded-md bg-gray-100 mb-4">
          <h3 className="text-blue-600 mb-2">Messages</h3>
          <div className="h-60 overflow-y-auto bg-white p-2 rounded-md">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                {msg}
              </div>
            ))}
            <div ref={messagesEndRef} /> {/* This div is used for scrolling */}
          </div>
        </div>

        <div>
          <button
            onClick={handleAcknowlegdement}
            className="mx-4 my-4 font-semibold bg-blue-400 text-white rounded-md p-2 hover:bg-blue-600"
          >
            Acknowledgement
          </button>

          <button
            onClick={handlePathakLocated}
            className="mx-4 my-4 font-semibold bg-yellow-600 text-white rounded-md p-2 hover:bg-yellow-800"
          >
            Nearby Nirbhaya Pathak Located
          </button>

          <button
            onClick={handleEndConversation}
            className="mx-4 my-4 font-semibold bg-red-600 text-white rounded-md p-2 hover:bg-red-800"
          >
            End Conversation
          </button>

          <br />

          <div className="flex flex-row">
            <input
              className="mx-4 my-4 px-4 py-2 items-center justify-center rounded-md border-2 border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              type="text"
              placeholder="Type your message here"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <button
              className="mx-1 my-4 px-4 py-2 font-semibold bg-green-600 text-white rounded-md p-2 hover:bg-green-800"
              onClick={handleSendMessage}
            >
              Send Message
            </button>
          </div>
        </div>
        <Map location={location} />
      </div>
    </>
  );
};

export default Response;
