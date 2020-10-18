import { Pool, RowDataPacket } from 'mysql2/promise';

export class Plan implements IPlan {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewById = this.viewById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }
  
  async view(owner: string) {
    const sql = `SELECT id, name, data FROM plans WHERE owner = ?`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [owner]);
    return rows;
  }

  async viewById(id: string, owner: string) {
    const sql = `SELECT id, name, data FROM plans WHERE owner = ? AND id = ?`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [owner, id]);
    return row;
  }

  async create({ author, owner, name, data }: ICreatingPlan) {
    const sql = `INSERT INTO plans (id, owner, name, data) VALUES (?, ?, ?, ?)`;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [author, owner, name, data]);
    return row;
  }

  async update({ id, owner, name, data }: IUpdatingPlan) {
    const sql = `
      UPDATE plans SET name = ?, data = ? WHERE owner = ? AND id = ? LIMIT 1
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [name, data, owner, id]);
    return row;
  }

  async delete(id: string, owner: string) {
    const sql = `DELETE FROM plans WHERE owner = ? AND id = ? LIMIT 1`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [owner, id]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IPlan {
  pool: Pool;
  view(owner: string): Data;
  viewById(id: string, owner: string): Data;
  create({author, owner, name, data}: ICreatingPlan): Data;
  update({id, author, owner, name, data}: IUpdatingPlan): Data;
  delete(id: string, owner: string): Data;
}

interface ICreatingPlan {
  author: string;
  owner: string;
  name: string;
  data: string;
}

interface IUpdatingPlan extends ICreatingPlan {
  id: string;
}