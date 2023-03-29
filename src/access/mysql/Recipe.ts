import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import type { SearchRequest, SearchResponse } from '../../lib/validations';

export class Recipe implements IRecipe {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool =                pool;
    this.autosuggest =         this.autosuggest.bind(this);
    this.search =              this.search.bind(this);
    this.getPrivateIds =       this.getPrivateIds.bind(this);
    this.viewAllPublicTitles = this.viewAllPublicTitles.bind(this);
    this.viewOneById =         this.viewOneById.bind(this);
    this.viewOneByTitle =      this.viewOneByTitle.bind(this);
    this.create =              this.create.bind(this);
    this.update =              this.update.bind(this);
    this.disownAllByAuthorId = this.disownAllByAuthorId.bind(this);
    this.disownOneByAuthorId = this.disownOneByAuthorId.bind(this);
    this.deleteAllByOwnerId =  this.deleteAllByOwnerId.bind(this);
    this.deleteOneByOwnerId =  this.deleteOneByOwnerId.bind(this);
  }

  async autosuggest(term: string) {
    const ownerId = 1;  // only public recipes are searchable
    const sql = `SELECT id, title AS text FROM recipes WHERE title LIKE ? AND owner_id = ? LIMIT 5`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [`%${term}%`, ownerId]);
    return rows;
  }

  async search({ term, filters, sorts, currentPage, resultsPerPage }: SearchRequest) {
    const ownerId = 1;  // only public recipes are searchable
    let sql = `
      SELECT
        r.id,
        u.username AS author,
        rt.name    AS recipe_type_name,
        c.name     AS cuisine_name,
        r.title,
        r.description,
        r.recipe_image
      FROM recipes r
      INNER JOIN users u         ON u.id = r.author_id
      INNER JOIN recipe_types rt ON rt.id = r.recipe_type_id
      INNER JOIN cuisines c      ON c.id = r.cuisine_id
      WHERE r.owner_id = ?
    `;

    // order matters

    let params: Array<number|string> = [ownerId];

    if (term) {
      sql += ` AND r.title LIKE ?`;
      params.push(`%${term}%`);
    }

    const recipeTypes = filters?.recipeTypes ?? [];
    const methods     = filters?.methods ?? [];
    const cuisines    = filters?.cuisines ?? [];

    if (recipeTypes.length > 0) {
      const placeholders = '?,'.repeat(recipeTypes.length).slice(0, -1);
      sql += ` AND rt.name IN (${placeholders})`;
      params.push(...recipeTypes);
    }

    if (methods.length > 0) {
      const placeholders = '?,'.repeat(methods.length).slice(0, -1);
      // I don't believe this is optimal, but it's the best solution I know of for now. -- tjalferes, March 19th 2023
      sql += ` AND JSON_OVERLAPS(
        JSON_ARRAY(${placeholders}),
        (
          SELECT JSON_ARRAYAGG(m.name)
          FROM methods m
          INNER JOIN recipe_methods rm ON rm.method_id = m.id
          WHERE rm.recipe_id = r.id
        )
      )`;
      params.push(...methods);
    }

    if (cuisines.length > 0) {
      const placeholders = '?,'.repeat(cuisines.length).slice(0, -1);
      sql += ` AND c.code IN (${placeholders})`;  
      params.push(...cuisines);
    }

    //if (neededSorts)

    const [ [ { count } ] ] = await this.pool.execute<RowDataPacket[]>(`SELECT COUNT(*) AS count FROM (${sql}) results`, params);
    const totalResults = Number(count);
    
    const limit =  resultsPerPage ? Number(resultsPerPage)            : 20;
    const offset = currentPage    ? (Number(currentPage) - 1) * limit : 0;

    sql += ` LIMIT ? OFFSET ?`;

    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [...params, `${limit}`, `${offset}`]);  // order matters

    const totalPages = (totalResults <= limit) ? 1 : Math.ceil(totalResults / limit);
    console.log('>>>totalPages', totalPages);

    return {results: rows, totalResults, totalPages};
  }

  async getPrivateIds(userId: number) {
    const sql = `SELECT id FROM recipes WHERE author_id = ? AND owner_id = ?`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [userId, userId]);
    const ids: number[] = [];
    rows.forEach(({ id }) => ids.push(id));
    return ids;
  }

  async viewAllPublicTitles(authorId: number, ownerId: number) {  // for Next.js getStaticPaths
    const sql = `SELECT title FROM recipes WHERE author_id = ? AND owner_id = ?`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [authorId, ownerId]);
    return rows;
  }

  /*async viewAll(authorId: number, ownerId: number) {
    const sql = `
      SELECT id, recipe_type_id, cuisine_id, title, recipe_image, owner_id
      FROM recipes
      WHERE author_id = ? AND owner_id = ?
      ORDER BY title ASC
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [authorId, ownerId]);
    return rows;
  }*/

  async viewOneById(id: number, authorId: number, ownerId: number) {
    const sql = `${viewOneSQL} AND r.id = ?`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [authorId, ownerId, id]);
    return row;
  }

  async viewOneByTitle(title: string, authorId: number, ownerId: number) {
    const sql = `${viewOneSQL} AND r.title = ?`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [authorId, ownerId, title]);
    return row;
  }

  async create(recipe: ICreatingRecipe) {
    const sql = `
      INSERT INTO recipes (
        recipe_type_id,
        cuisine_id,
        author_id,
        owner_id,
        title,
        description,
        active_time,
        total_time,
        directions,
        recipe_image,
        equipment_image,
        ingredients_image,
        cooking_image,
        video
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[] & ResultSetHeader>(sql, [
      recipe.recipeTypeId,
      recipe.cuisineId,
      recipe.authorId,
      recipe.ownerId,
      recipe.title,
      recipe.description,
      recipe.activeTime,
      recipe.totalTime,
      recipe.directions,
      recipe.recipeImage,
      recipe.equipmentImage,
      recipe.ingredientsImage,
      recipe.cookingImage,
      recipe.video
    ]);
    return row;
  }

  async update(recipe: IUpdatingRecipe) {
    const sql = `
      UPDATE recipes
      SET
        recipe_type_id = ?,
        cuisine_id = ?,
        author_id = ?,
        owner_id = ?,
        title = ?,
        description = ?,
        active_time = ?,
        total_time = ?,
        directions = ?,
        recipe_image = ?,
        equipment_image = ?,
        ingredients_image = ?,
        cooking_image = ?,
        video = ?
      WHERE id = ?
      LIMIT 1
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [
      recipe.recipeTypeId,
      recipe.cuisineId,
      recipe.authorId,
      recipe.ownerId,
      recipe.title,
      recipe.description,
      recipe.activeTime,
      recipe.totalTime,
      recipe.directions,
      recipe.recipeImage,
      recipe.equipmentImage,
      recipe.ingredientsImage,
      recipe.cookingImage,
      recipe.video,
      recipe.id
    ]);
    return row;
  }
  
  async disownAllByAuthorId(authorId: number) {
    if (authorId == 1 || authorId == 2) return;
    const newAuthorId = 2;  // double check
    const sql = `UPDATE recipes SET author_id = ? WHERE author_id = ? AND owner_id = 1`;
    await this.pool.execute<RowDataPacket[]>(sql, [newAuthorId, authorId]);
  }

  async disownOneByAuthorId(id: number, authorId: number) {
    const newAuthorId = 2;  // double check
    const sql = `UPDATE recipes SET author_id = ? WHERE id = ? AND author_id = ? AND owner_id = 1 LIMIT 1`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [newAuthorId, id, authorId]);
    return row;
  }

  async deleteAllByOwnerId(ownerId: number) {
    if (ownerId == 1 || ownerId == 2) return;
    const sql = `DELETE FROM recipes WHERE owner_id = ?`;
    await this.pool.execute<RowDataPacket[]>(sql, [ownerId]);
  }
  
  async deleteOneByOwnerId(id: number, ownerId: number) {
    const sql = `DELETE FROM recipes WHERE id = ? AND owner_id = ? LIMIT 1`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id, ownerId]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

