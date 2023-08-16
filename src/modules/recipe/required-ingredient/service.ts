import { IRecipeIngredientRepo } from "./repo";

export class RecipeIngredientService {
  repo: IRecipeIngredientRepo;

  constructor(repo: IRecipeIngredientRepo) {
    this.repo = repo;
  }

  async create({ recipe_id, required_ingredients }: CreateParams) {
    if (!required_ingredients.length) return;

    // TO DO: use domain
    required_ingredients.map(({ amount, unit_id, ingredient_id }) =>
      assert({recipe_id, amount, unit_id, ingredient_id}, validRecipeIngredient));

    const placeholders = '(?, ?, ?, ?),'
      .repeat(required_ingredients.length)
      .slice(0, -1);

    const values: number[] = [];

    required_ingredients.map(({ amount, unit_id, ingredient_id }) =>
      values.push(recipe_id, amount, unit_id, ingredient_id));

    await this.repo.insert(placeholders, values);
  }
}

type CreateParams = {
  recipe_id:            string;
  required_ingredients: RequiredIngredient[];
};

type RequiredIngredient = {
  amount?:       number;
  unit_id?:      number;
  ingredient_id: string;
};
