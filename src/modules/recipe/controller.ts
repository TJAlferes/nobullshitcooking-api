import type { Request, Response } from 'express';

import { NotFoundException } from '../../utils/exceptions';
import { NOBSC_USER_ID } from '../shared/model';
import { RecipeRepo } from './repo';

// Only for official recipes. See:
// src/modules/user/public/recipe/controller.ts for public  user recipes and
// src/modules/user/private/recipe/controllerts for private user recipes.
export const recipeController = {
  async viewAllOfficialTitles(req: Request, res: Response) {
    const repo = new RecipeRepo();
    const titles = await repo.viewAllOfficialTitles();

    return res.json(titles);
  },  // for Next.js getStaticPaths

  async viewOneByTitle(req: Request, res: Response) {
    const title = decodeURIComponent(req.params.title)
    const author_id = NOBSC_USER_ID;
    const owner_id = NOBSC_USER_ID;

    const repo = new RecipeRepo();
    const recipe = await repo.viewOneByTitle(title);
    if (!recipe) throw new NotFoundException();
    console.log('RECIPE TITLE: ', recipe.title);
    console.log('RECIPE TITLE: ', recipe.title);
    if (recipe.author_id !== author_id) throw new NotFoundException(); 
    if (recipe.owner_id !== owner_id) throw new NotFoundException(); 

    return res.json(recipe);
  }  // for Next.js getStaticProps
};
