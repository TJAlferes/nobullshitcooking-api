import { DeleteObjectCommand } from '@aws-sdk/client-s3';

import { ValidationException } from '../../../utils/exceptions';
import { AwsS3PrivateUploadsClient } from '../../aws-s3/private-uploads/client';
import { AwsS3PublicUploadsClient } from '../../aws-s3/public-uploads/client';
import { Image } from '../../image/model';
import { ImageRepoInterface } from '../../image/repo';
import { RecipeImage } from './model';
import { RecipeImageRepoInterface } from './repo';

export class RecipeImageService {
  imageRepo:       ImageRepoInterface;
  recipeImageRepo: RecipeImageRepoInterface;

  constructor({ imageRepo, recipeImageRepo }: ConstructorParams) {
    this.imageRepo       = imageRepo;
    this.recipeImageRepo = recipeImageRepo;
  }

  async bulkCreate({ recipe_id, author_id, owner_id, uploaded_images }: BulkCreateParams) {
    if (uploaded_images.length !== 4) {
      //throw new ValidationException('Recipe must have 4 images.');
      return false;
    }
    
    const images: ImageDTO[] = [];
    const recipe_images: RecipeImageDTO[] = [];

    for (const uploaded_image of uploaded_images) {
      const image = Image.create({
        author_id,
        owner_id,
        image_filename: uploaded_image.image_filename,
        caption:        uploaded_image.caption
      }).getDTO();

      images.push(image);

      const recipe_image = RecipeImage.create({
        recipe_id,
        image_id: image.image_id,
        type:     uploaded_image.type
      }).getDTO();

      recipe_images.push(recipe_image);
    }

    const result1 = await this.imageRepo.bulkInsert({
      placeholders: '(?, ?, ?, ?, ?),(?, ?, ?, ?, ?),(?, ?, ?, ?, ?),(?, ?, ?, ?, ?)',
      images
    });
    if (!result1) return false;

    this.checkRecipeImagesTypes(recipe_images);

    const result2 = await this.recipeImageRepo.bulkInsert({
      placeholders: '(?, ?, ?),(?, ?, ?),(?, ?, ?),(?, ?, ?)',
      recipe_images
    });
    if (!result2) return false;

    return true;
  }

  // TO DO: thoroughly test
  async bulkUpdate({ author_id, owner_id, uploaded_images }: BulkUpdateParams) {
    if (uploaded_images.length !== 4) {
      throw new ValidationException('Recipe must have 4 images.');
    }

    const images: ImageDTO[] = [];

    for (const uploaded_image of uploaded_images) {
      const curr_image = await this.imageRepo.viewOne(uploaded_image.image_id);

      // If the current image is not the same as the uploaded image,
      // delete the current image from AWS S3
      if (curr_image.image_filename !== uploaded_image.image_filename) {
        const s3Client = author_id === owner_id
          ? AwsS3PrivateUploadsClient
          : AwsS3PublicUploadsClient;
        const ownership = author_id === owner_id ? 'private' : 'public';

        if (uploaded_image.type === 1) {
          await s3Client.send(new DeleteObjectCommand({
            Bucket: `nobsc-${ownership}-uploads`,
            Key: `recipe/${author_id}/${curr_image.image_filename}-medium.jpg`
          }));
          await s3Client.send(new DeleteObjectCommand({
            Bucket: `nobsc-${ownership}-uploads`,
            Key: `recipe/${author_id}/${curr_image.image_filename}-small.jpg`
          }));
          await s3Client.send(new DeleteObjectCommand({
            Bucket: `nobsc-${ownership}-uploads`,
            Key: `recipe/${author_id}/${curr_image.image_filename}-tiny.jpg`
          }));
        }

        if (uploaded_image.type === 2) {
          await s3Client.send(new DeleteObjectCommand({
            Bucket: `nobsc-${ownership}-uploads`,
            Key: `recipe-equipment/${author_id}/${curr_image.image_filename}-medium.jpg`
          }));
        }

        if (uploaded_image.type === 3) {
          await s3Client.send(new DeleteObjectCommand({
            Bucket: `nobsc-${ownership}-uploads`,
            Key: `recipe-ingredients/${author_id}/${curr_image.image_filename}-medium.jpg`
          }));
        }

        if (uploaded_image.type === 4) {
          await s3Client.send(new DeleteObjectCommand({
            Bucket: `nobsc-${ownership}-uploads`,
            Key: `recipe-cooking/${author_id}/${curr_image.image_filename}-medium.jpg`
          }));
        }
      }

      const image = Image.update({
        image_id: uploaded_image.image_id,
        author_id,
        owner_id,
        image_filename: uploaded_image.image_filename,  // can be updated
        caption:        uploaded_image.caption          // can be updated
      }).getDTO();

      images.push(image);
    }


    for (const image of images) {
      await this.imageRepo.update(image);
    }
  }

  checkRecipeImagesTypes(recipe_images: RecipeImageDTO[]) {
    // the recipe must already be in the recipe table and
    // the 4 images must already be in the image table

    // we allow 4 images per recipe:
    // 1 image of completed/plated recipe (this is the primary image)
    // 1 image of all required equipment
    // 1 image of all required ingredients
    // 1 image of a prepping/cooking detail/process/action

    if (recipe_images.length !== 4) {
      throw new ValidationException('Recipe must have 4 images.');
    }

    if (!recipe_images.some(ai => ai.type === 1)) {
      throw new ValidationException('Missing recipe image.');
    }
    if (!recipe_images.some(ai => ai.type === 2)) {
      throw new ValidationException('Missing equipment image.');
    }
    if (!recipe_images.some(ai => ai.type === 3)) {
      throw new ValidationException('Missing ingredients image.');
    }
    if (!recipe_images.some(ai => ai.type === 4)) {
      throw new ValidationException('Missing cooking image.');
    }
  }
}

type ConstructorParams = {
  imageRepo:       ImageRepoInterface;
  recipeImageRepo: RecipeImageRepoInterface;
};

type BulkCreateParams = {
  recipe_id:       string;
  author_id:       string;
  owner_id:        string;
  uploaded_images: ImageInfo[];
};

type BulkUpdateParams = {
  author_id:       string;
  owner_id:        string;
  uploaded_images: ImageInfo[];
};

type ImageInfo = {
  image_id:       string;
  image_filename: string;
  caption:        string;
  type:           number;
};

type ImageDTO = {
  image_id:       string;
  image_filename: string;
  caption:        string;
  author_id:      string;
  owner_id:       string;
};

type RecipeImageDTO = {
  recipe_id: string;
  image_id:  string;
  type:      number;
};
