import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export class Product implements IProduct {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.getForElasticSearch =     this.getForElasticSearch.bind(this);
    this.getForElasticSearchById = this.getForElasticSearchById.bind(this);
    this.view =                    this.view.bind(this);
    this.viewById =                this.viewById.bind(this);
    this.create =                  this.create.bind(this);
    this.update =                  this.update.bind(this);
    this.delete =                  this.delete.bind(this);
  }

  async getForElasticSearch() {
    const sql = `
      SELECT
        CAST(p.id AS CHAR),
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
    const final = [];
    for (let row of rows) final.push({index: {_index: 'products', _id: row.id}}, row);
    return final;
  }

  async getForElasticSearchById(id: number) {
    const sql = `
      SELECT
        CAST(p.id AS CHAR),
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
    const [ [ row ] ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return row as ISavingProduct;
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

  async create(product: ICreatingProduct) {
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
    const [ row ] = 
      await this.pool.execute<RowDataPacket[] & ResultSetHeader>(sql, [
        product.productCategoryId,
        product.productTypeId,
        product.brand,
        product.variety,
        product.name,
        product.description,
        product.specs,
        product.image
      ]);
    return row;
  }

  async update(product: IUpdatingProduct) {
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
      product.productCategoryId,
      product.productTypeId,
      product.brand,
      product.variety,
      product.name,
      product.description,
      product.specs,
      product.image,
      product.id
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
  getForElasticSearch(): any;
  getForElasticSearchById(id: number): Promise<ISavingProduct>;
  view(): Data;
  viewById(id: number): Data;
  create(product: ICreatingProduct): DataWithHeader;
  update(product: IUpdatingProduct): Data;
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

interface ISavingProduct {
  id: string;
  product_category_name: string;
  product_type_name: string;
  fullname: string;
  brand: string;
  variety: string;
  name: string;
  description: string;
  specs: string;
  image: string;
}