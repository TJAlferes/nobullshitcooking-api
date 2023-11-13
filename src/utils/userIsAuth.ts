import { Request, Response, NextFunction } from 'express';

import { UnauthorizedException } from './exceptions.js';

export function userIsAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session || !req.session.user_id || !req.session.username) {  // insufficient?
    next(UnauthorizedException());
  }
  next();
}
