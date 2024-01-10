import type { Request, Response, NextFunction } from 'express';

import { ForbiddenException, NotFoundException } from '../../../utils/exceptions';
import { PlanRecipeRepo }    from '../../plan/recipe/repo';
import { PlanRecipeService } from '../../plan/recipe/service';
import { Plan }              from '../../plan/model';
import { PlanRepo }          from '../../plan/repo';

export const privatePlanController = {
  async viewAll(req: Request, res: Response) {
    const author_id = req.session.user_id!;
    const owner_id  = req.session.user_id!;

    const planRepo = new PlanRepo();
    const plans = await planRepo.viewAll({author_id, owner_id});
    
    return res.status(200).json(plans);
  },

  /*async viewOne(req: Request, res: Response) {
    const { plan_id } = req.params;
    const author_id = req.session.user_id!;
    const owner_id  = req.session.user_id!;
    
    const planRepo = new PlanRepo();
    const plan = await planRepo.viewOneByPlanId(plan_id);
    if (!plan) throw new NotFoundException();
    if (plan.author_id !== author_id) throw new ForbiddenException();
    if (plan.owner_id !== owner_id) throw new ForbiddenException();

    return res.status(200).json(plan);
  },  // is this needed??? */

  async create(req: Request, res: Response, next: NextFunction) {
    const { plan_name, included_recipes } = req.body;
    const author_id = req.session.user_id!;
    const owner_id  = req.session.user_id!;

    const plan = Plan.create({author_id, owner_id, plan_name}).getDTO();

    const planRepo = new PlanRepo();
    await planRepo.insert(plan);

    const planRecipeService = new PlanRecipeService(new PlanRecipeRepo());
    try {
      await planRecipeService.bulkCreate({plan_id: plan.plan_id, included_recipes});
    } catch (err) {
      // rollback (MySQL does not support nested transactions, so we do this)
      await planRepo.deleteOne({plan_id: plan.plan_id, owner_id});
      next(err);
    }

    return res.status(201).json();
  },

  async update(req: Request, res: Response) {
    const { plan_id, plan_name, included_recipes } = req.body;
    const author_id = req.session.user_id!;
    const owner_id  = req.session.user_id!;

    const planRepo = new PlanRepo();
    const plan = await planRepo.viewOneByPlanId(plan_id);
    if (!plan) throw new NotFoundException();
    if (plan.author_id !== author_id) throw new ForbiddenException();
    if (plan.owner_id !== owner_id) throw new ForbiddenException();

    const updated_plan = Plan.update({plan_id, author_id, owner_id, plan_name}).getDTO();
    await planRepo.update(updated_plan);

    const planRecipeService = new PlanRecipeService(new PlanRecipeRepo());
    await planRecipeService.bulkUpdate({plan_id: updated_plan.plan_id, included_recipes});

    return res.status(204).json();
  },

  async deleteOne(req: Request, res: Response) {
    const { plan_id } = req.params;
    const owner_id = req.session.user_id!;

    const planRepo = new PlanRepo();
    const plan = await planRepo.viewOneByPlanId(plan_id);
    if (!plan) throw new NotFoundException();
    if (plan.owner_id !== owner_id) throw new ForbiddenException();

    await planRepo.deleteOne({plan_id, owner_id});

    return res.status(204).json();
  }
};
