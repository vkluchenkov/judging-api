import { AppDataSource } from '../data-source';
import { Category } from '../models/Category.entity';
import { Judge } from '../models/Judge.entity';
import { Note } from '../models/Note.entity';
import { Performance } from '../models/Performance.entity';
import { Score } from '../models/Score.entity';
import { User } from '../models/User.entity';
import { SaveScoresServicePayload } from '../controllers/messages.types';
import { handleWsError } from '../errors/handleWsError';
import { ServerError } from '../errors/ServerError';
import { NotFoundError } from '../errors/NotFoundError';
import { ConflictError } from '../errors/ConflictError';

export const getScoresByJudge = async (judgeId: number, performanceId: number) => {
  return await AppDataSource.getRepository(Performance)
    .createQueryBuilder('performance')
    .where('performance.id = :id', { id: performanceId })
    .leftJoinAndSelect('performance.category', 'category')
    .leftJoinAndSelect('category.judges', 'judges')
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

export const getCategoryByJudge = async (user: User, categoryId: number) => {
  return await AppDataSource.getRepository(Performance)
    .createQueryBuilder('performance')
    .leftJoinAndSelect('performance.category', 'category')
    .where('category.id = :id', { id: categoryId })
    .leftJoinAndSelect('category.judges', 'judges')
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

export const saveScoresByJudge = async (payload: SaveScoresServicePayload) => {
  const { scores, note, performanceId, judgeId } = payload;
  const scoresRepository = await AppDataSource.getRepository(Score);
  const notesRepository = await AppDataSource.getRepository(Note);

  // Scores saving
  try {
    await Promise.all(
      scores.map(async (score) => {
        const isScore = await scoresRepository.findOneBy({
          judge: { id: judgeId },
          criteria: { id: score.criteriaId },
          performance: { id: performanceId },
        });

        const scoreDBPayload = {
          value: score.score,
          judge: { id: judgeId },
          criteria: { id: score.criteriaId },
          performance: { id: performanceId },
        };

        if (!isScore) {
          return scoresRepository.save(scoreDBPayload);
        } else return scoresRepository.update({ id: isScore.id }, { value: score.score });
      })
    );
  } catch (error) {
    handleWsError({ err: error as ServerError });
  }

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

  try {
    if (!isNote && note.length) await notesRepository.save(noteDBPayload);
    else await notesRepository.update({ id: isNote!.id }, { text: note });
  } catch (error) {
    handleWsError({ err: error as ServerError });
  }

  return await getScoresByJudge(judgeId, performanceId);
};

export const confirmCategory = async (judgeId: number, categoryId: number) => {
  try {
    const categoryRepository = AppDataSource.getRepository(Category);
    const judgeRepository = AppDataSource.getRepository(Judge);

    const judge = await judgeRepository.findOneBy({ id: judgeId });
    if (!judge) throw new NotFoundError(`No judge found with id ${judgeId}`);

    const category = await categoryRepository.findOne({
      where: { id: categoryId },
      relations: { approvedBy: true, judges: true },
    });

    if (!category) throw new NotFoundError(`No category found with id ${categoryId}`);

    const isCategoryJudge = category.judges.find((catJudge) => catJudge.id === judge.id);
    if (!isCategoryJudge)
      throw new ConflictError(
        `Can't confirm category ${category.id} as the judge ${judge.id} is not assigned to it`
      );

    const isApproved = category.approvedBy.filter((judge) => judge.id === judgeId);
    if (!isApproved.length) {
      category.approvedBy.push(judge!);
      return await categoryRepository.save(category);
    } else
      throw new ConflictError(`Category ${category.id} is already approved by judge ${judge.id}`);
  } catch (error) {
    handleWsError({ err: error as ServerError });
  }
};
