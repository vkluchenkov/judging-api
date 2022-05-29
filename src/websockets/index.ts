import { verify, JwtPayload } from 'jsonwebtoken';
import { parse } from 'url';
import { Server, WebSocket } from 'ws';
import { Server as httpServer } from 'http';
import { parser } from '../controllers/messages';
import { AppDataSource } from '../data-source';
import { User } from '../models/User.entity';

type WsClients = {
  [key: string]: WebSocket;
};

export const WebSockets = (expressServer: httpServer) => {
  const wsClients: WsClients = {};
  const wss = new Server({ server: expressServer, path: '/ws' });

  wss.on('connection', async (ws, req) => {
    if (!req.url) {
      ws.send('Error: Incorrect or missing token');
      ws.close();
    } else {
      const token = parse(req.url, true).query.token as string;
      if (!token) {
        ws.send('Error: Incorrect or missing token');
        ws.close();
        return;
      }
      const { NODE_ENV, JWT_SECRET } = process.env;
      const secret = NODE_ENV === 'production' && JWT_SECRET ? JWT_SECRET : 'dev-secret';
      const payload = verify(token, secret) as JwtPayload;

      if (!payload) {
        ws.send('Error: Incorrect or missing token');
        ws.close();
        return;
      }

      wsClients[token] = ws;
      ws.send('Hi there, I am a WebSocket server!');
      const userId = payload.id as unknown as number;

      const user = await AppDataSource.getRepository(User)
        .createQueryBuilder('user')
        .where('user.id = :id', { id: userId })
        .leftJoinAndSelect('user.judge', 'judge')
        .getOne();

      ws.on('message', (data) => {
        for (const [token, client] of Object.entries(wsClients)) {
          verify(token, secret, (err, decoded) => {
            if (err) {
              client.send('Error: Your token is no longer valid. Please reauthenticate.');
              client.close();
            } else parser(client, user!, JSON.parse(data.toString()));
          });
        }
      });

      ws.on('close', () => delete wsClients[token]);
    }
  });
};
