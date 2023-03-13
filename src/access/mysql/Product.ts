import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import type { SearchRequest, SearchResponse } from '../../lib/validations';

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
    const sql = `SELECT id, brand, variety, name, fullname AS text FROM products WHERE name LIKE ? LIMIT 5`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [`%${term}%`]);
    return rows;
  }

  async search({ term, filters, sorts, currentPage, resultsPerPage }: SearchRequest) {
    let sql = `
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

    // order matters

    const params: Array<number|string> = [];

    if (term) {
      sql += ` WHERE p.fullname LIKE ?`;
      params.push(`%${term}%`);
    }

    const productCategories = filters?.productCategories ?? [];
    const productTypes = filters?.productTypes ?? [];

    if (productCategories.length > 0) {
      const placeholders = '?,'.repeat(productCategories.length).slice(0, -1);
      sql += ` AND c.name IN (${placeholders})`;
      params.push(...productCategories);
    }

    if (productTypes.length > 0) {
      const placeholders = '?,'.repeat(productTypes.length).slice(0, -1);
      sql += ` AND t.name IN (${placeholders})`;
      params.push(...productTypes);
    }

    //if (neededSorts)

    const [ [ { count } ] ] = await this.pool.execute<RowDataPacket[]>(`SELECT COUNT(*) AS count FROM (${sql}) results`, params);
    const totalResults = Number(count);
    
    const limit =  resultsPerPage ? Number(resultsPerPage)            : 20;
    const offset = currentPage    ? (Number(currentPage) - 1) * limit : 0;

    sql += ` LIMIT ? OFFSET ?`;

    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [...params, `${limit}`, `${offset}`]);  // order matters

    const totalPages = (totalResults <= limit) ? 1 : Math.ceil(totalResults / limit);

    return {results: rows, totalResults, totalPages};
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
  pool:                                 Pool;
  auto(term: string):                   Data;
  search(searchRequest: SearchRequest): Promise<SearchResponse>;
  viewAll():                            Data;
  viewOne(id: number):                  Data;
  create(product: ICreatingProduct):    DataWithHeader;
  update(product: IUpdatingProduct):    Data;
  deleteOne(id: number):                Data;
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
