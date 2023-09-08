import { Request, Response } from 'express';

import { IngredientAltNameRepo }    from '../../../ingredient/alt-name/repo';
import { IngredientAltNameService } from '../../../ingredient/alt-name/service';
import { Ingredient }               from '../../../ingredient/model';
import { IngredientRepo }           from '../../../ingredient/repo';

export const privateIngredientController = {
  async viewAll(req: Request, res: Response) {
    const owner_id  = req.session.userInfo!.user_id;

    const repo = new IngredientRepo();
    const rows = await repo.viewAll(owner_id);

    return res.send(rows);
  },

  async viewOne(req: Request, res: Response) {
    const ingredient_id = req.body.id;
    const owner_id      = req.session.userInfo!.user_id;

    const repo = new IngredientRepo();
    const row = await repo.viewOne({owner_id, ingredient_id});

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
    const owner_id           = req.session.userInfo!.user_id;

    const ingredient = Ingredient.create({
      ingredient_type_id,
      owner_id,
      ingredient_brand,
      ingredient_variety,
      ingredient_name,
      notes,
      image_id
    }).getDTO();
    const ingredientRepo = new IngredientRepo();
    await ingredientRepo.insert(ingredient);

    if (alt_names.length) {
      const ingredientAltNameRepo = new IngredientAltNameRepo();
      const { create } = new IngredientAltNameService(ingredientAltNameRepo);
      await create({ingredient_id: ingredient.ingredient_id, alt_names});
    }

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
    const owner_id           = req.session.userInfo!.user_id;

    const ingredient = Ingredient.update({
      ingredient_id,
      ingredient_type_id,
      owner_id,
      ingredient_brand,
      ingredient_variety,
      ingredient_name,
      notes,
      image_id
    }).getDTO();
    const ingredientRepo = new IngredientRepo();
    await ingredientRepo.update(ingredient);

    const ingredientAltNameRepo = new IngredientAltNameRepo();
    const { update } = new IngredientAltNameService(ingredientAltNameRepo);
    await update({ingredient_id, alt_names});

    return res.send({message: 'Ingredient updated.'});
  },

  async deleteOne(req: Request, res: Response) {
    const ingredient_id = req.body.ingredient_id;
    const owner_id      = req.session.userInfo!.user_id;

    const repo = new IngredientRepo();
    await repo.deleteOne({ingredient_id, owner_id});
    
    return res.send({message: 'Ingredient deleted.'});
  }
};
