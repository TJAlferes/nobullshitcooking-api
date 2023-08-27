import { Request, Response } from 'express';

import { RecipeRepo } from './repo';

// Only for official recipes. See:
// src/modules/user/public/recipe/controller.ts for public user recipes and
// src/modules/user/private/recipe/controllerts for private user recipes.
export const recipeController = {
  async viewAllTitles(req: Request, res: Response) {
    const repo = new RecipeRepo();
    const rows = await repo.viewAllTitles();

    return res.send(rows);
  },  // for Next.js getStaticPaths

  async viewOneByTitle(req: Request, res: Response) {
    const title = unslugify(req.params.title);

    const repo = new RecipeRepo();
    const row = await repo.viewOneByTitle(title);

    return res.send(row);
  }
};

// TO DO: move to shared
function unslugify(title: string) {
  return title
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
