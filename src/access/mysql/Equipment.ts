import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export class Equipment implements IEquipment {
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
    this.deleteById =              this.deleteById.bind(this);
  }

  async getForElasticSearch() {
    const ownerId = 1;  // only public equipment goes into ElasticSearch
    const sql = `
      SELECT
        CAST(e.id AS CHAR),
        t.name AS equipment_type_name,
        e.name,
        e.description,
        e.image
      FROM equipment e
      INNER JOIN equipment_types t ON t.id = e.equipment_type_id
      WHERE e.owner_id = ?
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [ownerId]);
    const final = [];
    for (let row of rows) final.push({index: {_index: 'equipment', _id: row.id}}, row);
    return final;
  }
  
  async getForElasticSearchById(id: number) {
    const ownerId = 1;  // only public equipment goes into ElasticSearch
    const sql = `
      SELECT
        CAST(e.id AS CHAR),
        t.name AS equipment_type_name,
        e.name,
        e.description,
        e.image
      FROM equipment e
      INNER JOIN equipment_types t ON t.id = e.equipment_type_id
      WHERE e.id = ? e.owner_id = ?
    `;
    const [ [ row ] ] = await this.pool.execute<RowDataPacket[]>(sql, [id, ownerId]);
    return row as ISavingEquipment;
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
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [authorId, ownerId]);
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
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id, authorId, ownerId]);
    return row;
  }

  async create(equipment: ICreatingEquipment) {
    const sql = `
      INSERT INTO equipment (equipment_type_id, author_id, owner_id, name, description, image)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[] & ResultSetHeader>(sql, [
      equipment.equipmentTypeId, equipment.authorId, equipment.ownerId, equipment.name, equipment.description, equipment.image
    ]);
    return row;
  }

  async update(equipment: IUpdatingEquipment) {
    const sql = `
      UPDATE equipment
      SET equipment_type_id = ?, name = ?, description = ?, image = ?
      WHERE id = ?
      LIMIT 1
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [equipment.equipmentTypeId, equipment.name, equipment.description, equipment.image, equipment.id]);
    return row;
  }

  async delete(ownerId: number) {
    const sql = `DELETE FROM equipment WHERE owner_id = ?`;
    await this.pool.execute<RowDataPacket[]>(sql, [ownerId]);
  }

  async deleteById(id: number, ownerId: number) {
    const sql = `DELETE FROM equipment WHERE owner_id = ? AND id = ? LIMIT 1`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [ownerId, id]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

type DataWithHeader = Promise<RowDataPacket[] & ResultSetHeader>;

export interface IEquipment {
  pool: Pool;
  getForElasticSearch(): any;
  getForElasticSearchById(id: number): Promise<ISavingEquipment>;
  view(authorId: number, ownerId: number): Data;
  viewById(id: number, authorId: number, ownerId: number): Data;
  create(equipment: ICreatingEquipment): DataWithHeader;
  update(equipment: IUpdatingEquipment): Data;
  delete(ownerId: number): void;
  deleteById(id: number, ownerId: number): Data;
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

interface ISavingEquipment {
  id: string;
  equipment_type_name: string;
  name: string;
  description: string;
  image: string;
}