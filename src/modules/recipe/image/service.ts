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
    if (!uploaded_images) return;

    let placeholders = '(?, ?, ?, ?, ?),'
      .repeat(uploaded_images.length)
      .slice(0, -1);
    
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
        type:     uploaded_image.type,
        order:    uploaded_image.order
      });
    });

    await this.imageRepo.bulkInsert({placeholders, images});

    if (!associated_images.length) return;
    if (associated_images.length > 6) return;

    this.validateAssociatedImages(associated_images);

    placeholders = '(?, ?, ?, ?),'
      .repeat(associated_images.length)
      .slice(0, -1);

    const recipe_images = associated_images.map(ai =>
      RecipeImage.create({recipe_id, ...ai}).getDTO()
    );

    await this.recipeImageRepo.insert({placeholders, recipe_images});
  }

  async bulkUpdate({ recipe_id, author_id, owner_id, uploaded_images }: BulkUpdateParams) {


    // validate here

    if (!associated_images.length) return;
    if (associated_images.length > 6) return;

    const placeholders = '(?, ?, ?, ?),'
      .repeat(associated_images.length)
      .slice(0, -1);

    const recipe_images = associated_images.map(ai =>
      RecipeImage.create({recipe_id, ...ai}).getDTO()
    );

    await this.recipeImageRepo.update({recipe_id, placeholders, recipe_images});
  }

  validateAssociatedImages(associated_images: AssociatedImage[]) {
    // the recipe must already be in the recipe table and
    // the 4 images must already be in the image table

    // we only allow the following 4 images per recipe:
    // 1 image of completed/plated recipe (this is the primary image)
    // 1 image of all required equipment
    // 1 image of all required ingredients
    // 1 image of a prepping/cooking detail/process/action
    //
    // with the following constraints:
    // if type === 1|2|3 then order = 1
    // if type === 4     then order = given user input (but still 1|2|3)

    // validate and coerce types 1-3

    const type1 = associated_images.filter(ai => ai.type === 1);  // THIS MAKES A NEW ARRAY!!!
    if (!type1.length) return;
    if (type1.length > 1) return;

    const type2 = associated_images.filter(ai => ai.type === 2);
    if (!type2.length) return;
    if (type2.length > 1) return;

    const type3 = associated_images.filter(ai => ai.type === 3);
    if (!type3.length) return;
    if (type3.length > 1) return;

    // validate type 4 and its orders 1-3

    const type4 = associated_images.filter(ai => ai.type === 4);
    if (!type4.length) return;
    if (type4.length > 3) return;
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
  order:          number;
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
  order:    number;
};
