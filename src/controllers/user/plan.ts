import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { validPlanEntity } from '../../lib/validations/plan/entity';
import { Plan } from '../../mysql-access/Plan';

export class UserPlanController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewById = this.viewById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.deleteById = this.deleteById.bind(this);
  }

  async view(req: Request, res: Response) {
    const ownerId = req.session!.userInfo.id;
    const plan = new Plan(this.pool);
    const rows = await plan.view(ownerId);
    return res.send(rows);
  }

  async viewById(req: Request, res: Response) {
    const id = Number(req.body.id);
    const ownerId = req.session!.userInfo.id;
    const plan = new Plan(this.pool);
    const [ row ] = await plan.viewById(id, ownerId);
    return res.send(row);
  }

  async create(req: Request, res: Response) {
    const { name, data } = req.body.planInfo;
    const authorId = req.session!.userInfo.id;
    const ownerId = req.session!.userInfo.id;
    const planCreation = {authorId, ownerId, name, data};
    assert(planCreation, validPlanEntity);
    const plan = new Plan(this.pool);
    await plan.create(planCreation);
    return res.send({message: 'Plan created.'});
  }

  async update(req: Request, res: Response) {
    const { id, name, data } = req.body.planInfo;
    const authorId = req.session!.userInfo.id;
    const ownerId = req.session!.userInfo.id;
    const planUpdate = {authorId, ownerId, name, data};
    assert(planUpdate, validPlanEntity);
    const plan = new Plan(this.pool);
    await plan.update({id, ...planUpdate});
    return res.send({message: 'Plan updated.'});
  }

  async deleteById(req: Request, res: Response) {
    const id = Number(req.body.id);
    const ownerId = req.session!.userInfo.id;
    const plan = new Plan(this.pool);
    await plan.deleteById(id, ownerId);
    return res.send({message: 'Plan deleted.'});
  }
}