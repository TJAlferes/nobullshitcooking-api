import { Request, Response } from 'express';

import { MethodRepo } from '../access/mysql';

export class MethodController {
  async viewAll(req: Request, res: Response) {
    const repo = new MethodRepo();
    const rows = await repo.viewAll();
    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    const id = Number(req.params.id);

    const repo = new MethodRepo();
    const [ row ] = await repo.viewOne(id);
    return res.send(row);
  }
}
