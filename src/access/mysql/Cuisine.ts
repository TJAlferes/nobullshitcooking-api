import { Pool, RowDataPacket } from 'mysql2/promise';

export class CuisineRepository implements ICuisineRepository {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async viewAll() {
    const sql = `SELECT id, continent, code, name, country FROM cuisines`;
    const [ rows ] = await this.pool.execute<Cuisine[]>(sql);
    return rows;
  }

  async viewOne(id: number) {
    const sql = `SELECT id, continent, code, name, country FROM cuisines WHERE id = ?`;
    const [ row ] = await this.pool.execute<Cuisine[]>(sql, [id]);
    return row;
  }
}

export interface ICuisineRepository {
  pool:                    Pool;
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
