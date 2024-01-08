import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import type { Request, Response, NextFunction } from 'express';

import { ForbiddenException, NotFoundException} from '../../../utils/exceptions';
import { AwsS3PrivateUploadsClient as s3Client } from '../../aws-s3/private-uploads/client';
import { ImageRepo } from '../../image/repo';
import { RecipeImageRepo } from '../../recipe/image/repo';
import { RecipeImageService } from '../../recipe/image/service';
import { RecipeEquipmentRepo } from '../../recipe/required-equipment/repo';
import { RecipeEquipmentService } from '../../recipe/required-equipment/service';
import { RecipeIngredientRepo } from '../../recipe/required-ingredient/repo';
import { RecipeIngredientService } from '../../recipe/required-ingredient/service';
import { RecipeMethodRepo } from '../../recipe/required-method/repo';
import { RecipeMethodService } from '../../recipe/required-method/service';
import { RecipeSubrecipeRepo } from '../../recipe/required-subrecipe/repo';
import { RecipeSubrecipeService } from '../../recipe/required-subrecipe/service';
import { Recipe } from '../../recipe/model';
import { RecipeRepo } from '../../recipe/repo';

export const privateRecipeController = {
  async overviewAll(req: Request, res: Response) {
    const author_id = req.session.user_id!;
    const owner_id  = req.session.user_id!;

    const repo = new RecipeRepo();
    const recipes = await repo.overviewAll({author_id, owner_id});

    return res.status(200).json(recipes);
  },

  async viewOne(req: Request, res: Response) {
    const { recipe_id } = req.params;
    const author_id = req.session.user_id!;
    const owner_id  = req.session.user_id!;

    const repo = new RecipeRepo();
    const recipe = await repo.viewOneByRecipeId(recipe_id);
    if (!recipe) throw new NotFoundException();
    if (author_id !== recipe.author_id) throw new ForbiddenException();
    if (owner_id !== recipe.owner_id) throw new ForbiddenException();
    
    return res.status(200).json(recipe);
  },

  async edit(req: Request, res: Response) {
    const { recipe_id } = req.params;
    const author_id = req.session.user_id!;
    const owner_id  = req.session.user_id!;

    const repo = new RecipeRepo();
    const recipe = await repo.viewOneToEdit(recipe_id);
    if (!recipe) throw new NotFoundException();
    if (author_id !== recipe.author_id) throw new ForbiddenException();
    if (owner_id !== recipe.owner_id) throw new ForbiddenException();

    return res.status(200).json(recipe);
  },

  async create(req: Request, res: Response, next: NextFunction) {
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

    // NOTE: MySQL does not support nested transactions
    // So here's what we do instead: we have our own "rollback" logic:
    // If anything below fails, we call recipeRepo.deleteOne
    // (the other tables will then be taken care of by their ON DELETE CASCADE)

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
    try {
      await recipeMethodService.bulkCreate({
        recipe_id: recipe.recipe_id,
        required_methods
      });
    } catch (err) {
      await recipeRepo.deleteOne({owner_id, recipe_id: recipe.recipe_id});
      next(err);
    }

    const recipeEquipmentService = new RecipeEquipmentService(new RecipeEquipmentRepo());
    try {
      await recipeEquipmentService.bulkCreate({
        recipe_id: recipe.recipe_id,
        required_equipment
      });
    } catch (err) {
      await recipeRepo.deleteOne({owner_id, recipe_id: recipe.recipe_id});
      next(err);
    }

    const recipeIngredientService = new RecipeIngredientService(new RecipeIngredientRepo());
    try {
      await recipeIngredientService.bulkCreate({
        recipe_id: recipe.recipe_id,
        required_ingredients
      });
    } catch (err) {
      await recipeRepo.deleteOne({owner_id, recipe_id: recipe.recipe_id});
      next(err);
    }

    const recipeSubrecipeService = new RecipeSubrecipeService(new RecipeSubrecipeRepo());
    try {
      await recipeSubrecipeService.bulkCreate({
        recipe_id: recipe.recipe_id,
        required_subrecipes
      });
    } catch (err) {
      await recipeRepo.deleteOne({owner_id, recipe_id: recipe.recipe_id});
      next(err);
    }

    const recipeImageService = new RecipeImageService({
      imageRepo: new ImageRepo(),
      recipeImageRepo: new RecipeImageRepo()
    });
    try {
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
    } catch (err) {
      await recipeRepo.deleteOne({owner_id, recipe_id: recipe.recipe_id});
      next(err);
    }

    return res.status(201).json();
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
    if (!recipe) throw new NotFoundException();
    if (author_id !== recipe.author_id) throw new ForbiddenException();
    if (owner_id !== recipe.owner_id) throw new ForbiddenException();

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
    await recipeMethodService.bulkUpdate({recipe_id, required_methods});

    const recipeEquipmentService = new RecipeEquipmentService(new RecipeEquipmentRepo());
    await recipeEquipmentService.bulkUpdate({recipe_id, required_equipment});

    const recipeIngredientService = new RecipeIngredientService(new RecipeIngredientRepo());
    await recipeIngredientService.bulkUpdate({recipe_id, required_ingredients});

    const recipeSubrecipeService = new RecipeSubrecipeService(new RecipeSubrecipeRepo());
    await recipeSubrecipeService.bulkUpdate({recipe_id, required_subrecipes});

    const recipeImageService = new RecipeImageService({
      imageRepo: new ImageRepo(),
      recipeImageRepo: new RecipeImageRepo()
    });
    await recipeImageService.bulkUpdate({
      //recipe_id,  ???
      author_id,
      owner_id,
      uploaded_images: [
        recipe_image,
        equipment_image,
        ingredients_image,
        cooking_image
      ]
    });

    return res.status(204).json();
  },

  async deleteOne(req: Request, res: Response) {
    const { recipe_id } = req.params;
    const owner_id = req.session.user_id!;

    const recipeRepo = new RecipeRepo();
    const recipe = await recipeRepo.viewOneByRecipeId(recipe_id);
    if (!recipe) throw new NotFoundException();
    if (owner_id !== recipe.owner_id) throw new ForbiddenException();

    const imageRepo = new ImageRepo();

    const recipe_image = await imageRepo.viewOne(recipe.recipe_image.image_id);
    if (!recipe_image) throw new NotFoundException();
    if (owner_id !== recipe_image.owner_id) throw new ForbiddenException();
    await s3Client.send(new DeleteObjectCommand({
      Bucket: 'nobsc-private-uploads',
      Key: `recipe/${owner_id}/${recipe_image.image_filename}-medium.jpg`
    }));
    await s3Client.send(new DeleteObjectCommand({
      Bucket: 'nobsc-private-uploads',
      Key: `recipe/${owner_id}/${recipe_image.image_filename}-small.jpg`
    }));
    await s3Client.send(new DeleteObjectCommand({
      Bucket: 'nobsc-private-uploads',
      Key: `recipe/${owner_id}/${recipe_image.image_filename}-tiny.jpg`
    }));
    await imageRepo.deleteOne({owner_id, image_id: recipe_image.image_id});

    const equipment_image = await imageRepo.viewOne(recipe.equipment_image.image_id);
    if (!equipment_image) throw new NotFoundException();
    if (owner_id !== equipment_image.owner_id) throw new ForbiddenException();
    await s3Client.send(new DeleteObjectCommand({
      Bucket: 'nobsc-private-uploads',
      Key: `recipe-equipment/${owner_id}/${equipment_image.image_filename}-medium.jpg`
    }));
    await imageRepo.deleteOne({owner_id, image_id: equipment_image.image_id});

    const ingredients_image = await imageRepo.viewOne(recipe.ingredients_image.image_id);
    if (!ingredients_image) throw new NotFoundException();
    if (owner_id !== ingredients_image.owner_id) throw new ForbiddenException();
    await s3Client.send(new DeleteObjectCommand({
      Bucket: 'nobsc-private-uploads',
      Key: `recipe-ingredients/${owner_id}/${ingredients_image.image_filename}-medium.jpg`
    }));
    await imageRepo.deleteOne({owner_id, image_id: ingredients_image.image_id});

    const cooking_image = await imageRepo.viewOne(recipe.cooking_image.image_id);
    if (!cooking_image) throw new NotFoundException();
    if (owner_id !== cooking_image.owner_id) throw new ForbiddenException();
    await s3Client.send(new DeleteObjectCommand({
      Bucket: 'nobsc-private-uploads',
      Key: `recipe-cooking/${owner_id}/${cooking_image.image_filename}-medium.jpg`
    }));
    await imageRepo.deleteOne({owner_id, image_id: cooking_image.image_id});

    await recipeRepo.deleteOne({owner_id, recipe_id});

    return res.status(204).json();
  }
};
