import { Request, Response } from 'express';
import { assert }            from 'superstruct';

import { PlanRepo }  from '../../../repos/mysql';
import { validPlan } from '../../../lib/validations';

export class UserPrivatePlanController {
  async viewAll(req: Request, res: Response) {
    const ownerId = req.session.userInfo!.id;
    const planRepo = new PlanRepo();
    const rows = await planRepo.viewAll(ownerId);
    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    const id =      Number(req.body.id);
    const ownerId = req.session.userInfo!.id;
    
    const planRepo = new PlanRepo();
    const [ row ] = await planRepo.viewOne(id, ownerId);
    return res.send(row);
  }

  async create(req: Request, res: Response) {
    const { name, data } = req.body.planInfo;
    const authorId =       req.session.userInfo!.id;
    const ownerId =        req.session.userInfo!.id;

    const args = {authorId, ownerId, name, data};
    assert(args, validPlan);
    const planRepo = new PlanRepo();
    await planRepo.create(args);
    return res.send({message: 'Plan created.'});
  }

  async update(req: Request, res: Response) {
    const { id, name, data } = req.body.planInfo;
    const authorId =           req.session.userInfo!.id;
    const ownerId =            req.session.userInfo!.id;

    const args = {authorId, ownerId, name, data};
    assert(args, validPlan);

    const planRepo = new PlanRepo();
    await planRepo.update({id, ...args});
    return res.send({message: 'Plan updated.'});
  }

  async deleteOne(req: Request, res: Response) {
    const id =      Number(req.body.id);
    const ownerId = req.session.userInfo!.id;

    const planRepo = new PlanRepo();
    await planRepo.deleteOne(id, ownerId);
    return res.send({message: 'Plan deleted.'});
  }
}
