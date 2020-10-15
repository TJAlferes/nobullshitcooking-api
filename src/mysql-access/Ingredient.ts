import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class Ingredient implements IIngredient {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.getAllForElasticSearch = this.getAllForElasticSearch.bind(this);
    this.getForElasticSearch = this.getForElasticSearch.bind(this);
    this.view = this.view.bind(this);
    this.viewById = this.viewById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.createPrivate = this.createPrivate.bind(this);
    this.updatePrivate = this.updatePrivate.bind(this);
    this.deleteByOwnerId = this.deleteByOwnerId.bind(this);
    this.deleteAllByOwnerId = this.deleteAllByOwnerId.bind(this);
  }

  async getAllForElasticSearch() {
    const ownerId = 1;  // only public ingredients goes into ElasticSearch
    const sql = `
      SELECT
        CAST(i.id AS CHAR),
        i.ingredient_type_id,
        i.owner_id,
        t.name AS ingredient_type_name,
        i.brand,
        i.variety,
        i.name,
        i.fullname,
        i.description,
        i.image
      FROM ingredients i
      INNER JOIN ingredient_types t ON t.id = i.ingredient_type_id
      WHERE i.owner_id = ?
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [ownerId]);
    let final = [];
    for (let row of rows) {
      final.push({index: {_index: 'ingredients', _id: row.id}}, {...row});
    }
    return final;
  }

  async getForElasticSearch(id: number) {
    const ownerId = 1;  // only public ingredients goes into ElasticSearch
    const sql = `
      SELECT
        CAST(i.id AS CHAR),
        i.ingredient_type_id,
        i.owner_id,
        t.name AS ingredient_type_name,
        i.brand,
        i.variety,
        i.name,
        i.fullname,
        i.description,
        i.image
      FROM ingredients i
      INNER JOIN ingredient_types t ON t.id = i.ingredient_type_id
      WHERE i.id = ? i.owner_id = ?
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [id, ownerId]);
    let {
      ingredient_type_name,
      brand,
      variety,
      name,
      fullname,
      image
    } = row[0];
    return {
      id: row[0].id,
      ingredient_type_name,
      fullname,
      brand,
      variety,
      name,
      image
    };
  }

  async view(authorId: number, ownerId: number) {
    const sql = `
      SELECT
        i.id,
        i.ingredient_type_id,
        i.owner_id,
        t.name AS ingredient_type_name,
        i.brand,
        i.variety,
        i.name,
        i.fullname,
        i.description,
        i.image
      FROM ingredients i
      INNER JOIN ingredient_types t ON i.ingredient_type_id = t.id
      WHERE i.author_id = ? AND i.owner_id = ?
      ORDER BY i.name ASC
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [authorId, ownerId]);
    return row;
  }

  async viewById(id: number, authorId: number, ownerId: number) {
    const sql = `
      SELECT
        i.id,
        t.name AS ingredient_type_name,
        i.brand,
        i.variety,
        i.name,
        i.fullname,
        i.description,
        i.image
      FROM ingredients i
      INNER JOIN ingredient_types t ON i.ingredient_type_id = t.id
      WHERE owner_id = 1 AND i.id = ?
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [id, authorId, ownerId]);
    return row;
  }

  async create({
    ingredientTypeId,
    authorId,
    ownerId,
    brand,
    variety,
    name,
    description,
    image
  }: ICreatingIngredient) {
    const sql = `
      INSERT INTO ingredients (
        ingredient_type_id,
        author_id,
        owner_id,
        brand,
        variety,
        name,
        description,
        image
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[] & ResultSetHeader>(sql, [
        ingredientTypeId,
        authorId,
        ownerId,
        brand,
        variety,
        name,
        description,
        image
      ]);
    return row;
  }

  async update({
    id,
    ingredientTypeId,
    authorId,
    ownerId,
    brand,
    variety,
    name,
    description,
    image
  }: IUpdatingIngredient) {
    const sql = `
      UPDATE ingredients
      SET
        ingredient_type_id = ?,
        brand = ?,
        variety = ?,
        name = ?,
        description = ?,
        image = ?
      WHERE id = ?
      LIMIT 1
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [
      ingredientTypeId,
      brand,
      variety,
      name,
      description,
      image,
      id
    ]);
    return row;
  }

  async delete(id: number) {
    const sql = `DELETE FROM ingredients WHERE id = ? LIMIT 1`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return row;
  }

  async createPrivate({
    ingredientTypeId,
    authorId,
    ownerId,
    brand,
    variety,
    name,
    description,
    image
  }: ICreatingIngredient) {
    const sql = `
      INSERT INTO ingredients (
        ingredient_type_id,
        author_id,
        owner_id,
        brand,
        variety,
        name,
        description,
        image
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [
      ingredientTypeId,
      authorId,
      ownerId,
      brand,
      variety,
      name,
      description,
      image
    ]);
    return row;
  }

  async updatePrivate({
    id,
    ingredientTypeId,
    authorId,
    ownerId,
    brand,
    variety,
    name,
    description,
    image
  }: IUpdatingIngredient) {
    const sql = `
      UPDATE ingredients
      SET
        ingredient_type_id = ?,
        author_id = ?,
        owner_id = ?,
        brand = ?,
        variety =?,
        name = ?,
        description = ?,
        image = ?
      WHERE owner_id = ? AND id = ?
      LIMIT 1
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [
      ingredientTypeId,
      authorId,
      ownerId,
      brand,
      variety,
      name,
      description,
      image,
      ownerId,
      id
    ]);
    return row;
  }

  async deleteByOwnerId(id: number, ownerId: number) {
    const sql = `DELETE FROM ingredients WHERE owner_id = ? AND id = ? LIMIT 1`;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [ownerId, id]);
    return row;
  }

  async deleteAllByOwnerId(ownerId: number) {
    const sql = `DELETE FROM ingredients WHERE owner_id = ?`;
    await this.pool.execute<RowDataPacket[]>(sql, [ownerId]);
  }
}

type Data = Promise<RowDataPacket[]>;

type DataWithHeader = Promise<RowDataPacket[] & ResultSetHeader>;

export interface IIngredient {
  pool: Pool;
  getAllForElasticSearch(): any;  // finish
  getForElasticSearch(id: number): any;  // finish
  view(authorId: number, ownerId: number): Data;
  viewById(id: number, authorId: number, ownerId: number): Data;
  create({
    ingredientTypeId,
    authorId,
    ownerId,
    brand,
    variety,
    name,
    description,
    image
  }: ICreatingIngredient): DataWithHeader;
  update({
    id,
    ingredientTypeId,
    authorId,
    ownerId,
    brand,
    variety,
    name,
    description,
    image
  }: IUpdatingIngredient): Data;
  delete(id: number): Data;
  createPrivate({
    ingredientTypeId,
    authorId,
    ownerId,
    brand,
    variety,
    name,
    description,
    image
  }: ICreatingIngredient): Data;
  updatePrivate({
    id,
    ingredientTypeId,
    authorId,
    ownerId,
    brand,
    variety,
    name,
    description,
    image
  }: IUpdatingIngredient): Data;
  deleteByOwnerId(id: number, ownerId: number): Data;
  deleteAllByOwnerId(ownerId: number): void;
}

interface ICreatingIngredient {
  ingredientTypeId: number;
  authorId: number;
  ownerId: number;
  brand: string;
  variety: string;
  name: string;
  description: string;
  image: string;
}

interface IUpdatingIngredient extends ICreatingIngredient {
  id: number;
}