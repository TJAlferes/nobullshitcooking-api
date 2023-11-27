import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

import type { SearchRequest, SearchResponse } from '../search/model';
import { NOBSC_USER_ID } from '../shared/model';
import { MySQLRepo } from '../shared/MySQL';

export class IngredientRepo extends MySQLRepo implements IngredientRepoInterface {
  async autosuggest(term: string) {
    const owner_id = NOBSC_USER_ID;  // only public equipment are searchable
    const sql = `
      SELECT
        i.ingredient_id AS id,
        ${fullnameSql} AS text
      FROM ingredient i
      LEFT JOIN ingredient_alt_name n ON i.ingredient_id = n.ingredient_id
      WHERE i.owner_id = ? AND ${fullnameSql} LIKE ?
      LIMIT 5;
    `;
    //${fullnameSql} AS fullname
    //GROUP BY i.ingredient_id
    //LIMIT 5;
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
        i.ingredient_id,
        t.ingredient_type_name,
        i.ingredient_brand,
        i.ingredient_variety,
        i.ingredient_name,
        ${fullnameSql} AS fullname,
        i.notes,
        m.image_filename
      FROM ingredient i
      INNER JOIN ingredient_type t     ON t.ingredient_type_id = i.ingredient_type_id
      LEFT JOIN ingredient_alt_name n ON i.ingredient_id      = n.ingredient_id
      INNER JOIN image m               ON i.image_id           = m.image_id
      WHERE i.owner_id = ?
    `;

    // order matters

    const params: Array<number|string> = [owner_id];

    if (term) {
      sql += ` AND ${fullnameSql} LIKE ?`;
      params.push(`%${term}%`);
    }

    const ingredient_types = filters?.ingredient_types ?? [];

    if (ingredient_types.length > 0) {
      const placeholders = '?,'.repeat(ingredient_types.length).slice(0, -1);
      sql += ` AND t.ingredient_type_name IN (${placeholders})`;
      params.push(...ingredient_types);
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

    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [
      ...params,
      `${limit}`,
      `${offset}`
    ]);  // order matters

    const total_pages = (total_results <= limit) ? 1 : Math.ceil(total_results / limit);

    return {
      results: rows,
      total_results,
      total_pages
    };
  }

  async hasPrivate(ingredient_ids: string[]) {
    const sql = `
      SELECT *
      FROM ingredient
      WHERE ingredient_id IN ? AND (owner_id = ?)
      `;
      const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [ingredient_ids, NOBSC_USER_ID]);
      return rows.length > 0 ? true : false;
  }  // TO DO: thoroughly integration test this

  async viewAllOfficialFullnames() {
    const owner_id  = NOBSC_USER_ID;
    const sql = `SELECT ${fullnameSql} AS fullname FROM ingredient i WHERE i.owner_id = ?`;
    const [ rows ] = await this.pool.execute<FullnameView[]>(sql, [owner_id]);
    return rows;
  }  // for Next.js getStaticPaths

  async viewAll(owner_id: string) {
    const sql = `
      SELECT
        i.ingredient_id,
        i.ingredient_type_id,
        t.ingredient_type_name,
        i.owner_id,
        i.ingredient_brand,
        i.ingredient_variety,
        i.ingredient_name,
        ${fullnameSql} AS fullname,
        i.notes,
        m.image_id,
        m.image_filename,
        m.caption
      FROM ingredient i
      INNER JOIN ingredient_type t     ON i.ingredient_type_id = t.ingredient_type_id
      INNER JOIN ingredient_alt_name n ON i.ingredient_id      = n.ingredient_id
      INNER JOIN image m               ON i.image_id           = m.image_id
      WHERE i.owner_id = ?
      ORDER BY i.ingredient_name ASC
    `;
    const [ rows ] = await this.pool.execute<IngredientView[]>(sql, [owner_id]);
    return rows;
  }

  async viewOne(ingredient_id: string) {
    const sql = `
      SELECT
        i.ingredient_id,
        i.ingredient_type_id,
        t.ingredient_type_name,
        i.owner_id,
        i.ingredient_brand,
        i.ingredient_variety,
        i.ingredient_name,
        ${fullnameSql} AS fullname,
        i.notes,
        m.image_id,
        m.image_filename,
        m.caption
      FROM ingredient i
      INNER JOIN ingredient_type t    ON i.ingredient_type_id = t.ingredient_type_id
      LEFT JOIN ingredient_alt_name n ON i.ingredient_id      = n.ingredient_id
      INNER JOIN image m              ON i.image_id           = m.image_id
      WHERE i.ingredient_id = ?
    `;
    const [ [ row ] ] = await this.pool.execute<IngredientView[]>(sql, [ingredient_id]);
    return row;
  }

  async insert(params: InsertParams) {
    const sql = `
      INSERT INTO ingredient (
        ingredient_id,
        ingredient_type_id,
        owner_id,
        ingredient_brand,
        ingredient_variety,
        ingredient_name,
        notes,
        image_id
      ) VALUES (
        :ingredient_id,
        :ingredient_type_id,
        :owner_id,
        :ingredient_brand,
        :ingredient_variety,
        :ingredient_name,
        :notes,
        :image_id
      )
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, params);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async update({
    ingredient_type_id,
    ingredient_brand,
    ingredient_variety,
    ingredient_name,
    notes,
    image_id,
    owner_id,
    ingredient_id
  }: UpdateParams) {
    const sql = `
      UPDATE ingredient
      SET
        ingredient_type_id = :ingredient_type_id,
        ingredient_brand   = :ingredient_brand,
        ingredient_variety = :ingredient_variety,
        ingredient_name    = :ingredient_name,
        notes              = :notes,
        image_id           = :image_id
      WHERE owner_id = :owner_id AND ingredient_id = :ingredient_id
      LIMIT 1
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, {
      ingredient_type_id,
      ingredient_brand,
      ingredient_variety,
      ingredient_name,
      notes,
      image_id,
      owner_id,
      ingredient_id
    });
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async deleteAll(owner_id: string) {
    const sql = `DELETE FROM ingredient WHERE owner_id = ?`;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, [owner_id]);
    // log instead
    //if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async deleteOne(params: DeleteOneParams) {
    const sql = `
      DELETE FROM ingredient
      WHERE owner_id = :owner_id AND ingredient_id = :ingredient_id
      LIMIT 1
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, params);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }
}

