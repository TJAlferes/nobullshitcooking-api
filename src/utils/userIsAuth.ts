import { Request, Response, NextFunction } from 'express';

import { StatusError } from './StatusError';

export function userIsAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session || !req.session.user_id || !req.session.username) {  // insufficient?
    next(new StatusError("Unauthorized", 401));
  }
  next();
}
