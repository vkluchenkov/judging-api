import { WebSocket } from 'ws';
import { User } from '../models/User.entity';

export type WsClient = {
  user: User;
  token: string;
  socket: WebSocket;
};
