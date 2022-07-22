export interface LoginPayload {
  username: string;
  password: string;
}

interface Score {
  criteriaId: number;
  score: number;
}

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

interface PushScoresMessage {
  type: 'pushScores';
  performanceId: number;
}

interface PushCategoryMessage {
  type: 'pushCategory';
  categoryId: number;
}

export type Message =
  | GetScoresMessage
  | SaveScoresMessage
  | CallHelpMessage
  | GetCategoryMessage
  | ConfirmCategoryMessage
  | PushScoresMessage
  | PushCategoryMessage;

export interface SaveScoresPayload {
  scores: Score[];
  note: string;
  performanceId: number;
  judgeId: number;
}
