import { RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from './MySQL';

export class CuisineRepo extends MySQLRepo implements ICuisineRepo {
  async viewAll() {
    const sql = `SELECT id, continent, code, name, country FROM cuisine`;
    const [ rows ] = await this.pool.execute<Cuisine[]>(sql);
    return rows;
  }

  async viewOne(id: number) {
    const sql = `SELECT id, continent, code, name, country FROM cuisine WHERE id = ?`;
    const [ row ] = await this.pool.execute<Cuisine[]>(sql, [id]);
    return row;
  }
}

export interface ICuisineRepo {
  viewAll: () =>           Promise<Cuisine[]>;
  viewOne: (id: number) => Promise<Cuisine[]>;
}

type Cuisine = RowDataPacket & {
  id:        number;
  continent: string;
  code:      string;
  name:      string;
  country:   string;
};
