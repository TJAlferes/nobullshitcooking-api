import { RecipeImage }              from "./model";
import { RecipeImageRepoInterface } from "./repo";

export class RecipeImageService {
  repo: RecipeImageRepoInterface;

  constructor(repo: RecipeImageRepoInterface) {
    this.repo = repo;
  }

  async create({ recipe_id, associated_images }: CreateParams) {
    // the recipe must already be in the recipe table and
    // the 6 images must already be in the image tabe
    // (if they don't use some, just have placeholder default image_urls)
    if (!associated_images.length) return;
    if (associated_images.length > 6) return;

    // we only allow the following 6 images per recipe:
    // 1 image      of completed and plated recipe (primary image)
    // 1 image      of required equipment image
    // 1 image      of required ingredients image
    // 3 image(s) of prepping/cooking detail/process/action
    //
    // with the following constraints:
    // if type === 1|2|3 then order = 1
    // if type === 4     then order = given user input (but still 1|2|3)

    // validate and coerce types 1-3

    const type1 = associated_images.filter(ai => ai.type === 1);
    if (!type1.length) return;
    if (type1.length > 1) return;
    type1[0].order = 1;

    const type2 = associated_images.filter(ai => ai.type === 2);
    if (!type2.length) return;
    if (type2.length > 1) return;
    type2[0].order = 1;

    const type3 = associated_images.filter(ai => ai.type === 3);
    if (!type3.length) return;
    if (type3.length > 1) return;
    type3[0].order = 1;

    // validate type 4 and its orders 1-3

    const type4 = associated_images.filter(ai => ai.type === 4);
    if (!type4.length) return;
    if (type4.length > 3) return;

    const order1 = type4.filter(t => t.order === 1);
    if (!order1.length) return;
    if (order1.length > 1) return;

    const order2 = type4.filter(t => t.order === 2);
    if (!order2.length) return;
    if (order2.length > 1) return;

    const order3 = type4.filter(t => t.order === 3);
    if (!order3.length) return;
    if (order3.length > 1) return;

    const placeholders = '(?, ?, ?, ?),'
      .repeat(associated_images.length)
      .slice(0, -1);

    const recipe_images = associated_images.map(ai =>
      RecipeImage.create({recipe_id, ...ai}).getDTO()
    );

    await this.repo.insert({placeholders, recipe_images});
  }

  async update({ recipe_id, associated_images }: UpdateParams) {
    if (!associated_images.length) return;
    if (associated_images.length > 6) return;

    const placeholders = '(?, ?, ?, ?),'
      .repeat(associated_images.length)
      .slice(0, -1);

    const recipe_images = associated_images.map(ai =>
      RecipeImage.create({recipe_id, ...ai}).getDTO()
    );

    await this.repo.update({recipe_id, placeholders, recipe_images});
  }
}

type CreateParams = {
  recipe_id:         string;
  associated_images: AssociatedImage[];
};

type UpdateParams = CreateParams;

type AssociatedImage = {
  image_id:  string;
  type:      number;
  order:     number;
};
