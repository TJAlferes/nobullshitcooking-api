import { IRecipeSubrecipeRepo } from "./repo";

export class RecipeSubrecipeService {
  repo: IRecipeSubrecipeRepo;

  constructor(repo: IRecipeSubrecipeRepo) {
    this.repo = repo;
  }

  async create({ recipe_id, required_subrecipes }: CreateParams) {
    if (!required_subrecipes.length) return;

    required_subrecipes.map(({ amount, unit_id, subrecipe_id }) =>
      assert({recipe_id, amount, unit_id, subrecipe_id}, validRecipeSubrecipe));

    const placeholders = '(?, ?, ?, ?),'
      .repeat(required_subrecipes.length)
      .slice(0, -1);  // use namedPlaceholders instead???

    const values: number[] = [];

    required_subrecipes.map(({ amount, unit_id, subrecipe_id }) =>
      values.push(recipe_id, amount, unit_id, subrecipe_id));

    await this.repo.insert(placeholders, values);
  }
}

type CreateParams = {
  recipe_id:           string;
  required_subrecipes: RequiredSubrecipe[];
};

type RequiredSubrecipe = {
  amount?:      number;
  unit_id?:     number;
  subrecipe_id: string;  // use title instead??? and lookup id here?
};
