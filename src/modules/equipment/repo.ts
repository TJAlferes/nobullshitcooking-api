import { RowDataPacket } from 'mysql2/promise';

import type { SearchRequest, SearchResponse } from '../search/model';
import { MySQLRepo } from '../shared/MySQL';

export class EquipmentRepo extends MySQLRepo implements IEquipmentRepo {
  async autosuggest(term: string) {
    const owner_id = 1;  // only public equipment are searchable (this should be in the service, not in the repo)
    const sql = `SELECT equipment_id, equipment_name AS text FROM equipment WHERE equipment_name LIKE ? AND owner_id = ? LIMIT 5`;
    const [ rows ] = await this.pool.execute<EquipmentSuggestion[]>(sql, [`%${term}%`, owner_id]);
    return rows;
  }

  async search({ term, filters, sorts, current_page, results_per_page }: SearchRequest) {
    const owner_id = 1;  // only public equipment are searchable (this should be in the service, not in the repo)
    let sql = `
      SELECT
        e.equipment_id,
        t.equipment_type_name,
        e.equipment_name,
        e.description,
        i.image_url
      FROM equipment e
      INNER JOIN equipment_type t ON e.equipment_type_id = t.equipment_type_id
      INNER JOIN image i          ON e.image_id          = i.image_id
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

  async viewAll(owner_id:  string) {
    const sql = `
      SELECT
        e.equipment_id,
        e.equipment_type_id,
        t.equipment_type_name,
        e.owner_id,
        e.equipment_name,
        e.description,
        i.image_url
      FROM equipment e
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
        e.description,
        i.image_url
      FROM equipment e
      INNER JOIN equipment_type t ON e.equipment_type_id = t.equipment_type_id
      INNER JOIN image i          ON e.image_id          = i.image_id
      WHERE e.equipment_id = :equipment_id AND e.owner_id = :owner_id
    `;
    const [ [ row ] ] = await this.pool.execute<EquipmentView[]>(sql, params);
    return row;
  }

  async insert(params: InsertParams) {
    const sql = `
      INSERT INTO equipment (
        equipment_id,
        equipment_type_id,
        owner_id,
        equipment_name,
        description
      ) VALUES (
        :equipment_id,
        :equipment_type_id,
        :owner_id,
        :equipment_name,
        :description
      )
    `;
    await this.pool.execute(sql, params);
  }

  async update(params: InsertParams) {
    const sql = `
      UPDATE equipment
      SET
        equipment_type_id = :equipment_type_id,
        equipment_name    = :equipment_name,
        description       = :description
      WHERE equipment_id = :equipment_id
      LIMIT 1
    `;
    await this.pool.execute(sql, params);
  }

  async deleteAll(owner_id: string) {
    const sql = `DELETE FROM equipment WHERE owner_id = ?`;
    await this.pool.execute(sql, [owner_id]);
  }

  async deleteOne(params: DeleteOneParams) {
    const sql = `DELETE FROM equipment WHERE equipment_id = :equipment_id AND owner_id = :owner_id LIMIT 1`;
    await this.pool.execute(sql, params);
  }
}

export interface IEquipmentRepo {
  autosuggest: (term: string) =>                  Promise<EquipmentSuggestion[]>;
  search:      (search_request: SearchRequest) => Promise<SearchResponse>;
  viewAll:     (owner_id: string) =>              Promise<EquipmentView[]>;
  viewOne:     (params: ViewOneParams) =>         Promise<EquipmentView>;
  insert:      (params: InsertParams) =>          Promise<void>;
  update:      (params: InsertParams) =>          Promise<void>;
  deleteAll:   (owner_id: string) =>              Promise<void>;
  deleteOne:   (params: DeleteOneParams) =>       Promise<void>;
}

type EquipmentView = RowDataPacket & {
  equipment_id:        string;
  equipment_type_id:   number;
  owner_id:            string;
  equipment_type_name: string;
  equipment_name:      string;
  description:         string;
  image_url:           string;
};

// or EquipmentRow???
type InsertParams = {
  equipment_id:      string;
  equipment_type_id: number;
  owner_id:          string;
  equipment_name:    string;
  description:       string;
  image_url:         string;
};

type EquipmentSuggestion = RowDataPacket & {
  equipment_id:   string;
  equipment_name: string;
};

type ViewOneParams = {
  equipment_id: string;
  owner_id:     string;
};

type DeleteOneParams = {
  equipment_id: string;
  owner_id:     string;
};
