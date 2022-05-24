import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import { Performance } from './models/Performance.entity';
import { Judge } from './models/Judge.entity';

dotenv.config();
const PORT = process.env.PORT || 3005;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

AppDataSource.initialize()
  .then(() => console.log('connection to DB established'))
  .catch((e) => console.log(e));

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', async (message: string) => {
    console.log('received: %s', message);
    const res = await testQuery();
    ws.send(JSON.stringify(res));
  });

  ws.send('Hi there, I am a WebSocket server');
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT} :)`);
});

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
