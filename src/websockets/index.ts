import { verify, JwtPayload } from 'jsonwebtoken';
import { parse } from 'url';
import { Server } from 'ws';
import { Server as httpServer } from 'http';
import { parser } from '../controllers/messages';
import { getUser } from '../controllers/user';
import { WsClient } from './types';
import { config } from 'dotenv';
import { handleWsError } from '../errors/handleWsError';
import { ServerError } from '../errors/ServerError';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { wsLogger } from '../middlwares/logger';

config();

export const WebSockets = (expressServer: httpServer) => {
  const wsClients: WsClient[] = [];
  const wss = new Server({ server: expressServer, path: '/ws' });

  wss.on('connection', async (ws, req) => {
    if (!req.url) {
      ws.send('Error: Incorrect or missing token');
      ws.close();
      return;
    }

    const token = parse(req.url, true).query.token as string;
    if (!token) {
      ws.send('Error: Incorrect or missing token');
      ws.close();
      return;
    }
    const { NODE_ENV, JWT_SECRET } = process.env;
    const secret = NODE_ENV === 'production' && JWT_SECRET ? JWT_SECRET : 'dev-secret';

    const payload = () => {
      try {
        return verify(token, secret) as JwtPayload;
      } catch (err) {
        ws.send('Error: Incorrect or missing token');
        ws.close();
      }
    };

    if (payload()) {
      const user = await getUser(payload()!.id);
      if (!user) {
        ws.send('Error: No user found');
        ws.close();
        return;
      }

      const newClient = { user, token, socket: ws };

      // Kill existing session if there's one for this user
      const index = wsClients.findIndex((el) => el.user.id === user.id);
      if (index >= 0) {
        wsClients[index].socket.send('Closing session: user logged in from another device');
        wsClients[index].socket.close();
      }

      // Add new session
      wsClients.push(newClient);

      ws.send(`Hi ${user.username}, I am a WebSocket server!`);

      // Check token on each message and send to parser if valid
      ws.on('message', async (data) => {
        const client = wsClients.find((el) => el.socket === ws);
        if (client) {
          try {
            const isValid = verify(token, secret);
            if (!isValid)
              throw new UnauthorizedError(
                'Error: Your token is no longer valid. Please reauthenticate'
              );
          } catch (error) {
            handleWsError({ err: error as ServerError });
            client.socket.close();
          }
          try {
            const logMessage = {
              timestamp: new Date(),
              user: user.id,
              data: JSON.parse(data.toString()),
            };
            wsLogger.log('info', JSON.stringify(logMessage));

            await parser({ client, user, message: JSON.parse(data.toString()), wsClients });
          } catch (error) {
            handleWsError({ err: error as ServerError });
          }
        }
      });
    }

    ws.on('close', () => {
      const index = wsClients.findIndex((el) => el.user.id === payload()!.id);
      if (index >= 0) wsClients.splice(index, 1);
    });
  });
};
