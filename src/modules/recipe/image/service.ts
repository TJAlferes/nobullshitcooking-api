import { ValidationException }      from "../../../utils/exceptions.js";
import { Image }                    from "../../image/model.js";
import { ImageRepoInterface }       from "../../image/repo.js";
import { RecipeImage }              from "./model.js";
import { RecipeImageRepoInterface } from "./repo.js";

export class RecipeImageService {
  imageRepo:       ImageRepoInterface;
  recipeImageRepo: RecipeImageRepoInterface;

  constructor({ imageRepo, recipeImageRepo }: ConstructorParams) {
    this.imageRepo       = imageRepo;
    this.recipeImageRepo = recipeImageRepo;
  }

  async bulkCreate({ recipe_id, author_id, owner_id, uploaded_images }: BulkCreateParams) {
    if (uploaded_images.length !== 4) throw ValidationException("Recipe must have 4 images.");
    
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

    await this.imageRepo.bulkInsert({
      placeholders: '(?, ?, ?, ?, ?),(?, ?, ?, ?, ?),(?, ?, ?, ?, ?),(?, ?, ?, ?, ?)',
      images
    });

    this.checkRecipeImagesTypes(recipe_images);

    await this.recipeImageRepo.bulkInsert({
      placeholders: '(?, ?, ?),(?, ?, ?),(?, ?, ?),(?, ?, ?)',
      recipe_images
    });
  }

  // TO DO: thoroughly test
  async bulkUpdate({ author_id, owner_id, uploaded_images }: BulkUpdateParams) {
    if (uploaded_images.length !== 4) throw ValidationException("Recipe must have 4 images.");

    // imageRepo updates:
    // set image_filename to new AWS S3 name or reset to 'default'
    // set caption        to new caption     or reset to ''

    const images: ImageDTO[] = [];

    for (const uploaded_image of uploaded_images) {
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
      throw ValidationException("Recipe must have 4 images.");
    }

    if (!recipe_images.some(ai => ai.type === 1)) {
      throw ValidationException("Missing recipe image.");
    }
    if (!recipe_images.some(ai => ai.type === 2)) {
      throw ValidationException("Missing equipment image.");
    }
    if (!recipe_images.some(ai => ai.type === 3)) {
      throw ValidationException("Missing ingredients image.");
    }
    if (!recipe_images.some(ai => ai.type === 4)) {
      throw ValidationException("Missing cooking image.");
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
  uploaded_images: ImageUpdateInfo[];
};

type ImageInfo = {
  image_filename: string;
  caption:        string;
  type:           number;
};

type ImageUpdateInfo = ImageInfo & {
  image_id: string;
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
