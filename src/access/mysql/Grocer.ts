import { Pool, RowDataPacket } from 'mysql2/promise';

export class Grocer implements IGrocer {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    //this.viewById = this.viewById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async view(owner: string) {
    const sql = `
      SELECT id, name, address, notes
      FROM grocers
      WHERE owner = ?
      ORDER BY name ASC
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [owner]);
    return rows;
  }

  async create({ owner, name, address, notes }: ICreatingGrocer) {
    const sql = `
      INSERT INTO grocers (owner, name, address, notes) VALUES (?, ?, ?, ?)
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [owner, name, address, notes]);
    return row;
  }

  async update({ id, owner, name, address, notes }: IUpdatingGrocer) {
    const sql = `
      UPDATE grocers
      SET name = ?, address = ?, notes = ?
      WHERE id = ? AND owner = ?
      LIMIT 1
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [name, address, notes, owner, id]);
    return row;
  }

  async delete(id: string, owner: string) {
    const sql = `DELETE FROM grocers WHERE owner = ? AND id = ? LIMIT 1`;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [owner, id]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IGrocer {
  pool: Pool;
  view(owner: string): Data;
  create({owner, name, address, notes}: ICreatingGrocer): Data;
  update({id, owner, name, address, notes}: IUpdatingGrocer): Data;
  delete(id: string, owner: string): Data;
}

interface ICreatingGrocer {
  owner: string;
  name: string;
  address: string;
  notes: string;
}

interface IUpdatingGrocer extends ICreatingGrocer {
  id: string;
}