import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import type { SearchRequest, SearchResponse } from '../search/model';
import { NOBSC_USER_ID, UNKNOWN_USER_ID } from '../shared/model';
import { MySQLRepo } from '../shared/MySQL';

export class RecipeRepo extends MySQLRepo implements RecipeRepoInterface {
  async autosuggest(term: string) {
    const owner_id = NOBSC_USER_ID;  // only public recipes are searchable 
    const sql = `
      SELECT
        recipe_id,
        title AS text
      FROM recipe
      WHERE owner_id = ? AND title LIKE ?
      LIMIT 5
    `;
    const [ rows ] = await this.pool.execute<RecipeSuggestionView[]>(sql, [
      owner_id,
      `%${term}%`
    ]);
    return rows;
  }

  async search({ term, filters, sorts, current_page, results_per_page }: SearchRequest) {
    const owner_id = NOBSC_USER_ID;  // only public recipes are searchable
    let sql = `
      SELECT
        r.recipe_id,
        u.username AS author,
        rt.recipe_type_name,
        c.cuisine_name,
        r.title,
        r.description,
        (
          SELECT i.image_filename
          FROM image i
          INNER JOIN recipe_image ri ON i.image_id = ri.image_id
          WHERE ri.recipe_id = r.recipe_id AND ri.type = 1
        ) AS image_filename
      FROM recipe r
      INNER JOIN user u          ON u.user_id = r.author_id
      INNER JOIN recipe_type rt  ON rt.recipe_type_id = r.recipe_type_id
      INNER JOIN cuisine c       ON c.cuisine_id = r.cuisine_id
      WHERE r.owner_id = ?
    `;

    // order matters
    // order may not matter if we used named placeholders instead of ? placeholders

    let params: Array<number|string> = [owner_id];

    if (term) {
      sql += ` AND r.title LIKE ?`;
      params.push(`%${term}%`);
    }

    const recipe_types = filters?.recipe_types ?? [];
    const cuisines     = filters?.cuisines ?? [];
    const methods      = filters?.methods ?? [];

    //const { recipe_types, cuisines, methods } = filters!;

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

  async hasPrivate(recipe_ids: string[]) {
    const sql = `
      SELECT *
      FROM recipe
      WHERE recipe_id IN ? AND (author_id = owner_id)
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, recipe_ids);
    return rows.length > 0 ? true : false;
  }  // TO DO: thoroughly integration test this

  async viewAllOfficialTitles() {
    const author_id = NOBSC_USER_ID;
    const owner_id  = NOBSC_USER_ID;
    const sql = `SELECT title FROM recipe WHERE author_id = ? AND owner_id = ?`;
    const [ rows ] = await this.pool.execute<TitleView[]>(sql, [author_id, owner_id]);
    return rows;
  }  // for Next.js getStaticPaths

  async overviewAll({ author_id, owner_id }: OverviewAllParams) {
    let sql = `
      SELECT
        r.recipe_id,
        r.author_id,
        r.owner_id,
        r.recipe_type_id,
        r.cuisine_id,
        u.username AS author,
        r.title,
        (
          SELECT
            i.image_filename
          FROM recipe_image ri
          INNER JOIN recipe_image ri ON ri.recipe_id = r.recipe_id
          INNER JOIN image i         ON i.image_id = ri.image_id
          WHERE ri.type = 1
        ) image_filename
      FROM recipe r
      INNER JOIN user u ON recipe.author_id = user.user_id
      WHERE r.author_id = ? AND r.owner_id = ?
    `;
    const [ rows ] = await this.pool.execute<(RecipeOverview & RowDataPacket)[]>(sql, [
      author_id,
      owner_id
    ]);
    return rows;
  }  // for logged in user

  async viewOneByRecipeId(recipe_id: string) {
    const sql = `${recipeDetailViewSQL} r.recipe_id = ?`;
    const [ [ row ] ] = await this.pool.execute<RecipeView[]>(sql, recipe_id);
    return row;
  }

  async viewOneByTitle(title: string) {
    const sql = `${recipeDetailViewSQL} r.title = ?`;
    const [ [ row ] ] = await this.pool.execute<RecipeView[]>(sql, title);
    return row;
  }

  async viewOneToEdit(recipe_id: string) {
    const sql = `${existingRecipeToEditViewSQL} r.recipe_id = ?`;
    const [ [ row ] ] = await this.pool.execute<RecipeView[]>(sql, recipe_id);
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
        directions
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
        :directions
      )
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, params);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
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
        directions        = :directions
      WHERE recipe_id = :recipe_id
      LIMIT 1
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, params);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async unattributeAll(author_id: string) {
    // TO DO: move to service
    if (author_id === NOBSC_USER_ID || author_id === UNKNOWN_USER_ID) {
      return;
    }

    const owner_id        = NOBSC_USER_ID;
    const unknown_user_id = UNKNOWN_USER_ID;

    const sql = `
      UPDATE recipe
      SET author_id = :unknown_user_id
      WHERE
            author_id = :author_id
        AND owner_id  = :owner_id
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, {
      unknown_user_id,
      author_id,
      owner_id
    });
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async unattributeOne({ author_id, recipe_id }: UnattributeOneParams) {
    // TO DO: move to service
    if (author_id === NOBSC_USER_ID || author_id === UNKNOWN_USER_ID) {
      return;
    }

    const owner_id        = NOBSC_USER_ID;
    const unknown_user_id = UNKNOWN_USER_ID;

    const sql = `
      UPDATE recipe
      SET author_id = :unknown_user_id
      WHERE
            author_id = :author_id
        AND owner_id  = :owner_id
        AND recipe_id = :recipe_id
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, {
      unknown_user_id,
      author_id,
      owner_id,
      recipe_id
    });
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  // TO DO: ???
  async deleteAll(owner_id: string) {}
  
  async deleteOne({ owner_id, recipe_id }: DeleteOneParams) {
    const sql = `
      DELETE FROM recipe
      WHERE owner_id = ? AND recipe_id = ?
      LIMIT 1
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, [owner_id, recipe_id]);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }
}

