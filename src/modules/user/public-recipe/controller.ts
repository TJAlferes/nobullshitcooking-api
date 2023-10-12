import type { Request, Response } from 'express';

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
import { UserRepo }                from '../repo';
import { PublicRecipeService }     from './service';

export const publicRecipeController = {
  async overviewAll(req: Request, res: Response) {
    const author_id = req.session.user_id!;
    const owner_id  = NOBSC_USER_ID

    const repo = new RecipeRepo();
    const rows = await repo.overviewAll({author_id, owner_id});

    return res.json(rows);
  },

  async viewOne(req: Request, res: Response) {
    const author = unslugify(req.params.usename);

    const userRepo = new UserRepo();
    const user = await userRepo.getByUsername(author);
    if (!user) return res.status(404);

    const title = unslugify(req.params.title);
    const author_id = user.user_id;
    const owner_id  = NOBSC_USER_ID;

    const recipeRepo = new RecipeRepo()
    const row = await recipeRepo.viewOneByTitle({title, author_id, owner_id});
    
    return res.json(row);
  },

  async edit(req: Request, res: Response) {
    const { recipe_id } = req.params;
    const author_id = req.session.user_id!;
    const owner_id  = NOBSC_USER_ID;

    const repo = new RecipeRepo();
    const row = await repo.viewExistingRecipeToEdit({recipe_id, author_id, owner_id});

    return res.json(row);
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
    } = req.body;
    const recipe_type_id = Number(req.body.recipe_type_id);
    const cuisine_id     = Number(req.body.cuisine_id);
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

    const recipeMethodService = new RecipeMethodService(new RecipeMethodRepo());
    await recipeMethodService.bulkCreate(required_methods);

    const recipeEquipmentService = new RecipeEquipmentService(new RecipeEquipmentRepo());
    await recipeEquipmentService.bulkCreate(required_equipment);

    const recipeIngredientService = new RecipeIngredientService(new RecipeIngredientRepo());
    await recipeIngredientService.bulkCreate(required_ingredients);

    const recipeSubrecipeService = new RecipeSubrecipeService(new RecipeSubrecipeRepo());
    await recipeSubrecipeService.bulkCreate(required_subrecipes);

    const recipeImageService = new RecipeImageService({
      imageRepo: new ImageRepo(),
      recipeImageRepo: new RecipeImageRepo()
    });
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

    return res.status(201);
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
    const recipe_type_id = Number(req.body.recipe_type_id);
    const cuisine_id     = Number(req.body.cuisine_id);
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

    const recipeMethodService = new RecipeMethodService(new RecipeMethodRepo());
    await recipeMethodService.bulkUpdate(required_methods);  // TO DO: fix all these

    const recipeEquipmentService = new RecipeEquipmentService(new RecipeEquipmentRepo());
    await recipeEquipmentService.bulkUpdate(required_equipment);

    const recipeIngredientService = new RecipeIngredientService(new RecipeIngredientRepo());
    await recipeIngredientService.bulkUpdate(required_ingredients);

    const recipeSubrecipeService = new RecipeSubrecipeService(new RecipeSubrecipeRepo());
    await recipeSubrecipeService.bulkUpdate(required_subrecipes);

    const recipeImageService = new RecipeImageService({
      imageRepo: new ImageRepo(),
      recipeImageRepo: new RecipeImageRepo()
    });
    await recipeImageService.bulkUpdate({
      author_id,
      owner_id,
      uploaded_images: [
        recipe_image,
        equipment_image,
        ingredients_image,
        cooking_image
      ]
    });

    return res.status(204);
  },

  async unattributeOne(req: Request, res: Response) {
    const { recipe_id } = req.params;
    const author_id = req.session.user_id!;

    const repo = new RecipeRepo();
    await repo.unattributeOne({author_id, recipe_id});

    return res.status(204);
  }
};

// TO DO: move to shared
function unslugify(title: string) {
  return title
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
