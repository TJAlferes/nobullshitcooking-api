import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import type { Request, Response } from 'express';

import { Equipment } from '../../equipment/model.js';
import { EquipmentRepo } from '../../equipment/repo.js';
import { ImageRepo } from '../../image/repo.js';
import { NotFoundException, UnauthorizedException } from '../../../utils/exceptions.js';

const s3 = new S3Client({
  credentials: {
    accessKeyId:     process.env.AWS_S3_PRIVATE_UPLOADS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_S3_PRIVATE_UPLOADS_SECRET_ACCESS_KEY!
  }, 
  region: "us-east-1"
});

export const privateEquipmentController = {
  async viewAll(req: Request, res: Response) {
    const owner_id  = req.session.user_id!;

    const repo = new EquipmentRepo();
    const rows = await repo.viewAll(owner_id);

    return res.send(rows);
  },

  async viewOne(req: Request, res: Response) {
    const equipment_id = req.body.equipment_id;
    const owner_id     = req.session.user_id!;

    const repo = new EquipmentRepo();
    const row = await repo.viewOne({equipment_id, owner_id});

    return res.send(row);
  },

  async create(req: Request, res: Response) {
    const { equipment_name, notes, image_id } = req.body;
    const equipment_type_id = Number(req.body.equipment_type_id);
    const owner_id          = req.session.user_id!;

    const repo = new EquipmentRepo();
    const equipment = Equipment.create({
      equipment_type_id,
      owner_id,
      equipment_name,
      notes,
      image_id
    }).getDTO();
    await repo.insert(equipment);
    
    return res.status(201);
  },

  async update(req: Request, res: Response) {
    const { equipment_id, equipment_name, notes, image_id } = req.body;
    const equipment_type_id = Number(req.body.equipment_type_id);
    const owner_id          = req.session.user_id!;

    const repo = new EquipmentRepo();

    const equipment = await repo.getOneByEquipmentId(equipment_id);
    if (!equipment) throw NotFoundException();
    if (owner_id !== equipment.owner_id) throw UnauthorizedException();

    const updated_equipment = Equipment.update({
      equipment_id,
      equipment_type_id,
      owner_id,
      equipment_name,
      notes,
      image_id
    }).getDTO();
    await repo.update(updated_equipment);

    return res.status(204);
  },

  async deleteOne(req: Request, res: Response) {
    const equipment_id = req.body.equipment_id;
    const owner_id     = req.session.user_id!;

    const repo = new EquipmentRepo();
    const equipment = await repo.getOneByEquipmentId(equipment_id);
    if (!equipment) throw NotFoundException();
    if (owner_id !== equipment.owner_id) throw UnauthorizedException();

    const imageRepo = new ImageRepo();
    const image = await imageRepo.getOneByImageId(equipment.image_id);
    if (!image) throw NotFoundException();
    if (owner_id !== image.owner_id) throw UnauthorizedException();

    await s3.send(new DeleteObjectCommand({
      Bucket: 'nobsc-private-uploads',
      Key: `
        nobsc-private-uploads/equipment
        /${owner_id}
        /${image.image_filename}
      `
    }));

    await repo.deleteOne({equipment_id, owner_id});

    return res.status(204);
  }
};
