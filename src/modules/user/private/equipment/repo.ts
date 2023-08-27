import { RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from '../../../shared/MySQL';

export class PrivateEquipmentRepo extends MySQLRepo implements IPrivateEquipmentRepo {
  async viewAll(owner_id:  string) {
    const sql = `
      SELECT
        e.equipment_id,
        e.equipment_type_id,
        t.equipment_type_name,
        e.owner_id,
        e.equipment_name,
        e.notes,
        i.image_url
      FROM private_equipment e
      INNER JOIN equipment_type t ON e.equipment_type_id = t.equipment_type_id
      INNER JOIN image i          ON e.image_id          = i.image_id
      WHERE e.owner_id = ?
      ORDER BY e.equipment_name ASC
    `;
    const [ rows ] = await this.pool.execute<EquipmentView[]>(sql, owner_id);
    return rows;
  }

  async viewOne(params: ViewOneParams) {
    const sql = `
      SELECT
        e.equipment_id,
        e.equipment_type_id,
        t.equipment_type_name,
        e.owner_id,
        e.equipment_name,
        e.notes,
        i.image_url
      FROM private_equipment e
      INNER JOIN equipment_type t ON e.equipment_type_id = t.equipment_type_id
      INNER JOIN image i          ON e.image_id          = i.image_id
      WHERE e.equipment_id = :equipment_id AND e.owner_id = :owner_id
    `;
    const [ [ row ] ] = await this.pool.execute<EquipmentView[]>(sql, params);
    return row;
  }

  async insert(params: InsertParams) {
    const sql = `
      INSERT INTO private_equipment (
        equipment_id,
        equipment_type_id,
        owner_id,
        equipment_name,
        notes,
        image_id
      ) VALUES (
        :equipment_id,
        :equipment_type_id,
        :owner_id,
        :equipment_name,
        :notes,
        :image_id
      )
    `;
    await this.pool.execute(sql, params);
  }

  async update(params: InsertParams) {
    const sql = `
      UPDATE private_equipment
      SET
        equipment_type_id = :equipment_type_id,
        equipment_name    = :equipment_name,
        notes             = :notes,
        image_id          = :image_id
      WHERE equipment_id = :equipment_id
      LIMIT 1
    `;
    await this.pool.execute(sql, params);
  }

  async deleteAll(owner_id: string) {
    const sql = `DELETE FROM private_equipment WHERE owner_id = ?`;
    await this.pool.execute(sql, [owner_id]);
  }

  async deleteOne(params: DeleteOneParams) {
    const sql = `
      DELETE FROM private_equipment
      WHERE equipment_id = :equipment_id AND owner_id = :owner_id
      LIMIT 1
    `;
    await this.pool.execute(sql, params);
  }
}

export interface IPrivateEquipmentRepo {
  viewAll:   (owner_id: string) =>        Promise<EquipmentView[]>;
  viewOne:   (params: ViewOneParams) =>   Promise<EquipmentView>;
  insert:    (params: InsertParams) =>    Promise<void>;
  update:    (params: InsertParams) =>    Promise<void>;
  deleteAll: (owner_id: string) =>        Promise<void>;
  deleteOne: (params: DeleteOneParams) => Promise<void>;
}

type EquipmentView = RowDataPacket & {
  equipment_id:        string;
  equipment_type_id:   number;
  owner_id:            string;
  equipment_type_name: string;
  equipment_name:      string;
  notes:               string;
  image_url:           string;
};

type InsertParams = {
  equipment_id:      string;
  equipment_type_id: number;
  owner_id:          string;
  equipment_name:    string;
  notes:             string;
  image_id:          string;
};

type ViewOneParams = {
  equipment_id: string;
  owner_id:     string;
};

type DeleteOneParams = {
  equipment_id: string;
  owner_id:     string;
};
