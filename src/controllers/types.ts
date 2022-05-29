export interface LoginPayload {
  username: string;
  password: string;
}

export interface JudgeMessage {
  type: 'getScores' | 'saveScores' | 'confirmCategory' | 'callHelp';
  performanceId?: number;
}
