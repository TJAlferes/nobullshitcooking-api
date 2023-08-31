import { Request, Response } from 'express';

import { RecipeEquipmentRepo }     from '../../../recipe/required-equipment/repo';
import { RecipeEquipmentService }  from '../../../recipe/required-equipment/service';
import { RecipeIngredientRepo }    from '../../../recipe/required-ingredient/repo';
import { RecipeIngredientService } from '../../../recipe/required-ingredient/service';
import { RecipeMethodRepo }        from '../../../recipe/required-method/repo';
import { RecipeMethodService }     from '../../../recipe/required-method/service';
import { RecipeSubrecipeRepo }     from '../../../recipe/required-subrecipe/repo';
import { RecipeSubrecipeService }  from '../../../recipe/required-subrecipe/service';
//import { PublicRecipeRepo }        from './repo';
import { RecipeRepo }              from '../../../recipe/repo';
import { RecipeService }           from '../../../recipe/service';

// MERGE WITH recipeController??? DON'T if possible
export const publicRecipeController = {
  async viewAllTitles(req: Request, res: Response) {
    const repo = new PublicRecipeRepo();
    const rows = await repo.viewAllTitles();

    return res.send(rows);
  },  // for Next.js getStaticPaths

  async overviewAll(req: Request, res: Response) {
    const owner_id = req.session.userInfo!.id;

    const recipeRepo = new PublicRecipeRepo();
    const recipeService = new RecipeService(recipeRepo);
    const rows = await RecipeService.viewAll(author_id);
    //const rows = await recipeRepo.viewAll({author_id, owner_id});

    return res.send(rows);
  },

  async viewOne(req: Request, res: Response) {
    const title     = unslugify(req.params.title);
    const author    = unslugify(req.params.usename);
    const author_id = req.session.userInfo!.id;
    const owner_id  = 1;

    const recipeRepo = new PublicRecipeRepo()
    const row = await recipeRepo.viewOne({title, authorId, ownerId});
    
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
    const owner_id       = 1;

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

    const recipeRepo    = new PublicRecipeRepo();
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
    const id =           Number(req.body.recipeInfo.id);
    const recipeTypeId = Number(req.body.recipeInfo.recipeTypeId);
    const cuisineId =    Number(req.body.recipeInfo.cuisineId);
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
    const author_id      = req.session.userInfo!.id;
    const owner_id       = 1;

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

    const recipeRepo    = new PublicRecipeRepo();
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

  async disownOne(req: Request, res: Response) {
    const recipe_id = req.body.recipe_id;
    const owner_id  = req.session.userInfo!.id;

    const repo = new PublicRecipeRepo();
    await repo.disownOne({recipe_id, owner_id});

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
