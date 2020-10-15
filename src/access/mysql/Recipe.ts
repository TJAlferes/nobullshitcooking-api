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
    this.deletePrivate = this.deletePrivate.bind(this);
    this.deletePrivateById = this.deletePrivateById.bind(this);
    this.disown = this.disown.bind(this);
    this.disownById = this.disownById.bind(this);
    this.getAllPrivateIdsByUserId = this.getAllPrivateIdsByUserId.bind(this);
  }

  async getAllForElasticSearch() {
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
    let final = [];
    for (let row of rows) {
      final.push({index: {_index: 'recipes', _id: row.id}}, {...row});
    }
    return final;
  }

  async getForElasticSearch(id: number) {
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
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [id, ownerId]);
    return row;
  }

  async view(authorId: number, ownerId: number) {
    const sql = `
      SELECT id, recipe_type_id, cuisine_id, title, recipe_image, owner_id
      FROM recipes
      WHERE author_id = ? AND owner_id = ?
      ORDER BY title ASC
    `;
    const [ rows ] = await this.pool
      .execute<RowDataPacket[]>(sql, [authorId, ownerId]);
    return rows;
  }

  async viewById(id: number, authorId: number, ownerId: number) {
    const sql = `
      SELECT
        r.id,
        u.username AS author,
        u.avatar AS author_avatar,
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
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [id, authorId, ownerId]);
    return row;
  }

  async create({
    recipeTypeId,
    cuisineId,
    authorId,
    ownerId,
    title,
    description,
    activeTime,
    totalTime,
    directions,
    recipeImage,
    equipmentImage,
    ingredientsImage,
    cookingImage
  }: ICreatingRecipe) {
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
        cooking_image
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[] & ResultSetHeader>(sql, [
        recipeTypeId,
        cuisineId,
        authorId,
        ownerId,
        title,
        description,
        activeTime,
        totalTime,
        directions,
        recipeImage,
        equipmentImage,
        ingredientsImage,
        cookingImage
      ]);
    return row;
  }
  
  async update({
    id,
    recipeTypeId,
    cuisineId,
    authorId,
    ownerId,
    title,
    description,
    activeTime,
    totalTime,
    directions,
    recipeImage,
    equipmentImage,
    ingredientsImage,
    cookingImage
  }: IUpdatingRecipe) {
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
        cooking_image = ?
      WHERE id = ?
      LIMIT 1
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [
      recipeTypeId,
      cuisineId,
      authorId,
      ownerId,
      title,
      description,
      activeTime,
      totalTime,
      directions,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage,
      id
    ]);
    return row;
  }
  
  async deleteById(id: number) {
    const sql = `DELETE FROM recipes WHERE id = ? LIMIT 1`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return row;
  }

  async getInfoToEdit(id: number, authorId: number, ownerId: number) {
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
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [id, authorId, ownerId]);
    return row;
  }

  async updatePrivate({
    id,
    recipeTypeId,
    cuisineId,
    authorId,
    ownerId,
    title,
    description,
    activeTime,
    totalTime,
    directions,
    recipeImage,
    equipmentImage,
    ingredientsImage,
    cookingImage
  }: IUpdatingRecipe) {
    const sql = `
      UPDATE recipes
      SET
        recipe_type_id = ?,
        cuisine_id = ?,
        title = ?,
        description = ?,
        active_time = ?,
        total_time = ?,
        directions = ?,
        recipe_image = ?,
        equipment_image = ?,
        ingredients_image = ?,
        cooking_image = ?
      WHERE id = ? AND author_id = ? AND owner_id = ?
      LIMIT 1
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [
      recipeTypeId,
      cuisineId,
      title,
      description,
      activeTime,
      totalTime,
      directions,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage,
      id,
      authorId,
      ownerId
    ]);
    return row;
  }

  async deletePrivate(authorId: number, ownerId: number) {
    const sql = `DELETE FROM recipes WHERE author_id = ? AND owner_id = ?`;
    await this.pool.execute<RowDataPacket[]>(sql, [authorId, ownerId]);
  }
  
  async deletePrivateById(id: number, authorId: number, ownerId: number) {
    const sql = `
      DELETE
      FROM recipes
      WHERE recipe_id = ? AND author_id = ? AND owner_id = ?
      LIMIT 1
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [id, authorId, ownerId]);
    return row;
  }

  async disown(authorId: number) {
    const newAuthorId = 2;
    const sql = `
      UPDATE recipes SET author_id = ? WHERE author_id = ? AND owner_id = 1
    `;
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

  async getAllPrivateIdsByUserId(userId: number) {
    const sql = `SELECT id FROM recipes WHERE author_id = ? AND owner_id = ?`;
    const [ rows ] = await this.pool
      .execute<RowDataPacket[]>(sql, [userId, userId]);
    return rows.map(r => r.id);
  }
}

type Data = Promise<RowDataPacket[]>;

type DataWithHeader = Promise<RowDataPacket[] & ResultSetHeader>;

export interface IRecipe {
  pool: Pool;
  getAllForElasticSearch(): any;
  getForElasticSearch(id: number): Data;
  view(authorId: number, ownerId: number): Data;
  viewById(id: number, authorId: number, ownerId: number): Data;
  create({
    recipeTypeId,
    cuisineId,
    authorId,
    ownerId,
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
    recipeTypeId,
    cuisineId,
    authorId,
    ownerId,
    title,
    description,
    activeTime,
    totalTime,
    directions,
    recipeImage,
    equipmentImage,
    ingredientsImage,
    cookingImage
  }: IUpdatingRecipe): Data;
  deleteById(id: number): Data;
  getInfoToEdit(id: number, authorId: number, ownerId: number): Data;
  updatePrivate({
    id,
    recipeTypeId,
    cuisineId,
    authorId,
    ownerId,
    title,
    description,
    activeTime,
    totalTime,
    directions,
    recipeImage,
    equipmentImage,
    ingredientsImage,
    cookingImage
  }: IUpdatingRecipe): Data;
  deletePrivate(authorId: number, ownerId: number): void;
  deletePrivateById(id: number, authorId: number, ownerId: number): Data;
  disown(authorId: number): void;
  disownById(id: number, authorId: number): Data;
  getAllPrivateIdsByUserId(userId: number): Promise<number[]>;
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
}

export interface IUpdatingRecipe extends ICreatingRecipe {
  id: number;
  //  what about prevImage ?
}