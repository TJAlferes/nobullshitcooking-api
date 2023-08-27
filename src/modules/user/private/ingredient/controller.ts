import { Request, Response } from 'express';
import { assert }            from 'superstruct';

import { RecipeIngredientRepo } from '../../../recipe/required-ingredient/repo';
import { PrivateIngredientRepo }       from './repo';
import { PrivateIngredient }    from './model';

export const privateIngredientController = {
  async viewAll(req: Request, res: Response) {
    const owner_id  = req.session.userInfo!.id;

    const repo = new PrivateIngredientRepo();
    const rows = await repo.viewAll(owner_id);
    return res.send(rows);
  },

  async viewOne(req: Request, res: Response) {
    const ingredient_id = req.body.id;
    const owner_id      = req.session.userInfo!.id;

    const repo = new PrivateIngredientRepo();
    const row = await repo.viewOne({ingredient_id, owner_id});
    return res.send(row);
  },

  async create(req: Request, res: Response) {
    const {
      ingredient_brand,
      ingredient_variety,
      ingredient_name,
      alt_names,
      notes,
      image_id
    } = req.body.ingredientInfo;
    const ingredient_type_id = Number(req.body.ingredientInfo.ingredient_type_id);
    const owner_id           = req.session.userInfo!.id;

    const args = {
      ingredient_type_id,
      owner_id,
      ingredient_brand,
      ingredient_variety,
      ingredient_name,
      notes,
      image_id
    };

    const ingredient = PrivateIngredient.create(args).getDTO();
    const ingredientRepo = new PrivateIngredientRepo();
    await ingredientRepo.insert(ingredient);

    // validate alt_names
    //const ingredientAltNamesRepo = new IngredientAltNamesRepo();
    //await ingredientAltNamesRepo.insert(alt_names);

    return res.send({message: 'Ingredient created.'});
  },

  async update(req: Request, res: Response) {
    const {
      ingredient_id,
      ingredient_brand,
      ingredient_variety,
      ingredient_name,
      alt_names,
      notes,
      image_id
    } = req.body.ingredientInfo;
    const ingredient_type_id = Number(req.body.ingredientInfo.ingredient_type_id);
    const owner_id           = req.session.userInfo!.id;
    
    const args = {
      ingredient_id,
      ingredient_type_id,
      owner_id,
      ingredient_brand,
      ingredient_variety,
      ingredient_name,
      notes,
      image_id
    };

    const ingredient = PrivateIngredient.create(args).getDTO();
    const ingredientRepo = new PrivateIngredientRepo();
    await ingredientRepo.update(ingredient);

    // validate alt_names
    //const ingredientAltNamesRepo = new IngredientAltNamesRepo();
    //await ingredientAltNamesRepo.insert(alt_names);

    return res.send({message: 'Ingredient updated.'});
  },

  async deleteOne(req: Request, res: Response) {
    const ingredient_id = req.body.ingredient_id;
    const owner_id      = req.session.userInfo!.id;

    const recipeIngredientRepo = new RecipeIngredientRepo();
    await recipeIngredientRepo.deleteByIngredientId(ingredient_id);

    const privateIngredientRepo = new PrivateIngredientRepo();
    await privateIngredientRepo.deleteOne({ingredient_id, owner_id});
    
    return res.send({message: 'Ingredient deleted.'});
  }
};
