import express from "express";
import mongoose from "mongoose";
import { notFoundError, errorHandler } from "./middlewares/error-handler.js";
import morgan from "morgan";
import cors from "cors";
import { Server } from "socket.io";
import { LlamaModel, LlamaContext, LlamaChatSession } from "node-llama-cpp";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import http from "http";
import bodyParser from "body-parser";
import ConversationModel from "./Models/conversation.js";

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 7001;
const databaseName = "chatcount_db";

mongoose.Promise = global.Promise;

import userRoute from "./Routes/auth_route.js";
import fecRoute from "./Routes/fec_route.js";
import conversationRoute from "./Routes/conversation_route.js";
import conversation from "./Models/conversation.js";
//DATABASE
mongoose
  .connect(`mongodb://localhost:27017/${databaseName}`)
  .then(() => {
    console.log(`Connected to ${databaseName}`);
  })
  .catch((err) => {
    console.log(err);
  });
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200"); // Replace with your frontend's origin
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(morgan("dev"));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST","DELETE","PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST","DELETE","PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Origin",
      "X-Requested-With",
      "Accept",
    ],
    credentials: true,
  })
);
app.use(bodyParser.json());

app.use(express.json());
app.use("/avatars", express.static("public/images"));

app.use((req, res, next) => {
  console.log("middleware just run !");
  next();
});
app.use("/gse", (req, res, next) => {
  console.log("Middleware just ran on a gse route !");
  next();
});

app.use(express.urlencoded({ extended: true }));

app.use("/user", userRoute);
app.use("/fec", fecRoute);
app.use("/conversation", conversationRoute);

app.use(notFoundError);
app.use(errorHandler);
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const modelPath = path.join(
  __dirname,
  "../models/mistral-7b-instruct-v0.2.Q4_0.gguf"
);
const model = new LlamaModel({ modelPath });
const context = new LlamaContext({ model: model });
const session = new LlamaChatSession({ context: context });
io.on("connection", (socket) => {
  console.log("Un utilisateur s'est connecté");

  socket.on('message', async (message) => {
    console.log("Message reçu :", message);
  
    const { conversationId, text } = message;
  
    try {
      const prediction = await session.prompt({ text }); // Obtenir la réponse du bot
  
      const botMessage = {
        sender: 'bot',
        text: prediction
      };
  
      // Envoyer la réponse du bot au client
      socket.emit("message", prediction);
  
      // Enregistrer le message utilisateur dans la conversation
      await saveMessageToDatabase('user', text, conversationId);
  
      // Enregistrer la réponse du bot dans la conversation
      await saveMessageToDatabase('bot', prediction, conversationId);
  
      console.log("Message enregistré :", { sender: 'bot', text: prediction });
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });
  async function saveMessageToDatabase(sender, text, conversationId) {
    try {
      let conversation = await ConversationModel.findById(conversationId);
  
      if (!conversation) {
        conversation = new ConversationModel({
          _id: conversationId,
          messages: [],
        });
      }
  
      conversation.messages.push({ sender, text });
      await conversation.save();
    } catch (error) {
      console.error("Error saving message:", error);
    }
  }
  socket.on("disconnect", () => {
    console.log("Un utilisateur s'est déconnecté");
  });

  socket.on("launch_success", (data) => {
    socket.emit("conversation_launched", {
      message: "Conversation lancée avec succès",
    });
  });
});
