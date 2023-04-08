import { Performance } from '../models/Performance.entity';

export interface scoresDto {
  view: 'scoring';
  data: Performance;
}

export interface categoryDto {
  view: 'category';
  data: Performance[];
}

export interface judgeMessageDto {
  view: 'message';
  data: {
    message: string;
  };
}

export interface notificationDto {
  view: 'notification';
  data: {
    isSuccess: boolean;
  };
}
