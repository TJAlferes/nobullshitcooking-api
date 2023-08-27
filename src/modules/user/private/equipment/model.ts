import { assert, string } from 'superstruct';

import { GenerateUUIDv7StringId, UUIDv7StringId, NumberId, Notes } from '../../../shared/model';

export class PrivateEquipment {
  private equipment_id;
  private equipment_type_id;
  private owner_id;
  private equipment_name;
  private notes;
  private image_id;

  private constructor(params: ConstructorParams) {
    this.equipment_id      = UUIDv7StringId(params.equipment_id);
    this.equipment_type_id = NumberId(params.equipment_type_id);
    this.owner_id          = UUIDv7StringId(params.owner_id);
    this.equipment_name    = EquipmentName(params.equipment_name);
    this.notes             = Notes(params.notes);
    this.image_id          = UUIDv7StringId(params.image_id);
  }

  static create(params: CreateParams) {
    const equipment_id = GenerateUUIDv7StringId();

    const equipment = new PrivateEquipment({...params, equipment_id});

    return equipment;  // only return id ???
  }

  static update(params: UpdateParams) {}

  getDTO() {
    return {
      equipment_id:      this.equipment_id,
      equipment_type_id: this.equipment_type_id,
      owner_id:          this.owner_id,
      equipment_name:    this.equipment_name,
      notes:             this.notes,
      image_id:          this.image_id
    };
  }
}

export function EquipmentName(name: string) {
  assert(name, string());
  if (name.length > 100) {
    throw new Error("Equipment name must be no more than 100 characters.");
  }
  return name;
}

type CreateParams = {
  equipment_type_id: number;
  owner_id:          string;
  equipment_name:    string;
  notes:             string;
  image_id:          string;
};

type UpdateParams = CreateParams & {
  equipment_id: string;
}

type ConstructorParams = UpdateParams;
