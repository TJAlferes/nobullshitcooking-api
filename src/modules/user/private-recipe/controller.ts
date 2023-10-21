import type { Request, Response } from 'express';

import { ImageRepo }               from '../../image/repo.js';
import { RecipeImageRepo }         from '../../recipe/image/repo.js';
import { RecipeImageService }      from '../../recipe/image/service.js';
import { RecipeEquipmentRepo }     from '../../recipe/required-equipment/repo.js';
import { RecipeEquipmentService }  from '../../recipe/required-equipment/service.js';
import { RecipeIngredientRepo }    from '../../recipe/required-ingredient/repo.js';
import { RecipeIngredientService } from '../../recipe/required-ingredient/service.js';
import { RecipeMethodRepo }        from '../../recipe/required-method/repo.js';
import { RecipeMethodService }     from '../../recipe/required-method/service.js';
import { RecipeSubrecipeRepo }     from '../../recipe/required-subrecipe/repo.js';
import { RecipeSubrecipeService }  from '../../recipe/required-subrecipe/service.js';
import { Recipe }                  from '../../recipe/model.js';
import { RecipeRepo }              from '../../recipe/repo.js';

export const privateRecipeController = {
  async overviewAll(req: Request, res: Response) {
    const author_id = req.session.user_id!;
    const owner_id  = req.session.user_id!;

    const repo = new RecipeRepo();
    const rows = await repo.overviewAll({author_id, owner_id});

    return res.json(rows);
  },

  async viewOne(req: Request, res: Response) {
    const { recipe_id } = req.params;
    const author_id = req.session.user_id!;
    const owner_id  = req.session.user_id!;

    const repo = new RecipeRepo();
    const row = await repo.viewOneByRecipeId({recipe_id, author_id, owner_id});
    
    return res.json(row);
  },

  async edit(req: Request, res: Response) {
    const { recipe_id } = req.params;
    const author_id = req.session.user_id!;
    const owner_id  = req.session.user_id!;

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
    const owner_id       = req.session.user_id!;

    const recipeRepo = new RecipeRepo();
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
    const owner_id       = req.session.user_id!;

    const recipeRepo = new RecipeRepo();
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
    await recipeMethodService.bulkUpdate(required_methods);

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
      //recipe_id: recipe.recipe_id,
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

  async deleteOne(req: Request, res: Response) {
    const { recipe_id } = req.params;
    const owner_id = req.session.user_id!;

    const recipeRepo = new RecipeRepo();
    await recipeRepo.deleteOne({owner_id, recipe_id});

    return res.status(204);
  }
};
