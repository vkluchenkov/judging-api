import * as jwt from 'jsonwebtoken';
import * as url from 'url';
import * as WebSocket from 'ws';
import * as http from 'http';

type WsClients = {
  [key: string]: WebSocket.WebSocket;
};

export const WebSockets = (expressServer: http.Server) => {
  const wsClients: WsClients = {};
  const wss = new WebSocket.Server({ server: expressServer, path: '/ws' });

  wss.on('connection', (ws, req) => {
    if (!req.url) {
      ws.send('Error: Incorrect or missing token');
      ws.close();
    } else {
      const token = url.parse(req.url, true).query.token as string;
      const { NODE_ENV, JWT_SECRET } = process.env;
      const secret = NODE_ENV === 'production' ? JWT_SECRET! : 'dev-secret';
      const payload = jwt.verify(token, secret) as jwt.JwtPayload;

      if (!payload) {
        ws.send('Error: Incorrect or missing token');
        ws.close();
      }

      wsClients[token] = ws;
      const userId = payload.id as unknown as number;
      ws.send('Hi there, I am a WebSocket server!');

      ws.on('message', (data) => {
        for (const [token, client] of Object.entries(wsClients)) {
          jwt.verify(token, secret, (err, decoded) => {
            if (err) {
              client.send('Error: Your token is no longer valid. Please reauthenticate.');
              client.close();
            } else client.send('You sent: ' + data);
          });
        }
      });
    }
  });
};
