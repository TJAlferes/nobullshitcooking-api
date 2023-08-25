import { Request, Response } from 'express';

import { RecipeRepo } from './repo';

// Only for official recipes. See:
// src/modules/user/public/recipe/controller.ts for public user recipes and
// src/modules/user/private/recipe/controllerts for private user recipes.
export const recipeController = {
  // for Next.js getStaticPaths
  async viewAllPublicTitles(req: Request, res: Response) {
    const author_id = 1;  // MOVE
    const owner_id =  1;  // MOVE

    // use a service
    const repo = new RecipeRepo();
    const rows = await repo.viewAllPublicTitles(author_id, owner_id);

    return res.send(rows);
  },

  async viewOneByTitle(req: Request, res: Response) {
    const title = unslugify(req.params.title);
    const author_id = 1;  // MOVE
    const owner_id =  1;  // MOVE

    // use a service
    const repo = new RecipeRepo();
    const row = await repo.viewOneByTitle(title, author_id, owner_id);

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