type DataWithHeader = Promise<RowDataPacket[] & ResultSetHeader>;

export interface IRecipe {
  pool:                                                             Pool;
  autosuggest(term: string):                                        Data;
  search(searchRequest: SearchRequest):                             Promise<SearchResponse>;
  getPrivateIds(userId: number):                                    Promise<number[]>;
  viewAllPublicTitles(authorId: number, ownerId: number):           Data;
  viewOneById(id: number, authorId: number, ownerId: number):       Data;
  viewOneByTitle(title: string, authorId: number, ownerId: number): Data;
  create(recipe: ICreatingRecipe):                                  DataWithHeader;
  update(recipe: IUpdatingRecipe):                                  Data;
  disownAllByAuthorId(authorId: number):                            void;
  disownOneByAuthorId(id: number, authorId: number):                Data;
  deleteAllByOwnerId(ownerId: number):                              void;
  deleteOneByOwnerId(id: number, ownerId: number):                  Data;
}

export type ICreatingRecipe = {
  recipeTypeId:     number;
  cuisineId:        number;
  authorId:         number;
  ownerId:          number;
  title:            string;
  description:      string;
  activeTime:       string;
  totalTime:        string;
  directions:       string;
  recipeImage:      string;
  equipmentImage:   string;
  ingredientsImage: string;
  cookingImage:     string;
  video:            string;
};

