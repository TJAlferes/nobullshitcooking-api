import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import type { Request, Response } from 'express';

import { ForbiddenException, NotFoundException } from '../../../utils/exceptions';
import { AwsS3PrivateUploadsClient } from '../../aws-s3/private-uploads/client';
import { Equipment } from '../../equipment/model';
import { EquipmentRepo } from '../../equipment/repo';
import { Image } from '../../image/model';
import { ImageRepo } from '../../image/repo';

export const privateEquipmentController = {
  async viewAll(req: Request, res: Response) {
    const owner_id  = req.session.user_id!;

    const repo = new EquipmentRepo();
    const equipment = await repo.viewAll(owner_id);

    return res.status(200).json(equipment);
  },

  async viewOne(req: Request, res: Response) {
    const { equipment_id } = req.params;
    const owner_id = req.session.user_id!;

    const repo = new EquipmentRepo();
    const equipment = await repo.viewOne(equipment_id);
    if (!equipment) throw new NotFoundException();
    if (owner_id !== equipment.owner_id) throw new ForbiddenException();

    return res.status(200).json(equipment);
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

    // TO DO: if image_filename === 'default' then no need to create image record,
    //        just reference the default equipment image_id (<-- TO DO)
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
    
    return res.status(201).json();
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
    if (!equipment) throw new NotFoundException();
    if (owner_id !== equipment.owner_id) throw new ForbiddenException();

    const imageRepo = new ImageRepo();
    const image = await imageRepo.viewOne(equipment.image_id);
    if (!image) throw new NotFoundException();
    if (owner_id !== image.owner_id) throw new ForbiddenException();

    const updated_image = Image.update({
      image_id,
      image_filename,
      caption,
      author_id,
      owner_id
    }).getDTO();
    await imageRepo.update(updated_image);

    const updated_equipment = Equipment.update({
      equipment_id,
      equipment_type_id,
      owner_id,
      equipment_name,
      notes,
      image_id
    }).getDTO();
    await equipmentRepo.update(updated_equipment);

    return res.status(204).json();
  },

  async deleteOne(req: Request, res: Response) {
    const { equipment_id } = req.params;
    const owner_id = req.session.user_id!;

    const equipmentRepo = new EquipmentRepo();
    const equipment = await equipmentRepo.viewOne(equipment_id);
    if (!equipment) throw new NotFoundException();
    if (equipment.owner_id !== owner_id) throw new ForbiddenException();

    await equipmentRepo.deleteOne({equipment_id, owner_id});

    // TO DO: if they're using the default image...
    const imageRepo = new ImageRepo();
    const image = await imageRepo.viewOne(equipment.image_id);
    if (!image) throw new NotFoundException();
    // If they don't own the image, then don't delete the image from S3 and MySQL
    if (image.owner_id !== owner_id) throw new ForbiddenException();

    await AwsS3PrivateUploadsClient.send(new DeleteObjectCommand({
      Bucket: 'nobsc-private-uploads',
      Key: `equipment/${owner_id}/${image.image_filename}-small.jpg`
    }));
    await AwsS3PrivateUploadsClient.send(new DeleteObjectCommand({
      Bucket: 'nobsc-private-uploads',
      Key: `equipment/${owner_id}/${image.image_filename}-tiny.jpg`
    }));

    // TO DO: make sure they are authorized
    // TO DO: if they're using the default image...
    await imageRepo.deleteOne({owner_id, image_id: image.image_id});

    return res.status(204).json();
  }
};
