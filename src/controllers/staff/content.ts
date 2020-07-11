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
  createContent: async function(req: Request, res: Response) {
    const contentTypeId = Number(req.body.contentInfo.contentTypeId);
    const published = req.body.contentInfo.published;
    const title = req.body.contentInfo.title;
    const contentItems = req.body.contentInfo.contentItems;

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
      contentItems
    };

    // you need to understand coerce and defaulted better
    assert(
      coerce({contentToCreate}, validCreatingContentEntity),
      validCreatingContentEntity
    );

    const content = new Content(pool);

    await content.createContent(contentToCreate);

    return res.send({message: 'Content created.'});
  },
  updateContent: async function(req: Request, res: Response) {
    const contentId = Number(req.body.contentInfo.contentId);
    const contentTypeId = Number(req.body.contentInfo.contentTypeId);
    const published = req.body.contentInfo.published;
    const title = req.body.contentInfo.title;
    const contentItems = req.body.contentInfo.contentItems;

    const ownerId = 1;

    const contentToUpdateWith = {
      contentTypeId,
      ownerId,
      published,
      title,
      contentItems
    };

    // you need to understand coerce and defaulted better
    assert(
      coerce({contentToUpdateWith}, validEditingContentEntity),
      validEditingContentEntity
    );

    const content = new Content(pool);

    await content
    .updateContent({contentId, ...contentToUpdateWith});

    return res.send({message: 'Content updated.'});
  },
  deleteContent: async function(req: Request, res: Response) {
    const contentId = Number(req.body.contentId);

    const ownerId = 1;

    const content = new Content(pool);

    await content.deleteContent(ownerId, contentId);

    return res.send({message: 'Content deleted.'});
  }
};