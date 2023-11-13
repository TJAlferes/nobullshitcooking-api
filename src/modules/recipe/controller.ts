import type { Request, Response } from 'express';

import { NotFoundException } from '../../utils/exceptions.js';
import { NOBSC_USER_ID } from '../shared/model.js';
import { RecipeRepo }    from './repo.js';

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
    const { title } = req.params;
    const author_id = NOBSC_USER_ID;
    const owner_id = NOBSC_USER_ID;

    const repo = new RecipeRepo();
    const recipe = await repo.viewOneByTitle(title);
    if (!recipe) throw NotFoundException();
    if (recipe.author_id !== author_id) throw NotFoundException();  //ForbiddenException(); 
    if (recipe.owner_id !== owner_id) throw NotFoundException();  //ForbiddenException(); 

    return res.json(recipe);
  }
};

// TO DO: move to shared
//function unslugify(title: string) {
//  return title
//    .split('-')
//    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//    .join(' ');
//}
