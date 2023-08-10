import { RowDataPacket } from 'mysql2/promise';

import type { SearchRequest, SearchResponse } from '../../lib/validations';
import { MySQLRepo } from './MySQL';

export class IngredientRepo extends MySQLRepo implements IIngredientRepo {
  async auto(term: string) {
    const owner_id = 1;  // only public ingredients are suggestible
    const sql = `
      SELECT
        ingredient_id,
        brand,
        variety,
        ingredient_name,
        fullname AS text
      FROM ingredient
      WHERE fullname LIKE ? AND owner_id = ?
      LIMIT 5
    `;
    const [ rows ] = await this.pool.execute<IngredientSuggestion[]>(sql, [`%${term}%`, owner_id]);
    return rows;
  }

  async search({ term, filters, sorts, current_page, results_per_page }: SearchRequest) {
    const owner_id = 1;  // only public ingredients are searchable
    let sql = `
      SELECT
        i.ingredient_d,
        t.ingredient_type_name,
        i.brand,
        i.variety,
        i.ingredient_name,
        i.fullname,
        i.description,
        i.image
      FROM ingredient i
      INNER JOIN ingredient_type t ON t.ingredient_type_id = i.ingredient_type_id
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

  async viewAll(params: ViewAllParams) {
    const sql = `
      SELECT
        i.ingredient_id,
        i.ingredient_type_id,
        t.ingredient_type_name,
        i.owner_id,
        i.brand,
        i.variety,
        i.ingredient_name,
        i.fullname,
        i.description,
        i.image
      FROM ingredient i
      INNER JOIN ingredient_type t ON i.ingredient_type_id = t.ingredient_type_id
      WHERE i.author_id = :author_id AND i.owner_id = :owner_id
      ORDER BY i.ingredient_name ASC
    `;
    const [ row ] = await this.pool.execute<IngredientView[]>(sql, params);
    return row;
  }

  async viewOne(params: ViewOneParams) {
    const sql = `
      SELECT
        i.ingredient_id,
        i.ingredient_type_id
        t.ingredient_type_name,
        i.owner_id,
        i.brand,
        i.variety,
        i.ingredient_name,
        i.fullname,
        i.description,
        i.image
      FROM ingredient i
      INNER JOIN ingredient_type t ON i.ingredient_type_id = t.ingredient_type_id
      WHERE i.ingredient_id = :ingredient_id AND i.author_id = :author_id AND i.owner_id = :owner_id
    `;
    const [ [ row ] ] = await this.pool.execute<IngredientView[]>(sql, params);
    return row;
  }

  async insert(params: InsertParams) {
    const sql = `
      INSERT INTO ingredient (
        ingredient_id
        ingredient_type_id,
        author_id,
        owner_id,
        brand,
        variety,
        ingredient_name,
        description,
        image
      ) VALUES (
        :ingredient_id
        :ingredient_type_id,
        :author_id,
        :owner_id,
        :brand,
        :variety,
        :ingredient_name,
        :description,
        :image
      )
    `;
    await this.pool.execute(sql, params);
  }

  async update(params: InsertParams) {
    const sql = `
      UPDATE ingredient
      SET
        ingredient_type_id = :ingredient_type_id,
        brand              = :brand,
        variety            = :variety,
        ingredient_name    = :ingredient_name,
        description        = :description,
        image              = :image
      WHERE ingredient_id = :ingredient_id
      LIMIT 1
    `;
    await this.pool.execute(sql, params);
  }

  async deleteAll(owner_id: number) {
    const sql = `DELETE FROM ingredient WHERE owner_id = ?`;
    await this.pool.execute(sql, [owner_id]);
  }

  async deleteOne(params: DeleteOneParams) {
    const sql = `DELETE FROM ingredient WHERE owner_id = ? AND id = ? LIMIT 1`;
    await this.pool.execute(sql, params);
  }
}

export interface IIngredientRepo {
  auto:      (term: string) =>                 Promise<IngredientSuggestion[]>;
  search:    (searchRequest: SearchRequest) => Promise<SearchResponse>;
  viewAll:   (params: ViewAllParams) =>        Promise<IngredientView[]>;
  viewOne:   (params: ViewOneParams) =>        Promise<IngredientView>;
  insert:    (params: InsertParams) =>         Promise<void>;
  update:    (params: InsertParams) =>         Promise<void>;
  deleteAll: (owner_id: number) =>             Promise<void>;
  deleteOne: (params: DeleteOneParams) => Promise<void>;
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
  image:                string;
};

type InsertParams = {
  ingredient_id:      string;
  ingredient_type_id: number;
  author_id:          string;
  owner_id:           string;
  brand:              string;
  variety:            string;
  ingredient_name:    string;
  description:        string;
  image:              string;
};

type IngredientSuggestion = RowDataPacket & {
  ingredient_id:   string;
  brand:           string;
  variety:         string;
  ingredient_name: string;
  text:            string;
};

type ViewAllParams = {
  author_id: string;
  owner_id:  string;
};

type ViewOneParams = {
  ingredient_id: string;
  author_id:     string;
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
