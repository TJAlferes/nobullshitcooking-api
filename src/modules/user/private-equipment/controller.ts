import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import type { Request, Response } from 'express';

import { ForbiddenException, NotFoundException } from '../../../utils/exceptions.js';
import { Equipment } from '../../equipment/model.js';
import { EquipmentRepo } from '../../equipment/repo.js';
import { Image } from '../../image/model.js';
import { ImageRepo } from '../../image/repo.js';

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
    const equipment = await repo.viewAll(owner_id);

    return res.json(equipment);
  },

  async viewOne(req: Request, res: Response) {
    const equipment_id = req.body.equipment_id;
    const owner_id     = req.session.user_id!;

    const repo = new EquipmentRepo();
    const equipment = await repo.viewOne(equipment_id);
    if (!equipment) throw NotFoundException();
    if (owner_id !== equipment.owner_id) throw ForbiddenException();

    return res.json(equipment);
  },

  async create(req: Request, res: Response) {
    const {
      equipment_name,
      notes,
      image_filename,
      caption
    } = req.body;
    const equipment_type_id = Number(req.body.equipment_type_id);
    const author_id         = req.session.user_id!;
    const owner_id          = req.session.user_id!;

    const image = Image.create({
      image_filename,
      caption,
      author_id,
      owner_id
    }).getDTO();
    const imageRepo = new ImageRepo();
    await imageRepo.insert(image);

    const equipment = Equipment.create({
      equipment_type_id,
      owner_id,
      equipment_name,
      notes,
      image_id: image.image_id
    }).getDTO();
    const equipmentRepo = new EquipmentRepo();
    await equipmentRepo.insert(equipment);
    
    return res.status(201);
  },

  async update(req: Request, res: Response) {
    const {
      equipment_id,
      equipment_name,
      notes,
      image_id,
      image_filename,
      caption
    } = req.body;
    const equipment_type_id = Number(req.body.equipment_type_id);
    const author_id         = req.session.user_id!;
    const owner_id          = req.session.user_id!;

    const equipmentRepo = new EquipmentRepo();
    const equipment = await equipmentRepo.viewOne(equipment_id);
    if (!equipment) throw NotFoundException();
    if (owner_id !== equipment.owner_id) throw ForbiddenException();

    const imageRepo = new ImageRepo();
    const image = await imageRepo.viewOne(equipment.image_id);
    if (!image) throw NotFoundException();
    if (owner_id !== image.owner_id) throw ForbiddenException();

    const updated_image = Image.update({
      image_id,
      image_filename,
      caption,
      author_id,
      owner_id
    }).getDTO();
    await imageRepo.insert(updated_image);

    const updated_equipment = Equipment.update({
      equipment_id,
      equipment_type_id,
      owner_id,
      equipment_name,
      notes,
      image_id
    }).getDTO();
    await equipmentRepo.update(updated_equipment);

    return res.status(204);
  },

  async deleteOne(req: Request, res: Response) {
    const equipment_id = req.body.equipment_id;
    const owner_id     = req.session.user_id!;

    const equipmentRepo = new EquipmentRepo();
    const equipment = await equipmentRepo.viewOne(equipment_id);
    if (!equipment) throw NotFoundException();
    if (equipment.owner_id !== owner_id) throw ForbiddenException();

    const imageRepo = new ImageRepo();
    const image = await imageRepo.viewOne(equipment.image_id);
    if (!image) throw NotFoundException();
    if (image.owner_id !== owner_id) throw ForbiddenException();

    await s3.send(new DeleteObjectCommand({
      Bucket: 'nobsc-private-uploads',
      Key: `
        nobsc-private-uploads/equipment
        /${owner_id}
        /${image.image_filename}
      `
    }));

    await equipmentRepo.deleteOne({equipment_id, owner_id});

    return res.status(204);
  }
};
