import { IRecipeEquipmentRepo } from "./repo";

export class RecipeEquipmentService {
  repo: IRecipeEquipmentRepo;

  constructor(repo: IRecipeEquipmentRepo) {
    this.repo = repo;
  }

  async create({ recipe_id, required_equipment }: CreateParams) {
    if (!required_equipment.length) return;

    required_equipment.map(({ amount, equipment_id }) =>
      assert({recipe_id, amount, equipment_id}, validRecipeEquipment));

    const placeholders = '(?, ?, ?),'.repeat(required_equipment.length).slice(0, -1);

    const values: number[] = [];

    required_equipment.map(({ amount, equipment_id }) =>
      values.push(recipe_id, amount, equipment_id));

    await this.repo.insert(placeholders, values);
  }
}

type CreateParams = {
  recipe_id:            string;
  required_equipment: RequiredEquipment[];
};

type RequiredEquipment = {
  amount?:      number;
  equipment_id: string;
};
