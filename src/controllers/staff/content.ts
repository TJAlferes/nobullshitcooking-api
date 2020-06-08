import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { pool } from '../../lib/connections/mysqlPoolConnection';
import {
  validContentEntity
} from '../../lib/validations/content/contentEntity';
import { Content } from '../../mysql-access/Content';

export const staffContentController = {
  createContent: async function(req: Request, res: Response) {
    const contentTypeId = Number(req.body.contentInfo.contentTypeId);
    const published = req.body.contentInfo.published;
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
      contentItems
    };

    assert({contentToCreate}, validContentEntity);

    const content = new Content(pool);

    content.createContent(contentToCreate);
  },
  updateContent: async function(req: Request, res: Response) {
    const contentId = Number(req.body.contentInfo.contentId);
    const contentTypeId = Number(req.body.contentInfo.contentTypeId);
    const published = req.body.contentInfo.published;
    const contentItems = req.body.contentInfo.contentItems;

    const authorId = 1;
    const ownerId = 1;

    const contentToUpdateWith = {
      contentTypeId,
      authorId,
      ownerId,
      published,
      contentItems
    }

    //assert({contentToUpdateWith}, validContentEntity);

    const content = new Content(pool);

    const updatedContent = content
    .updateContent({contentId, ...contentToUpdateWith});
  },
  deleteContent: async function(req: Request, res: Response) {
    const contentId = Number(req.body.contentId);

    const ownerId = 1;

    const content = new Content(pool);

    await content.deleteContent(ownerId, contentId);

    res.send({message: 'Content deleted.'});
  }
};