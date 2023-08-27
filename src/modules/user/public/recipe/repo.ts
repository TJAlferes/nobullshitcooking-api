import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import { MySQLRepo }       from '../../../shared/MySQL';
import { UNKNOWN_USER_ID } from '../../../shared/model';

export class PublicRecipeRepo extends MySQLRepo implements PublicRecipeRepoInterface {
  async viewAllTitles() {
    const sql = `SELECT title FROM public_recipe`;
    const [ rows ] = await this.pool.execute<TitleView[]>(sql);
    return rows;
  }  // for Next.js getStaticPaths

  async viewOneByRecipeId(params: ViewOneByRecipeIdParams) {
    const sql = `${viewOneSQL} AND r.recipe_id = ?`;
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
      INSERT INTO public_recipe (
        recipe_id,
        recipe_type_id,
        cuisine_id,
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
      UPDATE public_recipe
      SET
        recipe_type_id    = :recipe_type_id,
        cuisine_id        = :cuisine_id,
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

  async disownAll(owner_id: string) {
    const sql = `
      UPDATE public_recipe
      SET owner_id = :UNKNOWN_USER_ID
      WHERE owner_id = :owner_id
    `;
    await this.pool.execute(sql, {UNKNOWN_USER_ID, owner_id});
  }  // used when user account is deleted

  async disownOne(params: DisownOneParams) {
    const sql = `
      UPDATE public_recipe
      SET owner_id = :UNKNOWN_USER_ID
      WHERE owner_id = :owner_id AND recipe_id = :recipe_id
    `;
    await this.pool.execute(sql, {UNKNOWN_USER_ID, ...params});
  }
}

export interface PublicRecipeRepoInterface {
  viewAllTitles:     () =>                                Promise<TitleView[]>;
  viewOneByRecipeId: (params: ViewOneByRecipeIdParams) => Promise<RecipeView>;
  viewOneByTitle:    (params: ViewOneByTitleParams) =>    Promise<RecipeView>;
  insert:            (params: InsertParams) =>            Promise<ResultSetHeader>;
  update:            (params: InsertParams) =>            Promise<void>;
  disownAll:         (owner_id: string) =>                Promise<void>;
  disownOne:         (params: DisownOneParams) =>         Promise<void>;
}

export type InsertParams = {
  recipe_id:         string;
  recipe_type_id:    number;
  cuisine_id:        number;
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

type TitleView = RowDataPacket & {
  title: string;
};

export type RecipeView = RowDataPacket & {
  recipe_id:            string;
  recipe_type_id:       number;
  recipe_type_name:     string;
  cuisine_id:           number;
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

type ViewOneByRecipeIdParams = {
  recipe_id: string;
  owner_id:  string;
};

type ViewOneByTitleParams = {
  title:    string;
  owner_id: string;
};

type DisownOneParams = {
  recipe_id: string;
  owner_id:  string;
};

const viewOneSQL = `
  SELECT
    r.recipe_id,
    u.username AS author,
    rt.recipe_type_name,
    c.cuisine_name,
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
      INNER JOIN unit u               ON u.unit_id = ri.unit_id
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
      INNER JOIN unit u              ON u.unit_id = rs.unit_id
      WHERE rs.recipe_id = r.recipe_id
    ) subrecipes
  FROM public_recipe r
  INNER JOIN user u         ON u.user_id = r.owner_id
  INNER JOIN recipe_type rt ON rt.recipe_type_id = r.recipe_type_id
  INNER JOIN cuisine c      ON c.cuisine_id = r.cuisine_id
  WHERE r.owner_id = ?
`;
