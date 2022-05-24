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
const bodyParser = require("body-parser");
const data_source_1 = require("./data-source");
const Performance_entity_1 = require("./models/Performance.entity");
const user_1 = require("./controllers/user");
const handleError_1 = require("./errors/handleError");
dotenv.config();
const PORT = process.env.PORT || 3005;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
data_source_1.AppDataSource.initialize()
    .then(() => console.log('connection to DB established'))
    .catch((e) => console.log(e));
wss.on('connection', (ws) => {
    ws.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('received: %s', message);
        const res = yield testQuery();
        ws.send(JSON.stringify(res));
    }));
    ws.send('Hi there, I am a WebSocket server');
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/login', user_1.login);
app.post('/signup', user_1.signup);
// Errors handler
app.use((err, req, res, next) => (0, handleError_1.handleError)({ err, req, res, next }));
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT} :)`);
});
const testQuery = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield data_source_1.AppDataSource.getRepository(Performance_entity_1.Performance)
        .createQueryBuilder('performance')
        .leftJoinAndSelect('performance.category', 'category')
        .leftJoinAndSelect('performance.contestant', 'contestant')
        .leftJoinAndSelect('performance.scores', 'scores')
        .leftJoinAndSelect('scores.judge', 'judge')
        .leftJoinAndSelect('scores.criteria', 'criteria')
        .getMany();
});
//# sourceMappingURL=index.js.map