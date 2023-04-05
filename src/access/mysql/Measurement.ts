import { Pool, RowDataPacket } from 'mysql2/promise';

export class MeasurementRepository implements IMeasurementRepository {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async viewAll() {
    const sql = `SELECT id, name FROM measurements`;
    const [ rows ] = await this.pool.execute<Measurement[]>(sql);
    return rows;
  }

  async viewOne(id: number) {
    const sql = `SELECT id, name FROM measurements WHERE id = ?`;
    const [ row ] = await this.pool.execute<Measurement[]>(sql, [id]);
    return row;
  }
}

export interface IMeasurementRepository {
  pool:    Pool;
  viewAll: () =>           Promise<Measurement[]>;
  viewOne: (id: number) => Promise<Measurement[]>;
}

type Measurement = RowDataPacket & {
  id:   number;
  name: string;
};
