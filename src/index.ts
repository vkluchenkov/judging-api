import * as express from "express";
import * as http from "http";
import * as WebSocket from "ws";
import * as dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import { Category } from "./models/Category.entity";

dotenv.config();
const PORT = process.env.PORT || 3005;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

AppDataSource.initialize()
  .then(() => console.log("connection to DB established"))
  .catch((e) => console.log(e));

wss.on("connection", (ws: WebSocket) => {
  ws.on("message", (message: string) => {
    console.log("received: %s", message);
    testCategory();
    ws.send(`Hello, you sent -> ${message}`);
  });

  ws.send("Hi there, I am a WebSocket server");
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT} :)`);
});

const testCategory = async () => {
  const categoryRepository = AppDataSource.getRepository(Category);
  try {
    const res = await categoryRepository.find();
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};
