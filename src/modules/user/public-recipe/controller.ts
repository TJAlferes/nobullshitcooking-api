import { CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import type { Request, Response } from 'express';

import { ForbiddenException, NotFoundException} from '../../../utils/exceptions';
import { AwsS3PublicUploadsClient as s3Client } from '../../aws-s3/public-uploads/client';
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
import { NOBSC_USER_ID, UNKNOWN_USER_ID } from '../../shared/model';
import { UserRepo }                from '../repo';
import { PublicRecipeService }     from './service';

export const publicRecipeController = {
  async overviewAll(req: Request, res: Response) {
    const author_id = req.session.user_id!;
    const owner_id  = NOBSC_USER_ID

    const repo = new RecipeRepo();
    const recipes = await repo.overviewAll({author_id, owner_id});

    return res.status(200).json(recipes);
  },

  async viewOne(req: Request, res: Response) {
    const { author, title } = req.params;

    const userRepo = new UserRepo();
    const user = await userRepo.getByUsername(author);
    if (!user) throw new NotFoundException();

    const author_id = user.user_id;
    const owner_id  = NOBSC_USER_ID;

    const recipeRepo = new RecipeRepo()
    const recipe = await recipeRepo.viewOneByTitle(title);
    if (!recipe) throw new NotFoundException();
    if (author_id !== recipe.author_id) throw new ForbiddenException();
    if (owner_id !== recipe.owner_id) throw new ForbiddenException();
    
    return res.status(200).json(recipe);
  },

  async edit(req: Request, res: Response) {
    const { recipe_id } = req.params;
    const author_id = req.session.user_id!;
    const owner_id  = NOBSC_USER_ID;

    const repo = new RecipeRepo();
    const recipe = await repo.viewOneToEdit(recipe_id);
    if (!recipe) throw new NotFoundException();
    if (author_id !== recipe.author_id) throw new ForbiddenException();
    if (owner_id !== recipe.owner_id) throw new ForbiddenException();

    return res.status(200).json(recipe);
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

    const recipe = await recipeRepo.viewOneByRecipeId(recipe_id);
    if (!recipe) throw new NotFoundException();
    if (author_id !== recipe.author_id) throw new ForbiddenException();
    if (owner_id !== recipe.owner_id) throw new ForbiddenException();

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
      //recipe_id,
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

    const recipeRepo = new RecipeRepo();
    const recipe = await recipeRepo.viewOneByRecipeId(recipe_id);
    if (!recipe) throw new NotFoundException();
    if (author_id !== recipe.author_id) throw new ForbiddenException();

    const imageRepo = new ImageRepo();

    const recipe_image = await imageRepo.viewOne(recipe.recipe_image.image_id);
    if (!recipe_image) throw new NotFoundException();
    if (author_id !== recipe_image.author_id) throw new ForbiddenException();

    // TO DO: append jpg ???

    // recipe_images
    await s3Client.send(new CopyObjectCommand({
      Bucket: 'nobsc-public-uploads',
      CopySource: `
        nobsc-public-uploads/recipe
        /${author_id}
        /${recipe_image.image_filename}-medium
      `,
      Key: `recipe/${UNKNOWN_USER_ID}/${recipe_image.image_filename}-medium`
    }));
    await s3Client.send(new DeleteObjectCommand({
      Bucket: 'nobsc-public-uploads',
      Key: `
        nobsc-public-uploads/recipe
        /${author_id}
        /${recipe_image.image_filename}-medium
      `
    }));
    await s3Client.send(new CopyObjectCommand({
      Bucket: 'nobsc-public-uploads',
      CopySource: `
        nobsc-public-uploads/recipe
        /${author_id}
        /${recipe_image.image_filename}-thumb
      `,
      Key: `recipe/${UNKNOWN_USER_ID}/${recipe_image.image_filename}-thumb`
    }));
    await s3Client.send(new DeleteObjectCommand({
      Bucket: 'nobsc-public-uploads',
      Key: `
        nobsc-public-uploads/recipe
        /${author_id}
        /${recipe_image.image_filename}-thumb
      `
    }));
    await s3Client.send(new CopyObjectCommand({
      Bucket: 'nobsc-public-uploads',
      CopySource: `
        nobsc-public-uploads/recipe
        /${author_id}
        /${recipe_image.image_filename}-tiny
      `,
      Key: `recipe/${UNKNOWN_USER_ID}/${recipe_image.image_filename}-tiny`
    }));
    await s3Client.send(new DeleteObjectCommand({
      Bucket: 'nobsc-public-uploads',
      Key: `
        nobsc-public-uploads/recipe
        /${author_id}
        /${recipe_image.image_filename}-tiny
      `
    }));
    await imageRepo.unattributeOne({author_id, image_id: recipe_image.image_id});

    // equipment images
    const equipment_image = await imageRepo.viewOne(recipe.equipment_image.image_id);
    if (!equipment_image) throw new NotFoundException();
    if (author_id !== equipment_image.author_id) throw new ForbiddenException();
    await s3Client.send(new CopyObjectCommand({
      Bucket: 'nobsc-public-uploads',
      CopySource: `
        nobsc-public-uploads/recipe-
        /${author_id}
        /${equipment_image.image_filename}-medium
      `,
      Key: `recipe/${UNKNOWN_USER_ID}/${equipment_image.image_filename}-medium`
    }));
    await s3Client.send(new DeleteObjectCommand({
      Bucket: 'nobsc-public-uploads',
      Key: `
        nobsc-public-uploads/recipe-equipment
        /${author_id}
        /${equipment_image.image_filename}-medium
      `
    }));
    await imageRepo.unattributeOne({author_id, image_id: equipment_image.image_id});

    // ingredients images
    const ingredients_image = await imageRepo.viewOne(recipe.ingredients_image.image_id);
    if (!ingredients_image) throw new NotFoundException();
    if (author_id !== ingredients_image.author_id) throw new ForbiddenException();
    await s3Client.send(new CopyObjectCommand({
      Bucket: 'nobsc-public-uploads',
      CopySource: `
        nobsc-public-uploads/recipe-ingredients
        /${author_id}
        /${ingredients_image.image_filename}-medium
      `,
      Key: `recipe/${UNKNOWN_USER_ID}/${ingredients_image.image_filename}-medium`
    }));
    await s3Client.send(new DeleteObjectCommand({
      Bucket: 'nobsc-public-uploads',
      Key: `
        nobsc-public-uploads/recipe-ingredients
        /${author_id}
        /${ingredients_image.image_filename}-medium
      `
    }));
    await imageRepo.unattributeOne({author_id, image_id: ingredients_image.image_id});

    // cooking images
    const cooking_image = await imageRepo.viewOne(recipe.cooking_image.image_id);
    if (!cooking_image) throw new NotFoundException();
    if (author_id !== cooking_image.author_id) throw new ForbiddenException();
    await s3Client.send(new CopyObjectCommand({
      Bucket: 'nobsc-public-uploads',
      CopySource: `
        nobsc-public-uploads/recipe-cooking
        /${author_id}
        /${cooking_image.image_filename}-medium
      `,
      Key: `recipe/${UNKNOWN_USER_ID}/${cooking_image.image_filename}-medium`
    }));
    await s3Client.send(new DeleteObjectCommand({
      Bucket: 'nobsc-public-uploads',
      Key: `
        nobsc-public-uploads/recipe-cooking
        /${author_id}
        /${cooking_image.image_filename}-medium
      `
    }));
    await imageRepo.unattributeOne({author_id, image_id: cooking_image.image_id});

    await recipeRepo.unattributeOne({author_id, recipe_id});

    return res.status(204);
  }
};
