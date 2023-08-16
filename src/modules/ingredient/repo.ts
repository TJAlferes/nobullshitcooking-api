import { RowDataPacket } from 'mysql2/promise';

import type { SearchRequest, SearchResponse } from '../search/model';
import { MySQLRepo } from '../shared/MySQL';

export class IngredientRepo extends MySQLRepo implements IIngredientRepo {
  async auto(term: string) {
    const owner_id = 1;  // only public ingredients are suggestible (this should be in the service, not in the repo)
    const sql = `
      SELECT
        i.ingredient_id,
        i.ingredient_brand,
        i.ingredient_variety,
        i.ingredient_name,
        CONCAT_WS(
          ' ',
          i.ingredient_brand,
          i.ingredient_variety,
          i.ingredient_name,
          IFNULL(GROUP_CONCAT(n.alt_name SEPARATOR ' '), '')
        ) AS text,
      FROM ingredient i
      INNER JOIN ingredient_alt_name n ON i.ingredient_id = n.ingredient_id
      WHERE text LIKE ? AND i.owner_id = ?
      LIMIT 5
    `;
    const [ rows ] = await this.pool.execute<IngredientSuggestion[]>(sql, [`%${term}%`, owner_id]);
    return rows;
  }

  async search({ term, filters, sorts, current_page, results_per_page }: SearchRequest) {
    const owner_id = 1;  // only public ingredients are searchable (this should be in the service, not in the repo)
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
        i.description,
        m.image_url
      FROM ingredient i
      INNER JOIN ingredient_type t     ON t.ingredient_type_id = i.ingredient_type_id
      INNER JOIN ingredient_alt_name n ON i.ingredient_id      = n.ingredient_id
      INNER JOIN image m               ON i.image_id           = m.image_id
      WHERE i.owner_id = ?
    `;

    // order matters

    const params: Array<number|string> = [owner_id];

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

    const [ [ { count } ] ] = await this.pool.execute<RowDataPacket[]>(`SELECT COUNT(*) AS count FROM (${sql}) results`, params);
    const total_results = Number(count);
    
    const limit =  results_per_page ? Number(results_per_page)           : 20;
    const offset = current_page     ? (Number(current_page) - 1) * limit : 0;

    sql += ` LIMIT ? OFFSET ?`;

    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [...params, `${limit}`, `${offset}`]);  // order matters

    const total_pages = (total_results <= limit) ? 1 : Math.ceil(total_results / limit);

    return {results: rows, total_results, total_pages};
  }

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
        CONCAT_WS(
          ' ',
          i.ingredient_brand,
          i.ingredient_variety,
          i.ingredient_name,
          IFNULL(GROUP_CONCAT(n.alt_name SEPARATOR ' '), '')
        ) AS fullname,
        i.description,
        m.image_url
      FROM ingredient i
      INNER JOIN ingredient_type t     ON i.ingredient_type_id = t.ingredient_type_id
      INNER JOIN ingredient_alt_name n ON i.ingredient_id      = n.ingredient_id
      INNER JOIN image m               ON i.image_id           = m.image_id
      WHERE i.owner_id = ?
      ORDER BY i.ingredient_name ASC
    `;
    const [ row ] = await this.pool.execute<IngredientView[]>(sql, owner_id);
    return row;
  }

  async viewOne(params: ViewOneParams) {
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
        i.description,
        m.image_url
      FROM ingredient i
      INNER JOIN ingredient_type t     ON i.ingredient_type_id = t.ingredient_type_id
      INNER JOIN ingredient_alt_name n ON i.ingredient_id      = n.ingredient_id
      INNER JOIN image m               ON i.image_id           = m.image_id
      WHERE i.ingredient_id = :ingredient_id AND i.owner_id = :owner_id
    `;
    const [ [ row ] ] = await this.pool.execute<IngredientView[]>(sql, params);
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
        description
      ) VALUES (
        :ingredient_id
        :ingredient_type_id,
        :owner_id,
        :ingredient_brand,
        :ingredient_variety,
        :ingredient_name,
        :description
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
        description        = :description
      WHERE ingredient_id = :ingredient_id
      LIMIT 1
    `;
    await this.pool.execute(sql, params);
  }

  async deleteAll(owner_id: string) {
    const sql = `DELETE FROM ingredient WHERE owner_id = ?`;
    await this.pool.execute(sql, [owner_id]);
  }

  async deleteOne(params: DeleteOneParams) {
    const sql = `DELETE FROM ingredient WHERE ingredient_id = :ingredient_id AND owner_id = :owner_id LIMIT 1`;
    await this.pool.execute(sql, params);
  }
}

export interface IIngredientRepo {
  auto:      (term: string) =>                 Promise<IngredientSuggestion[]>;
  search:    (searchRequest: SearchRequest) => Promise<SearchResponse>;
  viewAll:   (owner_id: string) =>             Promise<IngredientView[]>;
  viewOne:   (params: ViewOneParams) =>        Promise<IngredientView>;
  insert:    (params: InsertParams) =>         Promise<void>;
  update:    (params: InsertParams) =>         Promise<void>;
  deleteAll: (owner_id: string) =>             Promise<void>;
  deleteOne: (params: DeleteOneParams) =>      Promise<void>;
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
  description:          string;
  image_url:            string;
};

type InsertParams = {
  ingredient_id:      string;
  ingredient_type_id: number;
  owner_id:           string;
  brand:              string;
  variety:            string;
  ingredient_name:    string;
  description:        string;
  image_url:          string;
};

type IngredientSuggestion = RowDataPacket & {
  ingredient_id:   string;
  brand:           string;
  variety:         string;
  ingredient_name: string;
  text:            string;
};

type ViewOneParams = {
  ingredient_id: string;
  owner_id:      string;
};

type DeleteOneParams = {
  ingredient_id: string;
  owner_id:      string;
};

/*
SELECT
  i.id,
  i.brand,
  i.variety,
  i.name,
  CONCAT_WS(' ', i.brand, i.variety, i.name, IFNULL(GROUP_CONCAT(ian.alt_name SEPARATOR ' '), '')) AS fullname
FROM
  ingredient AS i
LEFT JOIN
  ingredient_alt_name AS ian ON i.id = ian.ingredient_id
GROUP BY
  i.id;
*/
