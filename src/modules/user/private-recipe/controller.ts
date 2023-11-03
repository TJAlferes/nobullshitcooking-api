import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import type { Request, Response } from 'express';

import { ForbiddenException, NotFoundException} from '../../../utils/exceptions.js';
import { AwsS3PrivateUploadsClient } from '../../aws-s3/private-uploads/client.js';
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
    const recipes = await repo.overviewAll({author_id, owner_id});

    return res.json(recipes);
  },

  async viewOne(req: Request, res: Response) {
    const { recipe_id } = req.params;
    const author_id = req.session.user_id!;
    const owner_id  = req.session.user_id!;

    const repo = new RecipeRepo();
    const recipe = await repo.viewOneByRecipeId(recipe_id);
    if (!recipe) throw NotFoundException();
    if (author_id !== recipe.author_id) throw ForbiddenException();
    if (owner_id !== recipe.owner_id) throw ForbiddenException();
    
    return res.json(recipe);
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
    const recipe = await recipeRepo.viewOneByRecipeId(recipe_id);
    if (!recipe) throw NotFoundException();
    if (author_id !== recipe.author_id) throw ForbiddenException();
    if (owner_id !== recipe.owner_id) throw ForbiddenException();

    const updated_recipe = Recipe.update({
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
    await recipeRepo.update(updated_recipe);

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
    const recipe = await recipeRepo.viewOneByRecipeId(recipe_id);
    if (!recipe) throw NotFoundException();
    if (owner_id !== recipe.owner_id) throw ForbiddenException();

    const imageRepo = new ImageRepo();

    /*
    TO DO: delete from s3, image table, and recipe table
    (ON DELETE CASCADE will handle recipe_image, recipe_ingredient, etc.)
    TO DO: all 4 images AND all sizes
    "recipe",
    "recipe-cooking",
    "recipe-equipment",
    "recipe-ingredients"
    */
    const image = await imageRepo.viewOne(recipe.image_id);
    if (!image) throw NotFoundException();
    if (owner_id !== image.owner_id) throw ForbiddenException();

    await AwsS3PrivateUploadsClient.send(new DeleteObjectCommand({
      Bucket: 'nobsc-private-uploads',
      Key: `
        nobsc-private-uploads/recipe
        /${owner_id}
        /${recipe.images. image_filename}
      `
    }));
    //

    await recipeRepo.deleteOne({owner_id, recipe_id});

    return res.status(204);
  }
};
