import type { Request, Response } from 'express';

import { ForbiddenException, NotFoundException } from '../../../utils/exceptions';
import { RecipeRepo } from '../../recipe/repo';
import { NOBSC_USER_ID } from '../../shared/model';
import { PlanRecipeRepo } from '../../plan/recipe/repo';
import { PlanRecipeService } from '../../plan/recipe/service';
import { Plan } from '../../plan/model';
import { PlanRepo } from '../../plan/repo';
import { UserRepo } from '../repo';
import { PublicPlanService } from './service';

export const publicPlanController = {
  async viewAll(req: Request, res: Response) {
    const author_id = req.session.user_id!;
    const owner_id  = NOBSC_USER_ID;

    const planRepo = new PlanRepo();
    const rows = await planRepo.viewAll({author_id, owner_id});

    return res.status(200).json(rows);
  },

  async viewOne(req: Request, res: Response) {
    const { username, plan_name } = req.params;

    const userRepo = new UserRepo();
    const user = await userRepo.getByUsername(username);
    if (!user) throw new NotFoundException();

    const author_id = user.user_id;
    const owner_id  = NOBSC_USER_ID;
    
    const planRepo = new PlanRepo();
    const plan = await planRepo.viewOneByPlanName({plan_name, author_id, owner_id});
    if (!plan) throw new NotFoundException();
    if (plan.author_id !== author_id) throw new ForbiddenException();
    if (plan.owner_id !== owner_id) throw new ForbiddenException();

    return res.status(200).json(plan);
  },

  async create(req: Request, res: Response) {
    const { plan_name, included_recipes } = req.body;
    const author_id = req.session.user_id!;
    const owner_id  = NOBSC_USER_ID;

    const recipeRepo = new RecipeRepo();
    const { checkForPrivateContent } = new PublicPlanService(recipeRepo);
    await checkForPrivateContent(included_recipes);  // important

    const plan = Plan.create({author_id, owner_id, plan_name}).getDTO();

    const planRepo = new PlanRepo();
    await planRepo.insert(plan);

    const planRecipeService = new PlanRecipeService(new PlanRecipeRepo());
    await planRecipeService.bulkCreate({plan_id: plan.plan_id, included_recipes});

    return res.status(201).json();
  },

  async update(req: Request, res: Response) {
    const { plan_id, plan_name, included_recipes } = req.body;
    const author_id = req.session.user_id!;
    const owner_id  = NOBSC_USER_ID;

    const planRepo = new PlanRepo();
    const plan = await planRepo.viewOneByPlanId(plan_id);
    if (!plan) throw new NotFoundException();
    if (plan.author_id !== author_id) throw new ForbiddenException();
    if (plan.owner_id !== owner_id) throw new ForbiddenException();

    const recipeRepo = new RecipeRepo();
    const { checkForPrivateContent } = new PublicPlanService(recipeRepo);
    await checkForPrivateContent(included_recipes);  // important

    const updated_plan = Plan.update({plan_id, author_id, owner_id, plan_name}).getDTO();
    await planRepo.update(updated_plan);

    const planRecipeService = new PlanRecipeService(new PlanRecipeRepo());
    await planRecipeService.bulkUpdate({plan_id: updated_plan.plan_id, included_recipes});

    return res.status(204).json();
  },

  async unattributeOne(req: Request, res: Response) {
    const { plan_id } = req.params;
    const author_id = req.session.user_id!;

    const planRepo = new PlanRepo();
    await planRepo.unattributeOne({author_id, plan_id});

    return res.status(204).json();
  }
};
