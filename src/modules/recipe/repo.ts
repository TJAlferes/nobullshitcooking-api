import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import type { SearchRequest, SearchResponse } from '../search/model';
import { MySQLRepo } from '../shared/MySQL';

export class RecipeRepo extends MySQLRepo implements IRecipeRepo {
  async autosuggest(term: string) {
    const owner_id = 1;  // only public recipes are searchable  // const owner_id = nobsc_user_id

    const sql = `
      SELECT
        recipe_id,
        title AS text
      FROM recipe
      WHERE title LIKE ? AND owner_id = ?
      LIMIT 5
    `;

    const [ rows ] = await this.pool.execute<Suggestion[]>(sql, [
      `%${term}%`,
      owner_id
    ]);

    return rows;
  }

  async search({ term, filters, sorts, current_page, results_per_page }: SearchRequest) {
    const owner_id = 1;  // only public recipes are searchable  // const owner_id = nobsc_user_id
    let sql = `
      SELECT
        r.recipe_id,
        u.username AS author,
        rt.recipe_type_name,
        c.cuisine_name,
        r.title,
        r.description,
        i.image_url
      FROM recipe r
      INNER JOIN user u         ON u.user_id = r.author_id
      INNER JOIN recipe_type rt ON rt.recipe_type_id = r.recipe_type_id
      INNER JOIN cuisine c      ON c.cuisine_id = r.cuisine_id
      INNER JOIN image i        ON i.image_id = r.image_id
      WHERE r.owner_id = ?
    `;

    // order matters

    let params: Array<number|string> = [owner_id];

    if (term) {
      sql += ` AND r.title LIKE ?`;
      params.push(`%${term}%`);
    }

    const recipe_types = filters?.recipe_types ?? [];
    const cuisines     = filters?.cuisines ?? [];
    const methods      = filters?.methods ?? [];

    if (recipe_types.length > 0) {
      const placeholders = '?,'.repeat(recipe_types.length).slice(0, -1);
      sql += ` AND rt.recipe_type_name IN (${placeholders})`;
      params.push(...recipe_types);
    }

    if (cuisines.length > 0) {
      const placeholders = '?,'.repeat(cuisines.length).slice(0, -1);
      sql += ` AND c.code IN (${placeholders})`;  
      params.push(...cuisines);
    }

    if (methods.length > 0) {
      const placeholders = '?,'.repeat(methods.length).slice(0, -1);

      // Probably not optimal, but best solution I know for now.
      // -- tjalferes, March 19th 2023
      sql += ` AND JSON_OVERLAPS(
        JSON_ARRAY(${placeholders}),
        (
          SELECT JSON_ARRAYAGG(m.method_name)
          FROM method m
          INNER JOIN recipe_method rm ON rm.method_id = m.method_id
          WHERE rm.recipe_id = r.recipe_id
        )
      )`;

      params.push(...methods);
    }

    //if (needed_sorts)

    const [ [ { count } ] ] = await this.pool.execute<RowDataPacket[]>(
      `SELECT COUNT(*) AS count FROM (${sql}) results`,
      params
    );
    const total_results = Number(count);
    
    const limit  = results_per_page ? Number(results_per_page)           : 20;
    const offset = current_page     ? (Number(current_page) - 1) * limit : 0;

    sql += ` LIMIT ? OFFSET ?`;

    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [
      ...params,
      `${limit}`,
      `${offset}`
    ]);  // order matters

    const total_pages = total_results <= limit ? 1 : Math.ceil(total_results / limit);

