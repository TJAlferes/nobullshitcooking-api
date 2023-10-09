import type { Request, Response } from 'express';

import { PlanRecipe }     from '../../plan/recipe/model';
import { PlanRecipeRepo } from '../../plan/recipe/repo';
import { Plan }           from '../../plan/model';
import { PlanRepo }       from '../../plan/repo';

export const privatePlanController = {
  async viewAll(req: Request, res: Response) {
    const author_id = req.session.user_id!;
    const owner_id  = req.session.user_id!;

    const planRepo = new PlanRepo();
    const rows = await planRepo.overviewAll({author_id, owner_id});
    
    return res.json(rows);
  },

  async viewOne(req: Request, res: Response) {
    const { plan_id } = req.params;
    const author_id = req.session.user_id!;
    const owner_id  = req.session.user_id!;
    
    const planRepo = new PlanRepo();
    const row = await planRepo.viewOneByPlanId({plan_id, author_id, owner_id});

    return res.json(row);
  },

  async create(req: Request, res: Response) {
    const { plan_name, plan_data } = req.body;
    const author_id = req.session.user_id!;
    const owner_id  = req.session.user_id!;

    //
    const plan = Plan.create({author_id, owner_id, plan_name}).getDTO();

    const plan_recipes = plan_data.map(recipe => 
      PlanRecipe.create({plan_id: plan.plan_id, ...recipe}).getDTO()
    );

    const planRepo = new PlanRepo();
    await planRepo.insert(plan);

    const planRecipeRepo = new PlanRecipeRepo();
    await planRecipeRepo.bulkInsert(plan_recipes);
    //

    return res.status(201);
  },

  async update(req: Request, res: Response) {
    const { plan_id, plan_name, plan_data } = req.body;
    const author_id = req.session.user_id!;
    const owner_id  = req.session.user_id!;

    //
    const plan = Plan.update({plan_id, author_id, owner_id, plan_name}).getDTO();

    const plan_recipes = plan_data.map(recipe => 
      PlanRecipe.create({plan_id: plan.plan_id, ...recipe}).getDTO()
    );

    const planRepo = new PlanRepo();
    await planRepo.update(plan);

    const planRecipeRepo = new PlanRecipeRepo();
    await planRecipeRepo.bulkUpdate(plan_recipes);
    //

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
