import { Request, Response } from 'express';
import { assert }            from 'superstruct';

import {
  RecipeRepo,
  RecipeEquipmentRepo,
  RecipeIngredientRepo,
  RecipeMethodRepo,
  RecipeSubrecipeRepo
} from '../../../repos/mysql';
import { RecipeService } from '../../../../app/services';
import { validRecipe }   from '../../../lib/validations';  // TO DO: use domain

export class UserPrivateRecipeController {
  async viewAll(req: Request, res: Response) {
    const author_id = req.session.userInfo!.id;
    const owner_id  = req.session.userInfo!.id;

    const recipeRepo = new RecipeRepo();
    const rows = await recipeRepo.viewAll({author_id, owner_id});
    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    const title =    req.body.title;  // still use id ?
    const author_id = req.session.userInfo!.id;
    const owner_id =  req.session.userInfo!.id;

    const recipeRepo = new RecipeRepo();
    const row = await recipeRepo.viewOne({title, author_id, owner_id});
    return res.send(row);
  }

  async create(req: Request, res: Response) {
    const recipeTypeId = Number(req.body.recipeInfo.recipeTypeId);
    const cuisineId =    Number(req.body.recipeInfo.cuisineId);
    const {
      title,
      description,
      activeTime,
      totalTime,
      directions,
      methods,
      equipment,
      ingredients,
      subrecipes,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage,
      video
    } = req.body.recipeInfo;
    const author_id = req.session.userInfo!.id;
    const owner_id =  req.session.userInfo!.id;

    const creatingRecipe = {
      recipeTypeId,
      cuisineId,
      author_id,
      owner_id,
      title,
      description,
      activeTime,
      totalTime,
      directions,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage,
      video
    };
    assert(creatingRecipe, validRecipe);

    const recipeRepo =           new RecipeRepo();
    const recipeMethodRepo =     new RecipeMethodRepo();
    const recipeEquipmentRepo =  new RecipeEquipmentRepo();
    const recipeIngredientRepo = new RecipeIngredientRepo();
    const recipeSubrecipeRepo =  new RecipeSubrecipeRepo();
    await createRecipeService({
      creatingRecipe,

      methods,
      equipment,
      ingredients,
      subrecipes,

      recipeRepo,
      recipeMethodRepo,
      recipeEquipmentRepo,
      recipeIngredientRepo,
      recipeSubrecipeRepo
    });

    return res.send({message: 'Recipe created.'});
  }

  async update(req: Request, res: Response) {
    const id =           Number(req.body.recipeInfo.id);
    const recipeTypeId = Number(req.body.recipeInfo.recipeTypeId);
    const cuisineId =    Number(req.body.recipeInfo.cuisineId);
    const {
      title,
      description,
      activeTime,
      totalTime,
      directions,
      methods,
      equipment,
      ingredients,
      subrecipes,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage,
      video
    }= req.body.recipeInfo;
    const author_id = req.session.userInfo!.id;
    const owner_id =  req.session.userInfo!.id;
    if (!id) return res.send({message: 'Invalid recipe ID!'});

    const updatingRecipe = {
      recipeTypeId,
      cuisineId,
      author_id,
      owner_id,
      title,
      description,
      activeTime,
      totalTime,
      directions,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage,
      video
    };
    assert(updatingRecipe, validRecipe);

    const recipeRepo =           new RecipeRepo();
    const recipeMethodRepo =     new RecipeMethodRepo();
    const recipeEquipmentRepo =  new RecipeEquipmentRepo();
    const recipeIngredientRepo = new RecipeIngredientRepo();
    const recipeSubrecipeRepo =  new RecipeSubrecipeRepo();
    await updateRecipeService({
      recipeId: id,
      updatingRecipe,

      methods,
      equipment,
      ingredients,
      subrecipes,

      recipeRepo,
      recipeMethodRepo,
      recipeEquipmentRepo,
      recipeIngredientRepo,
      recipeSubrecipeRepo
    });

    return res.send({message: 'Recipe updated.'});
  }

  async deleteOne(req: Request, res: Response) {
    // transaction(s)?: TO DO: TRIGGERS
    const id =       Number(req.body.id);
    const owner_id =  req.session.userInfo!.id;

    //const favoriteRecipeRepo =   new FavoriteRecipeRepo();
    //const savedRecipeRepo =      new SavedRecipeRepo();
    const recipeEquipmentRepo =  new RecipeEquipmentRepo();
    const recipeIngredientRepo = new RecipeIngredientRepo();
    const recipeMethodRepo =     new RecipeMethodRepo();
    const recipeSubrecipeRepo =  new RecipeSubrecipeRepo();
    await Promise.all([
      //favoriteRecipeRepo.deleteAllByRecipeId(id),
      //savedRecipeRepo.deleteAllByRecipeId(id),
      recipeEquipmentRepo.deleteByRecipeId(id),
      recipeIngredientRepo.deleteByRecipeId(id),
      recipeMethodRepo.deleteByRecipeId(id),
      recipeSubrecipeRepo.deleteByRecipeId(id),
      recipeSubrecipeRepo.deleteBySubrecipeId(id)
    ]);

    // TO DO: what about deleting from plans???
    const recipeRepo = new RecipeRepo();
    await recipeRepo.deleteOneByOwnerId(id, owner_id);

    return res.send({message: 'Recipe deleted.'});
  }
}
