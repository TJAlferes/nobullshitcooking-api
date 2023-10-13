import type { Request, Response } from 'express';

import { PlanRecipeRepo }    from '../../plan/recipe/repo.js';
import { PlanRecipeService } from '../../plan/recipe/service.js';
import { Plan }              from '../../plan/model.js';
import { PlanRepo }          from '../../plan/repo.js';

export const privatePlanController = {
  async viewAll(req: Request, res: Response) {
    const author_id = req.session.user_id!;
    const owner_id  = req.session.user_id!;

    const planRepo = new PlanRepo();
    const rows = await planRepo.viewAll({author_id, owner_id});
    
    return res.json(rows);
  },

  async viewOne(req: Request, res: Response) {
    const { plan_id } = req.params;
    const author_id = req.session.user_id!;
    const owner_id  = req.session.user_id!;
    
    const planRepo = new PlanRepo();
    const row = await planRepo.viewOneByPlanId({plan_id, author_id, owner_id});

    return res.json(row);
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

    const plan = Plan.update({plan_id, author_id, owner_id, plan_name}).getDTO();

    const planRepo = new PlanRepo();
    await planRepo.update(plan);

    const planRecipeService = new PlanRecipeService(new PlanRecipeRepo());
    await planRecipeService.bulkUpdate({plan_id: plan.plan_id, included_recipes});

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
