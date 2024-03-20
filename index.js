import express from "express";
import mongoose from "mongoose";
import { notFoundError, errorHandler } from "./middlewares/error-handler.js";
import morgan from "morgan";
import cors from "cors";
import { Server } from "socket.io";

import path from "path";
import http from "http";
import bodyParser from "body-parser";
import ConversationModel from "./Models/conversation.js";
import { spawn } from "child_process";
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
    methods: ["GET", "POST", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "DELETE", "PATCH", "OPTIONS"],
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
io.on("connection", (socket) => {
  console.log("Un utilisateur s'est connecté");
  socket.on("message", async (message) => {
    console.log("Message reçu :", message);

    const { conversationId, text } = message;

    try {
      const pythonProcess = spawn("python", ["./script.py", text]); // Passer le message en tant qu'argument

      pythonProcess.stdout.on("data", async (data) => {
        const output = data.toString().trim();
        console.log("Sortie brute du script Python :", output);

        // Traitez la réponse du script Python ici
        const response = output; // Ajoutez votre logique pour traiter la réponse du script Python

        console.log("Réponse du bot extraite :", response);
        const botMessage = {
          sender: "bot",
          text: response,
        };
        socket.emit("message", botMessage.text); // Envoyer seulement le texte du message au front-end
        console.log("Réponse du bot envoyée :", response);
        await saveMessageToDatabase("user", text, conversationId); // Enregistrer le message de l'utilisateur dans la base de données
        await saveMessageToDatabase("bot", response, conversationId); // Enregistrer la réponse du bot dans la base de données
        console.log("Message enregistré :", { sender: "bot", text: response });
      });

      pythonProcess.stderr.on("data", (data) => {
        console.error(`Erreur de script Python : ${data}`);
      });

      pythonProcess.on("close", (code) => {
        console.log(`Processus Python terminé avec le code de sortie ${code}`);
      });
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
