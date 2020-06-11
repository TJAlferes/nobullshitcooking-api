import { Request, Response } from 'express';
//import { assert } from 'superstruct';

import { pool } from '../lib/connections/mysqlPoolConnection';
/*import {
  validContentRequest
} from '../lib/validations/content/contentRequest';*/
import { Content } from '../mysql-access/Content';

export const contentController = {
  viewContentById: async function(req: Request, res: Response) {
    const contentId = Number(req.params.contentId);

    //assert({contentId}, validEquipmentRequest);

    const content = new Content(pool);

    const [ row ] = await content.viewContentById(contentId);

    res.send(row);
  }
};