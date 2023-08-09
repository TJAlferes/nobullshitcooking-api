import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import type { SearchRequest, SearchResponse } from '../../lib/validations';
import { MySQLRepo } from './MySQL';

export class RecipeRepo extends MySQLRepo implements IRecipeRepo {
  async autosuggest(term: string) {
    const ownerId = 1;  // only public recipes are searchable
    const sql = `SELECT id, title AS text FROM recipe WHERE title LIKE ? AND owner_id = ? LIMIT 5`;
    const [ rows ] = await this.pool.execute<Suggestion[]>(sql, [`%${term}%`, ownerId]);
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
      FROM recipe r
      INNER JOIN user u         ON u.id = r.author_id
      INNER JOIN recipe_type rt ON rt.id = r.recipe_type_id
      INNER JOIN cuisine c      ON c.id = r.cuisine_id
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
          FROM method m
          INNER JOIN recipe_method rm ON rm.method_id = m.id
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
    const sql = `SELECT id FROM recipe WHERE author_id = ? AND owner_id = ?`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [userId, userId]);
    const ids: number[] = [];
    rows.forEach(({ id }) => ids.push(id));
    return ids;
  }

  async viewAllPublicTitles(authorId: number, ownerId: number) {  // for Next.js getStaticPaths
    const sql = `SELECT title FROM recipe WHERE author_id = ? AND owner_id = ?`;
    const [ rows ] = await this.pool.execute<Title[]>(sql, [authorId, ownerId]);
    return rows;
  }

  /*async viewAll(authorId: number, ownerId: number) {
    const sql = `
      SELECT id, recipe_type_id, cuisine_id, title, recipe_image, owner_id
      FROM recipe
      WHERE author_id = ? AND owner_id = ?
      ORDER BY title ASC
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [authorId, ownerId]);
    return rows;
  }*/

  async viewOneById(id: number, authorId: number, ownerId: number) {
    const sql = `${viewOneSQL} AND r.id = ?`;
    const [ [ row ] ] = await this.pool.execute<Recipe[]>(sql, [authorId, ownerId, id]);
    return row;
  }

  async viewOneByTitle(title: string, authorId: number, ownerId: number) {
    const sql = `${viewOneSQL} AND r.title = ?`;
    const [ [ row ] ] = await this.pool.execute<Recipe[]>(sql, [authorId, ownerId, title]);
    return row;
  }

  async create(recipe: CreatingRecipe) {  // TO DO: you need id :id now too
    const sql = `
      INSERT INTO recipe (
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
      ) VALUES (
        :recipeTypeId,
        :cuisineId,
        :authorId,
        :ownerId,
        :title,
        :description,
        :activeTime,
        :totalTime,
        :directions,
        :recipeImage,
        :equipmentImage,
        :ingredientsImage,
        :cookingImage,
        :video
      )
    `;
    const [ row ] = await this.pool.execute<ResultSetHeader>(sql, recipe);
    return row;
  }

  async update(recipe: UpdatingRecipe) {
    const sql = `
      UPDATE recipe
      SET
        recipe_type_id    = :recipeTypeId,
        cuisine_id        = :cuisineId,
        author_id         = :authorId,
        owner_id          = :ownerId,
        title             = :title,
        description       = :description,
        active_time       = :activeTime,
        total_time        = :totalTime,
        directions        = :directions,
        recipe_image      = :recipeImage,
        equipment_image   = :equipmentImage,
        ingredients_image = :ingredientsImage,
        cooking_image     = :cookingImage,
        video             = :video
      WHERE id = :id
      LIMIT 1
    `;
    await this.pool.execute<RowDataPacket[]>(sql, recipe);
  }
  
  async disownAllByAuthorId(authorId: number) {
    if (authorId == 1 || authorId == 2) return;
    const newAuthorId = 2;  // double check
    const sql = `UPDATE recipe SET author_id = ? WHERE author_id = ? AND owner_id = 1`;
    await this.pool.execute(sql, [newAuthorId, authorId]);
  }

  async disownOneByAuthorId(id: number, authorId: number) {
    const newAuthorId = 2;  // double check
    const sql = `UPDATE recipe SET author_id = ? WHERE id = ? AND author_id = ? AND owner_id = 1 LIMIT 1`;
    await this.pool.execute(sql, [newAuthorId, id, authorId]);
  }

  async deleteAllByOwnerId(ownerId: number) {
    if (ownerId == 1 || ownerId == 2) return;
    const sql = `DELETE FROM recipe WHERE owner_id = ?`;
    await this.pool.execute(sql, [ownerId]);
  }
  
  async deleteOneByOwnerId(id: number, ownerId: number) {
    const sql = `DELETE FROM recipe WHERE id = ? AND owner_id = ? LIMIT 1`;
    await this.pool.execute(sql, [id, ownerId]);
  }
}

