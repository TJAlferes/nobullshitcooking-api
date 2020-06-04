import { Pool, RowDataPacket } from 'mysql2/promise';

export class Ingredient implements IIngredient {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.getAllPublicIngredientsForElasticSearchBulkInsert =
      this.getAllPublicIngredientsForElasticSearchBulkInsert.bind(this);
    this.getIngredientForElasticSearchInsert =
      this.getIngredientForElasticSearchInsert.bind(this);
    this.viewIngredients = this.viewIngredients.bind(this);
    this.viewIngredientById = this.viewIngredientById.bind(this);
    this.createIngredient = this.createIngredient.bind(this);
    this.updateIngredient = this.updateIngredient.bind(this);
    this.deleteIngredient = this.deleteIngredient.bind(this);
    this.createMyPrivateUserIngredient =
      this.createMyPrivateUserIngredient.bind(this);
    this.updateMyPrivateUserIngredient =
      this.updateMyPrivateUserIngredient.bind(this);
    this.deleteMyPrivateUserIngredient =
      this.deleteMyPrivateUserIngredient.bind(this);
  }

  async getAllPublicIngredientsForElasticSearchBulkInsert() {
    const ownerId = 1;
    const sql1 = `
      SELECT
        CAST(i.ingredient_id AS CHAR),
        i.ingredient_type_id,
        i.owner_id,
        t.ingredient_type_name,
        i.ingredient_name,
        i.ingredient_description,
        i.ingredient_image
      FROM nobsc_ingredients i
      INNER JOIN
        nobsc_ingredient_types it ON
        it.ingredient_type_id = i.ingredient_type_id
      WHERE i.owner_id = ?
    `;
    const [ ingredientsForBulkInsert ] = await this.pool
    .execute<RowDataPacket[]>(sql1, [ownerId]);
    let final = [];

    // allows the sequence of awaits we want
    for (let ingredient of ingredientsForBulkInsert) {
      const { ingredient_id } = ingredient;
      final.push(
        {index: {_index: 'ingredients', _id: ingredient_id}},
        ingredient
      );
    }

    return final;
  }

  async getIngredientForElasticSearchInsert(ingredientId: number) {
    const ownerId = 1;
    const sql = `
      SELECT
        CAST(i.ingredient_id AS CHAR),
        i.ingredient_type_id,
        i.owner_id,
        t.ingredient_type_name,
        i.ingredient_name,
        i.ingredient_description,
        i.ingredient_image
      FROM nobsc_ingredients i
      INNER JOIN
        nobsc_ingredient_types it ON
        it.ingredient_type_id = e.ingredient_type_id
      WHERE i.ingredient_id = ? i.owner_id = ?
    `;
    const [ ingredientForInsert ] = await this.pool
    .execute<RowDataPacket[]>(sql, [ingredientId, ownerId]);
    /*const { ingredient_id } = ingredientForInsert;
    return [
      {index: {_index: 'ingredient', _id: ingredient_id}},
      ingredientForInsert
    ];*/
    return ingredientForInsert;
  }

  async viewIngredients(authorId: number, ownerId: number) {
    const sql = `
      SELECT
        i.ingredient_id AS ingredient_id,
        i.ingredient_type_id AS ingredient_type_id,
        i.owner_id AS owner_id,
        t.ingredient_type_name AS ingredient_type_name,
        i.ingredient_name AS ingredient_name,
        i.ingredient_description AS ingredient_description,
        i.ingredient_image AS ingredient_image
      FROM nobsc_ingredients
      INNER JOIN
        nobsc_ingredient_types t ON
        i.ingredient_type_id = t.ingredient_type_id
      WHERE i.author_id = ? AND i.owner_id = ?
      ORDER BY ingredient_name ASC
    `;
    const [ ingredients ] = await this.pool
    .execute<RowDataPacket[]>(sql, [authorId, ownerId]);
    return ingredients;
  }

  async viewIngredientById(
    ingredientId: number,
    authorId: number,
    ownerId: number
  ) {
    const sql = `
      SELECT
        i.ingredient_id AS ingredient_id,
        t.ingredient_type_name AS ingredient_type_name
        i.ingredient_name AS ingredient_name,
        i.ingredient_description AS ingredient_description,
        i.ingredient_image AS ingredient_image
      FROM nobsc_ingredients i
      INNER JOIN
        nobsc_ingredient_types t ON
        i.ingredient_type_id = t.ingredient_type_id
      WHERE owner_id = 1 AND ingredient_id = ?
    `;
    const [ ingredient ] = await this.pool
    .execute<RowDataPacket[]>(sql, [ingredientId, authorId, ownerId]);
    return ingredient;
  }

  async createIngredient({
    ingredientTypeId,
    authorId,
    ownerId,
    ingredientName,
    ingredientDescription,
    ingredientImage
  }: ICreatingIngredient) {
    const sql = `
      INSERT INTO nobsc_ingredients (
        ingredient_type_id,
        author_id,
        owner_id,
        ingredient_name,
        ingredient_description,
        ingredient_image
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [ createdIngredient ] = await this.pool
    .execute<RowDataPacket[]>(sql, [
      ingredientTypeId,
      authorId,
      ownerId,
      ingredientName,
      ingredientDescription,
      ingredientImage
    ]);
    return createdIngredient;
  }

  async updateIngredient({
    ingredientId,
    ingredientTypeId,
    authorId,
    ownerId,
    ingredientName,
    ingredientDescription,
    ingredientImage
  }: IUpdatingIngredient) {
    const sql = `
      UPDATE nobsc_ingredients
      SET
        ingredient_type_id = ?,
        ingredient_name = ?,
        ingredient_description = ?,
        ingredient_image = ?
      WHERE ingredient_id = ?
      LIMIT 1
    `;
    const [ updatedIngredient ] = await this.pool
    .execute<RowDataPacket[]>(sql, [
      ingredientTypeId,
      ingredientName,
      ingredientDescription,
      ingredientImage,
      ingredientId
    ]);
    return updatedIngredient;
  }

  async deleteIngredient(ingredientId: number) {
    const sql = `
      DELETE
      FROM nobsc_ingredients
      WHERE ingredient_id = ?
      LIMIT 1
    `;
    const [ deletedIngredient ] = await this.pool
    .execute<RowDataPacket[]>(sql, [ingredientId]);
    return deletedIngredient;
  }

  async createMyPrivateUserIngredient({
    ingredientTypeId,
    authorId,
    ownerId,
    ingredientName,
    ingredientDescription,
    ingredientImage
  }: ICreatingIngredient) {
    const sql = `
      INSERT INTO nobsc_ingredients (
        ingredient_type_id,
        author_id,
        owner_id,
        ingredient_name,
        ingredient_description,
        ingredient_image
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [ createdPrivateUserIngredient ] = await this.pool
    .execute<RowDataPacket[]>(sql, [
      ingredientTypeId,
      authorId,
      ownerId,
      ingredientName,
      ingredientDescription,
      ingredientImage
    ]);
    return createdPrivateUserIngredient;
  }

  async updateMyPrivateUserIngredient({
    ingredientId,
    ingredientTypeId,
    authorId,
    ownerId,
    ingredientName,
    ingredientDescription,
    ingredientImage
  }: IUpdatingIngredient) {
    const sql = `
      UPDATE nobsc_ingredients
      SET
        ingredient_type_id = ?,
        author_id = ?,
        owner_id = ?,
        ingredient_name = ?,
        ingredient_description = ?,
        ingredient_image = ?
      WHERE owner_id = ? AND ingredient_id = ?
      LIMIT 1
    `;
    const [ updatedPrivateUserIngredient ] = await this.pool
    .execute<RowDataPacket[]>(sql, [
      ingredientTypeId,
      authorId,
      ownerId,
      ingredientName,
      ingredientDescription,
      ingredientImage,
      ownerId,
      ingredientId
    ]);
    return updatedPrivateUserIngredient;
  }

  async deleteMyPrivateUserIngredient(ingredientId: number, ownerId: number) {
    const sql = `
      DELETE
      FROM nobsc_ingredients
      WHERE owner_id = ? AND ingredient_id = ?
      LIMIT 1
    `;
    const [ deletedPrivateUserIngredient ] = await this.pool
    .execute<RowDataPacket[]>(sql, [ownerId, ingredientId]);
    return deletedPrivateUserIngredient;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IIngredient {
  pool: Pool;
  getAllPublicIngredientsForElasticSearchBulkInsert(): any;  // finish
  getIngredientForElasticSearchInsert(ingredientId: number): Data;
  viewIngredients(authorId: number, ownerId: number): Data;
  viewIngredientById(
    ingredientId: number,
    authorId: number,
    ownerId: number
  ): Data;
  createIngredient({
    ingredientTypeId,
    authorId,
    ownerId,
    ingredientName,
    ingredientDescription,
    ingredientImage
  }: ICreatingIngredient): Data;
  updateIngredient({
    ingredientId,
    ingredientTypeId,
    authorId,
    ownerId,
    ingredientName,
    ingredientDescription,
    ingredientImage
  }: IUpdatingIngredient): Data;
  deleteIngredient(ingredientId: number): Data;
  createMyPrivateUserIngredient({
    ingredientTypeId,
    authorId,
    ownerId,
    ingredientName,
    ingredientDescription,
    ingredientImage
  }: ICreatingIngredient): Data;
  updateMyPrivateUserIngredient({
    ingredientId,
    ingredientTypeId,
    authorId,
    ownerId,
    ingredientName,
    ingredientDescription,
    ingredientImage
  }: IUpdatingIngredient): Data;
  deleteMyPrivateUserIngredient(ingredientId: number, ownerId: number): Data;
}

interface ICreatingIngredient {
  ingredientTypeId: number;
  authorId: number;
  ownerId: number;
  ingredientName: string;
  ingredientDescription: string;
  ingredientImage: string;
}

interface IUpdatingIngredient extends ICreatingIngredient {
  ingredientId: number;
}