    return {
      results: rows,
      total_results,
      total_pages
    };
  }

  async getPrivateIds(user_id: string) {
    const sql = `SELECT recipe_id FROM recipe WHERE author_id = ? AND owner_id = ?`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [user_id, user_id]);
    const ids: number[] = [];
    rows.forEach(({ id }) => ids.push(id));
    return ids;
  }  // is this needed?

  async viewAllPublicTitles(params: ViewAllPublicTitlesParams) {  // for Next.js getStaticPaths
    const sql = `SELECT title FROM recipe WHERE author_id = ? AND owner_id = ?`;
    const [ rows ] = await this.pool.execute<Title[]>(sql, params);
    return rows;
  }

  async viewOneById(params: ViewOneByIdParams) {
    const sql = `${viewOneSQL} AND r.id = ?`;
    const [ [ row ] ] = await this.pool.execute<RecipeView[]>(sql, params);
    return row;
  }

  async viewOneByTitle(params: ViewOneByTitleParams) {
    const sql = `${viewOneSQL} AND r.title = ?`;
    const [ [ row ] ] = await this.pool.execute<RecipeView[]>(sql, params);
    return row;
  }

  async insert(params: InsertParams) {
    const sql = `
      INSERT INTO recipe (
        recipe_id,
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
        :recipe_id,
        :recipe_type_id,
        :cuisine_id,
        :author_id,
        :owner_id,
        :title,
        :description,
        :active_time,
        :total_time,
        :directions,
        :recipe_image,
        :equipment_image,
        :ingredients_image,
        :cooking_image,
        :video
      )
    `;
    const [ row ] = await this.pool.execute<ResultSetHeader>(sql, params);
    return row;
  }

  async update(params: InsertParams) {
    const sql = `
      UPDATE recipe
      SET
        recipe_type_id    = :recipe_type_id,
        cuisine_id        = :cuisine_id,
        author_id         = :author_id,
        owner_id          = :owner_id,
        title             = :title,
        description       = :description,
        active_time       = :active_time,
        total_time        = :total_time,
        directions        = :directions,
        recipe_image      = :recipe_image,
        equipment_image   = :equipment_image,
        ingredients_image = :ingredients_image,
        cooking_image     = :cooking_image,
        video             = :video
      WHERE recipe_id = :recipe_id
      LIMIT 1
    `;
    await this.pool.execute<RowDataPacket[]>(sql, params);
  }
  
  // TO DO: change this name. you're not actually disowning, you're unauthoring
  async disownAllByAuthorId(author_id: string, nobsc_author_id: string) {
    //if (author_id === nobsc_author_id || author_id === nobsc_unknown_id) return;  // TO DO: move to service
    //const new_author_id = 2;  // double check
    const sql = `
      UPDATE recipe
      SET author_id = :nobsc_author_id
      WHERE author_id = :author_id AND owner_id = 1
    `;
    await this.pool.execute(sql, params);
  }

  // TO DO: change this name. you're not actually disowning, you're unauthoring
  async disownOneByAuthorId(recipe_id: string, author_id: string, nobsc_author_id: string) {
    //const newAuthorId = 2;  // double check
    const sql = `
      UPDATE recipe
      SET author_id = :nobsc_author_id
      WHERE recipe_id = :recipe_id AND author_id = :author_id AND owner_id = 1
    `;
    await this.pool.execute(sql, params);
  }

  async deleteAllByOwnerId(owner_id: string) {
    //if (owner_id === nobsc_author_id || owner_id === nobsc_unknown_id) return;  // TO DO: move to service
    const sql = `DELETE FROM recipe WHERE owner_id = ?`;
    await this.pool.execute(sql, [owner_id]);
  }
  
  async deleteOneByOwnerId(params: DeleteOneByOwnerIdParams) {
    const sql = `
      DELETE FROM recipe
      WHERE recipe_id = :recipe_id AND owner_id = :owner_id
      LIMIT 1
    `;
    await this.pool.execute(sql, params);
  }
}

export interface IRecipeRepo {
  autosuggest:         (term: string) =>                      Promise<Suggestion[]>;
  search:              (searchRequest: SearchRequest) =>      Promise<SearchResponse>;
  getPrivateIds:       (user_id: string) =>                   Promise<number[]>;  // ???
  viewAllPublicTitles: (params: ViewAllPublicTitlesParams) => Promise<Title[]>;
  viewOneById:         (params: ViewOneByIdParams) =>         Promise<RecipeView>;
  viewOneByTitle:      (params: ViewOneByTitleParams) =>      Promise<RecipeView>;
  insert:              (params: InsertParams) =>              Promise<ResultSetHeader>;
  update:              (params: InsertParams) =>              Promise<void>;
  disownAllByAuthorId: (author_id: string) =>                 Promise<void>;
  disownOneByAuthorId: (params: DisownOneByAuthorIdParams) => Promise<void>;
  deleteAllByOwnerId:  (owner_id: string) =>                  Promise<void>;
  deleteOneByOwnerId:  (params: DeleteOneByOwnerIdParams) =>  Promise<void>;
}

export type InsertParams = {
  recipe_id:         string;
  recipe_type_id:    number;
  cuisine_id:        number;
  author_id:         string;
  owner_id:          string;
  title:             string;
  description:       string;
  active_time:       string;
  total_time:        string;
  directions:        string;
  image_url:         string;
  //recipe_image:      string;
  //equipment_image:   string;
  //ingredients_image: string;
  //cooking_image:     string;
  //  what about prev_image ?
  video:             string;
};