export interface RecipeRepoInterface {
  autosuggest:           (term: string) =>                    Promise<RecipeSuggestionView[]>;
  search:                (searchRequest: SearchRequest) =>    Promise<SearchResponse>;
  hasPrivate:            (recipe_ids: string[]) =>            Promise<boolean>;
  viewAllOfficialTitles: () =>                                Promise<TitleView[]>;
  overviewAll:           (params: OverviewAllParams) =>       Promise<(RecipeOverview & RowDataPacket)[]>;
  viewOneByRecipeId:     (recipe_id: string) =>               Promise<RecipeView>;
  viewOneByTitle:        (title: string) =>                   Promise<RecipeView>;
  viewOneToEdit:         (recipe_id: string) =>               Promise<EditRecipeView>;
  insert:                (params: InsertParams) =>            Promise<void>;
  update:                (params: UpdateParams) =>            Promise<void>;
  unattributeAll:        (author_id: string) =>               Promise<void>;
  unattributeOne:        (params: UnattributeOneParams) =>    Promise<void>;
  deleteAll:             (owner_id: string) =>                Promise<void>;
  deleteOne:             (params: DeleteOneParams) =>         Promise<void>;
}

type RecipeSuggestionView = RowDataPacket & {
  recipe_id: string;
  text:      string;
};

type TitleView = RowDataPacket & {
  title: string;
};

type OverviewAllParams = {
  author_id: string;
  owner_id:  string;
};

export type RecipeOverview = {
  recipe_id:      string;
  author_id:      string;
  owner_id:       string;
  recipe_type_id: number;
  cuisine_id:     number;
  author:         string;
  title:          string;
  image_filename: string;
};

export type RecipeView = RowDataPacket & {
  recipe_id:            string;
  recipe_type_id:       number;
  recipe_type_name:     string;
  cuisine_id:           number;
  cuisine_name:         string;
  author_id:            string;
  author:               string;
  owner_id:             string;
  title:                string;
  description:          string;
  active_time:          string;
  total_time:           string;
  directions:           string;
  //images:               AssociatedImageView[];
  recipe_image:         AssociatedImageView;
  cooking_image:        AssociatedImageView;
  equipment_image:      AssociatedImageView;
  ingredients_image:    AssociatedImageView;
  required_methods:     RequiredMethodView[];
  required_equipment:   RequiredEquipmentView[];
  required_ingredients: RequiredIngredientView[];
  required_subrecipes:  RequiredSubrecipeView[];
};

type AssociatedImageView = {
  //type:           number;
  image_id:       string;
  image_filename: string;
  caption:        string;
};

type RequiredMethodView = {
  method_id:   number;
  method_name: string;
};

type RequiredEquipmentView = {
  amount:            number | null;
  equipment_id:      string;
  equipment_type_id: number;
  equipment_name:    string;
};

