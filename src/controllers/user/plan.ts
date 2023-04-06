import { Request, Response } from 'express';
import { Pool }              from 'mysql2/promise';
import { assert }            from 'superstruct';

import { Plan }      from '../../access/mysql';
import { validPlan } from '../../lib/validations';

export class UserPublicPlanController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async viewAll(req: Request, res: Response) {
    const ownerId = req.session.userInfo!.id;
    const plan = new Plan(this.pool);
    const rows = await plan.viewAll(ownerId);
    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    const id =      Number(req.body.id);
    const ownerId = req.session.userInfo!.id;
    
    const plan = new Plan(this.pool);
    const [ row ] = await plan.viewOne(id, ownerId);
    return res.send(row);
  }

  async create(req: Request, res: Response) {
    const { name, data } = req.body.planInfo;
    const authorId =       req.session.userInfo!.id;
    const ownerId =        req.session.userInfo!.id;

    const args = {authorId, ownerId, name, data};
    assert(args, validPlan);
    const plan = new Plan(this.pool);
    await plan.create(args);
    return res.send({message: 'Plan created.'});
  }

  async update(req: Request, res: Response) {
    const { id, name, data } = req.body.planInfo;
    const authorId =           req.session.userInfo!.id;
    const ownerId =            req.session.userInfo!.id;

    const args = {authorId, ownerId, name, data};
    assert(args, validPlan);

    const plan = new Plan(this.pool);
    await plan.update({id, ...args});
    return res.send({message: 'Plan updated.'});
  }

  async deleteOne(req: Request, res: Response) {
    const id =      Number(req.body.id);
    const ownerId = req.session.userInfo!.id;

    const plan = new Plan(this.pool);
    await plan.deleteOne(id, ownerId);
    return res.send({message: 'Plan deleted.'});
  }
}