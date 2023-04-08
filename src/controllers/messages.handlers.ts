import { NotFoundError } from '../errors/NotFoundError';
import { ConflictError } from '../errors/ConflictError';
import {
  CallHelpPayload,
  ConfirmCategoryPayload,
  GetCategoryPayload,
  GetScoresPayload,
  PushScoresPayload,
  SaveScoresPayload,
} from './messages.types';
import { categoryDto, notificationDto, judgeMessageDto, scoresDto } from './messages.dto';
import {
  getScoresByJudge,
  getCategoryByJudge,
  saveScoresByJudge,
  confirmCategory,
} from '../services/messages.service';

// Admin handlers
export const pushScoresHandler = async (payload: PushScoresPayload) => {
  const { client: admin, message, wsClients } = payload;
  const judgeSessions = wsClients.filter((wsClient) => wsClient.user.judge);

  if (judgeSessions.length === 0) throw new NotFoundError('No active judges found');

  await Promise.all(
    judgeSessions.map(async (session) => {
      const res = await getScoresByJudge(session.user.judge.id, message.performanceId);
      if (!res)
        // Тут переписать, вместо ошибки выдать "дефолтные" оценки для выступления
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
export const getScoresHandler = async (payload: GetScoresPayload) => {
  const { user, message, client } = payload;

  const res = await getScoresByJudge(user.judge.id, message.performanceId!);
  if (!res)
    throw new NotFoundError(
      `No scores found for the judge ${user.judge.name} and the performance with id ${message.performanceId}`
    );

  const isCategoryJudge = res.category.judges.find((judge) => judge.id === user.judge.id);

  if (!isCategoryJudge)
    throw new ConflictError(
      `Judge ${user.judge.name} is not assigned to category ${res.category.id}`
    );

  const dto: scoresDto = {
    view: 'scoring',
    data: res,
  };

  client.socket.send(JSON.stringify(dto));
};

export const getCategoryHandler = async (payload: GetCategoryPayload) => {
  const { user, message, client } = payload;

  const res = await getCategoryByJudge(user, message.categoryId);
  if (!res.length)
    throw new NotFoundError(
      `No category found for the judge ${user.judge.name} and category with id ${message.categoryId}`
    );

  const isCategoryJudge = res[0].category.judges.find((judge) => judge.id === user.judge.id);
  if (!isCategoryJudge)
    throw new ConflictError(
      `Judge ${user.judge.name} is not assigned to category ${message.categoryId}`
    );

  const dto: categoryDto = {
    view: 'category',
    data: res,
  };

  client.socket.send(JSON.stringify(dto));
};

export const saveScoresHandler = async (payload: SaveScoresPayload) => {
  const { user, message, client } = payload;
  const { performanceId, scores, note } = message;
  const { id: judgeId } = user.judge;

  const performance = await getScoresByJudge(judgeId, performanceId);
  if (performance) {
    const isCategoryJudge = performance.category.judges.find((judge) => judge.id === user.judge.id);

    if (!isCategoryJudge)
      throw new ConflictError(
        `Can't save scores. Judge ${user.judge.name} is not assigned to category ${performance.category.id}`
      );
  }

  if (performance && performance.category.isClosed)
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

export const callHelpHandler = async (payload: CallHelpPayload) => {
  const { client } = payload;
  // Here goes nothing (message to admin logic)

  const dto: notificationDto = {
    view: 'notification',
    data: { isSuccess: true },
  };
  client.socket.send(JSON.stringify(dto));
};

export const confirmCategoryHandler = async (payload: ConfirmCategoryPayload) => {
  const { client, user, message } = payload;

  const res = await confirmCategory(user.judge.id, message.categoryId);

  const dto: notificationDto = {
    view: 'notification',
    data: { isSuccess: res ? true : false },
  };
  client.socket.send(JSON.stringify(dto));
};
