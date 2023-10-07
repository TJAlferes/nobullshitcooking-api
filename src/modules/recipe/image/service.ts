import { Image }                    from "../../image/model";
import { ImageRepoInterface }       from "../../image/repo";
import { RecipeImage }              from "./model";
import { RecipeImageRepoInterface } from "./repo";

export class RecipeImageService {
  imageRepo:       ImageRepoInterface;
  recipeImageRepo: RecipeImageRepoInterface;

  constructor({ imageRepo, recipeImageRepo }: ConstructorParams) {
    this.imageRepo       = imageRepo;
    this.recipeImageRepo = recipeImageRepo;
  }

  async bulkCreate({ recipe_id, author_id, owner_id, uploaded_images }: BulkCreateParams) {
    if (uploaded_images.length !== 4) throw new Error("Recipe must have 4 images.");
    
    const images: ImageDTO[] = [];
    const associated_images: AssociatedImage[] = [];
    
    uploaded_images.map(uploaded_image => {
      const image = Image.create({
        author_id,
        owner_id,
        image_filename: uploaded_image.image_filename,
        caption:        uploaded_image.caption
      }).getDTO();

      images.push(image);

      associated_images.push({
        image_id: image.image_id,
        type:     uploaded_image.type
      });
    });

    // insert into image table

    await this.imageRepo.bulkInsert({
      placeholders: '(?, ?, ?, ?, ?),(?, ?, ?, ?, ?),(?, ?, ?, ?, ?),(?, ?, ?, ?, ?)',
      images
    });

    // insert into recipe_image table

    this.validateAssociatedImages(associated_images);

    const recipe_images = associated_images.map(ai =>
      RecipeImage.create({recipe_id, ...ai}).getDTO()
    );

    await this.recipeImageRepo.bulkInsert({
      placeholders: '(?, ?, ?),(?, ?, ?),(?, ?, ?),(?, ?, ?)',
      recipe_images
    });
  }

  async bulkUpdate({ recipe_id, author_id, owner_id, uploaded_images }: BulkUpdateParams) {
    if (uploaded_images.length !== 4) throw new Error("Recipe must have 4 images.");

    // TO DO: FINISH

    // imageRepo updates:
    // remove images (reset image_filename to 'default' and caption to '')
    // update images (image_filename (AWS S3), caption)

    // recipeImageRepo updates:
    // remove???
    // update recipe_images (type) ???

    // validate here

    if (associated_images.length < 1) return;
    if (associated_images.length > 6) return;

    const placeholders = '(?, ?, ?, ?),'
      .repeat(associated_images.length)
      .slice(0, -1);

    const recipe_images = associated_images.map(ai =>
      RecipeImage.create({recipe_id, ...ai}).getDTO()
    );

    await this.recipeImageRepo.bulkUpdate({recipe_id, placeholders, recipe_images});
  }

  validateAssociatedImages(associated_images: AssociatedImage[]) {
    // the recipe must already be in the recipe table and
    // the 4 images must already be in the image table

    // we allow 4 images per recipe:
    // 1 image of completed/plated recipe (this is the primary image)
    // 1 image of all required equipment
    // 1 image of all required ingredients
    // 1 image of a prepping/cooking detail/process/action

    if (associated_images.length !== 4) throw new Error("Recipe must have 4 images.");

    const type1 = associated_images.filter(ai => ai.type === 1);  // THIS MAKES A NEW ARRAY (SHALLOW COPY)!!! BUG???
    if (type1.length !== 1) throw new Error("Missing recipe image.");

    const type2 = associated_images.filter(ai => ai.type === 2);
    if (type2.length !== 1) throw new Error("Missing equipment image.");

    const type3 = associated_images.filter(ai => ai.type === 3);
    if (type3.length !== 1) throw new Error("Missing ingredients image.");

    const type4 = associated_images.filter(ai => ai.type === 4);
    if (type4.length !== 1) throw new Error("Missing cooking image.");
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
  uploaded_images: ImageUpload[];
}

type BulkUpdateParams = BulkCreateParams;

type ImageUpload = {
  image_filename: string;
  caption:        string;
  type:           number;
  medium:         null;
  thumb?:         null;
  tiny?:          null;
};

type ImageDTO = {
  image_id:       string;
  image_filename: string;
  caption:        string;
  author_id:      string;
  owner_id:       string;
};

type AssociatedImage = {
  image_id: string;
  type:     number;
};
