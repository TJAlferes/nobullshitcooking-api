const pool = require('../../lib/connections/mysqlPoolConnection');
const Equipment = require('../../mysql-access/Equipment');
const validEquipmentEntity = require('../../lib/validations/equipment/equipmentEntity');

const staffEquipmentController = {
  createEquipment: async function(req, res) {
    const equipmentTypeId = Number(req.sanitize(req.body.equipmentInfo.equipmentTypeId));
    const equipmentName = req.sanitize(req.body.equipmentInfo.equipmentName);
    const equipmentDescription = req.sanitize(req.body.equipmentInfo.equipmentDescription);
    const equipmentImage = req.sanitize(req.body.equipmentInfo.equipmentImage);

    const authorId = 1;
    const ownerId = 1;

    const equipmentToCreate = validEquipmentEntity({
      equipmentTypeId,
      authorId,
      ownerId,
      equipmentName,
      equipmentDescription,
      equipmentImage
    });
    const equipment = new Equipment(pool);
    await equipment.createEquipment(equipmentToCreate);

    const [ equipmentForInsert ] = await equipment
    .getEquipmentForElasticSearchInsert(equipmentId);

    const equipmentInfo = {
      equipmentId: equipmentForInsert.equipmentId,
      equipmentTypeName: equipmentForInsert.equipmentTypeName,
      equipmentName: equipmentForInsert.equipmentName,
      equipmentImage: equipmentForInsert.equipmentImage
    };

    await equipmentSearch.saveEquipment(equipmentInfo);

    res.send({message: 'Equipment created.'});
  },
  updateEquipment: async function(req, res) {
    const equipmentId = Number(req.sanitize(req.body.equipmentInfo.equipmentId));
    const equipmentTypeId = Number(req.sanitize(req.body.equipmentInfo.equipmentTypeId));
    const equipmentName = req.sanitize(req.body.equipmentInfo.equipmentName);
    const equipmentDescription = req.sanitize(req.body.equipmentInfo.equipmentDescription);
    const equipmentImage = req.sanitize(req.body.equipmentInfo.equipmentImage);

    const authorId = 1;
    const ownerId = 1;

    const equipmentToUpdateWith = validEquipmentEntity({
      equipmentTypeId,
      authorId,
      ownerId,
      equipmentName,
      equipmentDescription,
      equipmentImage
    });
    const equipment = new Equipment(pool);
    await equipment.updateEquipment(equipmentToUpdateWith, equipmentId);

    // TO DO: ElasticSearch

    res.send({message: 'Equipment updated.'});
  },
  deleteEquipment: async function(req, res) {
    const equipmentId = Number(req.sanitize(req.body.equipmentId));
    const equipment = new Equipment(pool);
    await equipment.deleteEquipment(equipmentId);

    // TO DO: ElasticSearch

    res.send({message: 'Equipment deleted.'});
  }
};

module.exports = staffEquipmentController;