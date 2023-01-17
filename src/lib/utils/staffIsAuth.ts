import { Request, Response, NextFunction } from 'express';

import { StatusError } from './StatusError';

export function staffIsAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.staffInfo?.staffname) return next(new StatusError("Unauthorized", 401));  // insufficient?
  return next();
};