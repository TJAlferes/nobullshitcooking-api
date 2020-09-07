import { Request, Response } from 'express';
import { assert, coerce } from 'superstruct';

import { pool } from '../../lib/connections/mysqlPoolConnection';
import { validContentCreation } from '../../lib/validations/content/create';
import { validContentUpdate } from '../../lib/validations/content/update';
import { Content } from '../../mysql-access/Content';

export const staffContentController = {
  create: async function(req: Request, res: Response) {
    const contentTypeId = Number(req.body.contentInfo.contentTypeId);
    const { published, title, items } = req.body.contentInfo;

    const authorId = 1;
    const ownerId = 1;
    const created = ((new Date).toISOString()).split("T")[0];

    const contentCreation = {
      contentTypeId,
      authorId,
      ownerId,
      created,
      published,
      title,
      items
    };

    // you need to understand coerce and defaulted better
    assert(
      coerce({contentCreation}, validContentCreation),
      validContentCreation
    );

    const content = new Content(pool);

    await content.create(contentCreation);

    return res.send({message: 'Content created.'});
  },
  update: async function(req: Request, res: Response) {
    const id = Number(req.body.contentInfo.id);
    const contentTypeId = Number(req.body.contentInfo.contentTypeId);
    const { published, title, items } = req.body.contentInfo;

    const ownerId = 1;

    const contentUpdate = {
      contentTypeId,
      ownerId,
      published,
      title,
      items
    };

    // you need to understand coerce and defaulted better
    assert(
      coerce({contentUpdate}, validContentUpdate),
      validContentUpdate
    );

    const content = new Content(pool);

    await content.update({id, ...contentUpdate});

    return res.send({message: 'Content updated.'});
  },
  delete: async function(req: Request, res: Response) {
    const id = Number(req.body.id);

    const ownerId = 1;

    const content = new Content(pool);

    await content.delete(ownerId, id);

    return res.send({message: 'Content deleted.'});
  }
};