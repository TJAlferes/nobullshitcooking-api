import { Request, Response } from 'express';

import { RecipeEquipmentRepo }  from '../../../recipe/required-equipment/repo';
import { RecipeIngredientRepo } from '../../../recipe/required-ingredient/repo';
import { RecipeMethodRepo }     from '../../../recipe/required-method/repo';
import { RecipeSubrecipeRepo }  from '../../../recipe/required-subrecipe/repo';
import { Recipe }               from '../../../recipe/model';
import { PrivateRecipeRepo }    from './repo';
import { RecipeService }        from '../../../recipe/service';

// MERGE WITH recipeController???
export const privateRecipeController = {
  async overviewAll(req: Request, res: Response) {
    const author_id = req.session.userInfo!.id;
    const owner_id  = req.session.userInfo!.id;

    const repo = new RecipeRepo();
    const rows = await repo.overviewAll({author_id, owner_id});

    return res.send(rows);
  },

  async viewOne(req: Request, res: Response) {
    const title     = unslugify(req.params.title);
    const author    = unslugify(req.params.usename);
    const author_id = req.session.userInfo!.user_id;
    const owner_id  = req.session.userInfo!.user_id;

    const repo = new PrivateRecipeRepo();
    const row = await repo.viewOne({title, owner_id});
    
    return res.send(row);
  },

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
      recipe_image,
      equipment_image,
      ingredients_image,
      cooking_image
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

      recipe_image,
      equipment_image,
      ingredients_image,
      cooking_image
    };

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
  },

  async update(req: Request, res: Response) {
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
      recipe_image,
      equipment_image,
      ingredients_image,
      cooking_image
    }= req.body.recipeInfo;
    const recipe_type_id = Number(req.body.recipeInfo.recipe_type_id);
    const cuisine_id     = Number(req.body.recipeInfo.cuisine_id);
    const author_id      = req.session.userInfo!.user_id;
    const owner_id       = req.session.userInfo!.user_id;

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

      recipe_image,
      equipment_image,
      ingredients_image,
      cooking_image
    };

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
  },

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
};

// TO DO: move to shared
function unslugify(title: string) {
  return title
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}