import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import type { SearchRequest, SearchResponse } from '../../lib/validations';
import { MySQLRepo } from './MySQL';

export class IngredientRepo extends MySQLRepo implements IIngredientRepo {
  async auto(term: string) {
    const ownerId = 1;  // only public ingredients are suggestible
    const sql = `
      SELECT
        id,
        brand,
        variety,
        name,
        fullname AS text
      FROM ingredient
      WHERE fullname LIKE ? AND owner_id = ?
      LIMIT 5
    `;
    const [ rows ] = await this.pool.execute<IngredientSuggestion[]>(sql, [`%${term}%`, ownerId]);
    return rows;
  }

  async search({ term, filters, sorts, currentPage, resultsPerPage }: SearchRequest) {
    const ownerId = 1;  // only public ingredients are searchable
    let sql = `
      SELECT
        i.id,
        t.name AS ingredient_type_name,
        i.brand,
        i.variety,
        i.name,
        i.fullname,
        i.description,
        i.image
      FROM ingredient i
      INNER JOIN ingredient_type t ON t.id = i.ingredient_type_id
      WHERE i.owner_id = ?
    `;

    // order matters

    const params: Array<number|string> = [ownerId];

    if (term) {
      sql += ` AND i.fullname LIKE ?`;
      params.push(`%${term}%`);
    }

    const ingredientTypes = filters?.ingredientTypes ?? [];

    if (ingredientTypes.length > 0) {
      const placeholders = '?,'.repeat(ingredientTypes.length).slice(0, -1);
      sql += ` AND t.name IN (${placeholders})`;
      params.push(...ingredientTypes);
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
        i.id,
        i.ingredient_type_id,
        i.owner_id,
        t.name AS ingredient_type_name,
        i.brand,
        i.variety,
        i.name,
        i.fullname,
        i.description,
        i.image
      FROM ingredient i
      INNER JOIN ingredient_type t ON i.ingredient_type_id = t.id
      WHERE i.author_id = ? AND i.owner_id = ?
      ORDER BY i.name ASC
    `;
    const [ row ] = await this.pool.execute<Ingredient[]>(sql, [authorId, ownerId]);
    return row;
  }

  async viewOne(id: number, authorId: number, ownerId: number) {
    const sql = `
      SELECT
        i.id,
        t.name AS ingredient_type_name,
        i.brand,
        i.variety,
        i.name,
        i.fullname,
        i.description,
        i.image
      FROM ingredient i
      INNER JOIN ingredient_type t ON i.ingredient_type_id = t.id
      WHERE owner_id = 1 AND i.id = ?
    `;
    const [ row ] = await this.pool.execute<Ingredient[]>(sql, [id, authorId, ownerId]);
    return row;
  }

  async create(ingredient: ICreatingIngredient) {
    const sql = `
      INSERT INTO ingredient (
        ingredient_type_id,
        author_id,
        owner_id,
        brand,
        variety,
        name,
        description,
        image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [ row ] = await this.pool.execute<Ingredient[] & ResultSetHeader>(sql, [
      ingredient.ingredientTypeId,
      ingredient.authorId,
      ingredient.ownerId,
      ingredient.brand,
      ingredient.variety,
      ingredient.name,
      ingredient.description,
      ingredient.image
    ]);
    return row;  // is this needed?
  }

  async update(ingredient: IUpdatingIngredient) {
    const sql = `
      UPDATE ingredient
      SET
        ingredient_type_id = ?,
        brand = ?,
        variety = ?,
        name = ?,
        description = ?,
        image = ?
      WHERE id = ?
      LIMIT 1
    `;
    await this.pool.execute(sql, [
      ingredient.ingredientTypeId,
      ingredient.brand,
      ingredient.variety,
      ingredient.name,
      ingredient.description,
      ingredient.image,
      ingredient.id
    ]);
  }

  async deleteAll(ownerId: number) {
    const sql = `DELETE FROM ingredient WHERE owner_id = ?`;
    await this.pool.execute(sql, [ownerId]);
  }

  async deleteOne(id: number, ownerId: number) {
    const sql = `DELETE FROM ingredient WHERE owner_id = ? AND id = ? LIMIT 1`;
    await this.pool.execute(sql, [ownerId, id]);
  }
}

export interface IIngredientRepo {
  auto:      (term: string) =>                                  Promise<IngredientSuggestion[]>;
  search:    (searchRequest: SearchRequest) =>                  Promise<SearchResponse>;
  viewAll:   (authorId: number, ownerId: number) =>             Promise<Ingredient[]>;
  viewOne:   (id: number, authorId: number, ownerId: number) => Promise<Ingredient[]>;
  create:    (ingredient: ICreatingIngredient) =>               Promise<Ingredient[] & ResultSetHeader>;
  update:    (ingredient: IUpdatingIngredient) =>               Promise<void>;
  deleteAll: (ownerId: number) =>                               Promise<void>;
  deleteOne: (id: number, ownerId: number) =>                   Promise<void>;
}

type Ingredient = RowDataPacket & {
  id:                   number;
  ingredient_type_id:   number;
  owner_id:             number;
  ingredient_type_name: string;
  brand:                string;
  variety:              string;
  name:                 string;
  fullname:             string;
  description:          string;
  image:                string;
};

type ICreatingIngredient = {
  ingredientTypeId: number;
  authorId:         number;
  ownerId:          number;
  brand:            string;
  variety:          string;
  name:             string;
  description:      string;
  image:            string;
};

type IUpdatingIngredient = ICreatingIngredient & {
  id: number;
};

type IngredientSuggestion = RowDataPacket & {
  id:      number;
  brand:   string;
  variety: string;
  name:    string;
  text:    string;
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
