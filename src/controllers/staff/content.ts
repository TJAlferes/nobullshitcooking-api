import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { Content } from '../../access/mysql';
import {
  validCreatingContent,
  validUpdatingContent
} from '../../lib/validations';

export class StaffContentController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async create(req: Request, res: Response) {
    const contentTypeId = Number(req.body.contentInfo.contentTypeId);
    const { published, title, items } = req.body.contentInfo;
    const authorId = 1;
    const ownerId = 1;
    const created = ((new Date).toISOString()).split("T")[0];

    const args = {
      contentTypeId,
      authorId,
      ownerId,
      created,
      published,
      title,
      items
    };
    assert(args, validCreatingContent);

    const content = new Content(this.pool);
    await content.create(args);
    return res.send({message: 'Content created.'});
  }

  async update(req: Request, res: Response) {
    const id = Number(req.body.contentInfo.id);
    const contentTypeId = Number(req.body.contentInfo.contentTypeId);
    const { published, title, items } = req.body.contentInfo;
    const ownerId = 1;

    const args = {contentTypeId, ownerId, published, title, items};
    assert(args, validUpdatingContent);

    const content = new Content(this.pool);
    await content.update({id, ...args});
    return res.send({message: 'Content updated.'});
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.body.id);
    const ownerId = 1;
    const content = new Content(this.pool);
    await content.delete(ownerId, id);
    return res.send({message: 'Content deleted.'});
  }
}