import { Request, Response, NextFunction } from 'express';

import { StatusError } from './StatusError';

export function userIsAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userInfo?.username) return next(new StatusError("Unauthorized", 401));  // insufficient?
  return next();
};