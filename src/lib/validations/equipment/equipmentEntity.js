const { struct } = require('superstruct');

const validEquipmentEntity = struct(
  {
    equipmentTypeId: 'number',
    authorId: 'number',
    ownerId: 'number',
    equipmentName: 'string',
    equipmentDescription: 'string',
    equipmentImage: 'string'
  },
  {
    equipmentImage: 'nobsc-equipment-default.png'
  }
);

module.exports = validEquipmentEntity;