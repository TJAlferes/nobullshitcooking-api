import { Request, Response } from 'express';
import { assert, coerce } from 'superstruct';

import { pool } from '../../lib/connections/mysqlPoolConnection';
import {
  validCreatingContentEntity
} from '../../lib/validations/content/creatingContentEntity';
import {
  validEditingContentEntity
} from '../../lib/validations/content/editingContentEntity';
import { Content } from '../../mysql-access/Content';

export const staffContentController = {
  create: async function(req: Request, res: Response) {
    const contentTypeId = Number(req.body.contentInfo.contentTypeId);
    const { published, title, items } = req.body.contentInfo;

    const authorId = 1;
    const ownerId = 1;
    const created = ((new Date).toISOString()).split("T")[0];

    const contentToCreate = {
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
      coerce({contentToCreate}, validCreatingContentEntity),
      validCreatingContentEntity
    );

    const content = new Content(pool);

    await content.create(contentToCreate);

    return res.send({message: 'Content created.'});
  },
  update: async function(req: Request, res: Response) {
    const id = Number(req.body.contentInfo.id);
    const contentTypeId = Number(req.body.contentInfo.contentTypeId);
    const { published, title, items } = req.body.contentInfo;

    const ownerId = 1;

    const contentToUpdateWith = {
      contentTypeId,
      ownerId,
      published,
      title,
      items
    };

    // you need to understand coerce and defaulted better
    assert(
      coerce({contentToUpdateWith}, validEditingContentEntity),
      validEditingContentEntity
    );

    const content = new Content(pool);

    await content.update({id, ...contentToUpdateWith});

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