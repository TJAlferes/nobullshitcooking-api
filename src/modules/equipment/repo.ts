import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

import type { SearchRequest, SearchResponse, EquipmentCard } from '../search/model';
import { NOBSC_USER_ID } from '../shared/model';
import { MySQLRepo } from '../shared/MySQL';

export class EquipmentRepo extends MySQLRepo implements EquipmentRepoInterface {
  async autosuggest(term: string) {
    const owner_id = NOBSC_USER_ID;  // only public equipment are searchable
    const sql = `
      SELECT
        equipment_id AS id,
        equipment_name AS text
      FROM equipment
      WHERE owner_id = ? AND equipment_name LIKE ?
      LIMIT 5
    `;
    const [ rows ] = await this.pool.execute<SuggestionView[]>(sql, [
      owner_id,
      `%${term}%`
    ]);
    return rows;
  }

  async search({ term, filters, sorts, current_page, results_per_page }: SearchRequest) {
    const owner_id = NOBSC_USER_ID;  // only public equipment are searchable
    let sql = `
      SELECT
        e.equipment_id,
        t.equipment_type_name,
        e.equipment_name,
        e.notes,
        i.image_filename
      FROM equipment e
      INNER JOIN equipment_type t ON e.equipment_type_id = t.equipment_type_id
      INNER JOIN image i          ON e.image_id          = i.image_id
      WHERE e.owner_id = ?
    `;

    // order matters

    const params: Array<number|string> = [owner_id];

    if (term) {
      // We generate escaped substrings of length 4 or more from the provided term
      const substrings = Array.from({ length: term.length - 3 }, (_, index) => term.slice(0, term.length - index));
      const escapedSubstrings = substrings.map(substring => this.pool.escape(`%${substring}%`).replace(/\\/g, ''));

      const likes = escapedSubstrings.map(escapedSubstring => `e.equipment_name LIKE ${escapedSubstring}`).join(' OR ');
      sql += ` AND (${likes})`;
    }

    const equipment_types = filters?.equipment_types ?? [];

    if (equipment_types.length > 0) {
      const placeholders = '?,'.repeat(equipment_types.length).slice(0, -1);
      sql += ` AND t.equipment_type_name IN (${placeholders})`;
      params.push(...equipment_types);
    }

    //if (needed_sorts)

    const [ [ { count } ] ] = await this.pool.execute<RowDataPacket[]>(
      `SELECT COUNT(*) AS count FROM (${sql}) results`,
      params
    );
    const total_results = Number(count);
    
    const limit =  results_per_page ? Number(results_per_page)           : 20;
    const offset = current_page     ? (Number(current_page) - 1) * limit : 0;

    sql += ` LIMIT ? OFFSET ?`;

    const [ results ] = await this.pool.execute<EquipmentCard[]>(sql, [
      ...params,
      `${limit}`,
      `${offset}`
    ]);

    const total_pages = (total_results <= limit) ? 1 : Math.ceil(total_results / limit);

    return {
      results,
      total_results,
      total_pages
    };
  }

