import { Request, Response } from 'express';
import { Pool }              from 'mysql2/promise';

import { Recipe } from '../access/mysql';

export class RecipeController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool =       pool;
    //this.viewAll =    this.viewAll.bind(this);     // remove?
    this.viewTitles = this.viewTitles.bind(this);  // for Next.js getStaticPaths
    this.viewOne =    this.viewOne.bind(this);
  }

  /*async viewAll(req: Request, res: Response) {
    const authorId = 1;
    const ownerId =  1;

    const recipe = new Recipe(this.pool);
    const rows = await recipe.viewAll(authorId, ownerId);
    return res.send(rows);
  }*/

  async viewTitles(req: Request, res: Response) {
    const authorId = 1;
    const ownerId =  1;

    const recipe = new Recipe(this.pool);
    const rows = await recipe.viewTitles(authorId, ownerId);
    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    function unslugify(title: string) {
      return title.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    const title = unslugify(req.params.title);
    const authorId = 1;
    const ownerId =  1;

    const recipe = new Recipe(this.pool);
    const [ row ] = await recipe.viewOne(title, authorId, ownerId);
    return res.send(row);
  }
}
