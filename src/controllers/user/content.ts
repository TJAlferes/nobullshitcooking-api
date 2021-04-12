import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert, coerce } from 'superstruct';

import { Content } from '../../access/mysql';
import { validContentCreation } from '../../lib/validations/content/create';
import { validContentUpdate } from '../../lib/validations/content/update';

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
    const author = req.session!.userInfo.username;
    const content = new Content(this.pool);

    const rows = await content.view(author);

    return res.send(rows);
  }

  async viewById(req: Request, res: Response) {
    const { id } = req.body;
    const author = req.session!.userInfo.username;

    const content = new Content(this.pool);

    const [ row ] = await content.viewById(id, author);

    return res.send(row);
  }

  async create(req: Request, res: Response) {
    const { type, published, title, items } = req.body.contentInfo;
    const author = req.session!.userInfo.username;
    const owner = req.session!.userInfo.username;
    const created = ((new Date).toISOString()).split("T")[0];

    const contentCreation =
      { type, author, owner, created, published, title, items };

    // you need to understand coerce and defaulted better
    assert(
      coerce({contentCreation}, validContentCreation),
      validContentCreation
    );

    const content = new Content(this.pool);

    await content.create(contentCreation);

    return res.send({message: 'Content created.'});
  }

  async update(req: Request, res: Response) {
    const { id, type, published, title, items } = req.body.contentInfo;
    const owner = req.session!.userInfo.username;

    const contentUpdate = { type, owner, published, title, items};

    // you need to understand coerce and defaulted better
    assert(
      coerce({contentUpdate}, validContentUpdate),
      validContentUpdate
    );

    const content = new Content(this.pool);

    await content.update({id, ...contentUpdate});

    return res.send({message: 'Content updated.'});
  }

  async delete(req: Request, res: Response) {
    const { id } = req.body;
    const owner = req.session!.userInfo.username;

    const content = new Content(this.pool);

    await content.delete(owner, id);
    
    return res.send({message: 'Content deleted.'});
  }
}