export interface IngredientRepoInterface {
  autosuggest: (term: string) =>                 Promise<SuggestionView[]>;
  search:      (searchRequest: SearchRequest) => Promise<SearchResponse>;
  hasPrivate:  (ingredient_ids: string[]) =>     Promise<boolean>;
  viewAllOfficialFullnames: () => Promise<FullnameView[]>;
  viewAll:     (owner_id: string) =>             Promise<IngredientView[]>;
  viewOne:     (ingredient_id: string) =>        Promise<IngredientView>;
  insert:      (params: InsertParams) =>         Promise<void>;
  update:      (params: InsertParams) =>         Promise<void>;
  deleteAll:   (owner_id: string) =>             Promise<void>;
  deleteOne:   (params: DeleteOneParams) =>      Promise<void>;
}

type SuggestionView = RowDataPacket & {
  id: string;
  text: string;
};

type FullnameView = RowDataPacket & {
  fullname: string;
};

type IngredientView = RowDataPacket & {
  ingredient_id:        string;
  ingredient_type_id:   number;
  ingredient_type_name: string;
  owner_id:             string;
  ingredient_brand:     string;
  ingredient_variety:   string;
  ingredient_name:      string;
  fullname:             string;
  notes:                string;
  image_id:             string;
  image_filename:       string;
  caption:              string;
};

type InsertParams = {
  ingredient_id:      string;
  ingredient_type_id: number;
  owner_id:           string;
  ingredient_brand:   string;
  ingredient_variety: string;
  ingredient_name:    string;
  notes:              string;
  image_id:           string;
};

type UpdateParams = InsertParams;

type DeleteOneParams = {
  owner_id:      string;
  ingredient_id: string;
};

const fullnameSql = `
  TRIM(CONCAT_WS(
    ' ',
    i.ingredient_brand,
    i.ingredient_variety,
    i.ingredient_name,
    IFNULL(n.alt_name, '')
  ))
`;
