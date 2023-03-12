import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import type { SearchRequest, SearchResponse } from '../../lib/validations';

export class Ingredient implements IIngredient {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool =      pool;
    this.auto =      this.auto.bind(this);
    this.search =    this.search.bind(this);
    this.viewAll =   this.viewAll.bind(this);
    this.viewOne =   this.viewOne.bind(this);
    this.create =    this.create.bind(this);
    this.update =    this.update.bind(this);
    this.deleteAll = this.deleteAll.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
  }

  async auto(term: string) {
    const ownerId = 1;  // only public ingredients are suggestible
    const sql = `SELECT id, brand, variety, name, fullname FROM equipment WHERE name LIKE ? AND owner_id = ? LIMIT 5`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [`%${term}%`, ownerId]);
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
      FROM ingredients i
      INNER JOIN ingredient_types t ON t.id = i.ingredient_type_id
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

    const [ [ count ] ] = await this.pool.execute<RowDataPacket[]>(`SELECT COUNT(*) FROM (${sql}) results`, params);
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
      FROM ingredients i
      INNER JOIN ingredient_types t ON i.ingredient_type_id = t.id
      WHERE i.author_id = ? AND i.owner_id = ?
      ORDER BY i.name ASC
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [authorId, ownerId]);
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
      FROM ingredients i
      INNER JOIN ingredient_types t ON i.ingredient_type_id = t.id
      WHERE owner_id = 1 AND i.id = ?
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id, authorId, ownerId]);
    return row;
  }

  async create(ingredient: ICreatingIngredient) {
    const sql = `
      INSERT INTO ingredients (
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
    const [ row ] = await this.pool.execute<RowDataPacket[] & ResultSetHeader>(sql, [
      ingredient.ingredientTypeId, ingredient.authorId, ingredient.ownerId, ingredient.brand, ingredient.variety, ingredient.name, ingredient.description, ingredient.image
    ]);
    return row;
  }

  async update(ingredient: IUpdatingIngredient) {
    const sql = `
      UPDATE ingredients
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
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [
      ingredient.ingredientTypeId, ingredient.brand, ingredient.variety, ingredient.name, ingredient.description, ingredient.image, ingredient.id
    ]);
    return row;
  }

  async deleteAll(ownerId: number) {
    const sql = `DELETE FROM ingredients WHERE owner_id = ?`;
    await this.pool.execute<RowDataPacket[]>(sql, [ownerId]);
  }

  async deleteOne(id: number, ownerId: number) {
    const sql = `DELETE FROM ingredients WHERE owner_id = ? AND id = ? LIMIT 1`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [ownerId, id]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

type DataWithHeader = Promise<RowDataPacket[] & ResultSetHeader>;

export interface IIngredient {
  pool:                                                   Pool;
  auto(term: string):                                     Data;
  search(searchRequest: SearchRequest):                   Promise<SearchResponse>;
  viewAll(authorId: number, ownerId: number):             Data;
  viewOne(id: number, authorId: number, ownerId: number): Data;
  create(ingredient: ICreatingIngredient):                DataWithHeader;
  update(ingredient: IUpdatingIngredient):                Data;
  deleteAll(ownerId: number):                             void;
  deleteOne(id: number, ownerId: number):                 Data;
}

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

/*interface ISavingIngredient {
  id:                   number;
  ingredient_type_name: string;
  fullname:             string;
  brand:                string;
  variety:              string;
  name:                 string;
  description:          string;
  image:                string;
}*/
