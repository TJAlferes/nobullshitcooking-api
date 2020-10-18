import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class Recipe implements IRecipe {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.getAllForElasticSearch = this.getAllForElasticSearch.bind(this);
    this.getForElasticSearch = this.getForElasticSearch.bind(this);
    this.view = this.view.bind(this);
    this.viewById = this.viewById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.deleteById = this.deleteById.bind(this);
    this.getInfoToEdit = this.getInfoToEdit.bind(this);
    this.updatePrivate = this.updatePrivate.bind(this);
    this.deletePrivateById = this.deletePrivateById.bind(this);
    this.disown = this.disown.bind(this);
    this.disownById = this.disownById.bind(this);
    this.getAllPrivateIdsByUsername =
      this.getAllPrivateIdsByUsername.bind(this);
  }

  async getAllForElasticSearch() {
    const owner = "NOBSC";  // only public recipes goes into ElasticSearch
    const sql = `
      SELECT
        CAST(r.id AS CHAR),
        r.author,
        r.type,
        r.cuisine,
        r.title,
        r.description,
        r.directions,
        r.recipe_image,
        (
          SELECT JSON_ARRAYAGG(rm.method)
          FROM recipe_methods rm
          WHERE rm.recipe = r.id
        ) method_names,
        (
          SELECT JSON_ARRAYAGG(e.name)
          FROM equipment e
          INNER JOIN recipe_equipment re ON re.equipment = e.id
          WHERE re.recipe = r.id
        ) equipment_names,
        (
          SELECT JSON_ARRAYAGG(i.name)
          FROM ingredients i
          INNER JOIN recipe_ingredients ri ON ri.ingredient = i.id
          WHERE ri.recipe = r.id
        ) ingredient_names,
        (
          SELECT JSON_ARRAYAGG(r.title)
          FROM recipes r
          INNER JOIN recipe_subrecipes rs ON rs.subrecipe = r.id
          WHERE rs.recipe = r.id
        ) subrecipe_titles
      FROM recipes r
      WHERE r.owner = ?
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [owner]);
    let final = [];
    for (let row of rows) {
      final.push({index: {_index: 'recipes', _id: row.id}}, {...row});
    }
    return final;
  }

  async getForElasticSearch(id: string) {
    const owner = "NOBSC";  // only public recipes goes into ElasticSearch
    const sql = `
      SELECT
        CAST(r.id AS CHAR),
        r.author,
        r.type,
        r.cuisine,
        r.title,
        r.description,
        r.directions,
        r.recipe_image,
        (
          SELECT JSON_ARRAYAGG(rm.method)
          FROM recipe_methods rm
          WHERE rm.recipe = r.id
        ) method_names,
        (
          SELECT JSON_ARRAYAGG(e.name)
          FROM equipment e
          INNER JOIN recipe_equipment re ON re.equipment = e.id
          WHERE re.recipe = r.id
        ) equipment_names,
        (
          SELECT JSON_ARRAYAGG(i.name)
          FROM ingredients i
          INNER JOIN recipe_ingredients ri ON ri.ingredient = i.id
          WHERE ri.recipe = r.id
        ) ingredient_names,
        (
          SELECT JSON_ARRAYAGG(r.title)
          FROM recipes r
          INNER JOIN recipe_subrecipes rs ON rs.subrecipe = r.id
          WHERE rs.recipe = r.id
        ) subrecipe_titles
      FROM recipes r
      WHERE r.id = ? AND r.owner = ?
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id, owner]);
    return row;
  }

  async view(author: string, owner: string) {
    const sql = `
      SELECT id, type, cuisine, title, recipe_image, owner
      FROM recipes
      WHERE author = ? AND owner = ?
      ORDER BY title ASC
    `;
    const [ rows ] = await this.pool
      .execute<RowDataPacket[]>(sql, [author, owner]);
    return rows;
  }

  async viewById(id: string, author: string, owner: string) {
    const sql = `
      SELECT
        r.id,
        r.author,
        u.avatar AS author_avatar,
        r.type,
        r.cuisine,
        r.title,
        r.description,
        r.active_time,
        r.total_time,
        r.directions,
        r.recipe_image,
        r.equipment_image,
        r.ingredients_image,
        r.cooking_image,
        r.video,
        (
          SELECT JSON_ARRAYAGG(JSON_OBJECT('method', rm.method))
          FROM recipe_methods rm
          WHERE rm.recipe = r.id
        ) required_methods,
        (
          SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'amount', re.amount,
            'equipment', e.name
          ))
          FROM equipment e
          INNER JOIN recipe_equipment re ON re.equipment = e.id
          WHERE re.recipe = r.id
        ) required_equipment,
        (
          SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'amount', ri.amount,
            'measurement', ri.measurement,
            'ingredient', i.name
          ))
          FROM ingredients i
          INNER JOIN recipe_ingredients ri ON ri.ingredient = i.id
          WHERE ri.recipe = r.id
        ) required_ingredients,
        (
          SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'amount', rs.amount,
            'measurement', rs.measurement,
            'subrecipe', r.title
          ))
          FROM recipes r
          INNER JOIN recipe_subrecipes rs ON rs.subrecipe = r.id
          WHERE rs.recipe = r.id
        ) required_subrecipes
      FROM recipes r
      INNER JOIN users u ON u.id = r.author
      WHERE r.id = ? AND r.author = ? AND r.owner = ?
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [id, author, owner]);
    return row;
  }

  async create({
    type,
    cuisine,
    author,
    owner,
    title,
    description,
    activeTime,
    totalTime,
    directions,
    recipeImage,
    equipmentImage,
    ingredientsImage,
    cookingImage,
    video
  }: ICreatingRecipe) {
    const sql = `
      INSERT INTO recipes (
        type,
        cuisine,
        author,
        owner,
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
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[] & ResultSetHeader>(sql, [
        type,
        cuisine,
        author,
        owner,
        title,
        description,
        activeTime,
        totalTime,
        directions,
        recipeImage,
        equipmentImage,
        ingredientsImage,
        cookingImage,
        video
      ]);
    return row;
  }
  
  async update({
    id,
    type,
    cuisine,
    author,
    owner,
    title,
    description,
    activeTime,
    totalTime,
    directions,
    recipeImage,
    equipmentImage,
    ingredientsImage,
    cookingImage,
    video
  }: IUpdatingRecipe) {
    const sql = `
      UPDATE recipes
      SET
        type = ?,
        cuisine = ?,
        author = ?,
        owner = ?,
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
      type,
      cuisine,
      author,
      owner,
      title,
      description,
      activeTime,
      totalTime,
      directions,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage,
      video,
      id
    ]);
    return row;
  }
  
  async deleteById(id: string) {
    const sql = `DELETE FROM recipes WHERE id = ? LIMIT 1`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return row;
  }

  async getInfoToEdit(id: string, author: string, owner: string) {
    const sql = `
      SELECT
      r.id,
      r.type,
      r.cuisine,
      r.owner,
      r.title,
      r.description,
      r.active_time,
      r.total_time,
      r.directions,
      r.recipe_image,
      r.equipment_image,
      r.ingredients_image,
      r.cooking_image,
      r.video,
      (
        SELECT JSON_ARRAYAGG(JSON_OBJECT('method', rm.method))
        FROM recipe_methods rm
        WHERE rm.recipe = r.id
      ) required_methods,
      (
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
          'amount', re.amount,
          'type', e.type,
          'equipment', re.equipment
        ))
        FROM equipment e
        INNER JOIN recipe_equipment re ON re.equipment = e.id
        WHERE re.recipe = r.id
      ) required_equipment,
      (
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
          'amount', ri.amount,
          'measurement', ri.measurement,
          'type', i.type,
          'ingredient', ri.ingredient
        ))
        FROM ingredients i
        INNER JOIN recipe_ingredients ri ON ri.ingredient = i.id
        WHERE ri.recipe = r.id
      ) required_ingredients,
      (
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
          'amount', rs.amount,
          'measurement', rs.measurement,
          'type', r.type,
          'cuisine', r.cuisine,
          'subrecipe', rs.subrecipe
        ))
        FROM recipes r
        INNER JOIN recipe_subrecipes rs ON rs.subrecipe = r.id
        WHERE rs.recipe = r.id
      ) required_subrecipes
      FROM recipes r
      INNER JOIN users u ON u.id = r.author
      WHERE r.id = ? AND r.author = ? AND r.owner = ?
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [id, author, owner]);
    return row;
  }

  // why?
  async updatePrivate({
    id,
    type,
    cuisine,
    author,
    owner,
    title,
    description,
    activeTime,
    totalTime,
    directions,
    recipeImage,
    equipmentImage,
    ingredientsImage,
    cookingImage,
    video
  }: IUpdatingRecipe) {
    const sql = `
      UPDATE recipes
      SET
        type = ?,
        cuisine = ?,
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
      WHERE id = ? AND author = ? AND owner = ?
      LIMIT 1
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [
      type,
      cuisine,
      title,
      description,
      activeTime,
      totalTime,
      directions,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage,
      video,
      id,
      author,
      owner,
    ]);
    return row;
  }
  
  async deletePrivateById(id: string, author: string, owner: string) {
    const sql = `
      DELETE FROM recipes WHERE id = ? AND author = ? AND owner = ? LIMIT 1
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [id, author, owner]);
    return row;
  }

  // needed?
  async disown(author: string) {
    const newAuthor = "Unknown";
    const owner = "NOBSC";
    const sql = `UPDATE recipes SET author = ? WHERE author = ? AND owner = ?`;
    await this.pool.execute<RowDataPacket[]>(sql, [newAuthor, author, owner]);
  }

  async disownById(id: string, author: string) {
    const newAuthor = "Unknown";
    const sql = `
      UPDATE recipes
      SET author = ?
      WHERE id = ? AND author = ? AND owner = 1
      LIMIT 1
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [newAuthor, id, author]);
    return row;
  }

  async getAllPrivateIdsByUsername(username: string) {
    const sql = `SELECT id FROM recipes WHERE author = ? AND owner = ?`;
    const [ rows ] = await this.pool
      .execute<RowDataPacket[]>(sql, [username, username]);
    return rows.map(r => r.id);
  }
}

type Data = Promise<RowDataPacket[]>;

type DataWithHeader = Promise<RowDataPacket[] & ResultSetHeader>;

export interface IRecipe {
  pool: Pool;
  getAllForElasticSearch(): any;
  getForElasticSearch(id: string): Data;
  view(author: string, owner: string): Data;
  viewById(id: string, author: string, owner: string): Data;
  create({
    type,
    cuisine,
    author,
    owner,
    title,
    description,
    activeTime,
    totalTime,
    directions,
    recipeImage,
    equipmentImage,
    ingredientsImage,
    cookingImage
  }: ICreatingRecipe): DataWithHeader;
  update({
    id,
    type,
    cuisine,
    author,
    owner,
    title,
    description,
    activeTime,
    totalTime,
    directions,
    recipeImage,
    equipmentImage,
    ingredientsImage,
    cookingImage,
    video
  }: IUpdatingRecipe): Data;
  deleteById(id: string): Data;
  getInfoToEdit(id: string, author: string, owner: string): Data;
  updatePrivate({
    id,
    type,
    cuisine,
    author,
    owner,
    title,
    description,
    activeTime,
    totalTime,
    directions,
    recipeImage,
    equipmentImage,
    ingredientsImage,
    cookingImage,
    video
  }: IUpdatingRecipe): Data;
  deletePrivateById(id: string, author: string, owner: string): Data;
  disown(author: string): void;
  disownById(id: string, author: string): Data;
  getAllPrivateIdsByUsername(username: string): Promise<string[]>;
}

export interface ICreatingRecipe {
  type: string;
  cuisine: string;
  author: string;
  owner: string;
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
  id: string;
  //  what about prevImage ?
}