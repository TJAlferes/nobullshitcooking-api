import { IRecipeMethodRepo } from "./repo";

export class RecipeMethodService {
  repo: IRecipeMethodRepo;

  constructor(repo: IRecipeMethodRepo) {
    this.repo = repo;
  }

  async create({ recipe_id, required_methods }: CreateParams) {
    if (!required_methods.length) return;

    // TO DO: use domain
    required_methods.map(({ method_id }) =>
      assert({recipe_id, method_id}, validRecipeMethod));

    const placeholders = '(?, ?),'.repeat(required_methods.length).slice(0, -1);  // if 3 methods, then: (?, ?),(?, ?),(?, ?)
    
    const values: number[] = [];
    
    required_methods.map(({ method_id }) => values.push(recipe_id, method_id));

    await this.repo.insert(placeholders, values);
  }
}

type CreateParams = {
  recipe_id:        string;
  required_methods: RequiredMethod[];
};

type RequiredMethod = {
  method_id: string;
};
