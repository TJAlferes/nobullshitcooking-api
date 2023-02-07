import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export class Product implements IProduct {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool =      pool;
    this.auto =      this.auto.bind(this);
    this.search =    this.search.bind(this);
    this.viewAll =   this.viewAll.bind(this);
    this.viewOne =   this.viewOne.bind(this);
    this.create =    this.create.bind(this);
    this.update =    this.update.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
  }

  async auto(term: string) {
    return [];
  }

  async search(term: string) {
    const sql = `
      SELECT
        p.id,
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
      INNER JOIN product_types t      ON t.id = p.product_type_id
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql);
    return rows;
  }

  async viewAll() {
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
      INNER JOIN product_types t      ON p.product_type_id = t.id
      ORDER BY p.name ASC
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql);
    return row;
  }

  async viewOne(id: number) {
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
      INNER JOIN product_types t      ON p.product_type_id = t.id
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

  async deleteOne(id: number) {
    const sql = `DELETE FROM products WHERE id = ? LIMIT 1`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

type DataWithHeader = Promise<RowDataPacket[] & ResultSetHeader>;

export interface IProduct {
  pool:                              Pool;
  auto(term: string):                Data;
  search(term: string):              Data;
  viewAll():                         Data;
  viewOne(id: number):               Data;
  create(product: ICreatingProduct): DataWithHeader;
  update(product: IUpdatingProduct): Data;
  deleteOne(id: number):             Data;
}

type ICreatingProduct = {
  productCategoryId: number;
  productTypeId:     number;
  brand:             string;
  variety:           string;  // model?
  name:              string;
  description:       string;
  specs:             any;  // finish
  image:             string;
};

type IUpdatingProduct = ICreatingProduct & {
  id: number;
};

/*interface ISavingProduct {
  id:                    number;
  product_category_name: string;
  product_type_name:     string;
  fullname:              string;
  brand:                 string;
  variety:               string;
  name:                  string;
  description:           string;
  specs:                 any;  // finish
  image:                 string;
}*/