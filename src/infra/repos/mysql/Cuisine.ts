import { RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from './MySQL';

export class CuisineRepo extends MySQLRepo implements ICuisineRepo {
  async viewAll() {
    const sql = `SELECT cuisine_id, continent, code, cuisine_name, country FROM cuisine`;
    const [ rows ] = await this.pool.execute<Cuisine[]>(sql);
    return rows;
  }

  async viewOne(cuisine_id: number) {
    const sql = `SELECT cuisine_id, continent, code, cusine_name, country FROM cuisine WHERE cuisine_id = ?`;
    const [ row ] = await this.pool.execute<Cuisine[]>(sql, [cuisine_id]);
    return row;
  }
}

export interface ICuisineRepo {
  viewAll: () =>           Promise<Cuisine[]>;
  viewOne: (cuisine_id: number) => Promise<Cuisine[]>;
}

type Cuisine = RowDataPacket & {
  cuisine_id:        number;
  continent: string;
  code:      string;
  name:      string;
  country:   string;
};
