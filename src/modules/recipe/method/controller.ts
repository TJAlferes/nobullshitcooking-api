import type { Request, Response } from 'express';

import { NotFoundException } from '../../../utils/exceptions';
import { MethodRepo } from './repo';

export const methodController = {
  async viewAll(req: Request, res: Response) {
    const repo = new MethodRepo();
    const methods = await repo.viewAll();

    return res.json(methods);
  },

  async viewOne(req: Request, res: Response) {
    const method_id = Number(req.params.method_id);

    const repo = new MethodRepo();
    const method = await repo.viewOne(method_id);
    if (!method) throw new NotFoundException();

    return res.json(method);
  }
};