type RequiredIngredientView = {
  amount:             number | null;
  unit_id:            number | null;
  unit_name:          string | null;  // LEFT or RIGHT JOIN to get the null ???
  ingredient_id:      string;
  ingredient_type_id: number;
  ingredient_name:    string;
};

type RequiredSubrecipeView = {
  amount:          number | null;
  unit_id:         number | null;
  unit_name:       string | null;  // LEFT or RIGHT JOIN to get the null ???
  subrecipe_id:    string;
  recipe_type_id:  number;
  cuisine_id:      number;
  subrecipe_title: string;
};

type EditRecipeView = {
  recipe_id:            string;
  recipe_type_id:       number;
  cuisine_id:           number;
  title:                string;
  description:          string;
  active_time:          string;
  total_time:           string;
  directions:           string;
  recipe_image:         AssociatedImageView;
  cooking_image:        AssociatedImageView;
  equipment_image:      AssociatedImageView;
  ingredients_image:    AssociatedImageView;
  required_methods:     EditRequiredMethodView[];
  required_equipment:   EditRequiredEquipmentView[];
  required_ingredients: EditRequiredIngredientView[];
  required_subrecipes:  EditRequiredSubrecipeView[];
};

type EditRequiredMethodView = {
  method_id:   number;
};

type EditRequiredEquipmentView = {
  amount:            number | null;
  equipment_id:      string;
  equipment_type_id: number;
};

type EditRequiredIngredientView = {
  amount:             number | null;
  unit_id:            number | null;
  ingredient_id:      string;
  ingredient_type_id: number;
};

type EditRequiredSubrecipeView = {
  amount:          number | null;
  unit_id:         number | null;
  subrecipe_id:    string;
  recipe_type_id:  number;
  cuisine_id:      number;
};

export type InsertParams = {
  recipe_id:      string;
  recipe_type_id: number;
  cuisine_id:     number;
  owner_id:       string;
  title:          string;
  description:    string;
  active_time:    string;
  total_time:     string;
  directions:     string;
};

type UpdateParams = InsertParams;

type UnattributeOneParams = {
  recipe_id: string;
  author_id: string;
};

type DeleteOneParams = {
  recipe_id: string;
  owner_id:  string;
};

const recipeDetailViewSQL = `
  SELECT
    r.recipe_id,
    r.author_id,
    u.username AS author,
    (
      i.image_filename
      FROM image i
      INNER JOIN user_image ui ON i.image_id = ui.image_id
      INNER JOIN recipe r ON r.author_id = ui.user_id
      WHERE ui.current = true
    ) AS author_avatar,
    rt.recipe_type_name,
    c.cuisine_name,
    r.title,
    r.description,
    r.active_time,
    r.total_time,
    r.directions,
    (
      SELECT i.image_id, i.image_filename, i.caption
      FROM image i
      INNER JOIN recipe_image ri ON i.image_id = ri.image_id
      WHERE ri.recipe_id = r.recipe_id AND ri.type = 1
    ) AS recipe_image,
    (
      SELECT i.image_id, i.image_filename, i.caption
      FROM image i
      INNER JOIN recipe_image ri ON i.image_id = ri.image_id
      WHERE ri.recipe_id = r.recipe_id AND ri.type = 2
    ) AS equipment_image,
    (
      SELECT i.image_id, i.image_filename, i.caption
      FROM image i
      INNER JOIN recipe_image ri ON i.image_id = ri.image_id
      WHERE ri.recipe_id = r.recipe_id AND ri.type = 3
    ) AS ingredients_image,
    (
      SELECT i.image_id, i.image_filename, i.caption
      FROM image i
      INNER JOIN recipe_image ri ON i.image_id = ri.image_id
      WHERE ri.recipe_id = r.recipe_id AND ri.type = 4
    ) AS cooking_image,
    (
      SELECT JSON_ARRAYAGG(JSON_OBJECT(
        'method_name', m.method_name
      ))
      FROM methods m
      INNER JOIN recipe_method rm ON rm.method_id = m.method_id
      WHERE rm.recipe_id = r.recipe_id
    ) required_methods,
    (
      SELECT JSON_ARRAYAGG(JSON_OBJECT(
        'amount',         re.amount,
        'equipment_name', e.equipment_name
      ))
      FROM equipment e
      INNER JOIN recipe_equipment re ON re.equipment_id = e.equipment_id
      WHERE re.recipe_id = r.recipe_id
    ) required_equipment,
    (
      SELECT JSON_ARRAYAGG(JSON_OBJECT(
        'amount',              ri.amount,
        'unit_name',           u.unit_name,
        'ingredient_fullname', CONCAT_WS(
                                 ' ',
                                 i.ingredient_brand,
                                 i.ingredient_variety,
                                 i.ingredient_name,
                                 IFNULL(GROUP_CONCAT(n.alt_name SEPARATOR ' '), '')
                               )
      ))
      FROM ingredients i
      INNER JOIN recipe_ingredient ri  ON ri.ingredient_id = i.ingredient_id
      INNER JOIN unit u                ON u.unit_id = ri.unit_id
      INNER JOIN ingredient_alt_name n ON n.ingredient_id = i.ingredient_id
      WHERE ri.recipe_id = r.recipe_id
    ) required_ingredients,
    (
      SELECT JSON_ARRAYAGG(JSON_OBJECT(
        'amount',          rs.amount,
        'unit_name',       u.unit_name,
        'subrecipe_title', r.title
      ))
      FROM recipes r
      INNER JOIN recipe_subrecipe rs ON rs.subrecipe_id = r.recipe_id
      INNER JOIN unit u              ON u.unit_id = rs.unit_id
      WHERE rs.recipe_id = r.recipe_id
    ) required_subrecipes
  FROM recipe r
  INNER JOIN user u         ON u.user_id = r.author_id
  INNER JOIN recipe_type rt ON rt.recipe_type_id = r.recipe_type_id
  INNER JOIN cuisine c      ON c.cuisine_id = r.cuisine_id
  WHERE
`;

