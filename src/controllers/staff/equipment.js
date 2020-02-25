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
    const [ row ] = await equipment.createEquipment(equipmentToCreate);

    // TO DO: ElasticSearch

    res.send(row);
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
    const [ row ] = await equipment.updateEquipment(equipmentToUpdateWith, equipmentId);

    // TO DO: ElasticSearch

    res.send(row);
  },
  deleteEquipment: async function(req, res) {
    const equipmentId = Number(req.sanitize(req.body.equipmentId));
    const equipment = new Equipment(pool);
    const [ row ] = await equipment.deleteEquipment(equipmentId);

    // TO DO: ElasticSearch

    res.send(row);
  }
};

module.exports = staffEquipmentController;