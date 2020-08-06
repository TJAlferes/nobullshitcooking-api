import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { pool } from '../../lib/connections/mysqlPoolConnection';
import {
  validEquipmentEntity
} from '../../lib/validations/equipment/equipmentEntity';
import { Equipment } from '../../mysql-access/Equipment';
import { RecipeEquipment } from '../../mysql-access/RecipeEquipment';

export const userEquipmentController = {
  view: async function(req: Request, res: Response) {
    const authorId = req.session!.userInfo.id;
    const ownerId = req.session!.userInfo.id;

    const equipment = new Equipment(pool);

    const rows = await equipment.view(authorId, ownerId);

    return res.send(rows);
  },
  viewById: async function(req: Request, res: Response) {
    const id = Number(req.body.id);
    const authorId = req.session!.userInfo.id;
    const ownerId = req.session!.userInfo.id;

    const equipment = new Equipment(pool);

    const [ row ] = await equipment.viewById(id, authorId, ownerId);

    return res.send(row);
  },
  create: async function(req: Request, res: Response) {
    const equipmentTypeId = Number(req.body.equipmentInfo.equipmentTypeId);
    const { name, description, image } = req.body.equipmentInfo;

    const authorId = req.session!.userInfo.id;
    const ownerId = req.session!.userInfo.id;

    const equipmentToCreate = {
      equipmentTypeId,
      authorId,
      ownerId,
      name,
      description,
      image
    };

    assert(equipmentToCreate, validEquipmentEntity);

    const equipment = new Equipment(pool);

    await equipment.createPrivate(equipmentToCreate);

    return res.send({message: 'Equipment created.'});
  },
  update: async function(req: Request, res: Response) {
    const id = Number(req.body.equipmentInfo.id);
    const equipmentTypeId = Number(req.body.equipmentInfo.equipmentTypeId);
    const { name, description, image } = req.body.equipmentInfo;

    const authorId = req.session!.userInfo.id;
    const ownerId = req.session!.userInfo.id;

    const equipmentToUpdateWith = {
      equipmentTypeId,
      authorId,
      ownerId,
      name,
      description,
      image
    };

    assert(equipmentToUpdateWith, validEquipmentEntity);

    const equipment = new Equipment(pool);

    await equipment.updatePrivate({id, ...equipmentToUpdateWith});

    return res.send({message: 'Equipment updated.'});
  },
  delete: async function(req: Request, res: Response) {
    const id = Number(req.body.id);
    const ownerId = req.session!.userInfo.id;

    const recipeEquipment = new RecipeEquipment(pool);
    const equipment = new Equipment(pool);

    await recipeEquipment.deleteByEquipmentId(id);
    await equipment.deleteByOwnerId(id, ownerId);

    return res.send({message: 'Equipment deleted.'});
  }
};