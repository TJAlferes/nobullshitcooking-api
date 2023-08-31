import { IngredientAltName } from "./model";
import { IngredientAltNameRepoInterface } from "./repo";

export class IngredientAltNameService {
  repo: IngredientAltNameRepoInterface;

  constructor(repo: IngredientAltNameRepoInterface) {
    this.repo = repo;
  }

  async create({ ingredient_id, alt_names }: CreateParams) {
    if (!alt_names.length) return;

    const placeholders = '(?, ?),'.repeat(alt_names.length).slice(0, -1);

    const valid_alt_names = alt_names.map((alt_name: string) =>
      IngredientAltName.create({ingredient_id, alt_name}).getDTO()
    );

    await this.repo.insert({placeholders, alt_names: valid_alt_names});
  }

  async update({ ingredient_id, alt_names }: UpdateParams) {
    if (!alt_names.length) {
      await this.repo.deleteByIngredientId(ingredient_id);
      return;
    }

    const placeholders = '(?, ?),'.repeat(alt_names.length).slice(0, -1);
    
    const valid_alt_names = alt_names.map((alt_name: string) =>
      IngredientAltName.create({ingredient_id, alt_name}).getDTO()
    );

    await this.repo.update({ingredient_id, placeholders, alt_names: valid_alt_names});
  }
}

type CreateParams = {
  ingredient_id: string;
  alt_names:     string[];
};

type UpdateParams = CreateParams;
