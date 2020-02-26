class EquipmentSearch {
  constructor(esClient) {
    this.client = esClient;
    this.findEquipment = this.findEquipment.bind(this);
    this.autoEquipment = this.autoEquipment.bind(this);
    this.saveEquipment = this.saveEquipment.bind(this);
    this.deleteEquipment = this.deleteEquipment.bind(this);
  }

  async findEquipment(searchBody) {  // deep pagination can kill performance, set upper bounds 
    const { body } = await this.client.search({
      index: "equipment",
      body: searchBody
    });
    return body;
  }

  async autoEquipment(searchTerm) {
    const { body } = await this.client.search({
      index: "equipment",
      body: {
        highlight: {
          fragment_size: 200,  // less?
          number_of_fragments: 1,
          fields: {equipmentName: {}}
        },
        query: {
          bool: {
            must: [
              {
                match: {
                  equipmentName: {query: searchTerm, operator: "and"}
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
    equipmentId,
    equipmentTypeName,
    equipmentName,
    equipmentImage
  }) {
    const savedEquipment = await this.client.index({
      index: 'equipment',
      id: equipmentId,
      body: {
        equipmentId,
        equipmentTypeName,
        equipmentName,
        equipmentImage
      }
    });
    await this.client.indices.refresh({index: 'equipment'});
    return savedEquipment;
  }

  // (staff only)
  async deleteEquipment(equipmentId) {
    const deletedEquipment = await this.client.delete(
      {index: 'equipment', id: equipmentId},
      {ignore: [404]}
    );
    await this.client.indices.refresh({index: 'equipment'});
    return deletedEquipment;
  }
}

module.exports = EquipmentSearch;