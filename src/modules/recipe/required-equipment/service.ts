import { RecipeEquipment } from './model';
import { RecipeEquipmentRepoInterface } from './repo';

export class RecipeEquipmentService {
  repo: RecipeEquipmentRepoInterface;

  constructor(repo: RecipeEquipmentRepoInterface) {
    this.repo = repo;
  }

  async bulkCreate({ recipe_id, required_equipment }: BulkCreateParams) {
    if (required_equipment.length < 1) return true;

    const placeholders = '(?, ?, ?),'.repeat(required_equipment.length).slice(0, -1);
    const recipe_equipment = required_equipment.map(re => 
      RecipeEquipment.create({recipe_id, ...re}).getDTO()
    );
    const result = await this.repo.bulkInsert({placeholders, recipe_equipment});
    return result;
  }

  async bulkUpdate({ recipe_id, required_equipment }: BulkUpdateParams) {
    if (required_equipment.length < 1) {
      const result = await this.repo.deleteByRecipeId(recipe_id);
      return result;
    }

    const placeholders = '(?, ?, ?),'.repeat(required_equipment.length).slice(0, -1);
    const recipe_equipment = required_equipment.map(re => 
      RecipeEquipment.create({recipe_id, ...re}).getDTO()
    );
    const result = await this.repo.bulkUpdate({recipe_id, placeholders, recipe_equipment});
    return result;
  }
}

type BulkCreateParams = {
  recipe_id:          string;
  required_equipment: RequiredEquipment[];
};

type BulkUpdateParams = BulkCreateParams;

type RequiredEquipment = {
  amount:       number | null;
  equipment_id: string;
};
