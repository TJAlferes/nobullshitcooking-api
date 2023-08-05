import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import type { SearchRequest, SearchResponse } from '../../lib/validations';
import { MySQLRepo } from './MySQL';

export class EquipmentRepo extends MySQLRepo implements IEquipmentRepo {
  async auto(term: string) {
    const ownerId = 1;  // only public equipment are searchable
    const sql = `SELECT id, name AS text FROM equipment WHERE name LIKE ? AND owner_id = ? LIMIT 5`;
    const [ rows ] = await this.pool.execute<EquipmentSuggestion[]>(sql, [`%${term}%`, ownerId]);
    return rows;
  }

  async search({ term, filters, sorts, currentPage, resultsPerPage }: SearchRequest) {
    const ownerId = 1;  // only public equipment are searchable
    let sql = `
      SELECT
        e.id,
        t.name AS equipment_type_name,
        e.name,
        e.description,
        e.image
      FROM equipment e
      INNER JOIN equipment_type t ON t.id = e.equipment_type_id
      WHERE e.owner_id = ?
    `;

    // order matters

    const params: Array<number|string> = [ownerId];

    if (term) {
      sql += ` AND e.name LIKE ?`;
      params.push(`%${term}%`);
    }

    const equipmentTypes = filters?.equipmentTypes ?? [];

    if (equipmentTypes.length > 0) {
      const placeholders = '?,'.repeat(equipmentTypes.length).slice(0, -1);
      sql += ` AND t.name IN (${placeholders})`;
      params.push(...equipmentTypes);
    }

    //if (neededSorts)

    const [ [ { count } ] ] = await this.pool.execute<RowDataPacket[]>(`SELECT COUNT(*) AS count FROM (${sql}) results`, params);
    const totalResults = Number(count);
    
    const limit =  resultsPerPage ? Number(resultsPerPage)            : 20;
    const offset = currentPage    ? (Number(currentPage) - 1) * limit : 0;

    sql += ` LIMIT ? OFFSET ?`;

    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [...params, `${limit}`, `${offset}`]);  // order matters

    const totalPages = (totalResults <= limit) ? 1 : Math.ceil(totalResults / limit);

    return {results: rows, totalResults, totalPages};
  }

  async viewAll(authorId: number, ownerId: number) {
    const sql = `
      SELECT
        e.id,
        e.equipment_type_id,
        e.owner_id,
        t.name AS equipment_type_name,
        e.name,
        e.description,
        e.image
      FROM equipment e
      INNER JOIN equipment_type t ON e.equipment_type_id = t.id
      WHERE e.author_id = ? AND e.owner_id = ?
      ORDER BY e.name ASC
    `;
    const [ rows ] = await this.pool.execute<Equipment[]>(sql, [authorId, ownerId]);
    return rows;
  }

  async viewOne(id: number, authorId: number, ownerId: number) {
    const sql = `
      SELECT
        e.id,
        e.equipment_type_id,
        e.owner_id,
        t.name AS equipment_type_name,
        e.name,
        e.description,
        e.image
      FROM equipment e
      INNER JOIN equipment_type t ON e.equipment_type_id = t.id
      WHERE e.id = ? AND e.author_id = ? AND e.owner_id = ?
    `;
    const [ row ] = await this.pool.execute<Equipment[]>(sql, [id, authorId, ownerId]);
    return row;
  }

  async create(equipment: ICreatingEquipment) {
    const sql = `
      INSERT INTO equipment (equipment_type_id, author_id, owner_id, name, description, image)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [ row ] = await this.pool.execute<Equipment[] & ResultSetHeader>(sql, [
      equipment.equipmentTypeId,
      equipment.authorId,
      equipment.ownerId,
      equipment.name,
      equipment.description,
      equipment.image
    ]);
    return row;  // is this needed?
  }

  async update(equipment: IUpdatingEquipment) {
    const sql = `
      UPDATE equipment
      SET equipment_type_id = ?, name = ?, description = ?, image = ?
      WHERE id = ?
      LIMIT 1
    `;
    await this.pool.execute(sql, [
      equipment.equipmentTypeId,
      equipment.name,
      equipment.description,
      equipment.image,
      equipment.id
    ]);
  }

  async deleteAll(ownerId: number) {
    const sql = `DELETE FROM equipment WHERE owner_id = ?`;
    await this.pool.execute(sql, [ownerId]);
  }

  async deleteOne(id: number, ownerId: number) {
    const sql = `DELETE FROM equipment WHERE owner_id = ? AND id = ? LIMIT 1`;
    await this.pool.execute(sql, [ownerId, id]);
  }
}

export interface IEquipmentRepo {
  pool:      Pool;
  auto:      (term: string) =>                                  Promise<EquipmentSuggestion[]>;
  search:    (searchRequest: SearchRequest) =>                  Promise<SearchResponse>;
  viewAll:   (authorId: number, ownerId: number) =>             Promise<Equipment[]>;
  viewOne:   (id: number, authorId: number, ownerId: number) => Promise<Equipment[]>;
  create:    (equipment: ICreatingEquipment) =>                 Promise<Equipment[] & ResultSetHeader>;
  update:    (equipment: IUpdatingEquipment) =>                 Promise<void>;
  deleteAll: (ownerId: number) =>                               Promise<void>;
  deleteOne: (id: number, ownerId: number) =>                   Promise<void>;
}

type Equipment = RowDataPacket & {
  id:                  number;
  equipment_type_id:   number;
  owner_id:            number;
  equipment_type_name: string;
  name:                string;
  description:         string;
  image:               string;
};

type ICreatingEquipment = {
  equipmentTypeId: number;
  authorId:        number;
  ownerId:         number;
  name:            string;
  description:     string;
  image:           string;
};

type IUpdatingEquipment = ICreatingEquipment & {
  id: number;
};

type EquipmentSuggestion = RowDataPacket & {
  id:   number;
  name: string;
};
