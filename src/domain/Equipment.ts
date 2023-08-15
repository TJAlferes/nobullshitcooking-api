import { assert, number, string } from 'superstruct';

import { GenerateId, Id, Description, Image } from './shared';

export class Equipment {
  private id;
  private equipment_type_id;
  private author_id;
  private owner_id;
  private equipment_name;
  private description;
  private image;

  private constructor(params: ConstructorParams) {
    this.id              = GenerateId();
    this.equipment_type_id = EquipmentTypeId(params.equipment_type_id);
    this.author_id        = Id(params.author_id);
    this.owner_id         = Id(params.owner_id);
    this.equipment_name  = EquipmentName(params.equipment_name);
    this.description     = Description(params.description);
    this.image           = Image(params.image);
  }

  static create(params: CreateParams) {
    const equipment_id = GenerateId();

    const equipment = new Equipment({...params, equipment_id});

    return equipment;  // only return id ???
  }

  static update(params: UpdateParams) {}
}

export function EquipmentTypeId(equipment_type_id: number) {
  assert(equipment_type_id, number());
  return equipment_type_id;
}

export function EquipmentName(name: string) {
  assert(name, string());
  if (name.length > 100) {
    throw new Error("Equipment name must be no more than 100 characters.");
  }
  return ;
}

type CreateParams = {
  equipment_type_id: number;
  author_id:         string;
  owner_id:          string;
  equipment_name:            string;
  description:     string;
  image:           string;
};

type UpdateParams = CreateParams & {
  equipment_id: string;
}

type ConstructorParams = UpdateParams;
