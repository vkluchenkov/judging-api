import { AppDataSource } from '../data-source';
import { Note } from '../models/Note.entity';
import { Performance } from '../models/Performance.entity';
import { Score } from '../models/Score.entity';
import { User } from '../models/User.entity';
import { WsClient } from '../websockets/types';
import { Message, SaveScoresPayload } from './types';

export const parser = async (
  client: WsClient,
  user: User,
  message: Message,
  wsClients: WsClient[]
) => {
  //
  // Admin messages
  //
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

  //
  // Judge messages
  //
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

    // Save scores by Judge
    if (message.type === 'saveScores') {
      const { performanceId, scores, note } = message;
      const { id: judgeId } = user.judge;
      try {
        const dto = await saveScoresByJudge({ scores, note, performanceId, judgeId });
        client.socket.send(JSON.stringify(dto));
      } catch (e) {
        console.log('e2');
      }
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
    .leftJoinAndSelect('performance.notes', 'notes')
    .leftJoinAndSelect('notes.judge', 'noteJudge')
    .andWhere('noteJudge.id = :judge', { judge: judgeId })
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
    .leftJoinAndSelect('performance.notes', 'notes')
    .leftJoinAndSelect('notes.judge', 'noteJudge')
    .andWhere('noteJudge.id = :judge', { judge: user.judge.id })
    .getMany();
};

const saveScoresByJudge = async (payload: SaveScoresPayload) => {
  const { scores, note, performanceId, judgeId } = payload;
  const scoresRepository = await AppDataSource.getRepository(Score);
  const notesRepository = await AppDataSource.getRepository(Note);

  // Scores saving
  scores.forEach(async (score) => {
    const isScore = await scoresRepository.findOneBy({
      judge: { id: judgeId },
      criteria: { id: score.criteriaId },
      performance: { id: performanceId },
    });

    const scoreRes = {
      value: score.score,
      judge: { id: judgeId },
      criteria: { id: score.criteriaId },
      performance: { id: performanceId },
    };

    if (!isScore) {
      return new Promise((resolve, reject) => {
        return scoresRepository.save(scoreRes).catch(reject);
      });
      // try {
      //   await scoresRepository.save(scoreRes);
      // } catch (e) {
      //   console.log('e1');
      // }
    } else return scoresRepository.update({ id: isScore.id }, { value: score.score });
  });

  // Note saving
  const isNote = await notesRepository.findOneBy({
    judge: { id: judgeId },
    performance: { id: performanceId },
  });

  const noteDBPayload = {
    text: note,
    judge: { id: judgeId },
    performance: { id: performanceId },
  };

  if (!isNote && note.length) await notesRepository.save(noteDBPayload);
  else if (note.length) await notesRepository.update({ id: isNote!.id }, { text: note });

  return await getScoresByJudge(judgeId, performanceId);
};
