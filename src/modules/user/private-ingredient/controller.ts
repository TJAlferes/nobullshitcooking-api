import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import type { Request, Response } from 'express';

import { ForbiddenException, NotFoundException} from '../../../utils/exceptions.js';
import { AwsS3PrivateUploadsClient } from '../../aws-s3/private-uploads/client.js';
import { Image } from '../../image/model.js';
import { ImageRepo } from '../../image/repo.js';
import { IngredientAltNameRepo } from '../../ingredient/alt-name/repo.js';
import { IngredientAltNameService } from '../../ingredient/alt-name/service.js';
import { Ingredient } from '../../ingredient/model.js';
import { IngredientRepo } from '../../ingredient/repo.js';

export const privateIngredientController = {
  async viewAll(req: Request, res: Response) {
    const owner_id  = req.session.user_id!;

    const repo = new IngredientRepo();
    const ingredients = await repo.viewAll(owner_id);

    return res.json(ingredients);
  },

  async viewOne(req: Request, res: Response) {
    const { ingredient_id } = req.params;
    const owner_id = req.session.user_id!;

    const repo = new IngredientRepo();
    const ingredient = await repo.viewOne(ingredient_id);
    if (!ingredient) throw NotFoundException();
    if (owner_id !== ingredient.owner_id) throw ForbiddenException();

    return res.json(ingredient);
  },

  async create(req: Request, res: Response) {
    const {
      ingredient_brand,
      ingredient_variety,
      ingredient_name,
      alt_names,
      notes,
      image_filename,
      caption
    } = req.body;
    const ingredient_type_id = Number(req.body.ingredient_type_id);
    const author_id          = req.session.user_id!;
    const owner_id           = req.session.user_id!;

    const image = Image.create({
      image_filename,
      caption,
      author_id,
      owner_id
    }).getDTO();
    const imageRepo = new ImageRepo();
    await imageRepo.insert(image);

    const ingredient = Ingredient.create({
      ingredient_type_id,
      owner_id,
      ingredient_brand,
      ingredient_variety,
      ingredient_name,
      notes,
      image_id: image.image_id
    }).getDTO();
    const ingredientRepo = new IngredientRepo();
    await ingredientRepo.insert(ingredient);

    if (alt_names.length > 0) {
      const ingredientAltNameRepo = new IngredientAltNameRepo();
      const { create } = new IngredientAltNameService(ingredientAltNameRepo);
      await create({ingredient_id: ingredient.ingredient_id, alt_names});
    }

    return res.status(201);
  },

  async update(req: Request, res: Response) {
    const {
      ingredient_id,
      ingredient_brand,
      ingredient_variety,
      ingredient_name,
      alt_names,
      notes,
      image_id,
      image_filename,
      caption
    } = req.body;
    const ingredient_type_id = Number(req.body.ingredient_type_id);
    const author_id          = req.session.user_id!;
    const owner_id           = req.session.user_id!;

    const ingredientRepo = new IngredientRepo();
    const ingredient = await ingredientRepo.viewOne(ingredient_id);
    if (!ingredient) throw NotFoundException();
    if (owner_id !== ingredient.owner_id) throw ForbiddenException();

    const imageRepo = new ImageRepo();
    const image = await imageRepo.viewOne(ingredient.image_id);
    if (!image) throw NotFoundException();
    if (owner_id !== image.owner_id) throw ForbiddenException();

    const updated_image = Image.update({
      image_id,
      image_filename,
      caption,
      author_id,
      owner_id
    }).getDTO();
    await imageRepo.insert(updated_image);

    const updated_ingredient = Ingredient.update({
      ingredient_id,
      ingredient_type_id,
      owner_id,
      ingredient_brand,
      ingredient_variety,
      ingredient_name,
      notes,
      image_id
    }).getDTO();
    await ingredientRepo.update(updated_ingredient);

    const ingredientAltNameRepo = new IngredientAltNameRepo();
    const { update } = new IngredientAltNameService(ingredientAltNameRepo);
    await update({ingredient_id, alt_names});

    return res.status(204);
  },

  async deleteOne(req: Request, res: Response) {
    const { ingredient_id } = req.params;
    const owner_id = req.session.user_id!;

    const ingredientRepo = new IngredientRepo();
    const ingredient = await ingredientRepo.viewOne(ingredient_id);
    if (!ingredient) throw NotFoundException();
    if (owner_id !== ingredient.owner_id) throw ForbiddenException();

    const imageRepo = new ImageRepo();
    const image = await imageRepo.viewOne(ingredient.image_id);
    if (!image) throw NotFoundException();
    if (owner_id !== image.owner_id) throw ForbiddenException();

    // TO DO: all sizes
    await AwsS3PrivateUploadsClient.send(new DeleteObjectCommand({
      Bucket: 'nobsc-private-uploads',
      Key: `
        nobsc-private-uploads/ingredient
        /${owner_id}
        /${image.image_filename}
      `
    }));

    // TO DO: await imageRepo.deleteOne

    await ingredientRepo.deleteOne({ingredient_id, owner_id});
    
    return res.status(204);
  }
};
