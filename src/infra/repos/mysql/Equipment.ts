import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import type { SearchRequest, SearchResponse } from '../../lib/validations';
import { MySQLRepo } from './MySQL';

export class EquipmentRepo extends MySQLRepo implements IEquipmentRepo {
  async auto(term: string) {
    const owner_id = 1;  // only public equipment are searchable
    const sql = `SELECT equipment_id, equipment_name AS text FROM equipment WHERE equipment_name LIKE ? AND owner_id = ? LIMIT 5`;
    const [ rows ] = await this.pool.execute<EquipmentSuggestion[]>(sql, [`%${term}%`, owner_id]);
    return rows;
  }

  async search({ term, filters, sorts, current_page, results_per_page }: SearchRequest) {
    const owner_id = 1;  // only public equipment are searchable
    let sql = `
      SELECT
        e.equipment_id,
        t.equipment_type_name,
        e.equipment_name,
        e.description,
        e.image
      FROM equipment e
      INNER JOIN equipment_type t ON t.equipment_type_id = e.equipment_type_id
      WHERE e.owner_id = ?
    `;

    // order matters

    const params: Array<number|string> = [owner_id];

    if (term) {
      sql += ` AND e.equipment_name LIKE ?`;
      params.push(`%${term}%`);
    }

    const equipment_types = filters?.equipment_types ?? [];

    if (equipment_types.length > 0) {
      const placeholders = '?,'.repeat(equipment_types.length).slice(0, -1);
      sql += ` AND t.equipment_type_name IN (${placeholders})`;
      params.push(...equipment_types);
    }

    //if (needed_sorts)

    const [ [ { count } ] ] = await this.pool.execute<RowDataPacket[]>(`SELECT COUNT(*) AS count FROM (${sql}) results`, params);
    const total_results = Number(count);
    
    const limit =  results_per_page ? Number(results_per_page)           : 20;
    const offset = current_page     ? (Number(current_page) - 1) * limit : 0;

    sql += ` LIMIT ? OFFSET ?`;

    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [...params, `${limit}`, `${offset}`]);  // order matters

    const total_pages = (total_results <= limit) ? 1 : Math.ceil(total_results / limit);

    return {results: rows, total_results, total_pages};
  }

  async viewAll(author_id: number, owner_id: number) {
    const sql = `
      SELECT
        e.equipment_id,
        e.equipment_type_id,
        e.owner_id,
        t.equipment_type_name,
        e.equipment_name,
        e.description,
        e.image
      FROM equipment e
      INNER JOIN equipment_type t ON e.equipment_type_id = t.equipment_type_id
      WHERE e.author_id = ? AND e.owner_id = ?
      ORDER BY e.name ASC
    `;
    const [ rows ] = await this.pool.execute<Equipment[]>(sql, [author_id, owner_id]);
    return rows;
  }

  async viewOne(id: number, author_id: number, owner_id: number) {
    const sql = `
      SELECT
        e.equipment_id,
        e.equipment_type_id,
        e.owner_id,
        t.equipment_type_name,
        e.equipment_name,
        e.description,
        e.image
      FROM equipment e
      INNER JOIN equipment_type t ON e.equipment_type_id = t.equipment_type_id
      WHERE e.equipment_id = ? AND e.author_id = ? AND e.owner_id = ?
    `;
    const [ row ] = await this.pool.execute<Equipment[]>(sql, [id, author_id, owner_id]);
    return row;
  }

  async create(equipment: ICreatingEquipment) {
    const sql = `
      INSERT INTO equipment (equipment_id, equipment_type_id, author_id, owner_id, equipment_name, description, image)
      VALUES (:equipment_id, :equipment_type_id, :author_id, :owner_id, :equipment_name, :description, :image)
    `;
    const [ row ] = await this.pool.execute<Equipment[] & ResultSetHeader>(sql, equipment);
    return row;  // is this needed?
  }

  async update(equipment: ICreatingEquipment) {
    const sql = `
      UPDATE equipment
      SET equipment_type_id = :equipment_type_id, equipment_name = :equipment_name, description = :description, image = :image
      WHERE equipment_id = :equipment_id
      LIMIT 1
    `;
    await this.pool.execute(sql, equipment);
  }

  async deleteAll(owner_id: number) {
    const sql = `DELETE FROM equipment WHERE owner_id = ?`;
    await this.pool.execute(sql, [owner_id]);
  }

  async deleteOne(equipment_id: number, owner_id: number) {
    const sql = `DELETE FROM equipment WHERE owner_id = ? AND equipment_id = ? LIMIT 1`;
    await this.pool.execute(sql, [owner_id, equipment_id]);
  }
}

export interface IEquipmentRepo {
  auto:      (term: string) =>                                  Promise<EquipmentSuggestion[]>;
  search:    (searchRequest: SearchRequest) =>                  Promise<SearchResponse>;
  viewAll:   (author_id: number, owner_id: number) =>             Promise<Equipment[]>;
  viewOne:   (id: number, author_id: number, owner_id: number) => Promise<Equipment[]>;
  create:    (equipment: ICreatingEquipment) =>                 Promise<Equipment[] & ResultSetHeader>;
  update:    (equipment: ICreatingEquipment) =>                 Promise<void>;
  deleteAll: (owner_id: number) =>                               Promise<void>;
  deleteOne: (id: number, owner_id: number) =>                   Promise<void>;
}

type Equipment = RowDataPacket & {
  equipment_id:        number;
  equipment_type_id:   number;
  owner_id:            number;
  equipment_type_name: string;
  equipment_name:      string;
  description:         string;
  image:               string;
};

type ICreatingEquipment = {
  equipment_id:      number;
  equipment_type_id: number;
  author_id:         number;
  owner_id:          number;
  equipment_name:    string;
  description:       string;
  image:             string;
};

type EquipmentSuggestion = RowDataPacket & {
  equipment_id:   number;
  equipment_name: string;
};
