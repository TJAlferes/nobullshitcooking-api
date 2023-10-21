import type {
  RequiredEquipment,
  RequiredIngredient,
  RequiredSubrecipe
} from "../../recipe/model.js";

export interface EquipmentRepoInterface {
  hasPrivate: (equipment_ids: string[]) => Promise<boolean>;
}

export interface IngredientRepoInterface {
  hasPrivate: (ingredient_ids: string[]) => Promise<boolean>;
}

export interface RecipeRepoInterface {
  hasPrivate: (recipe_ids: string[]) => Promise<boolean>;
}

export class PublicRecipeService {
  equipmentRepo:  EquipmentRepoInterface;
  ingredientRepo: IngredientRepoInterface;
  recipeRepo:     RecipeRepoInterface;

  constructor({ equipmentRepo, ingredientRepo, recipeRepo }: ConstructorParams) {
    this.equipmentRepo  = equipmentRepo;
    this.ingredientRepo = ingredientRepo;
    this.recipeRepo     = recipeRepo;
  }
  
  async checkForPrivateContent(params: CheckForPrivateContentParams) {
    // Examine each required equipment/ingredient/subrecipe.
    // If any are private, abort the creation of this recipe,
    // as public user recipes may NOT contain private content.
    if (params.required_equipment.length > 0) {
      const equipment_ids = params.required_equipment.map(re => re.equipment_id);
      const hasPrivate = await this.equipmentRepo.hasPrivate(equipment_ids);
      if (hasPrivate) {
        throw new Error('Public content may not contain private content.');
      }
    }
    if (params.required_ingredients.length > 0) {
      const ingredient_ids = params.required_ingredients.map(ri => ri.ingredient_id);
      const hasPrivate = await this.ingredientRepo.hasPrivate(ingredient_ids);
      if (hasPrivate) {
        throw new Error('Public content may not contain private content.');
      }
    }
    if (params.required_subrecipes.length > 0) {
      const subrecipe_ids = params.required_subrecipes.map(rs => rs.subrecipe_id);
      const hasPrivate = await this.recipeRepo.hasPrivate(subrecipe_ids);
      if (hasPrivate) {
        throw new Error('Public content may not contain private content.');
      }
    }
  }
}

type ConstructorParams = {
  equipmentRepo:  EquipmentRepoInterface;
  ingredientRepo: IngredientRepoInterface;
  recipeRepo:     RecipeRepoInterface;
};

// TO DO: handle optional amount and unit
type CheckForPrivateContentParams = {
  required_equipment:   RequiredEquipment[];
  required_ingredients: RequiredIngredient[];
  required_subrecipes:  RequiredSubrecipe[];
};
