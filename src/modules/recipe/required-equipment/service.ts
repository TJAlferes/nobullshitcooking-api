import { RecipeEquipment } from './model';
import { RecipeEquipmentRepoInterface } from './repo';

export class RecipeEquipmentService {
  repo: RecipeEquipmentRepoInterface;

  constructor(repo: RecipeEquipmentRepoInterface) {
    this.repo = repo;
  }

  async bulkCreate({ recipe_id, required_equipment }: BulkCreateParams) {
    if (required_equipment.length < 1) return;

    const placeholders = '(?, ?, ?),'.repeat(required_equipment.length).slice(0, -1);
    const recipe_equipment = required_equipment.map(({
      amount,
      equipment_id
    }) => 
      RecipeEquipment.create({
        recipe_id,
        amount: Number(amount),
        equipment_id
      }).getDTO()
    );
    await this.repo.bulkInsert({placeholders, recipe_equipment});
  }

  async bulkUpdate({ recipe_id, required_equipment }: BulkUpdateParams) {
    if (required_equipment.length < 1) {
      await this.repo.deleteByRecipeId(recipe_id);
      return;
    }

    const placeholders = '(?, ?, ?),'.repeat(required_equipment.length).slice(0, -1);
    const recipe_equipment = required_equipment.map(({
      amount,
      equipment_id
    }) => 
      RecipeEquipment.create({
        recipe_id,
        amount: Number(amount),
        equipment_id
      }).getDTO()
    );
    await this.repo.bulkUpdate({recipe_id, placeholders, recipe_equipment});
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
