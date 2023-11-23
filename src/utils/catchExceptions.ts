import type { Request, Response, NextFunction } from 'express';

export const catchExceptions = (fn: Function) => 
  (req: Request, res: Response, next: NextFunction) =>
    Promise
      .resolve(fn(req, res, next))
      .catch(err => {
        //console.log(err);
        next(err);
      });

export const tryCatch = (fn: Function) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res);
    } catch (err) {
      return next(err);
    }
  };
