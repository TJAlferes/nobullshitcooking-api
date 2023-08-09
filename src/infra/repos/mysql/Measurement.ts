import { RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from './MySQL';

export class MeasurementRepo extends MySQLRepo implements IMeasurementRepo {
  async viewAll() {
    const sql = `SELECT id, name FROM measurement`;
    const [ rows ] = await this.pool.execute<Measurement[]>(sql);
    return rows;
  }

  async viewOne(id: number) {
    const sql = `SELECT id, name FROM measurement WHERE id = ?`;
    const [ row ] = await this.pool.execute<Measurement[]>(sql, [id]);
    return row;
  }
}

export interface IMeasurementRepo {
  viewAll: () =>           Promise<Measurement[]>;
  viewOne: (id: number) => Promise<Measurement[]>;
}

type Measurement = RowDataPacket & {
  id:   number;
  name: string;
};
