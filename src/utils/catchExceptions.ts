import { Request, Response, NextFunction } from 'express';

export const catchExceptions = (func: Function) => 
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(func(req, res, next)).catch(next);