export interface IRecipeRepo {
  autosuggest:         (term: string) =>                                     Promise<Suggestion[]>;
  search:              (searchRequest: SearchRequest) =>                     Promise<SearchResponse>;
  getPrivateIds:       (userId: number) =>                                   Promise<number[]>;  // ???
  viewAllPublicTitles: (authorId: number, ownerId: number) =>                Promise<Title[]>;
  viewOneById:         (id: number, authorId: number, ownerId: number) =>    Promise<Recipe>;
  viewOneByTitle:      (title: string, authorId: number, ownerId: number) => Promise<Recipe>;
  create:              (recipe: CreatingRecipe) =>                           Promise<ResultSetHeader>;
  update:              (recipe: UpdatingRecipe) =>                           Promise<void>;
  disownAllByAuthorId: (authorId: number) =>                                 Promise<void>;
  disownOneByAuthorId: (id: number, authorId: number) =>                     Promise<void>;
  deleteAllByOwnerId:  (ownerId: number) =>                                  Promise<void>;
  deleteOneByOwnerId:  (id: number, ownerId: number) =>                      Promise<void>;
}

export type CreatingRecipe = {
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

export type UpdatingRecipe = CreatingRecipe & {
  id: number;
  //  what about prevImage ?
};

export type Recipe = RowDataPacket & {
  id:                number;
  author:            string;
  recipe_type_name:  string;
  cuisine_name:      string;
  author_id:         number;
  recipe_type_id:    number;
  cuisine_id:        number;
  owner_id:          number;
  title:             string;
  description:       string;
  active_time:       string;  // Date on insert?
  total_time:        string;  // Date on insert?
  directions:        string;
  recipe_image:      string;
  equipment_image:   string;
  ingredients_image: string;
  cooking_image:     string;
  methods:           Method[];
  equipment:         Equipment[];
  ingredients:       Ingredient[];
  subrecipes:        Subrecipe[];
};

type Method = {
  method_name: string;
  method_id:   number;
};

type Equipment = {
  amount:            number;
  equipment_name:    string;
  equipment_type_id: number;
  equipment_id:      number;
};

type Ingredient = {
  amount:             number;
  measurement_name:   string;
  ingredient_name:    string;

  measurement_id:     number;
  ingredient_type_id: number;
  ingredient_id:      number;
};

type Subrecipe = {
  amount:           number;
  measurement_name: string;
  subrecipe_title:  string;

  measurement_id:   number;
  recipe_type_id:   number;
  cuisine_id:       number;
  subrecipe_id:     number;
};

type Suggestion = RowDataPacket & {
  id:   number;
  text: string;
};

type Title = RowDataPacket & {
  title: string;
};

const viewOneSQL = `
  SELECT
    r.id,
    u.username AS author,
    rt.name    AS recipe_type_name,
    c.name     AS cuisine_name,
    r.author_id,
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
      INNER JOIN recipe_method rm ON rm.method_id = m.id
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
      INNER JOIN recipe_ingredient ri ON ri.ingredient_id = i.id
      INNER JOIN measurement m        ON m.id = ri.measurement_id
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
      INNER JOIN recipe_subrecipe rs ON rs.subrecipe_id = r.id
      INNER JOIN measurement m       ON m.id = rs.measurement_id
      WHERE rs.recipe_id = r.id
    ) subrecipes
  FROM recipes r
  INNER JOIN user u         ON u.id = r.author_id
  INNER JOIN recipe_type rt ON rt.id = r.recipe_type_id
  INNER JOIN cuisine c      ON c.id = r.cuisine_id
  WHERE r.author_id = ? AND r.owner_id = ?
`;