const existingRecipeToEditViewSQL = `
  SELECT
    r.recipe_id,
    r.recipe_type_id,
    r.cuisine_id,
    r.title,
    r.description,
    r.active_time,
    r.total_time,
    r.directions,
    (
      SELECT i.image_id, i.image_filename, i.caption
      FROM image i
      INNER JOIN recipe_image ri ON i.image_id = ri.image_id
      WHERE ri.recipe_id = r.recipe_id AND ri.type = 1
    ) AS recipe_image,
    (
      SELECT i.image_id, i.image_filename, i.caption
      FROM image i
      INNER JOIN recipe_image ri ON i.image_id = ri.image_id
      WHERE ri.recipe_id = r.recipe_id AND ri.type = 2
    ) AS equipment_image,
    (
      SELECT i.image_id, i.image_filename, i.caption
      FROM image i
      INNER JOIN recipe_image ri ON i.image_id = ri.image_id
      WHERE ri.recipe_id = r.recipe_id AND ri.type = 3
    ) AS ingredients_image,
    (
      SELECT i.image_id, i.image_filename, i.caption
      FROM image i
      INNER JOIN recipe_image ri ON i.image_id = ri.image_id
      WHERE ri.recipe_id = r.recipe_id AND ri.type = 4
    ) AS cooking_image,
    (
      SELECT rm.method_id
      FROM recipe_method rm
      WHERE rm.recipe_id = r.recipe_id
    ) methods,
    (
      SELECT JSON_ARRAYAGG(JSON_OBJECT(
        'amount',            re.amount,
        'equipment_type_id', e.equipment_type_id,
        'equipment_id',      re.equipment_id
      ))
      FROM recipe_equipment re
      WHERE re.recipe_id = r.recipe_id
    ) equipment,
    (
      SELECT JSON_ARRAYAGG(JSON_OBJECT(
        'amount',             ri.amount,
        'unit_id',            ri.unit_id,
        'ingredient_type_id', i.ingredient_type_id,
        'ingredient_id',      ri.ingredient_id
      ))
      FROM ingredients recipe_ingredient ri
      WHERE ri.recipe_id = r.recipe_id
    ) ingredients,
    (
      SELECT JSON_ARRAYAGG(JSON_OBJECT(
        'amount',          rs.amount,
        'unit_id',         rs.unit_id,
        'recipe_type_id',  r.recipe_type_id,
        'cuisine_id',      r.cuisine_id,
        'subrecipe_id',    rs.subrecipe_id
      ))
      FROM recipes recipe_subrecipe rs
      WHERE rs.recipe_id = r.recipe_id
    ) subrecipes
  FROM recipe r
  INNER JOIN user u         ON u.user_id = r.author_id
  INNER JOIN recipe_type rt ON rt.recipe_type_id = r.recipe_type_id
  INNER JOIN cuisine c      ON c.cuisine_id = r.cuisine_id
  WHERE
`;
