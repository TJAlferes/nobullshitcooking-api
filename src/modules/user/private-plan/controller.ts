import type { Request, Response } from 'express';

import { ForbiddenException, NotFoundException } from '../../../utils/exceptions.js';
import { PlanRecipeRepo }    from '../../plan/recipe/repo.js';
import { PlanRecipeService } from '../../plan/recipe/service.js';
import { Plan }              from '../../plan/model.js';
import { PlanRepo }          from '../../plan/repo.js';

export const privatePlanController = {
  async viewAll(req: Request, res: Response) {
    const author_id = req.session.user_id!;
    const owner_id  = req.session.user_id!;

    const planRepo = new PlanRepo();
    const plans = await planRepo.viewAll({author_id, owner_id});
    
    return res.status(200).json(plans);
  },

  async viewOne(req: Request, res: Response) {
    const { plan_id } = req.params;
    const author_id = req.session.user_id!;
    const owner_id  = req.session.user_id!;
    
    const planRepo = new PlanRepo();
    const plan = await planRepo.viewOneByPlanId(plan_id);
    if (!plan) throw NotFoundException();
    if (plan.author_id !== author_id) throw ForbiddenException();
    if (plan.owner_id !== owner_id) throw ForbiddenException();

    return res.status(200).json(plan);
  },  // is this needed???

  async create(req: Request, res: Response) {
    const { plan_name, included_recipes } = req.body;
    const author_id = req.session.user_id!;
    const owner_id  = req.session.user_id!;

    const plan = Plan.create({author_id, owner_id, plan_name}).getDTO();

    const planRepo = new PlanRepo();
    await planRepo.insert(plan);

    const planRecipeService = new PlanRecipeService(new PlanRecipeRepo());
    await planRecipeService.bulkCreate({plan_id: plan.plan_id, included_recipes});

    return res.status(201);
  },

  async update(req: Request, res: Response) {
    const { plan_id, plan_name, included_recipes } = req.body;
    const author_id = req.session.user_id!;
    const owner_id  = req.session.user_id!;

    const planRepo = new PlanRepo();
    const plan = await planRepo.viewOneByPlanId(plan_id);
    if (!plan) throw NotFoundException();
    if (plan.author_id !== author_id) throw ForbiddenException();
    if (plan.owner_id !== owner_id) throw ForbiddenException();

    const updated_plan = Plan.update({plan_id, author_id, owner_id, plan_name}).getDTO();
    await planRepo.update(updated_plan);

    const planRecipeService = new PlanRecipeService(new PlanRecipeRepo());
    await planRecipeService.bulkUpdate({plan_id: updated_plan.plan_id, included_recipes});

    return res.status(204);
  },

  async deleteOne(req: Request, res: Response) {
    const { plan_id } = req.params;
    const owner_id = req.session.user_id!;

    const planRepo = new PlanRepo();
    await planRepo.deleteOne({plan_id, owner_id});

    return res.status(204);
  }
};
