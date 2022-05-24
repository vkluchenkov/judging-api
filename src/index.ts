import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import { AppDataSource } from './data-source';
import { Performance } from './models/Performance.entity';
import { login, signup } from './controllers/user';
import { handleError } from './errors/handleError';
import { requestLogger } from './middlwares/logger';
import { errorLogger } from 'express-winston';

dotenv.config();
const PORT = process.env.PORT || 3005;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

AppDataSource.initialize()
  .then(() => console.log('connection to DB established'))
  .catch((e) => console.log(e));

const testQuery = async () => {
  return await AppDataSource.getRepository(Performance)
    .createQueryBuilder('performance')
    .leftJoinAndSelect('performance.category', 'category')
    .leftJoinAndSelect('performance.contestant', 'contestant')
    .leftJoinAndSelect('performance.scores', 'scores')
    .leftJoinAndSelect('scores.judge', 'judge')
    .leftJoinAndSelect('scores.criteria', 'criteria')
    .getMany();
};

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', async (message: string) => {
    console.log('received: %s', message);
    const res = await testQuery();
    ws.send(JSON.stringify(res));
  });

  ws.send('Hi there, I am a WebSocket server');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logger
app.use(requestLogger);

// Auth
app.post('/login', login);
app.post('/signup', signup);

// Errors logger
app.use(errorLogger);

// Errors handler
app.use(
  (
    err: Error & { statusCode?: number },
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => handleError({ err, req, res, next })
);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT} :)`);
});