  async hasPrivate(equipment_ids: string[]) {
    const placeholders = '?,'.repeat(equipment_ids.length).slice(0, -1);
    const sql = `
      SELECT *
      FROM equipment
      WHERE equipment_id IN (${placeholders}) AND owner_id != ?
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [...equipment_ids, NOBSC_USER_ID]);
    return rows.length > 0;
  }  // TO DO: thoroughly integration test this

  async viewAllOfficialNames() {
    const owner_id  = NOBSC_USER_ID;
    const sql = `SELECT equipment_name AS name FROM equipment WHERE owner_id = ?`;
    const [ rows ] = await this.pool.execute<NameView[]>(sql, [owner_id]);
    return rows;
  }  // for Next.js getStaticPaths

  async viewAll(owner_id: string) {
    const sql = `
      SELECT
        e.equipment_id,
        e.equipment_type_id,
        t.equipment_type_name,
        e.owner_id,
        e.equipment_name,
        e.notes,
        i.image_id,
        i.image_filename,
        i.caption
      FROM equipment e
      INNER JOIN equipment_type t ON e.equipment_type_id = t.equipment_type_id
      INNER JOIN image i          ON e.image_id          = i.image_id
      WHERE e.owner_id = ?
      ORDER BY e.equipment_name ASC
    `;
    const [ rows ] = await this.pool.execute<EquipmentView[]>(sql, [owner_id]);
    return rows;
  }

  async viewOne(equipment_id: string) {
    const sql = `
      SELECT
        e.equipment_id,
        e.equipment_type_id,
        t.equipment_type_name,
        e.owner_id,
        e.equipment_name,
        e.notes,
        i.image_id,
        i.image_filename,
        i.caption
      FROM equipment e
      INNER JOIN equipment_type t ON e.equipment_type_id = t.equipment_type_id
      INNER JOIN image i          ON e.image_id          = i.image_id
      WHERE e.equipment_id = ?
    `;
    const [ [ row ] ] = await this.pool.execute<EquipmentView[]>(sql, [equipment_id]);
    return row;
  }

  async viewOneByName(equipment_name: string) {
    const sql = `
      SELECT
        e.equipment_id,
        e.equipment_type_id,
        t.equipment_type_name,
        e.owner_id,
        e.equipment_name,
        e.notes,
        i.image_id,
        i.image_filename,
        i.caption
      FROM equipment e
      INNER JOIN equipment_type t ON e.equipment_type_id = t.equipment_type_id
      INNER JOIN image i          ON e.image_id          = i.image_id
      WHERE e.equipment_name = ?
    `;
    const [ [ row ] ] = await this.pool.execute<EquipmentView[]>(sql, [equipment_name]);
    return row;
  }

  async insert(params: InsertParams) {
    const sql = `
      INSERT INTO equipment (
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
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, params);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async update({
    equipment_type_id,
    equipment_name,
    notes,
    image_id,
    owner_id,
    equipment_id
  }: UpdateParams) {
    const sql = `
      UPDATE equipment
      SET
        equipment_type_id = :equipment_type_id,
        equipment_name    = :equipment_name,
        notes             = :notes,
        image_id          = :image_id
      WHERE owner_id = :owner_id AND equipment_id = :equipment_id
      LIMIT 1
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, {
      equipment_type_id,
      equipment_name,
      notes,
      image_id,
      owner_id,
      equipment_id
    });
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async deleteAll(owner_id: string) {
    const sql = `DELETE FROM equipment WHERE owner_id = ?`;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, [owner_id]);
    // log instead
    //if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async deleteOne(params: DeleteOneParams) {
    const sql = `
      DELETE FROM equipment
      WHERE owner_id = :owner_id AND equipment_id = :equipment_id
      LIMIT 1
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, params);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }
}

export interface EquipmentRepoInterface {
  autosuggest: (term: string) =>                  Promise<SuggestionView[]>;
  search:      (search_request: SearchRequest) => Promise<SearchResponse>;
  hasPrivate:  (equipment_ids: string[]) =>       Promise<boolean>;
  viewAllOfficialNames: () => Promise<NameView[]>;
  viewAll:     (owner_id: string) =>              Promise<EquipmentView[]>;
  viewOne:     (equipment_id: string) =>          Promise<EquipmentView>;
  viewOneByName: (equipment_name: string) =>          Promise<EquipmentView>;
  insert:      (params: InsertParams) =>          Promise<void>;
  update:      (params: UpdateParams) =>          Promise<void>;
  deleteAll:   (owner_id: string) =>              Promise<void>;
  deleteOne:   (params: DeleteOneParams) =>       Promise<void>;
}

type SuggestionView = RowDataPacket & {
  id: string;
  text: string;
};

type NameView = RowDataPacket & {
  name: string;
};

type EquipmentView = RowDataPacket & {
  equipment_id:        string;
  equipment_type_id:   number;
  owner_id:            string;
  equipment_type_name: string;
  equipment_name:      string;
  notes:               string;
  image_id:            string;
  image_filename:      string;
  caption:             string;
};

type InsertParams = {
  equipment_id:      string;
  equipment_type_id: number;
  owner_id:          string;
  equipment_name:    string;
  notes:             string;
  image_id:          string;
};

type UpdateParams = InsertParams;

type DeleteOneParams = {
  owner_id: string;
  equipment_id: string;
};
