import express from 'express';
import mongoose from 'mongoose';
import { notFoundError, errorHandler } from './middlewares/error-handler.js';
import morgan from 'morgan';
import cors from 'cors';
import { Server } from 'socket.io'; 
import { LlamaModel, LlamaContext, LlamaChatSession } from 'node-llama-cpp';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import http from 'http';

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 7001;
const databaseName = 'chatcount_db';

mongoose.Promise = global.Promise;

import userRoute from './Routes/auth_route.js';
import fecRoute from './Routes/fec_route.js';

//DATABASE
mongoose
  .connect(`mongodb://localhost:27017/${databaseName}`)
  .then(() => { 
    console.log(`Connected to ${databaseName}`);
  })
  .catch(err => { 
    console.log(err);
  });
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200'); // Replace with your frontend's origin
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  
app.use(morgan("dev"));

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
});

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  credentials: true,
}));
app.use(express.json());
app.use('/avatars', express.static('public/images'));

app.use((req, res, next) => {
  console.log("middleware just run !");
  next();
});
app.use("/gse", (req, res, next) => {
  console.log("Middleware just ran on a gse route !");
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use('/user', userRoute);
app.use('/fec', fecRoute);


app.use(notFoundError);
app.use(errorHandler);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const modelPath = path.join(__dirname, '../models/mixtral-8x7b-instruct-v0.1.Q3_K_M.gguf');
const model = new LlamaModel({ modelPath });
const context = new LlamaContext({ model: model });
const session = new LlamaChatSession({ context: context });

io.on('connection', (socket) => {
  console.log("Un utilisateur s'est connecté");

  socket.on('message', async (message) => {
    console.log('Message reçu :', message);

    const prediction = await session.prompt(message);

    socket.emit('message', prediction);
    console.log(prediction);
  });

  socket.on('disconnect', () => {
    console.log("Un utilisateur s est déconnecté");
  });
});
