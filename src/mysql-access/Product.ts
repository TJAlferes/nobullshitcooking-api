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
        t.name AS product_type_name,
        p.brand,
        p.variety,
        p.name,
        p.description,
        p.specs,
        p.image
      FROM products i
      INNER JOIN product_types t ON t.id = p.product_type_id
    `;

    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql);

    let final = [];

    for (let row of rows) {
      let { brand, variety, name } = row;

      brand = brand ? brand + " " : "";
      variety = variety ? variety + " " : "";
      const fullname = brand + variety + name;

      final.push(
        {index: {_index: 'products', _id: row.id}},
        {...row, fullname}
      );
    }

    return final;
  }

  async getForElasticSearch(id: number) {
    const sql = `
      SELECT
        CAST(p.id AS CHAR),
        p.product_type_id,
        t.name AS product_type_name,
        p.brand,
        p.variety,
        p.name,
        p.description,
        p.specs,
        p.image
      FROM products i
      INNER JOIN product_types t ON t.id = p.product_type_id
      WHERE p.id = ?
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);

    let {
      product_type_name,
      brand,
      variety,
      name,
      description,
      specs,
      image
    } = row[0];

    brand = brand ? brand + " " : "";
    variety = variety ? variety + " " : "";
    const fullname = brand + variety + name;

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
        p.product_type_id,
        t.name AS product_type_name,
        p.brand,
        p.variety,
        p.name,
        p.description,
        p.specs,
        p.image
      FROM products i
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
        t.name AS product_type_name,
        p.brand,
        p.variety,
        p.name,
        p.description,
        p.specs,
        p.image
      FROM products i
      INNER JOIN product_types t ON p.product_type_id = t.id
      WHERE AND id = ?
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return row;
  }

  async create({
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
        product_type_id,
        brand,
        variety,
        name,
        description,
        specs,
        image
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[] & ResultSetHeader>(sql, [
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
  productTypeId: number;  // category?
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