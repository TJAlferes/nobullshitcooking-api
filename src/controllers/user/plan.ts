import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { pool } from '../../lib/connections/mysqlPoolConnection';
import { validPlanEntity } from '../../lib/validations/plan/planEntity';
import { Plan } from '../../mysql-access/Plan';

export const userPlanController = {
  viewAllMyPrivatePlans: async function(req: Request, res: Response) {
    const ownerId = req.session!.userInfo.userId;

    const plan = new Plan(pool);

    const myPlans = await plan.viewAllMyPrivatePlans(ownerId);

    res.send(myPlans);
  },
  viewMyPrivatePlan: async function(req: Request, res: Response) {
    const planId = Number(req.body.planId);
    const ownerId = req.session!.userInfo.userId;

    const plan = new Plan(pool);

    const [ myPlan ] = await plan.viewMyPrivatePlan(planId, ownerId);

    res.send(myPlan);
  },
  createMyPrivatePlan: async function(req: Request, res: Response) {
    const planName = req.body.planInfo.planName;
    const planData = req.body.planInfo.planData;

    const authorId = req.session!.userInfo.userId;
    const ownerId = req.session!.userInfo.userId;

    const planToCreate = {
      authorId,
      ownerId,
      planName,
      planData
    };

    assert(planToCreate, validPlanEntity);

    const plan = new Plan(pool);

    await plan.createMyPrivatePlan(planToCreate);

    res.send({message: 'Plan created.'});
  },
  updateMyPrivatePlan: async function(req: Request, res: Response) {
    const planId = Number(req.body.planInfo.planId);
    const planName = req.body.planInfo.planName;
    const planData = req.body.planInfo.planData;

    const authorId = req.session!.userInfo.userId;
    const ownerId = req.session!.userInfo.userId;

    const planToUpdateWith = {
      authorId,
      ownerId,
      planName,
      planData
    };

    assert(planToUpdateWith, validPlanEntity);

    const plan = new Plan(pool);

    await plan.updateMyPrivatePlan({planId, ...planToUpdateWith});

    res.send({message: 'Plan updated.'});
  },
  deleteMyPrivatePlan: async function(req: Request, res: Response) {
    const planId = Number(req.body.planId);
    const ownerId = req.session!.userInfo.userId;

    const plan = new Plan(pool);

    await plan.deleteMyPrivatePlan(planId, ownerId);

    res.send({message: 'Plan deleted.'});
  }
};