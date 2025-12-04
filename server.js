import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { WebSocketServer } from "ws";

dotenv.config();

const app = express();
const server = createServer(app); // <-- REQUIRED for WebSocket

// WebSocket server MUST attach to HTTP server
const wss = new WebSocketServer({ server, path: "/live" });

console.log("WebSocket running...");

wss.on("connection", async (client) => {
  console.log("🔗 User connected");

  const genAI = new GoogleGenerativeAI(process.env.VITE_GOOGLE_API_KEY);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

  const session = await model.startChat({
    generationConfig: { responseModalities: ["text"] }
  });

  client.on("message", async (msg) => {
    try {
      const result = await session.sendMessageStream(msg.toString());

      for await (const chunk of result.stream) {
        client.send(chunk.text());
      }
    } catch (err) {
      console.error("WebSocket Error:", err);
      client.send("Error: " + err.message);
    }
  });

  client.on("close", () => {
    console.log("❌ Client disconnected");
    session.close();
  });
});

// Middleware
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const ai = new GoogleGenerativeAI(process.env.VITE_GOOGLE_API_KEY);

console.log("Gemini Key Loaded:", !!process.env.VITE_GOOGLE_API_KEY);
// HTTP Route API
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await ai.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    res.json({ text: response.response.text() });
  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend
app.use(express.static(path.join(__dirname, "dist")));

app.use((req, res) => {
  res.send("Server running");
});

// Start server (IMPORTANT: use server.listen not app.listen)
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
