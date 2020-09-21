import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
//import { v4 as uuidv4 } from 'uuid';

//const User = require('../data-access/user/User');

// NOTE: Notifications are not implemented yet, and possibly never will be

export class NotificationController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewById = this.viewById.bind(this);
  }

  async view(req: Request, res: Response) {
    //const userId = req.session.userInfo.userId;
  }

  async viewById(req: Request, res: Response) {
    //const userId = req.session.userInfo.userId;
  }

  async markNotificationAsRead(req: Request, res: Response) {
    //const userId = req.session.userInfo.userId;
  }

  async createNotification(req: Request, res: Response) {
    // if referenced in any way
    // so if favorited/saved
    // if used as subrecipe
    // if used in plan
  }
}