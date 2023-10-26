import { Request, Response, NextFunction } from 'express';

export const catchExceptions = (func: Function) => 
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(func(req, res, next)).catch(next);

// TO DO: instead of manually wrapping this around every route handler (controller),
//        see if we can set just once (maybe as middleware?)
