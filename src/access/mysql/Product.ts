import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class Product implements IProduct {
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
  }

  async getAllForElasticSearch() {
    const sql = `
      SELECT
        id,
        category,
        type,
        brand,
        variety,
        name,
        fullname,
        description,
        specs,
        image
      FROM products
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql);
    let final = [];
    for (let row of rows) {
      final.push({index: {_index: 'products', _id: row.id}}, row);
    }
    return final;
  }

  async getForElasticSearch(id: string) {
    const sql = `
      SELECT
        id,
        category,
        type,
        brand,
        variety,
        name,
        fullname,
        description,
        specs,
        image
      FROM products
      WHERE id = ?
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    // ?
    let {
      category,
      type,
      brand,
      variety,
      name,
      fullname,
      description,
      specs,
      image
    } = row[0];
    return {
      id: row[0].id,
      category,
      type,
      fullname,
      brand,
      variety,
      name,
      description,
      specs,
      image
    };
  }

  async view() {
    const sql = `
      SELECT
        id,
        category,
        type,
        brand,
        variety,
        name,
        fullname,
        description,
        specs,
        image
      FROM products
      ORDER BY category ASC
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql);
    return row;
  }

  async viewById(id: string) {
    const sql = `
      SELECT
        id,
        category,
        type,
        brand,
        variety,
        name,
        fullname,
        description,
        specs,
        image
      FROM products
      WHERE id = ?
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return row;
  }

  async create({
    category,
    type,
    brand,
    variety,
    name,
    description,
    specs,
    image
  }: ICreatingProduct) {
    const sql = `
      INSERT INTO products (
        category,
        type,
        brand,
        variety,
        name,
        description,
        specs,
        image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[] & ResultSetHeader>(sql, [
        category,
        type,
        brand,
        variety,
        name,
        description,
        specs,
        image
      ]);
    return row;
  }

  async update({
    id,
    category,
    type,
    brand,
    variety,
    name,
    description,
    specs,
    image
  }: IUpdatingProduct) {
    const sql = `
      UPDATE products
      SET
        category = ?,
        type = ?,
        brand = ?,
        variety = ?,
        name = ?,
        description = ?,
        specs = ?,
        image = ?
      WHERE id = ?
      LIMIT 1
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [
      category,
      type,
      brand,
      variety,
      name,
      description,
      specs,
      image,
      id
    ]);
    return row;
  }

  async delete(id: string) {
    const sql = `DELETE FROM products WHERE id = ? LIMIT 1`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return row;
  }
}


type Data = Promise<RowDataPacket[]>;

type DataWithHeader = Promise<RowDataPacket[] & ResultSetHeader>;

export interface IProduct {
  pool: Pool;
  getAllForElasticSearch(): any;  // finish
  getForElasticSearch(id: string): any;  // finish
  view(): Data;
  viewById(id: string): Data;
  create({
    category,
    type,
    brand,
    variety,
    name,
    description,
    specs,
    image
  }: ICreatingProduct): DataWithHeader;
  update({
    id,
    category,
    type,
    brand,
    variety,
    name,
    description,
    specs,
    image
  }: IUpdatingProduct): Data;
  delete(id: string): Data;
}

interface ICreatingProduct {
  category: string;
  type: string;
  brand: string;
  variety: string;  // model?
  name: string;
  description: string;
  specs: any;  // finish
  image: string;
}

interface IUpdatingProduct extends ICreatingProduct {
  id: string;
}