import * as Joi from 'joi';

const score = Joi.object().keys({
  criteraId: Joi.number().required(),
  score: Joi.number().min(1).max(10).required(),
});

// Judge messages
export const getScoresDataSchema = Joi.object({
  type: 'getScores',
  performanceId: Joi.number().required(),
});

export const getCategoryDataSchema = Joi.object({
  type: 'getCategory',
  categoryId: Joi.number().required(),
});

export const confirmCategoryDataSchema = Joi.object({
  type: 'confirmCategory',
  categoryId: Joi.number().required(),
});

export const saveScoresDataSchema = Joi.object({
  type: 'saveScores',
  scores: Joi.array().items(score).required(),
  note: Joi.string(),
  performanceId: Joi.number().required(),
});

// Admin messages
export const pushScoresDataSchema = Joi.object({
  type: 'pushScores',
  performanceId: Joi.number().required(),
});

export const pushCategoryDataSchema = Joi.object({
  type: 'pushCategory',
  categoryId: Joi.number().required(),
});

export const changeCategoryStatusDataSchema = Joi.object({
  type: 'changeCategoryStatus',
  categoryId: Joi.number().required(),
  isFinished: Joi.boolean().required(),
  isClosed: Joi.boolean().required(),
});
