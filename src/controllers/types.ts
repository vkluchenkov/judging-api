import { Performance } from '../models/Performance.entity';

// Payloads
export interface LoginPayload {
  username: string;
  password: string;
}

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

// Outgoing messages to judges
export interface scoresDto {
  view: 'scoring';
  data: Performance;
}

export interface categoryDto {
  view: 'category';
  data: Performance[];
}

export interface messageDto {
  view: 'message';
  data: {
    message: string;
  };
}

export interface helpDto {
  view: 'helpRequest';
  data: {
    isSuccess: boolean;
  };
}
