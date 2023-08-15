import { Request, Response } from 'express';

import { RecipeRepo } from '../repos/mysql';

// Only for official recipes. See:
// controllers/user/recipe.ts         for public  user recipes and
// controllers/user/private/recipe.ts for private user recipes.
export class RecipeController {
  // for Next.js getStaticPaths
  async viewAllPublicTitles(req: Request, res: Response) {
    const authorId = 1;
    const ownerId =  1;

    const repo = new RecipeRepo();
    const rows = await repo.viewAllPublicTitles(authorId, ownerId);
    return res.send(rows);
  }

  async viewOneByTitle(req: Request, res: Response) {
    const title = unslugify(req.params.title);
    const authorId = 1;
    const ownerId =  1;

    const repo = new RecipeRepo();
    const row = await repo.viewOneByTitle(title, authorId, ownerId);
    return res.send(row);
  }
}

// TO DO: move to shared
function unslugify(title: string) {
  return title
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
