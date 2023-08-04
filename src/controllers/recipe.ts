import { Request, Response } from 'express';

import { RecipeRepo } from '../access/mysql';

export class RecipeController {
  // remove?
  /*async viewAll(req: Request, res: Response) {
    const authorId = 1;
    const ownerId =  1;

    const repo = new RecipeRepo();
    const rows = await repo.viewAll(authorId, ownerId);
    return res.send(rows);
  }*/

  // for Next.js getStaticPaths
  async viewAllPublicTitles(req: Request, res: Response) {
    const authorId = 1;
    const ownerId =  1;

    const repo = new RecipeRepo();
    const rows = await repo.viewAllPublicTitles(authorId, ownerId);
    return res.send(rows);
  }

  async viewOneByTitle(req: Request, res: Response) {
    function unslugify(title: string) {
      return title.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    const title = unslugify(req.params.title);
    const authorId = 1;
    const ownerId =  1;

    const repo = new RecipeRepo();
    const row = await repo.viewOneByTitle(title, authorId, ownerId);
    return res.send(row);
  }
}
