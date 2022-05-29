import { WebSocket } from 'ws';
import { AppDataSource } from '../data-source';
import { Performance } from '../models/Performance.entity';
import { User } from '../models/User.entity';
import { JudgeMessage } from './types';

export const parser = async (client: WebSocket, user: User, message: JudgeMessage) => {
  if (message.type === 'getScores' && message.performanceId) {
    const res = await getScoresByJudge(user, message.performanceId!);
    const dto = {
      view: 'scoring',
      data: res,
    };
    client.send(JSON.stringify(dto));
  }
};

const getScoresByJudge = async (user: User, performanceId: number) => {
  return await AppDataSource.getRepository(Performance)
    .createQueryBuilder('performance')
    .where('performance.id = :id', { id: performanceId })
    .leftJoinAndSelect('performance.category', 'category')
    .leftJoinAndSelect('performance.contestant', 'contestant')
    .leftJoinAndSelect('performance.scores', 'scores')
    .leftJoinAndSelect('scores.judge', 'scoreJudge')
    .andWhere('scoreJudge.id = :judge', { judge: user.judge.id })
    .leftJoinAndSelect('scores.criteria', 'criteria')
    .getOne();
};
