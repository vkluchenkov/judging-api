import { NotFoundError } from '../errors/NotFoundError';
import { handleWsError } from '../errors/handleWsError';
import { ServerError } from '../errors/ServerError';
import { ConflictError } from '../errors/ConflictError';
import {
  CallHelpPayload,
  ConfirmCategoryPayload,
  GetCategoryPayload,
  GetScoresPayload,
  ParserPayload,
  PushScoresPayload,
  SaveScoresPayload,
} from './messages.types';
import { categoryDto, helpDto, judgeMessageDto, scoresDto } from './messages.dto';
import {
  getScoresByJudge,
  getCategoryByJudge,
  saveScoresByJudge,
  confirmCategory,
} from '../services/messages.service';

// Admin handlers
const pushScoresHandler = async (payload: PushScoresPayload) => {
  const { client: admin, message, wsClients } = payload;
  const judgeSessions = wsClients.filter((wsClient) => wsClient.user.judge);

  if (judgeSessions.length === 0) admin.socket.send('No connected judges found');

  await Promise.all(
    judgeSessions.map(async (session) => {
      const res = await getScoresByJudge(session.user.judge.id, message.performanceId);
      if (!res)
        throw new NotFoundError(
          `No scores found for the judge ${session.user.judge.name} and the performance with id ${message.performanceId}`
        );

      const dto: scoresDto = {
        view: 'scoring',
        data: res,
      };
      session.socket.send(JSON.stringify(dto));
      admin.socket.send(`Performance ${message.performanceId} sent to ${session.user.judge.name}`);
    })
  );
};

// Judge handlers
const getScoresHandler = async (payload: GetScoresPayload) => {
  const { user, message, client } = payload;
  const res = await getScoresByJudge(user.judge.id, message.performanceId!);
  if (!res)
    throw new NotFoundError(
      `No scores found for the judge ${user.judge.name} and the performance with id ${message.performanceId}`
    );

  const dto: scoresDto = {
    view: 'scoring',
    data: res,
  };
  client.socket.send(JSON.stringify(dto));
};

const getCategoryHandler = async (payload: GetCategoryPayload) => {
  const { user, message, client } = payload;
  const res = await getCategoryByJudge(user, message.categoryId);
  if (!res.length)
    throw new NotFoundError(
      `No category found for the judge ${user.judge.name} and category with id ${message.categoryId}`
    );

  const dto: categoryDto = {
    view: 'category',
    data: res,
  };
  client.socket.send(JSON.stringify(dto));
};

const saveScoresHandler = async (payload: SaveScoresPayload) => {
  const { user, message, client } = payload;
  const { performanceId, scores, note } = message;
  const { id: judgeId } = user.judge;

  const performance = await getScoresByJudge(judgeId, performanceId);
  if (!performance)
    throw new NotFoundError(
      `No scores found for the judge ${user.judge.name} and the performance with id ${message.performanceId}`
    );

  if (performance.category.isClosed)
    throw new ConflictError(
      `Not possible to save scores in closed category ${performance.category.name}`
    );
  else {
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
};

const callHelpHandler = async (payload: CallHelpPayload) => {
  const { client } = payload;
  // Here goes nothing (message to admin logic)

  const dto: helpDto = {
    view: 'helpRequest',
    data: { isSuccess: true },
  };
  client.socket.send(JSON.stringify(dto));
};

const confirmCategoryHandler = async (payload: ConfirmCategoryPayload) => {
  const { client, user, message } = payload;
  await confirmCategory(user.judge.id, message.categoryId);

  const dto: helpDto = {
    view: 'helpRequest',
    data: { isSuccess: true },
  };
  client.socket.send(JSON.stringify(dto));
};

// Parser
export const parser = async (payload: ParserPayload) => {
  const { user, message } = payload;

  // Admin messages
  if (user.role.name === 'admin') {
    // Push performance to all judges
    if (message.type === 'pushScores') {
      try {
        await pushScoresHandler(payload as PushScoresPayload);
      } catch (error) {
        handleWsError({ err: error as ServerError });
      }
    }
  }

  // Judge messages
  if (user.role.name === 'judge') {
    if (!user.judge)
      throw new ConflictError(
        `User ${user.username} assigned a role of a judge, but has not been assigned to a judge in the database`
      );

    // Get single performance for re-scoring by individual judge
    if (message.type === 'getScores') {
      try {
        await getScoresHandler(payload as GetScoresPayload);
      } catch (error) {
        handleWsError({ err: error as ServerError });
      }
    }

    // Get category for approval or changes by individual judge
    if (message.type === 'getCategory') {
      try {
        await getCategoryHandler(payload as GetCategoryPayload);
      } catch (error) {
        handleWsError({ err: error as ServerError });
      }
    }

    // Save scores by Judge
    if (message.type === 'saveScores') {
      try {
        await saveScoresHandler(payload as SaveScoresPayload);
      } catch (error) {
        handleWsError({ err: error as ServerError });
      }
    }

    if (message.type === 'callHelp') {
      try {
        await callHelpHandler(payload as CallHelpPayload);
      } catch (error) {
        handleWsError({ err: error as ServerError });
      }
    }

    if (message.type === 'confirmCategory') {
      try {
        await confirmCategoryHandler(payload as ConfirmCategoryPayload);
      } catch (error) {
        handleWsError({ err: error as ServerError });
      }
    }
  }
};