export type IUpdatingRecipe = ICreatingRecipe & {
  id: number;
  //  what about prevImage ?
};

const viewOneSQL = `
  SELECT
    r.id,
    u.username AS author,
    rt.name    AS recipe_type_name,
    c.name     AS cuisine_name,
    r.recipe_type_id,
    r.cuisine_id,
    r.owner_id,
    r.title,
    r.description,
    r.active_time,
    r.total_time,
    r.directions,
    r.recipe_image,
    r.equipment_image,
    r.ingredients_image,
    r.cooking_image,
    (
      SELECT JSON_ARRAYAGG(JSON_OBJECT(
        'method_name', m.name,
        'method_id',   rm.method_id
      ))
      FROM methods m
      INNER JOIN recipe_methods rm ON rm.method_id = m.id
      WHERE rm.recipe_id = r.id
    ) methods,
    (
      SELECT JSON_ARRAYAGG(JSON_OBJECT(
        'amount',         re.amount,
        'equipment_name', e.name,
        'equipment_type_id', e.equipment_type_id,
        'equipment_id',      re.equipment_id
      ))
      FROM equipment e
      INNER JOIN recipe_equipment re ON re.equipment_id = e.id
      WHERE re.recipe_id = r.id
    ) equipment,
    (
      SELECT JSON_ARRAYAGG(JSON_OBJECT(
        'amount',           ri.amount,
        'measurement_name', m.name,
        'ingredient_name',  i.name,
        'measurement_id',     ri.measurement_id,
        'ingredient_type_id', i.ingredient_type_id,
        'ingredient_id',      ri.ingredient_id
      ))
      FROM ingredients i
      INNER JOIN recipe_ingredients ri ON ri.ingredient_id = i.id
      INNER JOIN measurements m        ON m.id = ri.measurement_id
      WHERE ri.recipe_id = r.id
    ) ingredients,
    (
      SELECT JSON_ARRAYAGG(JSON_OBJECT(
        'amount',           rs.amount,
        'measurement_name', m.name,
        'subrecipe_title',  r.title,
        'measurement_id', rs.measurement_id,
        'recipe_type_id', r.recipe_type_id,
        'cuisine_id',     r.cuisine_id,
        'subrecipe_id',   rs.subrecipe_id
      ))
      FROM recipes r
      INNER JOIN recipe_subrecipes rs ON rs.subrecipe_id = r.id
      INNER JOIN measurements m       ON m.id = rs.measurement_id
      WHERE rs.recipe_id = r.id
    ) subrecipes
  FROM recipes r
  INNER JOIN users u         ON u.id = r.author_id
  INNER JOIN recipe_types rt ON rt.id = r.recipe_type_id
  INNER JOIN cuisines c      ON c.id = r.cuisine_id
  WHERE r.author_id = ? AND r.owner_id = ?
`;
