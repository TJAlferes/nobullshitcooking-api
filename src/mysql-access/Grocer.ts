import { Pool, RowDataPacket } from 'mysql2/promise';

export class Grocer implements IGrocer {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async view(ownerId: number) {
    const sql = `
      SELECT id, name, address, notes
      FROM grocers
      WHERE owner_id = ?
      ORDER BY name ASC
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [ownerId]);
    return rows;
  }

  async create({ ownerId, name, address, notes }: ICreatingGrocer) {
    const sql = `
      INSERT INTO grocers (owner_id, name, address, notes) VALUES (?, ?, ?, ?)
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [ownerId, name, address, notes]);
    return row;
  }

  async update({ id, ownerId, name, address, notes }: IUpdatingGrocer) {
    const sql = `
      UPDATE grocers
      SET name = ?, address = ?, notes = ?
      WHERE id = ? AND owner_id = ?
      LIMIT 1
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [name, address, notes, ownerId, id]);
    return row;
  }

  async delete(id: number, ownerId: number) {
    const sql = `DELETE FROM grocers WHERE owner_id = ? AND id = ? LIMIT 1`;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [ownerId, id]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IGrocer {
  pool: Pool;
  view(ownerId: number): Data;
  create({ownerId, name, address, notes}: ICreatingGrocer): Data;
  update({id, ownerId, name, address, notes}: IUpdatingGrocer): Data;
  delete(id: number, ownerId: number): Data;
}

interface ICreatingGrocer {
  ownerId: number;
  name: string;
  address: string;
  notes: string;
}

interface IUpdatingGrocer extends ICreatingGrocer {
  id: number;
}