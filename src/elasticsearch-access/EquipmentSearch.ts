import { Client } from '@elastic/elasticsearch';

export class EquipmentSearch implements IEquipmentSearch {
  client: Client;

  constructor(esClient: Client) {
    this.client = esClient;
    this.findEquipment = this.findEquipment.bind(this);
    this.autoEquipment = this.autoEquipment.bind(this);
    this.saveEquipment = this.saveEquipment.bind(this);
    this.deleteEquipment = this.deleteEquipment.bind(this);
  }

  // deep pagination can kill performance, set upper bounds 
  async findEquipment(searchBody: object) {
    const { body } = await this.client.search({
      index: "equipment",
      body: searchBody
    });
    return body;
  }

  async autoEquipment(searchTerm: string) {
    const { body } = await this.client.search({
      index: "equipment",
      body: {
        highlight: {
          fragment_size: 200,  // less?
          number_of_fragments: 1,
          fields: {equipment_name: {}}
        },
        query: {
          bool: {
            must: [
              {
                match: {
                  equipment_name: {query: searchTerm, operator: "and"}
                }
              }
            ],
          }
        }
      },
      from: 0,
      size: 5
    });
    return body;
  }

  // (staff only)
  async saveEquipment({
    equipment_id,
    equipment_type_name,
    equipment_name,
    equipment_image
  }: ISavingEquipment) {
    const savedEquipment = await this.client.index({
      index: 'equipment',
      id: equipment_id,
      body: {
        equipment_id,
        equipment_type_name,
        equipment_name,
        equipment_image
      }
    });
    await this.client.indices.refresh({index: 'equipment'});
    return savedEquipment;
  }

  // (staff only)
  async deleteEquipment(equipmentId: string) {
    const deletedEquipment = await this.client.delete(
      {index: 'equipment', id: equipmentId},
      {ignore: [404]}
    );
    await this.client.indices.refresh({index: 'equipment'});
    return deletedEquipment;
  }
}

interface IEquipmentSearch {
  client: Client;
  findEquipment(searchBody: any): any;  // finish
  autoEquipment(searchTerm: string): any;  // finish
  saveEquipment({
    equipment_id,
    equipment_type_name,
    equipment_name,
    equipment_image
  }: ISavingEquipment): void;
  deleteEquipment(equipmentId: string): void;
}

interface ISavingEquipment {
  equipment_id: string;
  equipment_type_name: string;
  equipment_name: string;
  equipment_image: string;
}