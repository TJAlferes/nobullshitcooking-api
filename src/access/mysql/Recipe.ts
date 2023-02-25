import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export class Recipe implements IRecipe {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool =          pool;
    this.auto =          this.auto.bind(this);
    this.search =        this.search.bind(this);
    this.getPrivateIds = this.getPrivateIds.bind(this);
    this.viewAll =       this.viewAll.bind(this);
    this.viewOne =       this.viewOne.bind(this);
    this.create =        this.create.bind(this);
    this.edit =          this.edit.bind(this);
    this.update =        this.update.bind(this);
    this.disownAll =     this.disownAll.bind(this);
    this.disownOne =     this.disownOne.bind(this);
    this.deleteAll =     this.deleteAll.bind(this);
    this.deleteOne =     this.deleteOne.bind(this);
  }

  async auto(term: string) {
    return [];
  }

  async search({ term, filters, sorts, currentPage, resultsPerPage }: SearchRequest) {
    const ownerId = 1;  // only public recipes are searchable
    const neededFilters = {recipeTypes: filters.recipeTypes, methods: filters.methods, cuisines: filters.cuisines};  // subset of filters
    let sql = `
      SELECT
        r.id,
        u.username AS author,
        rt.name    AS recipe_type_name,
        c.code     AS cuisine_code,
        c.name     AS cuisine_name,
        r.title,
        r.description,
        r.directions,
        r.recipe_image,
        (
          SELECT JSON_ARRAYAGG(m.name)
          FROM methods m
          INNER JOIN recipe_methods rm ON rm.method_id = m.id
          WHERE rm.recipe_id = r.id
        ) method_names,
        (
          SELECT JSON_ARRAYAGG(e.name)
          FROM equipment e
          INNER JOIN recipe_equipment re ON re.equipment_id = e.id
          WHERE re.recipe_id = r.id
        ) equipment_names,
        (
          SELECT JSON_ARRAYAGG(i.name)
          FROM ingredients i
          INNER JOIN recipe_ingredients ri ON ri.ingredient_id = i.id
          WHERE ri.recipe_id = r.id
        ) ingredient_names,
        (
          SELECT JSON_ARRAYAGG(r.title)
          FROM recipes r
          INNER JOIN recipe_subrecipes rs ON rs.subrecipe_id = r.id
          WHERE rs.recipe_id = r.id
        ) subrecipe_titles
      FROM recipes r
      INNER JOIN users u         ON u.id = r.author_id
      INNER JOIN recipe_types rt ON rt.id = r.recipe_type_id
      INNER JOIN cuisines c      ON c.id = r.cuisine_id
      WHERE r.owner_id = ?
    `;

    // move most of this into a service

    // order matters
    if (neededFilters.recipeTypes.length > 0) {
      const placeholders = '?,'.repeat(neededFilters.recipeTypes.length).slice(0, -1);
      sql += ` AND recipe_type_name IN (${placeholders})`;
    }
    if (neededFilters.methods.length > 0) {
      const placeholders = '?,'.repeat(neededFilters.methods.length).slice(0, -1);
      sql += ` AND JSON_OVERLAPS(method_names, ${placeholders})`;
    }
    if (neededFilters.cuisines.length > 0) {
      const placeholders = '?,'.repeat(neededFilters.cuisines.length).slice(0, -1);
      sql += ` AND cuisine_code IN (${placeholders})`;
    }

    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [ownerId, neededFilters.recipeTypes, neededFilters.methods, neededFilters.cuisines]);  // order matters

    return rows;
  }

  async getPrivateIds(userId: number) {
    const sql = `SELECT id FROM recipes WHERE author_id = ? AND owner_id = ?`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [userId, userId]);
    const ids: number[] = [];
    rows.forEach(({ id }) => ids.push(id));
    return ids;
  }

  async viewAll(authorId: number, ownerId: number) {
    const sql = `
      SELECT id, recipe_type_id, cuisine_id, title, recipe_image, owner_id
      FROM recipes
      WHERE author_id = ? AND owner_id = ?
      ORDER BY title ASC
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [authorId, ownerId]);
    return rows;
  }

  async viewOne(id: number, authorId: number, ownerId: number) {
    const sql = `
      SELECT
        r.id,
        u.username AS author,
        rt.name    AS recipe_type_name,
        c.name     AS cuisine_name,
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
          SELECT JSON_ARRAYAGG(JSON_OBJECT('method_name', m.name))
          FROM methods m
          INNER JOIN recipe_methods rm ON rm.method_id = m.id
          WHERE rm.recipe_id = r.id
        ) methods,
        (
          SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'amount',         re.amount,
            'equipment_name', e.name
          ))
          FROM equipment e
          INNER JOIN recipe_equipment re ON re.equipment_id = e.id
          WHERE re.recipe_id = r.id
        ) equipment,
        (
          SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'amount',           ri.amount,
            'measurement_name', m.name,
            'ingredient_name',  i.name
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
            'subrecipe_title',  r.title
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
      WHERE r.id = ? AND r.author_id = ? AND r.owner_id = ?
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id, authorId, ownerId]);
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

  async edit(id: number, authorId: number, ownerId: number) {
    const sql = `
      SELECT
        r.id,
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
          SELECT JSON_ARRAYAGG(JSON_OBJECT('method_id', rm.method_id))
          FROM recipe_methods rm
          WHERE rm.recipe_id = r.id
        ) methods,
        (
          SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'amount',            re.amount,
            'equipment_type_id', e.equipment_type_id,
            'equipment_id',      re.equipment_id
          ))
          FROM equipment e
          INNER JOIN recipe_equipment re ON re.equipment_id = e.equipment_id
          WHERE re.recipe_id = r.id
        ) equipment,
        (
          SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'amount',             ri.amount,
            'measurement_id',     ri.measurement_id,
            'ingredient_type_id', i.ingredient_type_id,
            'ingredient_id',      ri.ingredient_id
          ))
          FROM ingredients i
          INNER JOIN recipe_ingredients ri ON ri.ingredient_id = i.id
          WHERE ri.recipe_id = r.id
        ) ingredients,
        (
          SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'amount',         rs.amount,
            'measurement_id', rs.measurement_id,
            'recipe_type_id', r.recipe_type_id,
            'cuisine_id',     r.cuisine_id,
            'subrecipe_id',   rs.subrecipe_id
          ))
          FROM recipes r
          INNER JOIN recipe_subrecipes rs ON rs.subrecipe_id = r.id
          WHERE rs.recipe_id = r.recipe_id
        ) subrecipes
      FROM recipes r
      INNER JOIN users u         ON u.id = r.author_id
      INNER JOIN recipe_types rt ON rt.id = r.recipe_type_id
      INNER JOIN cuisines c      ON c.id = r.cuisine_id
      WHERE r.id = ? AND r.author_id = ? AND r.owner_id = ?;
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id, authorId, ownerId]);
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
  
  async disownAll(authorId: number) {
    const newAuthorId = 2;
    const sql = `UPDATE recipes SET author_id = ? WHERE author_id = ? AND owner_id = 1`;
    await this.pool.execute<RowDataPacket[]>(sql, [newAuthorId, authorId]);
  }

  async disownOne(id: number, authorId: number) {
    const newAuthorId = 2;
    const sql = `UPDATE recipes SET author_id = ? WHERE id = ? AND author_id = ? AND owner_id = 1 LIMIT 1`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [newAuthorId, id, authorId]);
    return row;
  }

  async deleteAll(authorId: number, ownerId: number) {
    const sql = `DELETE FROM recipes WHERE author_id = ? AND owner_id = ?`;
    await this.pool.execute<RowDataPacket[]>(sql, [authorId, ownerId]);
  }
  
  async deleteOne(id: number, authorId: number, ownerId: number) {
    const sql = `DELETE FROM recipes WHERE recipe_id = ? AND author_id = ? AND owner_id = ? LIMIT 1`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id, authorId, ownerId]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

type DataWithHeader = Promise<RowDataPacket[] & ResultSetHeader>;

export interface IRecipe {
  pool:                                                     Pool;
  auto(term: string):                                       Data;
  search(searchRequest: SearchRequest):                     Data;
  getPrivateIds(userId: number):                            Promise<number[]>;
  viewAll(authorId: number, ownerId: number):               Data;
  viewOne(id: number, authorId: number, ownerId: number):   Data;
  create(recipe: ICreatingRecipe):                          DataWithHeader;
  edit(id: number, authorId: number, ownerId: number):      Data;
  update(recipe: IUpdatingRecipe):                          Data;
  disownAll(authorId: number):                              void;
  disownOne(id: number, authorId: number):                  Data;
  deleteAll(authorId: number, ownerId: number):             void;
  deleteOne(id: number, authorId: number, ownerId: number): Data;
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

export type SearchRequest = {
  term:           string;    // setTerm
  filters:        {
    equipmentTypes:    string[],
    ingredientTypes:   string[],
    recipeTypes:       string[],
    methods:           string[],
    cuisines:          string[],
    productCategories: string[],
    productTypes:      string[]
  };                       // setFilters (add, remove, clear)
  sorts:          {};      // setSorts   (add, remove, clear)
  currentPage:    number;  // setCurrentPage     // OFFSET in MySQL
  resultsPerPage: number;  // setResultsPerPage  // LIMIT in MySQL
};

/*interface ISavingRecipe {
  id:               number;
  author:           string;
  recipe_type_name: string;
  cuisine_name:     string;
  title:            string;
  description:      string;
  directions:       string;
  recipe_image:     string;
  method_names:     string[];
  equipment_names:  string[];
  ingredient_names: string[];
  subrecipe_titles: string[];
  //video: string; ?
}*/