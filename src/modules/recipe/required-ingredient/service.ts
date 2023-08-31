import { RecipeIngredient }      from "./model";
import { IRecipeIngredientRepo } from "./repo";

export class RecipeIngredientService {
  repo: IRecipeIngredientRepo;

  constructor(repo: IRecipeIngredientRepo) {
    this.repo = repo;
  }

  async create({ recipe_id, required_ingredients }: CreateParams) {
    if (!required_ingredients.length) return;

    const placeholders = '(?, ?, ?, ?),'
      .repeat(required_ingredients.length)
      .slice(0, -1);

    const recipe_ingredients = required_ingredients.map(ri => 
      RecipeIngredient.create({recipe_id, ...ri}).getDTO()
    );

    await this.repo.insert({placeholders, recipe_ingredients});
  }

  async update({ recipe_id, required_ingredients }: UpdateParams) {
    if (!required_ingredients.length) {
      await this.repo.deleteByRecipeId(recipe_id);
      return;
    }

    const placeholders = '(?, ?, ?, ?),'
      .repeat(required_ingredients.length)
      .slice(0, -1);

    const recipe_ingredients = required_ingredients.map(ri => 
      RecipeIngredient.create({recipe_id, ...ri}).getDTO()
    );

    await this.repo.update({recipe_id, placeholders, recipe_ingredients});
  }
}

type CreateParams = {
  recipe_id:            string;
  required_ingredients: RequiredIngredient[];
};

type UpdateParams = CreateParams;

type RequiredIngredient = {
  amount?:       number;
  unit_id?:      number;
  ingredient_id: string;
};
