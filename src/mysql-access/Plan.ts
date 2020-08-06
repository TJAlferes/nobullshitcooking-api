import { Pool, RowDataPacket } from 'mysql2/promise';

export class Plan implements IPlan {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewAllByOwnerId = this.viewAllByOwnerId.bind(this);
    this.viewByOwnerId = this.viewByOwnerId.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.deleteByOwnerId = this.deleteByOwnerId.bind(this);
    this.deleteAllByOwnerId = this.deleteAllByOwnerId.bind(this);
  }
  
  async viewAllByOwnerId(ownerId: number) {
    const sql = `SELECT id, name, data FROM plans WHERE owner_id = ?`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [ownerId]);
    return rows;
  }

  async viewByOwnerId(id: number, ownerId: number) {
    const sql = `
      SELECT id, name, data FROM plans WHERE owner_id = ? AND id = ?
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [ownerId, id]);
    return row;
  }

  async create({ authorId, ownerId, name, data }: ICreatingPlan) {
    const sql = `
      INSERT INTO plans (id, owner_id, name, data) VALUES (?, ?, ?, ?)
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [authorId, ownerId, name, data]);
    return row;
  }

  async update({ id, authorId, ownerId, name, data }: IUpdatingPlan) {
    const sql = `
      UPDATE plans SET name = ?, data = ? WHERE owner_id = ? AND id = ? LIMIT 1
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [name, data, ownerId, id]);
    return row;
  }

  async deleteByOwnerId(id: number, ownerId: number) {
    const sql = `DELETE FROM plans WHERE owner_id = ? AND id = ? LIMIT 1`;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [ownerId, id]);
    return row;
  }

  async deleteAllByOwnerId(ownerId: number) {
    const sql = `DELETE FROM plans WHERE owner_id = ?`;
    await this.pool.execute<RowDataPacket[]>(sql, [ownerId]);
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IPlan {
  pool: Pool;
  viewAllByOwnerId(ownerId: number): Data;
  viewByOwnerId(planId: number, ownerId: number): Data;
  create({authorId, ownerId, name, data}: ICreatingPlan): Data;
  update({id, authorId, ownerId, name, data}: IUpdatingPlan): Data;
  deleteByOwnerId(id: number, ownerId: number): Data;
  deleteAllByOwnerId(ownerId: number): void;
}

interface ICreatingPlan {
  authorId: number;
  ownerId: number;
  name: string;
  data: string;
}

interface IUpdatingPlan extends ICreatingPlan {
  id: number;
}