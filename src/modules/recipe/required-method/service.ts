import { RecipeMethod } from "./model";
import { IRecipeMethodRepo } from "./repo";

export class RecipeMethodService {
  repo: IRecipeMethodRepo;

  constructor(repo: IRecipeMethodRepo) {
    this.repo = repo;
  }

  async create({ recipe_id, required_methods }: CreateParams) {
    if (!required_methods.length) return;

    const placeholders = '(?, ?),'.repeat(required_methods.length).slice(0, -1);  // if 3 methods, then: (?, ?),(?, ?),(?, ?)
    
    const recipe_methods = required_methods.map(rm =>
      RecipeMethod.create({recipe_id, ...rm}).getDTO()
    );

    await this.repo.insert({placeholders, recipe_methods});
  }
}

type CreateParams = {
  recipe_id:        string;
  required_methods: RequiredMethod[];
};

type RequiredMethod = {
  method_id: number;
};
