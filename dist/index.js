"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const dotenv = require("dotenv");
const data_source_1 = require("./data-source");
const Category_entity_1 = require("./models/Category.entity");
dotenv.config();
const PORT = process.env.PORT || 3005;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
data_source_1.AppDataSource.initialize()
    .then(() => console.log("connection to DB established"))
    .catch((e) => console.log(e));
wss.on("connection", (ws) => {
    ws.on("message", (message) => {
        console.log("received: %s", message);
        testCategory();
        ws.send(`Hello, you sent -> ${message}`);
    });
    ws.send("Hi there, I am a WebSocket server");
});
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT} :)`);
});
const testCategory = () => __awaiter(void 0, void 0, void 0, function* () {
    const categoryRepository = data_source_1.AppDataSource.getRepository(Category_entity_1.Category);
    try {
        const res = yield categoryRepository.find();
        console.log(res);
    }
    catch (error) {
        console.log(error);
    }
});
//# sourceMappingURL=index.js.map