import type { Request, Response } from 'express';

import { MethodRepo } from './repo.js';

export const methodController = {
  async viewAll(req: Request, res: Response) {
    const repo = new MethodRepo();
    const rows = await repo.viewAll();

    return res.json(rows);
  },

  async viewOne(req: Request, res: Response) {
    const method_id = Number(req.params.method_id);

    const repo = new MethodRepo();
    const row = await repo.viewOne(method_id);

    return res.json(row);
  }
};
