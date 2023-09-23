import { Request, Response } from 'express';

import { EquipmentRepo }           from '../../equipment/repo';
import { IngredientRepo }          from '../../ingredient/repo';
import { ImageRepo }               from '../../image/repo';
import { RecipeImageRepo }         from '../../recipe/image/repo';
import { RecipeImageService }      from '../../recipe/image/service';
import { RecipeEquipmentRepo }     from '../../recipe/required-equipment/repo';
import { RecipeEquipmentService }  from '../../recipe/required-equipment/service';
import { RecipeIngredientRepo }    from '../../recipe/required-ingredient/repo';
import { RecipeIngredientService } from '../../recipe/required-ingredient/service';
import { RecipeMethodRepo }        from '../../recipe/required-method/repo';
import { RecipeMethodService }     from '../../recipe/required-method/service';
import { RecipeSubrecipeRepo }     from '../../recipe/required-subrecipe/repo';
import { RecipeSubrecipeService }  from '../../recipe/required-subrecipe/service';
import { Recipe }                  from '../../recipe/model';
import { RecipeRepo }              from '../../recipe/repo';
import { NOBSC_USER_ID }           from '../../shared/model';
import { PublicRecipeService }     from './service';

export const publicRecipeController = {
  async overviewAll(req: Request, res: Response) {
    const author_id = req.session.user_id!;
    const owner_id  = NOBSC_USER_ID

    const repo = new RecipeRepo();
    const rows = await repo.overviewAll({author_id, owner_id});

    return res.send(rows);
  },

  async viewOne(req: Request, res: Response) {
    const title     = unslugify(req.params.title);
    const author    = unslugify(req.params.usename);  // hmm...
    const author_id = req.session.user_id!;
    const owner_id  = NOBSC_USER_ID;

    const repo = new RecipeRepo()
    const row = await repo.viewOneByTitle({title, author_id, owner_id});
    
    return res.send(row);
  },

  async edit(req: Request, res: Response) {
    const recipe_id = req.body.recipe_id;
    const author_id = req.session.user_id!;
    const owner_id  = NOBSC_USER_ID;

    const repo = new RecipeRepo();
    const rows = await repo.viewExistingRecipeToEdit({recipe_id, author_id, owner_id});

    return res.send(rows);
  },

  async viewAllTitles(req: Request, res: Response) {
    const repo = new RecipeRepo();
    const rows = await repo.viewPublicAllTitles();

    return res.send(rows);
  },  // for Next.js getStaticPaths

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
    } = req.body;
    const recipe_type_id = Number(req.body.recipeInfo.recipe_type_id);
    const cuisine_id     = Number(req.body.recipeInfo.cuisine_id);
    const author_id      = req.session.user_id!;
    const owner_id       = NOBSC_USER_ID;

    const equipmentRepo  = new EquipmentRepo();
    const ingredientRepo = new IngredientRepo();
    const recipeRepo     = new RecipeRepo();
    const { checkForPrivateContent } = new PublicRecipeService({
      equipmentRepo,
      ingredientRepo,
      recipeRepo
    });
    // ALSO CHECK FOR PRIVATE IMAGES???
    await checkForPrivateContent({
      required_equipment,
      required_ingredients,
      required_subrecipes,
    });  // important

    const recipe = Recipe.create({
      recipe_type_id,
      cuisine_id,
      author_id,
      owner_id,
      title,
      description,
      active_time,
      total_time,
      directions
    }).getDTO();
    await recipeRepo.insert(recipe);

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

    const imageRepo          = new ImageRepo();
    const recipeImageRepo    = new RecipeImageRepo();
    const recipeImageService = new RecipeImageService({imageRepo, recipeImageRepo});
    await recipeImageService.bulkCreate({
      recipe_id: recipe.recipe_id,
      author_id,
      owner_id,
      uploaded_images: [
        recipe_image,
        equipment_image,
        ingredients_image,
        cooking_image
      ]
    });

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
    }= req.body;
    const recipe_type_id = Number(req.body.recipeInfo.recipe_type_id);
    const cuisine_id     = Number(req.body.recipeInfo.cuisine_id);
    const author_id      = req.session.user_id!;
    const owner_id       = NOBSC_USER_ID;

    const equipmentRepo  = new EquipmentRepo();
    const ingredientRepo = new IngredientRepo();
    const recipeRepo     = new RecipeRepo();
    const { checkForPrivateContent } = new PublicRecipeService({
      equipmentRepo,
      ingredientRepo,
      recipeRepo
    });
    // ALSO CHECK FOR PRIVATE IMAGES???
    await checkForPrivateContent({
      required_equipment,
      required_ingredients,
      required_subrecipes,
    });  // important

    const recipe = Recipe.update({
      recipe_id,
      recipe_type_id,
      cuisine_id,
      author_id,
      owner_id,
      title,
      description,
      active_time,
      total_time,
      directions
    }).getDTO();
    await recipeRepo.update(recipe);

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

    const imageRepo          = new ImageRepo();
    const recipeImageRepo    = new RecipeImageRepo();
    const recipeImageService = new RecipeImageService({imageRepo, recipeImageRepo});
    await recipeImageService.bulkUpdate({
      recipe_id: recipe.recipe_id,
      author_id,
      owner_id,
      uploaded_images: [
        recipe_image,
        equipment_image,
        ingredients_image,
        cooking_image
      ]
    });

    return res.send({message: 'Recipe updated.'});
  },

  async disownOne(req: Request, res: Response) {
    const recipe_id = req.body.recipe_id;
    const author_id = req.session.user_id!;

    const repo = new RecipeRepo();
    await repo.disownOne({author_id, recipe_id});

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
