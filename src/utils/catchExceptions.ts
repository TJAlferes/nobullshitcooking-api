import type { Request, Response, NextFunction } from 'express';

export const catchExceptions = (fn: Function) => 
  (req: Request, res: Response, next: NextFunction) =>
    Promise
      .resolve(fn(req, res, next))
      .catch(err => {
        //console.log(err);
        next(err);
      });

// TO DO: instead of manually wrapping this around every route handler (controller),
//        see if we can set just once (maybe as middleware?)