export type RecipeView = RowDataPacket & {
  recipe_id:            string;
  recipe_type_id:       number;
  recipe_type_name:     string;
  cuisine_id:           number;
  author_id:            string;
  owner_id:             string;
  title:                string;
  description:          string;
  active_time:          string;  // Date on insert?
  total_time:           string;  // Date on insert?
  directions:           string;
  image_url:            string
  //recipe_image:         string;
  //equipment_image:      string;
  //ingredients_image:    string;
  //cooking_image:        string;
  //  what about prev_image ?
  video:                string;
  required_methods:     RequiredMethodView[];
  required_equipment:   RequiredEquipmentView[];
  required_ingredients: RequiredIngredientView[];
  required_subrecipes:  RequiredSubrecipeView[];
};

type RequiredMethodView = {
  method_id:   number;
  method_name: string;
};

type RequiredEquipmentView = {
  amount:            number;
  equipment_id:      string;
  equipment_type_id: number;
  equipment_name:    string;
};

type RequiredIngredientView = {
  amount:             number;
  unit_id:            number;
  unit_name:          string;
  ingredient_id:      string;
  ingredient_type_id: number;
  ingredient_name:    string;
};

type RequiredSubrecipeView = {
  amount:          number;
  unit_id:         number;
  unit_name:       string;
  subrecipe_id:    string;
  recipe_type_id:  number;
  cuisine_id:      number;
  subrecipe_title: string;
};

type Suggestion = RowDataPacket & {
  recipe_id: string;
  text:      string;
};

type Title = RowDataPacket & {
  title: string;
};

type ViewAllPublicTitlesParams = {
  author_id: string;
  owner_id:  string;
};

type ViewOneByIdParams = {
  recipe_id: string;
  author_id: string;
  owner_id:  string;
};

type ViewOneByTitleParams = {
  title:     string;
  author_id: string;
  owner_id:  string;
};

type DisownOneByAuthorIdParams = {
  recipe_id: string;
  author_id: string;
};

type DeleteOneByOwnerIdParams = {
  recipe_id: string;
  owner_id:  string;
};

const viewOneSQL = `
  SELECT
    r.recipe_id,
    u.username AS author,
    rt.recipe_type_name,
    c.cuisine_name,
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
        'method_name', m.method_name,
        'method_id',   rm.method_id
      ))
      FROM methods m
      INNER JOIN recipe_method rm ON rm.method_id = m.method_id
      WHERE rm.recipe_id = r.recipe_id
    ) methods,
    (
      SELECT JSON_ARRAYAGG(JSON_OBJECT(
        'amount',            re.amount,
        'equipment_name',    e.equipment_name,
        'equipment_type_id', e.equipment_type_id,
        'equipment_id',      re.equipment_id
      ))
      FROM equipment e
      INNER JOIN recipe_equipment re ON re.equipment_id = e.equipment_id
      WHERE re.recipe_id = r.recipe_id
    ) equipment,
    (
      SELECT JSON_ARRAYAGG(JSON_OBJECT(
        'amount',             ri.amount,
        'unit_name',          u.unit_name,
        'ingredient_name',    i.ingredient_name,
        'unit_id',            ri.unit_id,
        'ingredient_type_id', i.ingredient_type_id,
        'ingredient_id',      ri.ingredient_id
      ))
      FROM ingredients i
      INNER JOIN recipe_ingredient ri ON ri.ingredient_id = i.ingredient_id
      INNER JOIN unit u ON u.unit_id = ri.unit_id
      WHERE ri.recipe_id = r.recipe_id
    ) ingredients,
    (
      SELECT JSON_ARRAYAGG(JSON_OBJECT(
        'amount',          rs.amount,
        'unit_name',       u.unit_name,
        'subrecipe_title', r.title,
        'unit_id',         rs.unit_id,
        'recipe_type_id',  r.recipe_type_id,
        'cuisine_id',      r.cuisine_id,
        'subrecipe_id',    rs.subrecipe_id
      ))
      FROM recipes r
      INNER JOIN recipe_subrecipe rs ON rs.subrecipe_id = r.recipe_id
      INNER JOIN unit u       ON u.unit_id = rs.unit_id
      WHERE rs.recipe_id = r.recipe_id
    ) subrecipes
  FROM recipes r
  INNER JOIN user u         ON u.user_id = r.author_id
  INNER JOIN recipe_type rt ON rt.recipe_type_id = r.recipe_type_id
  INNER JOIN cuisine c      ON c.cuisine_id = r.cuisine_id
  WHERE r.author_id = ? AND r.owner_id = ?
`;
