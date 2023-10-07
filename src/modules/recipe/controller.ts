import type { Request, Response } from 'express';

import { NOBSC_USER_ID } from '../shared/model';
import { RecipeRepo }    from './repo';

// Only for official recipes. See:
// src/modules/user/public/recipe/controller.ts for public  user recipes and
// src/modules/user/private/recipe/controllerts for private user recipes.
export const recipeController = {
  async viewAllOfficialTitles(req: Request, res: Response) {
    const repo = new RecipeRepo();
    const rows = await repo.viewAllOfficialTitles();

    return res.send(rows);
  },  // for Next.js getStaticPaths

  async viewOneByTitle(req: Request, res: Response) {
    const title     = unslugify(req.params.title);
    const author_id = NOBSC_USER_ID;
    const owner_id  = NOBSC_USER_ID;

    const repo = new RecipeRepo();
    const row = await repo.viewOneByTitle({title, author_id, owner_id});

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
