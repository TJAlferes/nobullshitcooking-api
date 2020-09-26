import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class Equipment implements IEquipment {
  pool: Pool;

  // TO DO: improve these names, and see if you can further DRY
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
    const ownerId = 1;  // only public equipment goes into ElasticSearch
    const sql = `
      SELECT
        CAST(e.id AS CHAR) AS equipment_id,
        e.equipment_type_id,
        e.owner_id,
        t.name AS equipment_type_name,
        e.name,
        e.description,
        e.image
      FROM equipment e
      INNER JOIN equipment_types t ON t.id = e.equipment_type_id
      WHERE e.owner_id = ?
    `;

    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [ownerId]);

    let final = [];

    // allows the sequence of awaits we want
    for (let row of rows) {
      final.push({index: {_index: 'equipment', _id: row.id}}, row);
    }

    return final;
  }
  
  async getForElasticSearch(id: number) {
    const ownerId = 1;  // only public equipment goes into ElasticSearch
    const sql = `
      SELECT
        CAST(e.id AS CHAR) AS equipment_id,
        e.equipment_type_id,
        e.owner_id,
        t.name AS equipment_type_name,
        e.name,
        e.description,
        e.image
      FROM equipment e
      INNER JOIN equipment_types t ON t.id = e.equipment_type_id
      WHERE e.id = ? e.owner_id = ?
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [id, ownerId]);
    return row;
  }

  async view(authorId: number, ownerId: number) {
    const sql = `
      SELECT
        e.id,
        e.equipment_type_id,
        e.owner_id,
        t.name AS equipment_type_name,
        e.name,
        e.description,
        e.image
      FROM equipment e
      INNER JOIN equipment_types t ON e.equipment_type_id = t.id
      WHERE e.author_id = ? AND e.owner_id = ?
      ORDER BY e.name ASC
    `;
    const [ rows ] = await this.pool
    .execute<RowDataPacket[]>(sql, [authorId, ownerId]);
    return rows;
  }

  async viewById(id: number, authorId: number, ownerId: number) {
    const sql = `
      SELECT
        e.id,
        e.equipment_type_id,
        e.owner_id,
        t.name AS equipment_type_name,
        e.name,
        e.description,
        e.image
      FROM equipment e
      INNER JOIN equipment_types t ON e.equipment_type_id = t.id
      WHERE e.id = ? AND e.author_id = ? AND e.owner_id = ?
    `;
    const [ row ] = await this.pool
    .execute<RowDataPacket[]>(sql, [id, authorId, ownerId]);
    return row;
  }

  async create({
    equipmentTypeId,
    authorId,
    ownerId,
    name,
    description,
    image
  }: ICreatingEquipment) {
    const sql = `
      INSERT INTO equipment (
        equipment_type_id,
        author_id,
        owner_id,
        name,
        description,
        image
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [ row ] = await this.pool
    .execute<RowDataPacket[] & ResultSetHeader>(sql, [
      equipmentTypeId,
      authorId,
      ownerId,
      name,
      description,
      image
    ]);
    return row;
  }

  async update({
    id,
    equipmentTypeId,
    authorId,
    ownerId,
    name,
    description,
    image
  }: IUpdatingEquipment) {
    const sql = `
      UPDATE equipment
      SET equipment_type_id = ?, name = ?, description = ?, image = ?
      WHERE id = ?
      LIMIT 1
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [
      equipmentTypeId,
      name,
      description,
      image,
      id
    ]);
    return row;
  }

  async delete(id: number) {
    const sql = `DELETE FROM equipment WHERE id = ? LIMIT 1`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return row;
  }

  async createPrivate({
    equipmentTypeId,
    authorId,
    ownerId,
    name,
    description,
    image
  }: ICreatingEquipment) {
    const sql = `
      INSERT INTO equipment (
        equipment_type_id,
        author_id,
        owner_id,
        name,
        description,
        image
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [
      equipmentTypeId,
      authorId,
      ownerId,
      name,
      description,
      image
    ]);
    return row;
  }

  async updatePrivate({
    id,
    equipmentTypeId,
    authorId,
    ownerId,
    name,
    description,
    image
  }: IUpdatingEquipment) {
    const sql = `
      UPDATE equipment
      SET
        equipment_type_id = ?,
        author_id = ?,
        owner_id = ?,
        name = ?,
        description = ?,
        image = ?
      WHERE owner_id = ? AND id = ?
      LIMIT 1
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [
      equipmentTypeId,
      authorId,
      ownerId,
      name,
      description,
      image,
      ownerId,
      id
    ]);
    return row;
  }

  async deleteByOwnerId(id: number, ownerId: number) {
    const sql = `DELETE FROM equipment WHERE owner_id = ? AND id = ? LIMIT 1`;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [ownerId, id]);
    return row;
  }

  async deleteAllByOwnerId(ownerId: number) {
    const sql = `DELETE FROM equipment WHERE owner_id = ?`;
    await this.pool.execute<RowDataPacket[]>(sql, [ownerId]);
  }
}

type Data = Promise<RowDataPacket[]>;

type DataWithHeader = Promise<RowDataPacket[] & ResultSetHeader>;

export interface IEquipment {
  pool: Pool;
  getAllForElasticSearch(): any;  // finish
  getForElasticSearch(id: number): Data;
  view(authorId: number, ownerId: number): Data;
  viewById(id: number, authorId: number, ownerId: number): Data;
  create({
    equipmentTypeId,
    authorId,
    ownerId,
    name,
    description,
    image
  }: ICreatingEquipment): DataWithHeader;
  update({
    id,
    equipmentTypeId,
    authorId,
    ownerId,
    name,
    description,
    image
  }: IUpdatingEquipment): Data;
  delete(id: number): Data;
  createPrivate({
    equipmentTypeId,
    authorId,
    ownerId,
    name,
    description,
    image
  }: ICreatingEquipment): Data;
  updatePrivate({
    id,
    equipmentTypeId,
    authorId,
    ownerId,
    name,
    description,
    image
  }: IUpdatingEquipment): Data;
  deleteByOwnerId(id: number, ownerId: number): Data;
  deleteAllByOwnerId(ownerId: number): void;
}

interface ICreatingEquipment {
  equipmentTypeId: number;
  authorId: number;
  ownerId: number;
  name: string;
  description: string;
  image: string;
}

interface IUpdatingEquipment extends ICreatingEquipment {
  id: number;
}