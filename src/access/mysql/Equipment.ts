import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export class Equipment implements IEquipment {
  pool: Pool;
  
  constructor(pool: Pool) {
    this.pool =      pool;
    this.auto =      this.auto.bind(this);
    this.search =    this.search.bind(this);
    this.viewAll =   this.viewAll.bind(this);
    this.viewOne =   this.viewOne.bind(this);
    this.create =    this.create.bind(this);
    this.update =    this.update.bind(this);
    this.deleteAll = this.deleteAll.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
  }

  async auto(term: string) {
    return [];
  }

  async search(term: string) {
    const ownerId = 1;  // only public equipment are searchable
    const sql = `
      SELECT
        e.id,
        t.name AS equipment_type_name,
        e.name,
        e.description,
        e.image
      FROM equipment e
      INNER JOIN equipment_types t ON t.id = e.equipment_type_id
      WHERE e.owner_id = ? AND 
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [ownerId]);
    return rows;
  }

  async viewAll(authorId: number, ownerId: number) {
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

  async viewOne(id: number, authorId: number, ownerId: number) {
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

  async deleteAll(ownerId: number) {
    const sql = `DELETE FROM equipment WHERE owner_id = ?`;
    await this.pool.execute<RowDataPacket[]>(sql, [ownerId]);
  }

  async deleteOne(id: number, ownerId: number) {
    const sql = `DELETE FROM equipment WHERE owner_id = ? AND id = ? LIMIT 1`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [ownerId, id]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

type DataWithHeader = Promise<RowDataPacket[] & ResultSetHeader>;

export interface IEquipment {
  pool:                                                   Pool;
  auto(term: string):                                     Data;
  search(term: string):                                   Data;
  viewAll(authorId: number, ownerId: number):             Data;
  viewOne(id: number, authorId: number, ownerId: number): Data;
  create(equipment: ICreatingEquipment):                  DataWithHeader;
  update(equipment: IUpdatingEquipment):                  Data;
  deleteAll(ownerId: number):                             void;
  deleteOne(id: number, ownerId: number):                 Data;
}

type ICreatingEquipment = {
  equipmentTypeId: number;
  authorId:        number;
  ownerId:         number;
  name:            string;
  description:     string;
  image:           string;
};

type IUpdatingEquipment = ICreatingEquipment & {
  id: number;
};

/*interface ISavingEquipment {
  id:                  number;
  equipment_type_name: string;
  name:                string;
  description:         string;
  image:               string;
}*/