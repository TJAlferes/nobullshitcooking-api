import { Request, Response } from 'express';

import { MethodRepo } from './repo';

export class MethodController {
  async viewAll(req: Request, res: Response) {
    const repo = new MethodRepo();
    const rows = await repo.viewAll();

    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    const method_id = Number(req.params.method_id);

    const repo = new MethodRepo();
    const row = await repo.viewOne(method_id);

    return res.send(row);
  }
}
