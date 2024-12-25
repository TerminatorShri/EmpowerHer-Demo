import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import initializeSockets from "./socketHandler.js";
import twilio from "twilio";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
});

initializeSockets(io);

// Twilio API Setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

app.use(express.json());

app.post("/send-sms", async (req, res) => {
  const { to, message } = req.body;
  try {
    const response = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });
    res.status(200).json({
      success: true,
      message: "SMS sent successfully",
      data: response,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to send SMS", error });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
