const pool = require('../../lib/connections/mysqlPoolConnection');
const RecipeEquipment = require('../../mysql-access/RecipeEquipment');
const Equipment = require('../../mysql-access/Equipment');
const validEquipmentEntity = require('../../lib/validations/equipment/equipmentEntity');

const userEquipmentController = {
  viewAllMyPrivateUserEquipment: async function(req, res) {
    const ownerId = req.session.userInfo.userId;
    const equipment = new Equipment(pool);
    const rows = await equipment.viewAllMyPrivateUserEquipment(ownerId);
    res.send(rows);
  },
  viewMyPrivateUserEquipment: async function(req, res) {
    const equipmentId = Number(req.sanitize(req.body.equipmentId));
    const ownerId = req.session.userInfo.userId;
    const equipment = new Equipment(pool);
    const [ row ] = await equipment.viewMyPrivateUserEquipment(ownerId, equipmentId);
    res.send(row);
  },
  createMyPrivateUserEquipment: async function(req, res) {
    const equipmentTypeId = Number(req.sanitize(req.body.equipmentInfo.equipmentTypeId));
    const equipmentName = req.sanitize(req.body.equipmentInfo.equipmentName);
    const equipmentDescription = req.sanitize(req.body.equipmentInfo.equipmentDescription);
    const equipmentImage = req.sanitize(req.body.equipmentInfo.equipmentImage);

    const authorId = req.session.userInfo.userId;
    const ownerId = req.session.userInfo.userId;

    const equipmentToCreate = validEquipmentEntity({
      equipmentTypeId,
      authorId,
      ownerId,
      equipmentName,
      equipmentDescription,
      equipmentImage
    });
    const equipment = new Equipment(pool);
    await equipment.createMyPrivateUserEquipment(equipmentToCreate);
    res.send({message: 'Equipment created.'});
  },
  updateMyPrivateUserEquipment: async function(req, res) {
    const equipmentId = Number(req.sanitize(req.body.equipmentInfo.equipmentId));
    const equipmentTypeId = Number(req.sanitize(req.body.equipmentInfo.equipmentTypeId));
    const equipmentName = req.sanitize(req.body.equipmentInfo.equipmentName);
    const equipmentDescription = req.sanitize(req.body.equipmentInfo.equipmentDescription);
    const equipmentImage = req.sanitize(req.body.equipmentInfo.equipmentImage);

    const authorId = req.session.userInfo.userId;
    const ownerId = req.session.userInfo.userId;

    const equipmentToUpdateWith = validEquipmentEntity({
      equipmentTypeId,
      authorId,
      ownerId,
      equipmentName,
      equipmentDescription,
      equipmentImage
    });
    const equipment = new Equipment(pool);
    await equipment.updateMyPrivateUserEquipment(equipmentToUpdateWith, equipmentId);
    res.send({message: 'Equipment updated.'});
  },
  deleteMyPrivateUserEquipment: async function(req, res) {
    const equipmentId = Number(req.sanitize(req.body.equipmentId));
    const ownerId = req.session.userInfo.userId;
    const recipeEquipment = new RecipeEquipment(pool);
    const equipment = new Equipment(pool);
    await recipeEquipment.deleteRecipeEquipmentByEquipmentId(equipmentId);
    await equipment.deleteMyPrivateUserEquipment(ownerId, equipmentId);
    res.send({message: 'Equipment deleted.'});
  }
};

module.exports = userEquipmentController;