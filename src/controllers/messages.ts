import { NotFoundError } from '../errors/NotFoundError';
import { handleWsError } from '../errors/handleWsError';
import { ParserPayload, PushScoresPayload } from './messages.types';
import { categoryDto, helpDto, judgeMessageDto, scoresDto } from './messages.dto';
import {
  getScoresByJudge,
  getCategoryByJudge,
  saveScoresByJudge,
  confirmCategory,
} from '../services/messages.service';
import { ServerError } from '../errors/ServerError';

const pushScoresHandler = async (payload: PushScoresPayload) => {
  const { client: admin, message, wsClients } = payload;
  const judgeSessions = wsClients.filter((wsClient) => wsClient.user.judge);

  if (judgeSessions.length === 0) admin.socket.send('No connected judges found');

  await Promise.all(
    judgeSessions.map(async (session) => {
      const res = await getScoresByJudge(session.user.judge.id, message.performanceId);
      if (!res) throw new NotFoundError(`No scores found for judge ${session.user.judge.name}`);

      const dto: scoresDto = {
        view: 'scoring',
        data: res,
      };
      session.socket.send(JSON.stringify(dto));
      admin.socket.send(`Performance ${message.performanceId} sent to ${session.user.judge.name}`);
    })
  );
};

export const parser = async (payload: ParserPayload) => {
  const { client, user, message } = payload;
  // Admin messages
  if (user.role.name === 'admin') {
    // Push performance to all judges
    if (message.type === 'pushScores' && message.performanceId) {
      try {
        await pushScoresHandler(payload as PushScoresPayload);
      } catch (error) {
        handleWsError({ err: error as ServerError });
      }
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
        if (res) {
          const dto: scoresDto = {
            view: 'scoring',
            data: res,
          };
          client.socket.send(JSON.stringify(dto));
        }
      }
    }

    // Get category for approval or changes by individual judge
    if (message.type === 'getCategory' && message.categoryId) {
      const res = await getCategoryByJudge(user, message.categoryId!);
      if (res) {
        const dto: categoryDto = {
          view: 'category',
          data: res,
        };
        client.socket.send(JSON.stringify(dto));
      }
    }

    // Save scores by Judge
    if (message.type === 'saveScores') {
      const { performanceId, scores, note } = message;
      const { id: judgeId } = user.judge;

      const performance = await getScoresByJudge(judgeId, performanceId);

      if (performance?.category.isClosed) {
        const dto: judgeMessageDto = {
          view: 'message',
          data: {
            message: "You can't save scores to this category, because it's closed.",
          },
        };
        client.socket.send(JSON.stringify(dto));
      } else {
        const res = await saveScoresByJudge({ scores, note, performanceId, judgeId });

        //if category is finished (no dancer on stage), return category view
        if (res && res.category.isFinished) {
          const categoryData = await getCategoryByJudge(user, res.category.id);
          const dto: categoryDto = {
            view: 'category',
            data: categoryData,
          };
          client.socket.send(JSON.stringify(dto));

          //else return message to await for the next
        } else {
          const dto: judgeMessageDto = {
            view: 'message',
            data: { message: 'Thank you! Please wait for updates.' },
          };
          client.socket.send(JSON.stringify(dto));
        }
      }
    }

    if (message.type === 'callHelp') {
      // Here goes nothing (message to admin logic)

      const dto: helpDto = {
        view: 'helpRequest',
        data: { isSuccess: true },
      };
      client.socket.send(JSON.stringify(dto));
    }

    if (message.type === 'confirmCategory') {
      confirmCategory(user.judge.id, message.categoryId);

      const dto: helpDto = {
        view: 'helpRequest',
        data: { isSuccess: true },
      };
      client.socket.send(JSON.stringify(dto));
    }
  }
};
