import { WsClient } from '../websockets/types';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface Message {
  type:
    | 'getScores'
    | 'saveScores'
    | 'confirmCategory'
    | 'callHelp'
    | 'getCategory'
    | 'pushScores'
    | 'pushCategory';
  performanceId?: number;
  categoryId?: number;
}
