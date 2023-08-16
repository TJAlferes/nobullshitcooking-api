import { RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from '../../shared/MySQL';

export class CuisineRepo extends MySQLRepo implements ICuisineRepo {
  async viewAll() {
    const sql = `
      SELECT cuisine_id, cuisine_name, continent_code, country_code, country_name
      FROM cuisine
    `;
    const [ rows ] = await this.pool.execute<Cuisine[]>(sql);
    return rows;
  }

  async viewOne(cuisine_id: number) {
    const sql = `
      SELECT cuisine_id, cuisine_name, continent_code, country_code, country_name
      FROM cuisine
      WHERE cuisine_id = ?
    `;
    const [ [ row ] ] = await this.pool.execute<Cuisine[]>(sql, [cuisine_id]);
    return row;
  }
}

export interface ICuisineRepo {
  viewAll: () =>                   Promise<Cuisine[]>;
  viewOne: (cuisine_id: number) => Promise<Cuisine>;
}

type Cuisine = RowDataPacket & {
  cuisine_id:     number;
  cuisine_name:   string;
  continent_code: string;
  country_code:   string;
  country_name:   string;
};
