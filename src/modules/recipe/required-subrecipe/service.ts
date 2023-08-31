import { RecipeSubrecipe } from "./model";
import { IRecipeSubrecipeRepo } from "./repo";

export class RecipeSubrecipeService {
  repo: IRecipeSubrecipeRepo;

  constructor(repo: IRecipeSubrecipeRepo) {
    this.repo = repo;
  }

  async create({ recipe_id, required_subrecipes }: CreateParams) {
    if (!required_subrecipes.length) return;

    const placeholders = '(?, ?, ?, ?),'
      .repeat(required_subrecipes.length)
      .slice(0, -1);  // use namedPlaceholders instead???

    const recipe_subrecipes = required_subrecipes.map(rs =>
      RecipeSubrecipe.create({recipe_id, ...rs}).getDTO()
    );

    await this.repo.insert({placeholders, recipe_subrecipes});
  }

  async update({ recipe_id, required_subrecipes }: UpdateParams) {
    if (!required_subrecipes.length) {
      await this.repo.deleteByRecipeId(recipe_id);
      return;
    }

    const placeholders = '(?, ?, ?, ?),'
      .repeat(required_subrecipes.length)
      .slice(0, -1);  // use namedPlaceholders instead???

    const recipe_subrecipes = required_subrecipes.map(rs =>
      RecipeSubrecipe.create({recipe_id, ...rs}).getDTO()
    );

    await this.repo.update({recipe_id, placeholders, recipe_subrecipes});
  }
}

type CreateParams = {
  recipe_id:           string;
  required_subrecipes: RequiredSubrecipe[];
};

type UpdateParams = CreateParams;

type RequiredSubrecipe = {
  amount?:      number;
  unit_id?:     number;
  subrecipe_id: string;  // use title instead??? and lookup id here?
};
