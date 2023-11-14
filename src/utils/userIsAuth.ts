import type { Request, Response, NextFunction } from 'express';

import { UnauthorizedException } from './exceptions';

export function userIsAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session || !req.session.user_id || !req.session.username) {
    return next(new UnauthorizedException());
  }
  next();
}
