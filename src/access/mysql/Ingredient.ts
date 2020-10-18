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
    this.deleteByOwner = this.deleteByOwner.bind(this);
  }

  async getAllForElasticSearch() {
    const owner = "NOBSC";  // only public ingredients goes into ElasticSearch
    const sql = `
      SELECT
        CAST(id AS CHAR),
        owner,
        type,
        brand,
        variety,
        name,
        fullname,
        description,
        image
      FROM ingredients
      WHERE owner = ?
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [owner]);
    let final = [];
    for (let row of rows) {
      final.push({index: {_index: 'ingredients', _id: row.id}}, {...row});
    }
    return final;
  }

  async getForElasticSearch(id: string) {
    const owner = "NOBSC";  // only public ingredients goes into ElasticSearch
    const sql = `
      SELECT
        CAST(id AS CHAR),
        owner,
        type,
        brand,
        variety,
        name,
        fullname,
        description,
        image
      FROM ingredients
      WHERE id = ? owner = ?
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id, owner]);
    let {
      type,
      brand,
      variety,
      name,
      fullname,
      image
    } = row[0];
    return {
      id: row[0].id,
      type,
      fullname,
      brand,
      variety,
      name,
      image
    };
  }

  async view(author: string, owner: string) {
    const sql = `
      SELECT
        id,
        owner,
        type,
        brand,
        variety,
        name,
        fullname,
        description,
        image
      FROM ingredients
      WHERE author = ? AND owner = ?
      ORDER BY name ASC
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [author, owner]);
    return row;
  }

  async viewById(id: string, author: string, owner: string) {
    const sql = `
      SELECT
        id,
        type,
        brand,
        variety,
        name,
        fullname,
        description,
        image
      FROM ingredients
      WHERE id = ? AND author = ? AND owner = ?
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [id, author, owner]);
    return row;
  }

  async create({
    type,
    author,
    owner,
    brand,
    variety,
    name,
    description,
    image
  }: ICreatingIngredient) {
    const sql = `
      INSERT INTO ingredients (
        type,
        author,
        owner,
        brand,
        variety,
        name,
        description,
        image
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[] & ResultSetHeader>(sql, [
        type,
        author,
        owner,
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
    type,
    brand,
    variety,
    name,
    description,
    image
  }: IUpdatingIngredient) {
    const sql = `
      UPDATE ingredients
      SET
        type = ?,
        brand = ?,
        variety = ?,
        name = ?,
        description = ?,
        image = ?
      WHERE id = ?
      LIMIT 1
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [
      type,
      brand,
      variety,
      name,
      description,
      image,
      id
    ]);
    return row;
  }

  async delete(id: string) {
    const sql = `DELETE FROM ingredients WHERE id = ? LIMIT 1`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return row;
  }

  async createPrivate({
    type,
    author,
    owner,
    brand,
    variety,
    name,
    description,
    image
  }: ICreatingIngredient) {
    const sql = `
      INSERT INTO ingredients (
        type,
        author,
        owner,
        brand,
        variety,
        name,
        description,
        image
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [
      type,
      author,
      owner,
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
    type,
    author,
    owner,
    brand,
    variety,
    name,
    description,
    image
  }: IUpdatingIngredient) {
    const sql = `
      UPDATE ingredients
      SET
        type = ?,
        author = ?,
        owner = ?,
        brand = ?,
        variety =?,
        name = ?,
        description = ?,
        image = ?
      WHERE owner = ? AND id = ?
      LIMIT 1
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [
      type,
      author,
      owner,
      brand,
      variety,
      name,
      description,
      image,
      owner,
      id
    ]);
    return row;
  }

  async deleteByOwner(id: string, owner: string) {
    const sql = `DELETE FROM ingredients WHERE owner = ? AND id = ? LIMIT 1`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [owner, id]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

type DataWithHeader = Promise<RowDataPacket[] & ResultSetHeader>;

export interface IIngredient {
  pool: Pool;
  getAllForElasticSearch(): any;  // finish
  getForElasticSearch(id: string): any;  // finish
  view(author: string, owner: string): Data;
  viewById(id: string, author: string, owner: string): Data;
  create({
    type,
    author,
    owner,
    brand,
    variety,
    name,
    description,
    image
  }: ICreatingIngredient): DataWithHeader;
  update({
    id,
    type,
    author,
    owner,
    brand,
    variety,
    name,
    description,
    image
  }: IUpdatingIngredient): Data;
  delete(id: string): Data;
  createPrivate({
    type,
    author,
    owner,
    brand,
    variety,
    name,
    description,
    image
  }: ICreatingIngredient): Data;
  updatePrivate({
    id,
    type,
    author,
    owner,
    brand,
    variety,
    name,
    description,
    image
  }: IUpdatingIngredient): Data;
  deleteByOwner(id: string, owner: string): Data;
}

interface ICreatingIngredient {
  type: string;
  author: string;
  owner: string;
  brand: string;
  variety: string;
  name: string;
  description: string;
  image: string;
}

interface IUpdatingIngredient extends ICreatingIngredient {
  id: string;
}