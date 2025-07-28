// src/middleware/roles/isDeveloper.ts
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors/ApiError';
import { ErrorCodes } from '../utils/errors/ErrorCodes';

interface AuthRequest extends Request {
  user?: { id: number; role: string };
}

export const isDeveloper = (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = req.user as { id: number; role: string };

  if (!user || user.role !== 'Developer') {
    return next(new ApiError('Access denied. Developers only.', ErrorCodes.FORBIDDEN.statusCode));
  }

  next();
};
