import { verify, JwtPayload } from 'jsonwebtoken';
import { parse } from 'url';
import { Server, WebSocket } from 'ws';
import { Server as httpServer } from 'http';

type WsClients = {
  [key: string]: WebSocket;
};

export const WebSockets = (expressServer: httpServer) => {
  const wsClients: WsClients = {};
  const wss = new Server({ server: expressServer, path: '/ws' });

  wss.on('connection', (ws, req) => {
    if (!req.url) {
      ws.send('Error: Incorrect or missing token');
      ws.close();
    } else {
      const token = parse(req.url, true).query.token as string;
      const { NODE_ENV, JWT_SECRET } = process.env;
      const secret = NODE_ENV === 'production' && JWT_SECRET ? JWT_SECRET : 'dev-secret';
      const payload = verify(token, secret) as JwtPayload;

      if (!payload) {
        ws.send('Error: Incorrect or missing token');
        ws.close();
      }

      wsClients[token] = ws;
      const userId = payload.id as unknown as number;
      ws.send('Hi there, I am a WebSocket server!');

      ws.on('message', (data) => {
        for (const [token, client] of Object.entries(wsClients)) {
          verify(token, secret, (err, decoded) => {
            if (err) {
              client.send('Error: Your token is no longer valid. Please reauthenticate.');
              client.close();
            } else client.send('You sent: ' + data);
          });
        }
      });

      ws.on('close', () => delete wsClients[token]);
    }
  });
};
