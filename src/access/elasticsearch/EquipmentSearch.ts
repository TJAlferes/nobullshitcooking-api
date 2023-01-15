import { Client } from '@elastic/elasticsearch';

export class EquipmentSearch implements IEquipmentSearch {
  client: Client;

  constructor(esClient: Client) {
    this.client = esClient;
    this.find =   this.find.bind(this);
    this.auto =   this.auto.bind(this);
    this.save =   this.save.bind(this);
    this.delete = this.delete.bind(this);
  }

  // deep pagination can kill performance, set upper bounds 
  async find(searchBody: object) {
    const { body } = await this.client.search({index: "equipment", body: searchBody});
    return body;
  }

  async auto(term: string) {
    const { body } = await this.client.search({
      index: "equipment",
      body: {
        highlight: {
          fragment_size: 200,  // less?
          number_of_fragments: 1,
          fields: {
            name: {}
          }
        },
        query: {
          bool: {
            must: [
              {
                match: {
                  name: {
                    query: term,
                    operator: "and"
                  }
                }
              }
            ]
          }
        }
      },
      from: 0,
      size: 5
    });

    return body;
  }

  // (staff only)
  async save(equipment: ISavingEquipment) {
    const row = await this.client.index({
      index: 'equipment',
      id:    equipment.id,
      body: {
        id:                  equipment.id,
        equipment_type_name: equipment.equipment_type_name,
        name:                equipment.name,
        image:               equipment.image
      }
    });

    await this.client.indices.refresh({index: 'equipment'});

    return row;
  }

  // (staff only)
  async delete(id: string) {
    const row = await this.client.delete({index: 'equipment', id}, {ignore: [404]});

    await this.client.indices.refresh({index: 'equipment'});

    return row;
  }
}

export interface IEquipmentSearch {
  client:                            Client;
  find(searchBody: any):             any;  // finish
  auto(term: string):                any;  // finish
  save(equipment: ISavingEquipment): void;
  delete(id: string):                void;
}

interface ISavingEquipment {
  id:                  string;
  equipment_type_name: string;
  name:                string;
  image:               string;
}