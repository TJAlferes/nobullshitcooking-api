import { EquipmentRepoInterface }  from '../../equipment/repo';
import { IngredientRepoInterface } from '../../ingredient/repo';
import { RecipeRepoInterface }     from '../../recipe/repo';

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
    if (params.required_equipment.length) {
      const equipment_ids = params.required_equipment.map(re => re.equipment_id);
      const hasPrivate = await this.equipmentRepo.hasPrivate(equipment_ids);
      if (hasPrivate) {
        throw new Error('Public content may not contain private content.');
      }
    }
    if (params.required_ingredients.length) {
      const ingredient_ids = params.required_ingredients.map(ri => ri.ingredient_id);
      const hasPrivate = await this.ingredientRepo.hasPrivate(ingredient_ids);
      if (hasPrivate) {
        throw new Error('Public content may not contain private content.');
      }
    }
    if (params.required_subrecipes.length) {
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

type CheckForPrivateContentParams = {
  required_equipment:   RequiredEquipment[];
  required_ingredients: RequiredIngredient[];
  required_subrecipes:  RequiredSubrecipe[];
};



export type RecipeUpload = {
  recipe_type_id:       number;
  cuisine_id:           number;
  title:                string;
  description:          string;
  active_time:          string;
  total_time:           string;
  directions:           string;
  required_methods:     RequiredMethod[];
  required_equipment:   RequiredEquipment[];
  required_ingredients: RequiredIngredient[];
  required_subrecipes:  RequiredSubrecipe[];
  recipe_image:         ImageUpload & {
    thumb: File | null;
    tiny:  File | null;
  },
  equipment_image:      ImageUpload,
  ingredients_image:    ImageUpload,
  cooking_image:        ImageUpload
};

export type RecipeUpdateUpload = RecipeUpload & {
  recipe_id: string;
};


export type RequiredMethod = {
  method_id: number;
};

export type RequiredEquipment = {
  amount:       number;
  equipment_id: string;
};

export type RequiredIngredient = {
  amount:        number;
  unit_id:       number;
  ingredient_id: string;
};

export type RequiredSubrecipe = {
  amount:       number;
  unit_id:      number;
  subrecipe_id: string;
};

type ImageUpload = {
  image_filename: string;
  caption:        string;
  medium:         File | null;
};
