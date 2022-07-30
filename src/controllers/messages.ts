import { handleWsError } from '../errors/handleWsError';
import { ServerError } from '../errors/ServerError';
import { ConflictError } from '../errors/ConflictError';
import { BadRequestError } from '../errors/BadRequestError';
import {
  CallHelpPayload,
  ConfirmCategoryPayload,
  GetCategoryPayload,
  GetScoresPayload,
  ParserPayload,
  PushScoresPayload,
  SaveScoresPayload,
} from './messages.types';
import {
  getScoresDataSchema,
  getCategoryDataSchema,
  saveScoresDataSchema,
  confirmCategoryDataSchema,
  pushScoresDataSchema,
} from '../middlwares/validation';

import {
  pushScoresHandler,
  getScoresHandler,
  getCategoryHandler,
  saveScoresHandler,
  callHelpHandler,
  confirmCategoryHandler,
} from './messages.handlers';

// Parser
export const parser = async (payload: ParserPayload) => {
  const { user, message } = payload;
  const { competitionId } = message;

  // Contest Admin messages
  if (user.roles.find((role) => role.name === 'contestAdmin')) {
    // Push performance to all judges
    if (message.type === 'pushScores') {
      try {
        const validation = pushScoresDataSchema.validate(message);
        if (validation.error)
          throw new BadRequestError(`Incorrect data: ${validation.error.message}`);
        await pushScoresHandler(payload as PushScoresPayload);
      } catch (error) {
        handleWsError({ err: error as ServerError });
      }
    }
  }

  // Judge messages
  if (user.roles.find((role) => role.name === 'judge' && role.competition.id === competitionId)) {
    if (!user.judge)
      throw new ConflictError(
        `User ${user.username} assigned a role of a judge, but has not been assigned to the judge in the database`
      );

    // Get single performance for re-scoring by individual judge
    if (message.type === 'getScores') {
      try {
        const validation = getScoresDataSchema.validate(message);
        if (validation.error)
          throw new BadRequestError(`Incorrect data: ${validation.error.message}`);
        await getScoresHandler(payload as GetScoresPayload);
      } catch (error) {
        handleWsError({ err: error as ServerError });
      }
    }

    // Get category for approval or changes by individual judge
    if (message.type === 'getCategory') {
      try {
        const validation = getCategoryDataSchema.validate(message);
        if (validation.error)
          throw new BadRequestError(`Incorrect data: ${validation.error.message}`);
        await getCategoryHandler(payload as GetCategoryPayload);
      } catch (error) {
        handleWsError({ err: error as ServerError });
      }
    }

    // Save scores by Judge
    if (message.type === 'saveScores') {
      try {
        const validation = saveScoresDataSchema.validate(message);
        if (validation.error)
          throw new BadRequestError(`Incorrect data: ${validation.error.message}`);
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
        const validation = confirmCategoryDataSchema.validate(message);
        if (validation.error)
          throw new BadRequestError(`Incorrect data: ${validation.error.message}`);
        await confirmCategoryHandler(payload as ConfirmCategoryPayload);
      } catch (error) {
        handleWsError({ err: error as ServerError });
      }
    }
  } else
    throw new BadRequestError(
      `User ${user.username} has no assigned roles for competition ${competitionId}`
    );
};
