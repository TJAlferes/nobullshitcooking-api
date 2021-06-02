import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export class Recipe implements IRecipe {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.getForElasticSearch = this.getForElasticSearch.bind(this);
    this.getForElasticSearchById = this.getForElasticSearchById.bind(this);
    this.getPrivateIds = this.getPrivateIds.bind(this);
    this.view = this.view.bind(this);
    this.viewById = this.viewById.bind(this);
    this.create = this.create.bind(this);
    this.edit = this.edit.bind(this);
    this.update = this.update.bind(this);
    this.disown = this.disown.bind(this);
    this.disownById = this.disownById.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteById = this.deleteById.bind(this);
  }

  async getForElasticSearch() {
    const ownerId = 1;  // only public recipes goes into ElasticSearch
    const sql = `
      SELECT
        CAST(r.id AS CHAR) AS id,
        u.username AS author,
        rt.name AS recipe_type_name,
        c.name AS cuisine_name,
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
      INNER JOIN users u ON u.id = r.author_id
      INNER JOIN recipe_types rt ON rt.id = r.recipe_type_id
      INNER JOIN cuisines c ON c.id = r.cuisine_id
      WHERE r.owner_id = ?
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [ownerId]);
    const final = [];
    for (let row of rows) {
      final.push({index: {_index: 'recipes', _id: row.id}}, row);
    }
    return final;
  }

  async getForElasticSearchById(id: number) {
    const ownerId = 1;  // only public recipes goes into ElasticSearch
    const sql = `
      SELECT
        CAST(r.id AS CHAR) AS id,
        u.username AS author,
        rt.name AS recipe_type_name,
        c.name AS cuisine_name,
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
      INNER JOIN users u ON u.id = r.author_id
      INNER JOIN recipe_types rt ON rt.id = r.recipe_type_id
      INNER JOIN cuisines c ON c.id = r.cuisine_id
      WHERE r.id = ? AND r.owner_id = ?
    `;
    const [ [ row ] ] =
      await this.pool.execute<RowDataPacket[]>(sql, [id, ownerId]);
    return row as ISavingRecipe;
  }

  async getPrivateIds(userId: number) {
    const sql = `SELECT id FROM recipes WHERE author_id = ? AND owner_id = ?`;
    const [ rows ] =
      await this.pool.execute<RowDataPacket[]>(sql, [userId, userId]);
    const ids: number[] = [];
    rows.forEach(({ id }) => ids.push(id));
    return ids;
  }

  async view(authorId: number, ownerId: number) {
    const sql = `
      SELECT id, recipe_type_id, cuisine_id, title, recipe_image, owner_id
      FROM recipes
      WHERE author_id = ? AND owner_id = ?
      ORDER BY title ASC
    `;
    const [ rows ] =
      await this.pool.execute<RowDataPacket[]>(sql, [authorId, ownerId]);
    return rows;
  }

  async viewById(id: number, authorId: number, ownerId: number) {
    const sql = `
      SELECT
        r.id,
        u.username AS author,
        rt.name AS recipe_type_name,
        c.name AS cuisine_name,
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
        ) required_methods,
        (
          SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'amount', re.amount,
            'equipment_name', e.name
          ))
          FROM equipment e
          INNER JOIN recipe_equipment re ON re.equipment_id = e.id
          WHERE re.recipe_id = r.id
        ) required_equipment,
        (
          SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'amount', ri.amount,
            'measurement_name', m.name,
            'ingredient_name', i.name
          ))
          FROM ingredients i
          INNER JOIN recipe_ingredients ri
          ON ri.ingredient_id = i.id
          INNER JOIN measurements m ON m.id = ri.measurement_id
          WHERE ri.recipe_id = r.id
        ) required_ingredients,
        (
          SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'amount', rs.amount,
            'measurement_name', m.name,
            'subrecipe_title', r.title
          ))
          FROM recipes r
          INNER JOIN recipe_subrecipes rs ON rs.subrecipe_id = r.id
          INNER JOIN measurements m ON m.id = rs.measurement_id
          WHERE rs.recipe_id = r.id
        ) required_subrecipes
      FROM recipes r
      INNER JOIN users u ON u.id = r.author_id
      INNER JOIN recipe_types rt ON rt.id = r.recipe_type_id
      INNER JOIN cuisines c ON c.id = r.cuisine_id
      WHERE r.id = ? AND r.author_id = ? AND r.owner_id = ?
    `;
    const [ row ] =
      await this.pool.execute<RowDataPacket[]>(sql, [id, authorId, ownerId]);
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
    const [ row ] =
      await this.pool.execute<RowDataPacket[] & ResultSetHeader>(sql, [
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
    ) required_methods,
    (
      SELECT JSON_ARRAYAGG(JSON_OBJECT(
        'amount', re.amount,
        'equipment_type_id', e.equipment_type_id,
        'equipment_id', re.equipment_id
      ))
      FROM equipment e
      INNER JOIN recipe_equipment re ON re.equipment_id = e.equipment_id
      WHERE re.recipe_id = r.id
    ) required_equipment,
    (
      SELECT JSON_ARRAYAGG(JSON_OBJECT(
        'amount', ri.amount,
        'measurement_id', ri.measurement_id,
        'ingredient_type_id', i.ingredient_type_id,
        'ingredient_id', ri.ingredient_id
      ))
      FROM ingredients i
      INNER JOIN recipe_ingredients ri ON ri.ingredient_id = i.id
      WHERE ri.recipe_id = r.id
    ) required_ingredients,
    (
      SELECT JSON_ARRAYAGG(JSON_OBJECT(
        'amount', rs.amount,
        'measurement_id', rs.measurement_id,
        'recipe_type_id', r.recipe_type_id,
        'cuisine_id', r.cuisine_id,
        'subrecipe_id', rs.subrecipe_id
      ))
      FROM recipes r
      INNER JOIN recipe_subrecipes rs ON rs.subrecipe_id = r.id
      WHERE rs.recipe_id = r.recipe_id
    ) required_subrecipes
    FROM recipes r
    INNER JOIN users u ON u.id = r.author_id
    INNER JOIN recipe_types rt ON rt.id = r.recipe_type_id
    INNER JOIN cuisines c ON c.id = r.cuisine_id
    WHERE r.id = ? AND r.author_id = ? AND r.owner_id = ?;
    `;
    const [ row ] =
      await this.pool.execute<RowDataPacket[]>(sql, [id, authorId, ownerId]);
    return row;
  }

  async update(recipe: IUpdatingRecipe, authorId: number, ownerId: number) {
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
  
  async disown(authorId: number) {
    const newAuthorId = 2;
    const sql =
      `UPDATE recipes SET author_id = ? WHERE author_id = ? AND owner_id = 1`;
    await this.pool.execute<RowDataPacket[]>(sql, [newAuthorId, authorId]);
  }

  async disownById(id: number, authorId: number) {
    const newAuthorId = 2;
    const sql = `
      UPDATE recipes
      SET author_id = ?
      WHERE id = ? AND author_id = ? AND owner_id = 1
      LIMIT 1
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [newAuthorId, id, authorId]);
    return row;
  }

  async delete(authorId: number, ownerId: number) {
    const sql = `DELETE FROM recipes WHERE author_id = ? AND owner_id = ?`;
    await this.pool.execute<RowDataPacket[]>(sql, [authorId, ownerId]);
  }
  
  async deleteById(id: number, authorId: number, ownerId: number) {
    const sql = `
      DELETE
      FROM recipes
      WHERE recipe_id = ? AND author_id = ? AND owner_id = ?
      LIMIT 1
    `;
    const [ row ] =
      await this.pool.execute<RowDataPacket[]>(sql, [id, authorId, ownerId]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

type DataWithHeader = Promise<RowDataPacket[] & ResultSetHeader>;

export interface IRecipe {
  pool: Pool;
  getForElasticSearch(): any;
  getForElasticSearchById(id: number): Promise<ISavingRecipe>;
  getPrivateIds(userId: number): Promise<number[]>;
  view(authorId: number, ownerId: number): Data;
  viewById(id: number, authorId: number, ownerId: number): Data;
  create(recipe: ICreatingRecipe): DataWithHeader;
  edit(id: number, authorId: number, ownerId: number): Data;
  update(recipe: IUpdatingRecipe, authorId: number, ownerId: number): Data;
  disown(authorId: number): void;
  disownById(id: number, authorId: number): Data;
  delete(authorId: number, ownerId: number): void;
  deleteById(id: number, authorId: number, ownerId: number): Data;
}

export interface ICreatingRecipe {
  recipeTypeId: number;
  cuisineId: number;
  authorId: number;
  ownerId: number;
  title: string;
  description: string;
  activeTime: string;
  totalTime: string;
  directions: string;
  recipeImage: string;
  equipmentImage: string;
  ingredientsImage: string;
  cookingImage: string;
  video: string;
}

export interface IUpdatingRecipe extends ICreatingRecipe {
  id: number;
  //  what about prevImage ?
}

interface ISavingRecipe {
  id: string;
  author: string;
  recipe_type_name: string;
  cuisine_name: string;
  title: string;
  description: string;
  directions: string;
  recipe_image: string;
  method_names: string[];
  equipment_names: string[];
  ingredient_names: string[];
  subrecipe_titles: string[];
  //video: string; ?
}