import { assert, number, string } from 'superstruct';

import { GenerateId, Id, Description, Image } from './shared';

export class Equipment {
  private id;
  private equipmentTypeId;
  private authorId;
  private ownerId;
  private name;
  private description;
  private image;

  private constructor(params: EquipmentParams) {
    this.id              = GenerateId();
    this.equipmentTypeId = EquipmentTypeId(params.equipmentTypeId);
    this.authorId        = Id(params.authorId);
    this.ownerId         = Id(params.ownerId);
    this.name            = EquipmentName(params.name);
    this.description     = Description(params.description);
    this.image           = Image(params.image);
  }

  static create(params: EquipmentParams) {
    const equipment = new Equipment(params);
    return equipment;  // only return id ???
  }
}

export function EquipmentTypeId(equipmentTypeId: number) {
  assert(equipmentTypeId, number());
  return equipmentTypeId;
}

export function EquipmentName(name: string) {
  assert(name, string());
  if (name.length > 100) {
    throw new Error("Equipment name must be no more than 100 characters.");
  }
  return ;
}

type EquipmentParams = {
  equipmentTypeId: number;
  authorId:        string;
  ownerId:         string;
  name:            string;
  description:     string;
  image:           string;
};
