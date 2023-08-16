import { Request, Response } from 'express';
import { assert }            from 'superstruct';

import { PlanRepo }  from '../../repos/mysql';
import { validPlan } from '../../lib/validations';

export class UserPublicPlanController {
  async viewAll(req: Request, res: Response) {
    const owner_id = req.session.userInfo!.id;

    const planRepo = new PlanRepo();
    const rows = await planRepo.viewAll(owner_id);

    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    const plan_id  = req.body.plan_id;
    const owner_id = req.session.userInfo!.id;
    
    const planRepo = new PlanRepo();
    const row = await planRepo.viewOne({plan_id, owner_id});

    return res.send(row);
  }

  async create(req: Request, res: Response) {
    const { plan_name, plan_data } = req.body.planInfo;
    const owner_id = req.session.userInfo!.id;

    const args = {owner_id, plan_name, plan_data};
    assert(args, validPlan);
    const planRepo = new PlanRepo();
    await planRepo.create(args);
    return res.send({message: 'Plan created.'});
  }

  async update(req: Request, res: Response) {
    const { plan_id, plan_name, plan_data } = req.body.planInfo;
    const owner_id = req.session.userInfo!.id;

    const args = {owner_id, plan_name, plan_data};
    assert(args, validPlan);

    const planRepo = new PlanRepo();
    await planRepo.update({plan_id, ...args});
    return res.send({message: 'Plan updated.'});
  }

  async deleteOne(req: Request, res: Response) {
    const plan_id  = req.body.plan_id;
    const owner_id = req.session.userInfo!.id;

    const planRepo = new PlanRepo();
    await planRepo.deleteOne({plan_id, owner_id});
    return res.send({message: 'Plan deleted.'});
  }
}
