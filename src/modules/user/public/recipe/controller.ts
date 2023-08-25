import { Request, Response } from 'express';
import { assert }            from 'superstruct';

import { RecipeEquipmentRepo }  from '../../../recipe/required-equipment/repo';
import { RecipeIngredientRepo } from '../../../recipe/required-ingredient/repo';
import { RecipeMethodRepo }     from '../../../recipe/required-method/repo';
import { RecipeSubrecipeRepo }  from '../../../recipe/required-subrecipe/repo';
import { Recipe }               from '../../../recipe/model';
import { RecipeRepo }           from '../../../recipe/repo';
import { RecipeService }        from '../../../recipe/service';

export const userPublicRecipeController = {
  async viewAll(req: Request, res: Response) {
    const author_id = req.session.userInfo!.id;
    const owner_id  = 1;  // TO DO: move and change

    const recipeRepo = new RecipeRepo();
    // const recipeService = new RecipeService(recipeRepo);
    //const rows = await RecipeService.viewAll(author_id);
    const rows = await recipeRepo.viewAll({author_id, owner_id});

    return res.send(rows);
  },

  async viewOne(req: Request, res: Response) {
    const title = unslugify(req.params.title);
    const author = unslugify(req.params.usename);
    //const title =    req.body.title;
    //const authorId = req.session.userInfo!.id;
    const ownerId =  1;

    const recipeRepo = new RecipeRepo()
    const [ row ] = await recipeRepo.viewOne(title, authorId, ownerId);
    
    return res.send(row);
  },

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
    const authorId = req.session.userInfo!.id;
    const ownerId =  1;

    const creatingRecipe = {
      recipeTypeId,
      cuisineId,
      authorId,
      ownerId,
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
  },

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
    const authorId = req.session.userInfo!.id;
    const ownerId =  1;
    if (!id) return res.send({message: 'Invalid recipe ID!'});

    const updatingRecipe = {
      recipeTypeId,
      cuisineId,
      authorId,
      ownerId,
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
  },

  async disownOne(req: Request, res: Response) {
    const id =       Number(req.body.id);
    const authorId = req.session.userInfo!.id;

    const recipeRepo = new RecipeRepo();
    await recipeRepo.disownOneByAuthorId(id, authorId);

    return res.send({message: 'Recipe disowned.'});
  }
};

// TO DO: move to shared
function unslugify(title: string) {
  return title
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}