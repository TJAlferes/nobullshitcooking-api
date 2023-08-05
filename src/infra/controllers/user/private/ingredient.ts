import { Request, Response } from 'express';
import { assert }            from 'superstruct';

import { IngredientRepo, RecipeIngredientRepo } from '../../../access/mysql';
import { validIngredient }                      from '../../../lib/validations';

export class UserIngredientController {
  async viewAll(req: Request, res: Response) {
    const authorId = req.session.userInfo!.id;
    const ownerId =  req.session.userInfo!.id;

    const ingredientRepo = new IngredientRepo();
    const rows = await ingredientRepo.viewAll(authorId, ownerId);
    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    const id =       Number(req.body.id);
    const authorId = req.session.userInfo!.id;
    const ownerId =  req.session.userInfo!.id;

    const ingredientRepo = new IngredientRepo();
    const [ row ] = await ingredientRepo.viewOne(id, authorId, ownerId);
    return res.send(row);
  }

  async create(req: Request, res: Response) {
    const ingredientTypeId = Number(req.body.ingredientInfo.ingredientTypeId);
    const { brand, variety, name, altNames, description, image } = req.body.ingredientInfo;
    const authorId = req.session.userInfo!.id;
    const ownerId =  req.session.userInfo!.id;

    const args = {ingredientTypeId, authorId, ownerId, brand, variety, name, altNames, description, image};
    assert(args, validIngredient);

    const ingredientRepo = new IngredientRepo();
    await ingredientRepo.create(args);

    return res.send({message: 'Ingredient created.'});
  }

  async update(req: Request, res: Response) {
    const id =               Number(req.body.ingredientInfo.id);
    const ingredientTypeId = Number(req.body.ingredientInfo.ingredientTypeId);
    const { brand, variety, name, altNames, description, image } = req.body.ingredientInfo;
    const authorId = req.session.userInfo!.id;
    const ownerId =  req.session.userInfo!.id;
    
    const args = {ingredientTypeId, authorId, ownerId, brand, variety, name, altNames, description, image};
    assert(args, validIngredient);

    const ingredientRepo = new IngredientRepo();
    await ingredientRepo.update({id, ...args});

    return res.send({message: 'Ingredient updated.'});
  }

  async deleteOne(req: Request, res: Response) {
    const id =      Number(req.body.id);
    const ownerId = req.session.userInfo!.id;

    const recipeIngredientRepo = new RecipeIngredientRepo();
    await recipeIngredientRepo.deleteByIngredientId(id);

    const ingredientRepo = new IngredientRepo();
    await ingredientRepo.deleteOne(id, ownerId);
    
    return res.send({message: 'Ingredient deleted.'});
  }
}
