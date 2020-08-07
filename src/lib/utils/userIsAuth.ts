import { Request, Response, NextFunction } from 'express';

import { StatusError } from './StatusError';

export function userIsAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.userInfo.id) return next();  // insufficient?
  return next(new StatusError("Unauthorized", 401));
};