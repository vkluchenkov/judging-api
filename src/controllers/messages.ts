import { AppDataSource } from '../data-source';
import { Performance } from '../models/Performance.entity';
import { User } from '../models/User.entity';
import { WsClient } from '../websockets/types';
import { Message } from './types';

export const parser = async (
  client: WsClient,
  user: User,
  message: Message,
  wsClients: WsClient[]
) => {
  // Admin messages
  if (user.role.name === 'admin') {
    const judgeSessions = wsClients.filter((el) => el.user.judge);
    if (judgeSessions.length === 0) client.socket.send('No connected judges found');

    // Push performance to all judges
    if (message.type === 'pushScores' && message.performanceId) {
      judgeSessions.forEach(async (js) => {
        if (js.user.judge) {
          const res = await getScoresByJudge(js.user.judge.id, message.performanceId!);
          const dto = {
            view: 'scoring',
            data: res,
          };
          js.socket.send(JSON.stringify(dto));
          client.socket.send(`Performance ${message.performanceId} sent to ${js.user.judge.name}`);
        }
      });
    }
  }

  // Judge messages
  if (user.role.name === 'judge') {
    // Get single performance for re-scoring by individual judge
    if (message.type === 'getScores' && message.performanceId) {
      if (user.judge) {
        const res = await getScoresByJudge(user.judge.id, message.performanceId!);
        const dto = {
          view: 'scoring',
          data: res,
        };
        client.socket.send(JSON.stringify(dto));
      }
    }

    // Get category for approval or changes by individual judge
    if (message.type === 'getCategory' && message.categoryId) {
      const res = await getCategoryByJudge(user, message.categoryId!);
      const dto = {
        view: 'category',
        data: res,
      };
      client.socket.send(JSON.stringify(dto));
    }
  }
};

const getScoresByJudge = async (judgeId: number, performanceId: number) => {
  return await AppDataSource.getRepository(Performance)
    .createQueryBuilder('performance')
    .where('performance.id = :id', { id: performanceId })
    .leftJoinAndSelect('performance.category', 'category')
    .leftJoinAndSelect('performance.contestant', 'contestant')
    .leftJoinAndSelect('performance.scores', 'scores')
    .leftJoinAndSelect('scores.judge', 'scoreJudge')
    .andWhere('scoreJudge.id = :judge', { judge: judgeId })
    .leftJoinAndSelect('scores.criteria', 'criteria')
    .getOne();
};

const getCategoryByJudge = async (user: User, categoryId: number) => {
  return await AppDataSource.getRepository(Performance)
    .createQueryBuilder('performance')
    .leftJoinAndSelect('performance.category', 'category')
    .where('category.id = :id', { id: categoryId })
    .leftJoinAndSelect('performance.contestant', 'contestant')
    .leftJoinAndSelect('performance.scores', 'scores')
    .leftJoinAndSelect('scores.judge', 'scoreJudge')
    .andWhere('scoreJudge.id = :judge', { judge: user.judge.id })
    .leftJoinAndSelect('scores.criteria', 'criteria')
    .getMany();
};
