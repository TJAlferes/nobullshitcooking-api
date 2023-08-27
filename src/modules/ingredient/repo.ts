import { RowDataPacket } from 'mysql2/promise';

import type { SearchRequest, SearchResponse } from '../search/model';
import { MySQLRepo } from '../shared/MySQL';

export class IngredientRepo extends MySQLRepo implements IngredientRepoInterface {
  async autosuggest(term: string) {
    const sql = `
      SELECT
        i.ingredient_id,
        CONCAT_WS(
          ' ',
          i.ingredient_brand,
          i.ingredient_variety,
          i.ingredient_name,
          IFNULL(GROUP_CONCAT(n.alt_name SEPARATOR ' '), '')
        ) AS text,
      FROM ingredient i
      INNER JOIN ingredient_alt_name n ON i.ingredient_id = n.ingredient_id
      WHERE text LIKE ?
      LIMIT 5
    `;
    const [ rows ] = await this.pool.execute<IngredientSuggestion[]>(sql, [`%${term}%`]);
    return rows;
  }

  async search({ term, filters, sorts, current_page, results_per_page }: SearchRequest) {
    let sql = `
      SELECT
        i.ingredient_id,
        t.ingredient_type_name,
        i.ingredient_brand,
        i.ingredient_variety,
        i.ingredient_name,
        CONCAT_WS(
          ' ',
          i.ingredient_brand,
          i.ingredient_variety,
          i.ingredient_name,
          IFNULL(GROUP_CONCAT(n.alt_name SEPARATOR ' '), '')
        ) AS fullname,
        i.notes,
        m.image_url
      FROM ingredient i
      INNER JOIN ingredient_type t     ON t.ingredient_type_id = i.ingredient_type_id
      INNER JOIN ingredient_alt_name n ON i.ingredient_id      = n.ingredient_id
      INNER JOIN image m               ON i.image_id           = m.image_id
    `;

    // order matters

    const params: Array<number|string> = [];

    if (term) {
      sql += ` AND i.fullname LIKE ?`;
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

  async viewAll() {
    const sql = `
      SELECT
        i.ingredient_id,
        i.ingredient_type_id,
        t.ingredient_type_name,
        i.owner_id,
        i.ingredient_brand,
        i.ingredient_variety,
        i.ingredient_name,
        CONCAT_WS(
          ' ',
          i.ingredient_brand,
          i.ingredient_variety,
          i.ingredient_name,
          IFNULL(GROUP_CONCAT(n.alt_name SEPARATOR ' '), '')
        ) AS fullname,
        i.notes,
        m.image_url
      FROM ingredient i
      INNER JOIN ingredient_type t     ON i.ingredient_type_id = t.ingredient_type_id
      INNER JOIN ingredient_alt_name n ON i.ingredient_id      = n.ingredient_id
      INNER JOIN image m               ON i.image_id           = m.image_id
      ORDER BY i.ingredient_name ASC
    `;
    const [ rows ] = await this.pool.execute<IngredientView[]>(sql);
    return rows;
  }

  async viewOne(ingredient_id: string) {
    const sql = `
      SELECT
        i.ingredient_id,
        i.ingredient_type_id
        t.ingredient_type_name,
        i.owner_id,
        i.ingredient_brand,
        i.ingredient_variety,
        i.ingredient_name,
        CONCAT_WS(
          ' ',
          i.ingredient_brand,
          i.ingredient_variety,
          i.ingredient_name,
          IFNULL(GROUP_CONCAT(n.alt_name SEPARATOR ' '), '')
        ) AS fullname,
        i.notes,
        m.image_url
      FROM ingredient i
      INNER JOIN ingredient_type t     ON i.ingredient_type_id = t.ingredient_type_id
      INNER JOIN ingredient_alt_name n ON i.ingredient_id      = n.ingredient_id
      INNER JOIN image m               ON i.image_id           = m.image_id
      WHERE i.ingredient_id = :ingredient_id
    `;
    const [ [ row ] ] = await this.pool.execute<IngredientView[]>(sql, ingredient_id);
    return row;
  }

  async insert(params: InsertParams) {
    const sql = `
      INSERT INTO ingredient (
        ingredient_id
        ingredient_type_id,
        owner_id,
        ingredient_brand,
        ingredient_variety,
        ingredient_name,
        notes
      ) VALUES (
        :ingredient_id
        :ingredient_type_id,
        :owner_id,
        :ingredient_brand,
        :ingredient_variety,
        :ingredient_name,
        :notes
      )
    `;
    await this.pool.execute(sql, params);
  }

  async update(params: InsertParams) {
    const sql = `
      UPDATE ingredient
      SET
        ingredient_type_id = :ingredient_type_id,
        ingredient_brand   = :ingredient_brand,
        ingredient_variety = :ingredient_variety,
        ingredient_name    = :ingredient_name,
        notes              = :notes
      WHERE ingredient_id = :ingredient_id
      LIMIT 1
    `;
    await this.pool.execute(sql, params);
  }

  async deleteOne(ingredient_id: string) {
    const sql = `
      DELETE FROM ingredient
      WHERE ingredient_id = :ingredient_id
      LIMIT 1
    `;
    await this.pool.execute(sql, ingredient_id);
  }
}

export interface IngredientRepoInterface {
  autosuggest: (term: string) =>                 Promise<IngredientSuggestion[]>;
  search:      (searchRequest: SearchRequest) => Promise<SearchResponse>;
  viewAll:     () =>                             Promise<IngredientView[]>;
  viewOne:     (ingredient_id: string) =>        Promise<IngredientView>;
  insert:      (params: InsertParams) =>         Promise<void>;
  update:      (params: InsertParams) =>         Promise<void>;
  deleteOne:   (ingredient_id: string) =>        Promise<void>;
}

type IngredientView = RowDataPacket & {
  ingredient_id:        string;
  ingredient_type_id:   number;
  ingredient_type_name: string;
  owner_id:             string;
  brand:                string;
  variety:              string;
  ingredient_name:      string;
  fullname:             string;
  notes:                string;
  image_url:            string;
};

type InsertParams = {
  ingredient_id:      string;
  ingredient_type_id: number;
  owner_id:           string;
  brand:              string;
  variety:            string;
  ingredient_name:    string;
  notes:              string;
  image_id:           string;
};

type IngredientSuggestion = RowDataPacket & {
  ingredient_id:   string;
  brand:           string;
  variety:         string;
  ingredient_name: string;
  text:            string;
};
