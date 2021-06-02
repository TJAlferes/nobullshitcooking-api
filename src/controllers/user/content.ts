import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { Content } from '../../access/mysql';
import {
  validCreatingContent,
  validUpdatingContent
} from '../../lib/validations';

export class UserContentController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewById = this.viewById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async view(req: Request, res: Response) {
    const authorId = req.session.userInfo!.id;
    //const ownerId = req.session.userInfo!.id;
    const content = new Content(this.pool);
    const rows = await content.view(authorId);
    return res.send(rows);
  }

  async viewById(req: Request, res: Response) {
    const id = Number(req.body.id);
    const authorId = req.session.userInfo!.id;
    //const ownerId = req.session.userInfo!.id;
    const content = new Content(this.pool);
    const [ row ] = await content.viewById(id, authorId);
    return res.send(row);
  }

  async create(req: Request, res: Response) {
    const contentTypeId = Number(req.body.contentInfo.contentTypeId);
    const { published, title, items } = req.body.contentInfo;
    const authorId = req.session.userInfo!.id;
    const ownerId = req.session.userInfo!.id;
    const created = ((new Date).toISOString()).split("T")[0];

    const args =
      {contentTypeId, authorId, ownerId, created, published, title, items};
    assert(args, validCreatingContent);

    const content = new Content(this.pool);
    await content.create(args);

    return res.send({message: 'Content created.'});
  }

  async update(req: Request, res: Response) {
    const id = Number(req.body.contentInfo.id);
    const contentTypeId = Number(req.body.contentInfo.contentTypeId);
    const { published, title, items } = req.body.contentInfo;
    const ownerId = req.session.userInfo!.id;

    const args = {contentTypeId, ownerId, published, title, items};
    assert(args, validUpdatingContent);

    const content = new Content(this.pool);
    await content.update({id, ...args});

    return res.send({message: 'Content updated.'});
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.body.id);
    const ownerId = req.session.userInfo!.id;
    const content = new Content(this.pool);
    await content.delete(ownerId, id);  // TO DO: switch order?
    
    return res.send({message: 'Content deleted.'});
  }
}