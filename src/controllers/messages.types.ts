import { Performance } from '../models/Performance.entity';
import { User } from '../models/User.entity';
import { WsClient } from '../websockets/types';

// Payloads
interface Score {
  criteriaId: number;
  score: number;
}

export interface SaveScoresPayload {
  scores: Score[];
  note: string;
  performanceId: number;
  judgeId: number;
}

export interface ParserPayload {
  client: WsClient;
  user: User;
  message: Message;
  wsClients: WsClient[];
}

export interface PushScoresPayload {
  client: WsClient;
  user: User;
  message: PushScoresMessage;
  wsClients: WsClient[];
}

// Incoming messages from judges
interface GetScoresMessage {
  type: 'getScores';
  performanceId: number;
}

interface SaveScoresMessage {
  type: 'saveScores';
  scores: Score[];
  note: string;
  performanceId: number;
}

interface CallHelpMessage {
  type: 'callHelp';
}

interface GetCategoryMessage {
  type: 'getCategory';
  categoryId: number;
}

interface ConfirmCategoryMessage {
  type: 'confirmCategory';
  categoryId: number;
}

// Incoming messages from admin
interface PushScoresMessage {
  type: 'pushScores';
  performanceId: number;
}

interface PushCategoryMessage {
  type: 'pushCategory';
  categoryId: number;
}

interface ChangeCategoryStatusMessage {
  type: 'changeCategoryStatus';
  categoryId: number;
  isFinished: boolean;
  isClosed: boolean;
}

// All incoming messages
export type Message =
  | GetScoresMessage
  | SaveScoresMessage
  | CallHelpMessage
  | GetCategoryMessage
  | ConfirmCategoryMessage
  | PushScoresMessage
  | PushCategoryMessage
  | ChangeCategoryStatusMessage;
