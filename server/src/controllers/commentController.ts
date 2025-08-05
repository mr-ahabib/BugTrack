import { Request, Response, NextFunction } from 'express';
import Comment from '../models/comment';
import { ApiError } from '../utils/errors/ApiError';
import logger from '../logger/winstonLogger';

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
  const { bug_id } = req.params;
  const { comments } = req.body;

  if (!comments || comments.trim() === '') {
    return next(new ApiError('Comment text is required.', 400));
  }

  const newComment = await Comment.create({
    bug_id: Number(bug_id),
    comments,
  });

  logger.info(`Comment created for bug_id ${bug_id}`);

  return res.status(201).json({
    message: 'Comment created successfully',
    data: newComment,
  });
};

export const getCommentsByBugId = async (req: Request, res: Response, next: NextFunction) => {
  const { bug_id } = req.params;

  const comments = await Comment.findAll({
    where: { bug_id: Number(bug_id) },
    order: [['created_at', 'ASC']],
  });

  if (!comments.length) {
    return next(new ApiError('No comments found for this bug.', 404));
  }

  return res.status(200).json({
    message: 'Comments fetched successfully',
    data: comments,
  });
};
