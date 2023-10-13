import { RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from '../../shared/MySQL.js';

export class UnitRepo extends MySQLRepo implements IUnitRepo {
  async viewAll() {
    const sql = `SELECT unit_id, unit_name FROM unit`;
    const [ rows ] = await this.pool.execute<UnitView[]>(sql);
    return rows;
  }

  async viewOne(unit_id: number) {
    const sql = `SELECT unit_id, unit_name FROM unit WHERE unit_id = ?`;
    const [ [ row ] ] = await this.pool.execute<UnitView[]>(sql, [unit_id]);
    return row;
  }
}

export interface IUnitRepo {
  viewAll: () =>                Promise<UnitView[]>;
  viewOne: (unit_id: number) => Promise<UnitView>;
}

type UnitView = RowDataPacket & {
  unit_id:   number;
  unit_name: string;
};
