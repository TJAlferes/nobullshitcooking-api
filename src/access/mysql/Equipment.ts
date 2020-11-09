import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class Equipment implements IEquipment {
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
    const owner = "NOBSC";  // only public equipment goes into ElasticSearch
    const sql = `
      SELECT
        id,
        owner,
        type
        name,
        description,
        image
      FROM equipment
      WHERE owner = ?
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [owner]);
    let final = [];
    for (let row of rows) {
      final.push({index: {_index: 'equipment', _id: row.id}}, row);
    }
    return final;
  }
  
  async getForElasticSearch(id: string) {
    const owner = "NOBSC";  // only public equipment goes into ElasticSearch
    const sql = `
      SELECT
        id,
        owner,
        type
        name,
        description,
        image
      FROM equipment
      WHERE id = ? AND owner = ?
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id, owner]);
    return row;
  }

  async view(author: string, owner: string) {
    const sql = `
      SELECT
        id,
        owner,
        type,
        name,
        description,
        image
      FROM equipment
      WHERE author = ? AND owner = ?
      ORDER BY name ASC
    `;
    const [ rows ] = await this.pool
      .execute<RowDataPacket[]>(sql, [author, owner]);
    return rows;
  }

  async viewById(id: string, author: string, owner: string) {
    const sql = `
      SELECT
        id,
        owner,
        type,
        name,
        description,
        image
      FROM equipment
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
    name,
    description,
    image
  }: ICreatingEquipment) {
    const sql = `
      INSERT INTO equipment (
        type,
        author,
        owner,
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
        name,
        description,
        image
      ]);
    return row;
  }

  async update({
    id,
    type,
    name,
    description,
    image
  }: IUpdatingEquipment) {
    const sql = `
      UPDATE equipment
      SET type = ?, name = ?, description = ?, image = ?
      WHERE id = ?
      LIMIT 1
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [
      type,
      name,
      description,
      image,
      id
    ]);
    return row;
  }

  async delete(id: string) {
    const sql = `DELETE FROM equipment WHERE id = ? LIMIT 1`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return row;
  }

  async createPrivate({
    type,
    author,
    owner,
    name,
    description,
    image
  }: ICreatingEquipment) {
    const sql = `
      INSERT INTO equipment (
        type,
        author,
        owner,
        name,
        description,
        image
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [
      type,
      author,
      owner,
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
    name,
    description,
    image
  }: IUpdatingEquipment) {
    const sql = `
      UPDATE equipment
      SET
        type = ?,
        author = ?,
        owner = ?,
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
      name,
      description,
      image,
      owner,
      id
    ]);
    return row;
  }

  async deleteByOwner(id: string, owner: string) {
    const sql = `DELETE FROM equipment WHERE owner = ? AND id = ? LIMIT 1`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [owner, id]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

type DataWithHeader = Promise<RowDataPacket[] & ResultSetHeader>;

export interface IEquipment {
  pool: Pool;
  getAllForElasticSearch(): any;  // finish
  getForElasticSearch(id: string): Data;
  view(author: string, owner: string): Data;
  viewById(id: string, author: string, owner: string): Data;
  create({
    type,
    author,
    owner,
    name,
    description,
    image
  }: ICreatingEquipment): DataWithHeader;
  update({
    id,
    type,
    author,
    owner,
    name,
    description,
    image
  }: IUpdatingEquipment): Data;
  delete(id: string): Data;
  createPrivate({
    type,
    author,
    owner,
    name,
    description,
    image
  }: ICreatingEquipment): Data;
  updatePrivate({
    id,
    type,
    author,
    owner,
    name,
    description,
    image
  }: IUpdatingEquipment): Data;
  deleteByOwner(id: string, owner: string): Data;
}

interface ICreatingEquipment {
  type: string;
  author: string;
  owner: string;
  name: string;
  description: string;
  image: string;
}

interface IUpdatingEquipment extends ICreatingEquipment {
  id: string;
}