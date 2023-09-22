import { UUIDv7StringId } from '../../shared/model';

export class SavedRecipe {
  private user_id;
  private recipe_id;

  private constructor(params: ConstructorParams) {
    this.user_id   = UUIDv7StringId(params.user_id);
    this.recipe_id = UUIDv7StringId(params.recipe_id);
  }

  static create(params: CreateParams) {
    return new SavedRecipe(params);
  }

  getDTO() {
    return {
      user_id:   this.user_id,
      recipe_id: this.recipe_id
    };
  }
}

type CreateParams = {
  user_id:   string;
  recipe_id: string;
};

type ConstructorParams = CreateParams;
