import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { pool } from '../../lib/connections/mysqlPoolConnection';
import { validPlanEntity } from '../../lib/validations/plan/planEntity';
import { Plan } from '../../mysql-access/Plan';

export const userPlanController = {
  view: async function(req: Request, res: Response) {
    const ownerId = req.session!.userInfo.id;

    const plan = new Plan(pool);

    const rows = await plan.view(ownerId);

    return res.send(rows);
  },
  viewById: async function(req: Request, res: Response) {
    const id = Number(req.body.id);
    const ownerId = req.session!.userInfo.id;

    const plan = new Plan(pool);

    const [ row ] = await plan.viewById(id, ownerId);

    return res.send(row);
  },
  create: async function(req: Request, res: Response) {
    const { name, data } = req.body.planInfo;

    const authorId = req.session!.userInfo.id;
    const ownerId = req.session!.userInfo.id;

    const planToCreate = {authorId, ownerId, name, data};

    assert(planToCreate, validPlanEntity);

    const plan = new Plan(pool);

    await plan.create(planToCreate);

    return res.send({message: 'Plan created.'});
  },
  update: async function(req: Request, res: Response) {
    const { id, name, data } = req.body.planInfo;

    const authorId = req.session!.userInfo.id;
    const ownerId = req.session!.userInfo.id;

    const planToUpdateWith = {authorId, ownerId, name, data};

    assert(planToUpdateWith, validPlanEntity);

    const plan = new Plan(pool);

    await plan.update({id, ...planToUpdateWith});

    return res.send({message: 'Plan updated.'});
  },
  deleteById: async function(req: Request, res: Response) {
    const id = Number(req.body.id);
    const ownerId = req.session!.userInfo.id;

    const plan = new Plan(pool);

    await plan.deleteById(id, ownerId);

    return res.send({message: 'Plan deleted.'});
  }
};