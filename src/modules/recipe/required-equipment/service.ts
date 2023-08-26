
import { RecipeEquipment } from "./model";
import { IRecipeEquipmentRepo } from "./repo";

export class RecipeEquipmentService {
  repo: IRecipeEquipmentRepo;

  constructor(repo: IRecipeEquipmentRepo) {
    this.repo = repo;
  }

  async create({ recipe_id, required_equipment }: CreateParams) {
    if (!required_equipment.length) return;

    const placeholders = '(?, ?, ?),'.repeat(required_equipment.length).slice(0, -1);

    const recipe_equipment = required_equipment.map(re => 
      RecipeEquipment.create({...re, recipe_id}).getDTO()
    );

    await this.repo.insert({placeholders, recipe_equipment});
  }
}

type CreateParams = {
  recipe_id:          string;
  required_equipment: RequiredEquipment[];
};

type RequiredEquipment = {
  amount?:      number;
  equipment_id: string;
};
