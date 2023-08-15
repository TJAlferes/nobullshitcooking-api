import { Request, Response } from 'express';
import { assert }            from 'superstruct';

import { IngredientRepo, RecipeIngredientRepo } from '../../../repos/mysql';
import { validIngredient }                      from '../../../lib/validations';

export class UserIngredientController {
  async viewAll(req: Request, res: Response) {
    const author_id = req.session.userInfo!.id;
    const owner_id  = req.session.userInfo!.id;

    const ingredientRepo = new IngredientRepo();
    const rows = await ingredientRepo.viewAll({author_id, owner_id});
    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    const ingredient_id = req.body.id;
    const author_id     = req.session.userInfo!.id;
    const owner_id      = req.session.userInfo!.id;

    const ingredientRepo = new IngredientRepo();
    const row = await ingredientRepo.viewOne({ingredient_id, author_id, owner_id});
    return res.send(row);
  }

  async create(req: Request, res: Response) {
    const {
      ingredient_brand,
      ingredient_variety,
      ingredient_name,
      alt_names,
      description,
      image_id
    } = req.body.ingredientInfo;
    const ingredient_type_id = Number(req.body.ingredientInfo.ingredient_type_id);
    const author_id = req.session.userInfo!.id;
    const owner_id  = req.session.userInfo!.id;

    const args = {
      ingredient_type_id,
      author_id,
      owner_id,
      ingredient_brand,
      ingredient_variety,
      ingredient_name,
      description,
      image_id
    };
    assert(args, validIngredient);

    const ingredientRepo = new IngredientRepo();
    await ingredientRepo.insert(args);

    // validate alt_names
    //await ingredientAltNamesRepo.insert(alt_names);

    return res.send({message: 'Ingredient created.'});
  }

  async update(req: Request, res: Response) {
    const {
      ingredient_id,
      ingredient_brand,
      ingredient_variety,
      ingredient_name,
      alt_names,
      description,
      image_id
    } = req.body.ingredientInfo;
    const ingredient_type_id = Number(req.body.ingredientInfo.ingredient_type_id);
    const author_id = req.session.userInfo!.id;
    const owner_id  = req.session.userInfo!.id;
    
    const args = {
      ingredient_type_id,
      author_id,
      owner_id,
      ingredient_brand,
      ingredient_variety,
      ingredient_name,
      description,
      image_id
    };
    assert(args, validIngredient);

    const ingredientRepo = new IngredientRepo();
    await ingredientRepo.update(args);

    // validate alt_names
    //await ingredientAltNamesRepo.insert(alt_names);

    return res.send({message: 'Ingredient updated.'});
  }

  async deleteOne(req: Request, res: Response) {
    const ingredient_id = req.body.ingredient_id;
    const owner_id      = req.session.userInfo!.id;

    const recipeIngredientRepo = new RecipeIngredientRepo();
    await recipeIngredientRepo.deleteByIngredientId(ingredient_id);

    const ingredientRepo = new IngredientRepo();
    await ingredientRepo.deleteOne({ingredient_id, owner_id});
    
    return res.send({message: 'Ingredient deleted.'});
  }
}
