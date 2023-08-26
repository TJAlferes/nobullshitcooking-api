import { RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from '../../shared/MySQL';

export class CustomCuisineRepo extends MySQLRepo implements ICustomCuisineRepo {
  async viewAll() {
    const sql = ``;
  }
}

export interface ICustomCuisineRepo {

}

type CustomCuisineView = RowDataPacket & {

};
