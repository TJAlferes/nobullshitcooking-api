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
    const title     = req.body.title;  // still use id ?
    const author_id = req.session.userInfo!.id;
    const owner_id  = req.session.userInfo!.id;

    const recipeRepo = new RecipeRepo();
    const row = await recipeRepo.viewOne({title, author_id, owner_id});
    return res.send(row);
  }

  async create(req: Request, res: Response) {
    const {
      title,
      description,
      active_time,
      total_time,
      directions,
      required_methods,
      required_equipment,
      required_ingredients,
      required_subrecipes,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage,
      video
    } = req.body.recipeInfo;
    const recipe_type_id = Number(req.body.recipeInfo.recipe_type_id);
    const cuisine_id     = Number(req.body.recipeInfo.cuisine_id);
    const author_id      = req.session.userInfo!.id;
    const owner_id       = req.session.userInfo!.id;

    const creatingRecipe = {
      recipe_type_id,
      cuisine_id,
      author_id,
      owner_id,
      title,
      description,
      active_time,
      total_time,
      directions,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage,
      video
    };
    assert(creatingRecipe, validRecipe);

    const recipeRepo    = new RecipeRepo();
    const recipeService = new RecipeService(recipeRepo);
    await recipeService.create(creatingRecipe);

    const recipeMethodRepo    = new RecipeMethodRepo();
    const recipeMethodService = new RecipeMethodService(recipeMethodRepo);
    await recipeMethodService.create(required_methods);

    const recipeEquipmentRepo    = new RecipeEquipmentRepo();
    const recipeEquipmentService = new RecipeEquipmentService(recipeEquipmentRepo);
    await recipeEquipmentService.create(required_equipment);

    const recipeIngredientRepo    = new RecipeIngredientRepo();
    const recipeIngredientService = new RecipeIngredientService(recipeIngredientRepo);
    await recipeIngredientService.create(required_ingredients);

    const recipeSubrecipeRepo    = new RecipeSubrecipeRepo();
    const recipeSubrecipeService = new RecipeSubrecipeService(recipeSubrecipeRepo);
    await recipeSubrecipeService.create(required_subrecipes);

    const imageRepo    = new ImageRepo();
    const imageService = new ImageService(imageRepo);
    await imageService.create({});

    return res.send({message: 'Recipe created.'});
  }

  async update(req: Request, res: Response) {
    const id =           Number(req.body.recipeInfo.id);
    const {
      recipe_id,
      title,
      description,
      active_time,
      total_time,
      directions,
      required_methods,
      required_equipment,
      required_ingredients,
      required_subrecipes,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage,
      video
    }= req.body.recipeInfo;
    const recipe_type_id = Number(req.body.recipeInfo.recipe_type_id);
    const cuisine_id     = Number(req.body.recipeInfo.cuisine_id);
    const author_id      = req.session.userInfo!.id;
    const owner_id       = req.session.userInfo!.id;

    if (!recipe_id) return res.send({message: 'Invalid recipe ID!'});  // is this needed?

    const updatingRecipe = {
      recipe_id,
      recipe_type_id,
      cuisine_id,
      author_id,
      owner_id,
      title,
      description,
      active_time,
      total_time,
      directions,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage,
      video
    };
    assert(updatingRecipe, validRecipe);

    const recipeRepo    = new RecipeRepo();
    const recipeService = new RecipeService(recipeRepo);
    await recipeService.update(updatingRecipe);

    const recipeMethodRepo    = new RecipeMethodRepo();
    const recipeMethodService = new RecipeMethodService(recipeMethodRepo);
    await recipeMethodService.update(required_methods);

    const recipeEquipmentRepo    = new RecipeEquipmentRepo();
    const recipeEquipmentService = new RecipeEquipmentService(recipeEquipmentRepo);
    await recipeEquipmentService.update(required_equipment);

    const recipeIngredientRepo    = new RecipeIngredientRepo();
    const recipeIngredientService = new RecipeIngredientService(recipeIngredientRepo);
    await recipeIngredientService.update(required_ingredients);

    const recipeSubrecipeRepo    = new RecipeSubrecipeRepo();
    const recipeSubrecipeService = new RecipeSubrecipeService(recipeSubrecipeRepo);
    await recipeSubrecipeService.update(required_subrecipes);

    const imageRepo    = new ImageRepo();
    const imageService = new ImageService(imageRepo);
    await imageService.update({});

    return res.send({message: 'Recipe updated.'});
  }

  async deleteOne(req: Request, res: Response) {
    // transaction(s)?: TO DO: TRIGGERS
    const recipe_id = req.body.recipe_id;
    const owner_id  = req.session.userInfo!.id;

    //const favoriteRecipeRepo = new FavoriteRecipeRepo();
    //const savedRecipeRepo    = new SavedRecipeRepo();
    const recipeEquipmentRepo  = new RecipeEquipmentRepo();
    const recipeIngredientRepo = new RecipeIngredientRepo();
    const recipeMethodRepo     = new RecipeMethodRepo();
    const recipeSubrecipeRepo  = new RecipeSubrecipeRepo();
    await Promise.all([
      //favoriteRecipeRepo.deleteAllByRecipeId(id),
      //savedRecipeRepo.deleteAllByRecipeId(id),
      recipeEquipmentRepo.deleteByRecipeId(recipe_id),
      recipeIngredientRepo.deleteByRecipeId(recipe_id),
      recipeMethodRepo.deleteByRecipeId(recipe_id),
      recipeSubrecipeRepo.deleteByRecipeId(recipe_id),
      recipeSubrecipeRepo.deleteBySubrecipeId(recipe_id)
    ]);

    // TO DO: what about deleting from plans???
    const recipeRepo = new RecipeRepo();
    await recipeRepo.deleteOneByOwnerId({recipe_id, owner_id});

    return res.send({message: 'Recipe deleted.'});
  }
}
