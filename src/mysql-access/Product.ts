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
        CAST(p.id AS CHAR),
        p.product_type_id,
        c.name AS product_category_name,
        t.name AS product_type_name,
        p.brand,
        p.variety,
        p.name,
        p.fullname,
        p.description,
        p.specs,
        p.image
      FROM products p
      INNER JOIN product_categories c ON c.id = p.product_category_id
      INNER JOIN product_types t ON t.id = p.product_type_id
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql);
    let final = [];
    for (let row of rows) {
      final.push({index: {_index: 'products', _id: row.id}}, {...row});
    }
    return final;
  }

  async getForElasticSearch(id: number) {
    const sql = `
      SELECT
        CAST(p.id AS CHAR),
        p.product_type_id,
        c.name AS product_category_name,
        t.name AS product_type_name,
        p.brand,
        p.variety,
        p.name,
        p.fullname,
        p.description,
        p.specs,
        p.image
      FROM products p
      INNER JOIN product_categories c ON c.id = p.product_category_id
      INNER JOIN product_types t ON t.id = p.product_type_id
      WHERE p.id = ?
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    let {
      product_type_name,
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
      product_type_name,
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
        p.id,
        p.product_category_id,
        p.product_type_id,
        c.name AS product_category_name,
        t.name AS product_type_name,
        p.brand,
        p.variety,
        p.name,
        p.fullname,
        p.description,
        p.specs,
        p.image
      FROM products p
      INNER JOIN product_categories c ON c.id = p.product_category_id
      INNER JOIN product_types t ON p.product_type_id = t.id
      ORDER BY p.name ASC
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql);
    return row;
  }

  async viewById(id: number) {
    const sql = `
      SELECT
        p.id,
        p.product_category_id,
        p.product_type_id,
        c.name AS product_category_name,
        t.name AS product_type_name,
        p.brand,
        p.variety,
        p.name,
        p.fullname,
        p.description,
        p.specs,
        p.image
      FROM products p
      INNER JOIN product_categories c ON c.id = p.product_category_id
      INNER JOIN product_types t ON p.product_type_id = t.id
      WHERE p.id = ?
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return row;
  }

  async create({
    productCategoryId,
    productTypeId,
    brand,
    variety,
    name,
    description,
    specs,
    image
  }: ICreatingProduct) {
    const sql = `
      INSERT INTO products (
        product_category_id,
        product_type_id,
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
        productCategoryId,
        productTypeId,
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
    productCategoryId,
    productTypeId,
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
        product_category_id = ?,
        product_type_id = ?,
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
      productCategoryId,
      productTypeId,
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

  async delete(id: number) {
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
  getForElasticSearch(id: number): any;  // finish
  view(): Data;
  viewById(id: number): Data;
  create({
    productCategoryId,
    productTypeId,
    brand,
    variety,
    name,
    description,
    specs,
    image
  }: ICreatingProduct): DataWithHeader;
  update({
    id,
    productCategoryId,
    productTypeId,
    brand,
    variety,
    name,
    description,
    specs,
    image
  }: IUpdatingProduct): Data;
  delete(id: number): Data;
}

interface ICreatingProduct {
  productCategoryId: number;
  productTypeId: number;
  brand: string;
  variety: string;  // model?
  name: string;
  description: string;
  specs: any;  // finish
  image: string;
}

interface IUpdatingProduct extends ICreatingProduct {
  id: number;
}