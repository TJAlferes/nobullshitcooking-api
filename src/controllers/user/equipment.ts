import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { pool } from '../../lib/connections/mysqlPoolConnection';
import {
  validEquipmentEntity
} from '../../lib/validations/equipment/equipmentEntity';
import { Equipment } from '../../mysql-access/Equipment';
import { RecipeEquipment } from '../../mysql-access/RecipeEquipment';

export const userEquipmentController = {
  viewAllMyPrivateUserEquipment: async function(req: Request, res: Response) {
    const authorId = req.session!.userInfo.userId;
    const ownerId = req.session!.userInfo.userId;

    const equipment = new Equipment(pool);

    const rows = await equipment.viewEquipment(authorId, ownerId);

    res.send(rows);
  },
  viewMyPrivateUserEquipment: async function(req: Request, res: Response) {
    const equipmentId = Number(req.body.equipmentId);
    const authorId = req.session!.userInfo.userId;
    const ownerId = req.session!.userInfo.userId;

    const equipment = new Equipment(pool);

    const [ row ] = await equipment
    .viewEquipmentById(equipmentId, authorId, ownerId);

    res.send(row);
  },
  createMyPrivateUserEquipment: async function(req: Request, res: Response) {
    const equipmentTypeId = Number(req.body.equipmentInfo.equipmentTypeId);
    const equipmentName = req.body.equipmentInfo.equipmentName;
    const equipmentDescription = req.body.equipmentInfo.equipmentDescription;
    const equipmentImage = req.body.equipmentInfo.equipmentImage;

    const authorId = req.session!.userInfo.userId;
    const ownerId = req.session!.userInfo.userId;

    const equipmentToCreate = {
      equipmentTypeId,
      authorId,
      ownerId,
      equipmentName,
      equipmentDescription,
      equipmentImage
    };

    assert(equipmentToCreate, validEquipmentEntity);

    const equipment = new Equipment(pool);

    await equipment.createMyPrivateUserEquipment(equipmentToCreate);

    res.send({message: 'Equipment created.'});
  },
  updateMyPrivateUserEquipment: async function(req: Request, res: Response) {
    const equipmentId = Number(req.body.equipmentInfo.equipmentId);
    const equipmentTypeId = Number(req.body.equipmentInfo.equipmentTypeId);
    const equipmentName = req.body.equipmentInfo.equipmentName;
    const equipmentDescription = req.body.equipmentInfo.equipmentDescription;
    const equipmentImage = req.body.equipmentInfo.equipmentImage;

    const authorId = req.session!.userInfo.userId;
    const ownerId = req.session!.userInfo.userId;

    const equipmentToUpdateWith = {
      equipmentTypeId,
      authorId,
      ownerId,
      equipmentName,
      equipmentDescription,
      equipmentImage
    };

    assert(equipmentToUpdateWith, validEquipmentEntity);

    const equipment = new Equipment(pool);

    await equipment.updateMyPrivateUserEquipment({
      equipmentId,
      ...equipmentToUpdateWith
    });

    res.send({message: 'Equipment updated.'});
  },
  deleteMyPrivateUserEquipment: async function(req: Request, res: Response) {
    const equipmentId = Number(req.body.equipmentId);
    const ownerId = req.session!.userInfo.userId;

    const recipeEquipment = new RecipeEquipment(pool);
    const equipment = new Equipment(pool);

    await recipeEquipment.deleteRecipeEquipmentByEquipmentId(equipmentId);
    await equipment.deleteMyPrivateUserEquipment(equipmentId, ownerId);

    res.send({message: 'Equipment deleted.'});
  }
};